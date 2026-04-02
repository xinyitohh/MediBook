using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs;
using backend.Models;
using backend.Services;
using AutoMapper;
using AutoMapper.QueryableExtensions;

namespace backend.Controllers
{
    [Route("api/medical-report")]
    [ApiController]
    [Authorize]
    public class MedicalReportController : BaseController
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        private readonly INotificationService _notificationService;

        public MedicalReportController(AppDbContext context, IMapper mapper, INotificationService notificationService)
        {
            _context = context;
            _mapper = mapper;
            _notificationService = notificationService;
        }

        // GET api/medical-report/my
        [HttpGet("my")]
        public async Task<IActionResult> GetMyReports()
        {
            var reports = await _context.MedicalReports
                .Where(r => r.PatientId == CurrentProfileId)
                .OrderByDescending(r => r.UploadedAt)
                .ProjectTo<MedicalReportResponseDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return Ok(reports);
        }

        // DELETE api/medical-report/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReport(int id)
        {
            var report = await _context.MedicalReports
                .FirstOrDefaultAsync(r => r.Id == id && r.PatientId == CurrentProfileId);

            if (report == null)
                return NotFound(new { message = "Report not found or unauthorized" });

            _context.MedicalReports.Remove(report);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Report deleted" });
        }

        // GET api/medical-report/by-appointment/{appointmentId}
        [HttpGet("by-appointment/{appointmentId}")]
        public async Task<IActionResult> GetByAppointment(int appointmentId)
        {
            var report = await _context.MedicalReports
                .Where(r => r.AppointmentId == appointmentId && r.UploadedByRole == "Doctor")
                .OrderByDescending(r => r.UploadedAt)
                .ProjectTo<MedicalReportResponseDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();

            if (report == null)
                return NotFound(new { message = "No doctor report found for this appointment" });

            return Ok(report);
        }

        // POST api/medical-report/generate/{appointmentId}
        [HttpPost("generate/{appointmentId}")]
        [Authorize(Roles = "Doctor,Admin")]
        public async Task<IActionResult> GenerateReport(int appointmentId, [FromBody] GenerateReportDto dto)
        {
            var query = _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Doctor) // Added Include for Notification message
                .AsQueryable();

            if (UserRole == "Doctor")
            {
                query = query.Where(a => a.DoctorId == CurrentProfileId);
            }

            var appointment = await query.FirstOrDefaultAsync(a => a.Id == appointmentId);

            if (appointment == null)
                return NotFound(new { message = "Appointment not found or unauthorized" });

            if (appointment.Status != "Completed")
                return BadRequest(new { message = "Appointment must be completed before generating a report" });

            var report = _mapper.Map<MedicalReport>(dto);

            report.PatientId = appointment.PatientId;
            report.AppointmentId = appointmentId;
            report.FileName = $"Report_{appointment.Patient.FullName.Replace(" ", "_")}_{DateTime.UtcNow:yyyyMMdd}.pdf";
            report.FileType = "application/pdf";
            report.FileUrl = ""; // Placeholder for actual file storage logic
            report.UploadedByRole = "Doctor";

            _context.MedicalReports.Add(report);
            await _context.SaveChangesAsync();

            // TRIGGER: Notify patient that their report is ready for viewing
            await _notificationService.SendAsync(
                appointment.Patient.UserId,
                "New Medical Report Available",
                $"Dr. {appointment.Doctor.FullName} has issued your medical report for the visit on {appointment.AppointmentDate:dd MMM}.",
                "Report"
            );

            return Ok(new { message = "Report generated successfully and patient notified", id = report.Id });
        }
    }
}