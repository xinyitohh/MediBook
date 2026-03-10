using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.Json;
using backend.Data;
using backend.DTOs;
using backend.Models;

namespace backend.Controllers
{
    [Route("api/medical-report")]
    [ApiController]
    [Authorize]
    public class MedicalReportController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MedicalReportController(AppDbContext context)
        {
            _context = context;
        }

        // GET api/medical-report/my - get logged-in patient's reports
        [HttpGet("my")]
        public async Task<IActionResult> GetMyReports()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var patient = await _context.Patients
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (patient == null)
                return NotFound(new { message = "Patient profile not found" });

            var reports = await _context.MedicalReports
                .Where(r => r.PatientId == patient.Id)
                .OrderByDescending(r => r.UploadedAt)
                .Select(r => new MedicalReportResponseDto
                {
                    Id = r.Id,
                    FileName = r.FileName,
                    FileType = r.FileType,
                    FileSize = r.FileSize,
                    UploadedAt = r.UploadedAt.ToString("o"),
                    FileUrl = r.FileUrl,
                    Description = r.Description
                })
                .ToListAsync();

            return Ok(reports);
        }

        // DELETE api/medical-report/5 - delete a report
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReport(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var patient = await _context.Patients
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (patient == null)
                return NotFound(new { message = "Patient profile not found" });

            var report = await _context.MedicalReports
                .FirstOrDefaultAsync(r => r.Id == id && r.PatientId == patient.Id);

            if (report == null)
                return NotFound(new { message = "Report not found" });

            // TODO: Delete from S3 if applicable

            _context.MedicalReports.Remove(report);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Report deleted" });
        }

        // POST api/medical-report/generate/5 - doctor generates report for appointment
        [HttpPost("generate/{appointmentId}")]
        [Authorize(Roles = "Doctor,Admin")]
        public async Task<IActionResult> GenerateReport(int appointmentId, [FromBody] GenerateReportDto dto)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                .FirstOrDefaultAsync(a => a.Id == appointmentId);

            if (appointment == null)
                return NotFound(new { message = "Appointment not found" });

            if (appointment.Status != "Completed")
                return BadRequest(new { message = "Appointment must be completed before generating a report" });

            // Serialize medications to JSON
            var medicationsJson = JsonSerializer.Serialize(dto.Medications);

            var report = new MedicalReport
            {
                PatientId = appointment.PatientId,
                AppointmentId = appointmentId,
                FileName = $"Report_{appointment.Patient.FullName.Replace(" ", "_")}_{DateTime.UtcNow:yyyyMMdd}.pdf",
                FileType = "application/pdf",
                FileSize = 0, // Generated report, no physical file yet
                FileUrl = "", // TODO: Generate PDF and upload to S3
                Description = $"Medical report for appointment on {appointment.AppointmentDate:yyyy-MM-dd}",
                Diagnosis = dto.Diagnosis,
                Symptoms = dto.Symptoms,
                Treatment = dto.Treatment,
                Medications = medicationsJson,
                Notes = dto.Notes,
                FollowUpDate = dto.FollowUpDate
            };

            _context.MedicalReports.Add(report);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Report generated successfully", id = report.Id });
        }
    }
}
