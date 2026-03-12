using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using backend.Data;
using backend.DTOs;
using backend.Models;
using AutoMapper;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AppointmentController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public AppointmentController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET api/appointment/my - get logged in user's appointments
        [HttpGet("my")]
        public async Task<IActionResult> GetMyAppointments()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var role = User.FindFirstValue(ClaimTypes.Role);

            IQueryable<Appointment> query = _context.Appointments
                .Include(a => a.Doctor)
                .Include(a => a.Patient);

            if (role == "Doctor")
            {
                var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.UserId == userId);
                if (doctor == null) return NotFound(new { message = "Doctor profile not found" });

                query = query.Where(a => a.DoctorId == doctor.Id);
            }
            else
            {
                var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == userId);
                if (patient == null) return NotFound(new { message = "Patient profile not found" });

                query = query.Where(a => a.PatientId == patient.Id);
            }

            var appointments = await query.ToListAsync();

            // AUTOMAPPER: Replaces all manual .Select() blocks for both Doctor and Patient flows
            var response = _mapper.Map<IEnumerable<AppointmentResponseDto>>(appointments);

            return Ok(response);
        }

        // POST api/appointment - book appointment
        [HttpPost]
        public async Task<IActionResult> BookAppointment([FromBody] CreateAppointmentDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var patient = await _context.Patients
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (patient == null)
                return BadRequest(new { message = "Please complete your patient profile first" });

            var doctor = await _context.Doctors.FindAsync(dto.DoctorId);
            if (doctor == null)
                return NotFound(new { message = "Doctor not found" });

            var utcDate = DateTime.SpecifyKind(dto.AppointmentDate, DateTimeKind.Utc);

            var slotTaken = await _context.Appointments.AnyAsync(a =>
                a.DoctorId == dto.DoctorId &&
                a.AppointmentDate.Date == utcDate.Date &&
                a.TimeSlot == dto.TimeSlot &&
                a.Status != "Cancelled"
            );

            if (slotTaken)
                return BadRequest(new { message = "This time slot is already booked" });

            // AUTOMAPPER: Creates the Appointment model from the DTO
            var appointment = _mapper.Map<Appointment>(dto);

            // Set fields not present in DTO
            appointment.PatientId = patient.Id;
            appointment.AppointmentDate = utcDate;
            appointment.Status = "Pending";

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Appointment booked successfully", id = appointment.Id });
        }

        // PUT api/appointment/5/cancel - patient cancels
        [HttpPut("{id}/cancel")]
        public async Task<IActionResult> CancelAppointment(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == userId);

            var appointment = await _context.Appointments
                .FirstOrDefaultAsync(a => a.Id == id && a.PatientId == patient!.Id);

            if (appointment == null)
                return NotFound(new { message = "Appointment not found" });

            appointment.Status = "Cancelled";
            await _context.SaveChangesAsync();

            return Ok(new { message = "Appointment cancelled" });
        }

        // PUT api/appointment/5/confirm - doctor/admin confirms
        [HttpPut("{id}/confirm")]
        [Authorize(Roles = "Admin,Doctor")]
        public async Task<IActionResult> ConfirmAppointment(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);

            if (appointment == null)
                return NotFound(new { message = "Appointment not found" });

            appointment.Status = "Confirmed";
            await _context.SaveChangesAsync();

            return Ok(new { message = "Appointment confirmed" });
        }

        // PUT api/appointment/5/complete - doctor/admin marks as completed
        [HttpPut("{id}/complete")]
        [Authorize(Roles = "Admin,Doctor")]
        public async Task<IActionResult> CompleteAppointment(int id, [FromBody] CompleteAppointmentDto dto)
        {
            var appointment = await _context.Appointments.FindAsync(id);

            if (appointment == null)
                return NotFound(new { message = "Appointment not found" });

            // AUTOMAPPER: Maps the notes from dto to the existing appointment
            _mapper.Map(dto, appointment);

            appointment.Status = "Completed";
            await _context.SaveChangesAsync();

            return Ok(new { message = "Appointment completed" });
        }

        // GET api/appointment/all - admin sees all
        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var appointments = await _context.Appointments
                .Include(a => a.Doctor)
                .Include(a => a.Patient)
                .ToListAsync();

            // AUTOMAPPER: Automatically maps related Doctor and Patient names
            var response = _mapper.Map<IEnumerable<AppointmentResponseDto>>(appointments);

            return Ok(response);
        }
    }
}