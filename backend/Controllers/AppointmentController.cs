using AutoMapper;
using AutoMapper.QueryableExtensions;
using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AppointmentController : BaseController
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
            var query = _context.Appointments.AsQueryable();

            // Use CurrentProfileId from BaseController
            if (UserRole == "Doctor")
            {
                query = query.Where(a => a.DoctorId == CurrentProfileId);
            }
            else
            {
                query = query.Where(a => a.PatientId == CurrentProfileId);
            }

            // ProjectTo: Only selects required columns from the DB (Doctor Name, Patient Name, etc.)
            var response = await query
                .OrderByDescending(a => a.AppointmentDate)
                .ProjectTo<AppointmentResponseDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return Ok(response);
        }

        // POST api/appointment - book appointment
        [HttpPost]
        public async Task<IActionResult> BookAppointment([FromBody] CreateAppointmentDto dto)
        {
            // Use CurrentProfileId from BaseController
            if (UserRole != "Patient")
                return BadRequest(new { message = "Only patients can book appointments" });

            // Check doctor exists
            var doctorExists = await _context.Doctors.AnyAsync(d => d.Id == dto.DoctorId);
            if (!doctorExists)
                return NotFound(new { message = "Doctor not found" });

            // Check time slot not already taken
            // Global UTC Handling: No need for SpecifyKind here
            var slotTaken = await _context.Appointments.AnyAsync(a =>
                a.DoctorId == dto.DoctorId &&
                a.AppointmentDate.Date == dto.AppointmentDate.Date &&
                a.TimeSlot == dto.TimeSlot &&
                a.Status != "Cancelled"
            );

            if (slotTaken)
                return BadRequest(new { message = "This time slot is already booked" });

            // Map DTO to Model
            var appointment = _mapper.Map<Appointment>(dto);

            // Set properties not in DTO
            appointment.PatientId = CurrentProfileId;
            appointment.Status = "Pending";

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Appointment booked successfully", id = appointment.Id });
        }

        // PUT api/appointment/{id}/cancel
        [HttpPut("{id}/cancel")]
        public async Task<IActionResult> CancelAppointment(int id)
        {
            // Security: Ensure the patient owns this appointment
            var appointment = await _context.Appointments
                .FirstOrDefaultAsync(a => a.Id == id && a.PatientId == CurrentProfileId);

            if (appointment == null)
                return NotFound(new { message = "Appointment not found or unauthorized" });

            appointment.Status = "Cancelled";
            await _context.SaveChangesAsync();

            return Ok(new { message = "Appointment cancelled" });
        }

        // PUT api/appointment/{id}/confirm
        [HttpPut("{id}/confirm")]
        [Authorize(Roles = "Admin,Doctor")]
        public async Task<IActionResult> ConfirmAppointment(int id)
        {
            var query = _context.Appointments.AsQueryable();

            // If a doctor is confirming, ensure it is THEIR appointment
            if (UserRole == "Doctor")
                query = query.Where(a => a.DoctorId == CurrentProfileId);

            var appointment = await query.FirstOrDefaultAsync(a => a.Id == id);

            if (appointment == null)
                return NotFound(new { message = "Appointment not found" });

            appointment.Status = "Confirmed";
            await _context.SaveChangesAsync();

            return Ok(new { message = "Appointment confirmed" });
        }

        // PUT api/appointment/{id}/complete
        [HttpPut("{id}/complete")]
        [Authorize(Roles = "Admin,Doctor")]
        public async Task<IActionResult> CompleteAppointment(int id, [FromBody] CompleteAppointmentDto dto)
        {
            var query = _context.Appointments.AsQueryable();

            if (UserRole == "Doctor")
                query = query.Where(a => a.DoctorId == CurrentProfileId);

            var appointment = await query.FirstOrDefaultAsync(a => a.Id == id);

            if (appointment == null)
                return NotFound(new { message = "Appointment not found" });

            // Map updates from DTO to existing Model
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
            // Efficient projection for the admin list
            var response = await _context.Appointments
                .OrderByDescending(a => a.AppointmentDate)
                .ProjectTo<AppointmentResponseDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return Ok(response);
        }
    }
}