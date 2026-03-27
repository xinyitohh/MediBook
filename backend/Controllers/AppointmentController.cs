using AutoMapper;
using AutoMapper.QueryableExtensions;
using backend.Data;
using backend.DTOs;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Numerics;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AppointmentController : BaseController
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        private readonly INotificationService _notificationService;


        public AppointmentController(AppDbContext context, IMapper mapper, INotificationService notificationService)
        {
            _context = context;
            _mapper = mapper;
            _notificationService = notificationService; 
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
            if (UserRole != "Patient")
                return BadRequest(new { message = "Only patients can book appointments" });

            var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.Id == dto.DoctorId);
            if (doctor == null)
                return NotFound(new { message = "Doctor not found" });

            var slotTaken = await _context.Appointments.AnyAsync(a =>
                a.DoctorId == dto.DoctorId &&
                a.AppointmentDate.Date == dto.AppointmentDate.Date &&
                a.TimeSlot == dto.TimeSlot &&
                a.Status != "Cancelled"
            );

            if (slotTaken)
                return BadRequest(new { message = "This time slot is already booked" });

            var appointment = _mapper.Map<Appointment>(dto);

            appointment.AppointmentDate = DateTime.SpecifyKind(dto.AppointmentDate, DateTimeKind.Utc);

            appointment.PatientId = CurrentProfileId;
            appointment.Status = "Pending";

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            // Notify Doctor: New booking
            await _notificationService.SendAsync(   
                doctor.UserId,
                "New Appointment Request",
                $"A patient has booked a slot for {dto.AppointmentDate:dd MMM yyyy} at {dto.TimeSlot}.",
                "Appointment"
            );

            return Ok(new { message = "Appointment booked successfully", id = appointment.Id });
        }

        // PUT api/appointment/{id}/cancel
        [HttpPut("{id}/cancel")]
        public async Task<IActionResult> CancelAppointment(int id)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Doctor)
                .Include(a => a.Patient)
                .FirstOrDefaultAsync(a => a.Id == id && (a.PatientId == CurrentProfileId || UserRole == "Admin"));

            if (appointment == null)
                return NotFound(new { message = "Appointment not found or unauthorized" });

            appointment.Status = "Cancelled";
            await _context.SaveChangesAsync();

            // Notify Doctor: Patient cancelled
            await _notificationService.SendAsync(
                appointment.Doctor.UserId,
                "Appointment Cancelled",
                $"The appointment for {appointment.AppointmentDate:dd MMM yyyy} has been cancelled.",
                "Appointment"
            );

            return Ok(new { message = "Appointment cancelled" });
        }

        // PUT api/appointment/{id}/confirm
        [HttpPut("{id}/confirm")]
        [Authorize(Roles = "Admin,Doctor")]
        public async Task<IActionResult> ConfirmAppointment(int id)
        {
            var query = _context.Appointments.Include(a => a.Patient).Include(a => a.Doctor).AsQueryable();

            if (UserRole == "Doctor")
                query = query.Where(a => a.DoctorId == CurrentProfileId);

            var appointment = await query.FirstOrDefaultAsync(a => a.Id == id);

            if (appointment == null)
                return NotFound(new { message = "Appointment not found" });

            appointment.Status = "Confirmed";
            await _context.SaveChangesAsync();

            // Notify Patient: Doctor confirmed
            await _notificationService.SendAsync(
                appointment.Patient.UserId,
                "Appointment Confirmed",
                $"Your appointment with Dr. {appointment.Doctor.FullName} on {appointment.AppointmentDate:dd MMM yyyy} is confirmed.",
                "Appointment"
            );

            return Ok(new { message = "Appointment confirmed" });
        }

        // PUT api/appointment/{id}/complete
        [HttpPut("{id}/complete")]
        [Authorize(Roles = "Admin,Doctor")]
        public async Task<IActionResult> CompleteAppointment(int id, [FromBody] CompleteAppointmentDto dto)
        {
            var query = _context.Appointments.Include(a => a.Patient).Include(a => a.Doctor).AsQueryable();

            if (UserRole == "Doctor")
                query = query.Where(a => a.DoctorId == CurrentProfileId);

            var appointment = await query.FirstOrDefaultAsync(a => a.Id == id);

            if (appointment == null)
                return NotFound(new { message = "Appointment not found" });

            _mapper.Map(dto, appointment);
            appointment.Status = "Completed";
            await _context.SaveChangesAsync();

            // Notify Patient: Visit completed & check for medical report
            await _notificationService.SendAsync(
                appointment.Patient.UserId,
                "Visit Completed",
                $"Your session with Dr. {appointment.Doctor.FullName} is finished. You can now view your summary.",
                "Appointment"
            );

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

        [HttpGet("search")]
        [Authorize(Roles = "Admin,Doctor")]
        public async Task<IActionResult> SearchAppointments([FromQuery] int? doctorId, [FromQuery] int? patientId)
        {
            var query = _context.Appointments.AsQueryable();

            // 1. Filter by Doctor if provided
            if (doctorId.HasValue)
            {
                // Security: Doctors can only search their own records
                if (UserRole == "Doctor" && doctorId != CurrentProfileId)
                    return Unauthorized(new { message = "Unauthorized access to other doctor records." });

                query = query.Where(a => a.DoctorId == doctorId.Value);
            }

            // 2. Filter by Patient if provided
            if (patientId.HasValue)
            {
                query = query.Where(a => a.PatientId == patientId.Value);
            }

            var response = await query
                .OrderByDescending(a => a.AppointmentDate)
                .ProjectTo<AppointmentResponseDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return Ok(response);
        }
    }
}