using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using backend.Data;
using backend.DTOs;
using backend.Models;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AppointmentController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AppointmentController(AppDbContext context)
        {
            _context = context;
        }

        // GET api/appointment/my - get logged in user's appointments
        [HttpGet("my")]
        public async Task<IActionResult> GetMyAppointments()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var role = User.FindFirstValue(ClaimTypes.Role);

            // If user is a doctor, return appointments assigned to them
            if (role == "Doctor")
            {
                var doctor = await _context.Doctors
                    .FirstOrDefaultAsync(d => d.UserId == userId);

                if (doctor == null)
                    return NotFound(new { message = "Doctor profile not found" });

                var doctorAppointments = await _context.Appointments
                    .Include(a => a.Doctor)
                    .Include(a => a.Patient)
                    .Where(a => a.DoctorId == doctor.Id)
                    .Select(a => new AppointmentResponseDto
                    {
                        Id = a.Id,
                        Doctor = a.Doctor.FullName,
                        Specialty = a.Doctor.Specialty,
                        Patient = a.Patient.FullName,
                        Date = a.AppointmentDate.ToString("yyyy-MM-dd"),
                        Time = a.TimeSlot,
                        Status = a.Status,
                        Notes = a.Notes,
                        DoctorNotes = a.DoctorNotes
                    })
                    .ToListAsync();

                return Ok(doctorAppointments);
            }

            // Patient flow
            var patient = await _context.Patients
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (patient == null)
                return NotFound(new { message = "Patient profile not found" });

            var appointments = await _context.Appointments
                .Include(a => a.Doctor)
                .Include(a => a.Patient)
                .Where(a => a.PatientId == patient.Id)
                .Select(a => new AppointmentResponseDto
                {
                    Id = a.Id,
                    Doctor = a.Doctor.FullName,
                    Specialty = a.Doctor.Specialty,
                    Patient = a.Patient.FullName,
                    Date = a.AppointmentDate.ToString("yyyy-MM-dd"),
                    Time = a.TimeSlot,
                    Status = a.Status,
                    Notes = a.Notes,
                    DoctorNotes = a.DoctorNotes
                })
                .ToListAsync();

            return Ok(appointments);
        }

        // POST api/appointment - book appointment
        [HttpPost]
        public async Task<IActionResult> BookAppointment([FromBody] CreateAppointmentDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Get patient profile
            var patient = await _context.Patients
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (patient == null)
                return BadRequest(new { message = "Please complete your patient profile first" });

            // Check doctor exists
            var doctor = await _context.Doctors.FindAsync(dto.DoctorId);
            if (doctor == null)
                return NotFound(new { message = "Doctor not found" });

            // Check time slot not already taken
            var slotTaken = await _context.Appointments.AnyAsync(a =>
                a.DoctorId == dto.DoctorId &&
                a.AppointmentDate.Date == dto.AppointmentDate.Date &&
                a.TimeSlot == dto.TimeSlot &&
                a.Status != "Cancelled"
            );

            if (slotTaken)
                return BadRequest(new { message = "This time slot is already booked" });

            var appointment = new Appointment
            {
                PatientId = patient.Id,
                DoctorId = dto.DoctorId,
                AppointmentDate = dto.AppointmentDate,
                TimeSlot = dto.TimeSlot,
                Notes = dto.Notes,
                Status = "Pending"
            };

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            // TODO: Send SQS message here later (Task 2)

            return Ok(new { message = "Appointment booked successfully", id = appointment.Id });
        }

        // PUT api/appointment/5/cancel - patient cancels
        [HttpPut("{id}/cancel")]
        public async Task<IActionResult> CancelAppointment(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var patient = await _context.Patients
                .FirstOrDefaultAsync(p => p.UserId == userId);

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

            appointment.Status = "Completed";
            appointment.DoctorNotes = dto.DoctorNotes;
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
                .Select(a => new AppointmentResponseDto
                {
                    Id = a.Id,
                    Doctor = a.Doctor.FullName,
                    Specialty = a.Doctor.Specialty,
                    Patient = a.Patient.FullName,
                    Date = a.AppointmentDate.ToString("yyyy-MM-dd"),
                    Time = a.TimeSlot,
                    Status = a.Status,
                    Notes = a.Notes,
                    DoctorNotes = a.DoctorNotes
                })
                .ToListAsync();

            return Ok(appointments);
        }
    }
}
