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
        public async Task<IActionResult> GetMyAppointments([FromQuery] DateTime? startDate = null, [FromQuery] DateTime? endDate = null)
        {
            var query = _context.Appointments.AsQueryable();

            if (startDate.HasValue)
            {
                // Ensure date comparison works properly with postgres timestamp without time zone
                var sDate = DateTime.SpecifyKind(startDate.Value.Date, DateTimeKind.Utc);
                query = query.Where(a => a.AppointmentDate >= sDate);
            }
            
            if (endDate.HasValue)
            {
                var eDate = DateTime.SpecifyKind(endDate.Value.Date.AddDays(1).AddTicks(-1), DateTimeKind.Utc);
                query = query.Where(a => a.AppointmentDate <= eDate);
            }

            // Use CurrentProfileId from BaseController
            if (UserRole == "Doctor")
            {
                query = query.Where(a => a.DoctorId == CurrentProfileId);
            }
            else
            {
                query = query.Where(a => a.PatientId == CurrentProfileId);
            }

            var appointments = await query
                .Include(a => a.Doctor)
                    .ThenInclude(d => d.Specialty)
                .Include(a => a.Doctor)
                    .ThenInclude(d => d.Schedules) // Needed for Duration mapping
                .Include(a => a.Patient)
                    .ThenInclude(p => p.MedicalReports)
                .OrderByDescending(a => a.AppointmentDate)
                .ToListAsync();

            var response = _mapper.Map<List<AppointmentResponseDto>>(appointments);

            return Ok(response);
        }

        // POST api/appointment - book appointment
        [HttpPost]
        public async Task<IActionResult> BookAppointment([FromBody] CreateAppointmentDto dto)
        {
            if (UserRole != "Patient" && UserRole != "Doctor" && UserRole != "Admin")
                return BadRequest(new { message = "Unauthorized to book appointments" });

            if (UserRole == "Doctor") 
            {
                dto.DoctorId = CurrentProfileId;
            }

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

            if (UserRole == "Patient") {
                appointment.PatientId = CurrentProfileId;
            } else if (UserRole == "Doctor") {
                if (!dto.PatientId.HasValue) return BadRequest(new { message = "PatientId is required when Doctor is booking." });
                appointment.PatientId = dto.PatientId.Value;
                appointment.DoctorId = CurrentProfileId; // Ensure they book for themselves
            } else if (UserRole == "Admin") {
                if (!dto.PatientId.HasValue) return BadRequest(new { message = "PatientId is required." });
                appointment.PatientId = dto.PatientId.Value;
            }
            
            // If the doctor books it manually, assume it's automatically confirmed. Otherwise Pending.
            appointment.Status = (UserRole == "Doctor" || UserRole == "Admin") ? "Confirmed" : "Pending";
            appointment.CreatedAt = DateTime.UtcNow;

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            if (UserRole == "Patient") {
                // Notify Doctor: New booking
                await _notificationService.SendAsync(   
                    doctor.UserId,
                    "New Appointment Request",
                    $"A patient has booked a slot for {dto.AppointmentDate:dd MMM yyyy} at {dto.TimeSlot}.",
                    "Appointment"
                );
            } else {
                // Notify Patient: Doctor booked an appointment for them
                var patient = await _context.Patients.FindAsync(appointment.PatientId);
                if (patient != null) {
                    await _notificationService.SendAsync(
                        patient.UserId,
                        "New Appointment Scheduled",
                        $"Dr. {doctor.FullName} has scheduled an appointment for you on {dto.AppointmentDate:dd MMM yyyy} at {dto.TimeSlot}.",
                        "Appointment"
                    );
                }
            }

            // Attach Medical Report if provided
            if (dto.MedicalReportId.HasValue)
            {
                var report = await _context.MedicalReports.FirstOrDefaultAsync(r => r.Id == dto.MedicalReportId.Value && r.PatientId == appointment.PatientId);
                if (report != null)
                {
                    report.AppointmentId = appointment.Id;
                    await _context.SaveChangesAsync();
                }
            }

            return Ok(new { message = "Appointment booked successfully", id = appointment.Id });
        }

        // PUT api/appointment/{id}/cancel
        [HttpPut("{id}/cancel")]
        public async Task<IActionResult> CancelAppointment(int id, [FromBody] DoctorCancelDto dto = null)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Doctor)
                .Include(a => a.Patient)
                .FirstOrDefaultAsync(a => a.Id == id && (a.PatientId == CurrentProfileId || UserRole == "Admin" || UserRole == "Doctor"));

            if (appointment == null)
                return NotFound(new { message = "Appointment not found or unauthorized" });

            appointment.Status = "Cancelled";
            appointment.CancellationReason = dto?.Reason ?? "Cancelled by Patient";
            await _context.SaveChangesAsync();

            // Notify Doctor: Patient cancelled
            await _notificationService.SendAsync(
                appointment.Doctor.UserId,
                "Appointment Cancelled",
                $"The appointment for {appointment.AppointmentDate:dd MMM yyyy} has been cancelled. Reason: {appointment.CancellationReason}",
                "Appointment"
            );

            return Ok(new { message = "Appointment cancelled" });
        }

        // PUT api/appointment/{id}/doctor-cancel
        [HttpPut("{id}/doctor-cancel")]
        [Authorize(Roles = "Doctor")] // Only doctors can hit this endpoint
        public async Task<IActionResult> DoctorCancelAppointment(int id, [FromBody] DoctorCancelDto dto)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                .FirstOrDefaultAsync(a => a.Id == id && a.DoctorId == CurrentProfileId);

            if (appointment == null)
                return NotFound(new { message = "Appointment not found or unauthorized" });

            appointment.Status = "Cancelled";
            appointment.CancellationReason = dto.Reason;
            await _context.SaveChangesAsync();

            // Notify the patient that the doctor cancelled and tell them why
            await _notificationService.SendAsync(
                appointment.Patient.UserId,
                "Appointment Cancelled by Doctor",
                $"Dr. {appointment.Doctor.FullName} cancelled your appointment on {appointment.AppointmentDate:dd MMM yyyy}. Reason: {dto.Reason}",
                "Appointment"
            );

            return Ok(new { message = "Appointment cancelled successfully." });
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

        // PUT api/appointment/{id}/reschedule
        [HttpPut("{id}/reschedule")]
        [Authorize(Roles = "Admin,Doctor")]
        public async Task<IActionResult> RescheduleAppointment(int id, [FromBody] RescheduleAppointmentDto dto)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (appointment == null)
                return NotFound(new { message = "Appointment not found." });

            if (UserRole == "Doctor" && appointment.DoctorId != CurrentProfileId)
                return Unauthorized(new { message = "You can only reschedule your own appointments." });

            if (appointment.Status == "Cancelled" || appointment.Status == "Completed")
                return BadRequest(new { message = "Cannot reschedule completed or cancelled appointments." });

            var newDateUtc = DateTime.SpecifyKind(dto.AppointmentDate.Date, DateTimeKind.Utc);
            var dayOfWeek = (int)newDateUtc.DayOfWeek;

            // 1. Validate Doctor Schedule for this new day
            var schedule = await _context.DoctorSchedules
                .FirstOrDefaultAsync(s => s.DoctorId == appointment.DoctorId && s.DayOfWeek == dayOfWeek);

            if (schedule == null || !schedule.IsActive)
                return BadRequest(new { message = "The doctor is not working on the selected day." });

            if (!TimeSpan.TryParse(dto.TimeSlot, out TimeSpan requestedTime))
                return BadRequest(new { message = "Invalid time format." });

            TimeSpan.TryParse(schedule.StartTime, out TimeSpan dayStart);
            TimeSpan.TryParse(schedule.EndTime, out TimeSpan dayEnd);

            if (requestedTime < dayStart || requestedTime >= dayEnd)
                return BadRequest(new { message = "The selected time is outside the doctor's working hours." });

            if (!string.IsNullOrEmpty(schedule.BreakStart) && !string.IsNullOrEmpty(schedule.BreakEnd))
            {
                TimeSpan.TryParse(schedule.BreakStart, out TimeSpan breakStart);
                TimeSpan.TryParse(schedule.BreakEnd, out TimeSpan breakEnd);

                if (requestedTime >= breakStart && requestedTime < breakEnd)
                    return BadRequest(new { message = "The selected time falls during the doctor's break time." });
            }

            // 2. Validate Overlap with existing Confirmed/Pending appointments
            var slotTaken = await _context.Appointments.AnyAsync(a =>
                a.Id != id && // Exclude the current appointment
                a.DoctorId == appointment.DoctorId &&
                a.AppointmentDate.Date == newDateUtc.Date &&
                a.TimeSlot == dto.TimeSlot &&
                a.Status != "Cancelled"
            );

            if (slotTaken)
                return BadRequest(new { message = "This time slot is already booked." });

            // 3. Save updates
            appointment.AppointmentDate = newDateUtc;
            appointment.TimeSlot = dto.TimeSlot;
            await _context.SaveChangesAsync();

            // 4. Notify patient
            await _notificationService.SendAsync(
                appointment.Patient.UserId,
                "Appointment Rescheduled",
                $"Dr. {appointment.Doctor.FullName} has rescheduled your appointment to {appointment.AppointmentDate:dd MMM yyyy} at {appointment.TimeSlot}.",
                "Appointment"
            );

            return Ok(new { message = "Appointment rescheduled successfully." });
        }

        // GET api/appointment/all - admin sees all
        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var appointments = await _context.Appointments
                .Include(a => a.Doctor).ThenInclude(d => d.Specialty)
                .Include(a => a.Doctor).ThenInclude(d => d.Schedules)
                .Include(a => a.Patient).ThenInclude(p => p.MedicalReports)
                .OrderByDescending(a => a.AppointmentDate)
                .ToListAsync();

            var response = _mapper.Map<List<AppointmentResponseDto>>(appointments);

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

            var appointments = await query
                .Include(a => a.Doctor).ThenInclude(d => d.Specialty)
                .Include(a => a.Doctor).ThenInclude(d => d.Schedules)
                .Include(a => a.Patient).ThenInclude(p => p.MedicalReports)
                .OrderByDescending(a => a.AppointmentDate)
                .ToListAsync();

            var response = _mapper.Map<List<AppointmentResponseDto>>(appointments);

            return Ok(response);
        }
    }
}