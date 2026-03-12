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
    [Route("api/medical-report")]
    [ApiController]
    [Authorize]
    public class MedicalReportController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper; 

        public MedicalReportController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
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
                .ToListAsync();

            // AUTOMAPPER: Automatically handles the List conversion and Date formatting
            // as defined in your MappingProfile.cs
            var reportDtos = _mapper.Map<IEnumerable<MedicalReportResponseDto>>(reports);

            return Ok(reportDtos);
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

            // AUTOMAPPER: This one line replaces the manual object creation and 
            // the manual JsonSerializer.Serialize call (handled in MappingProfile.cs)
            var report = _mapper.Map<MedicalReport>(dto);

            // Set the foreign keys and metadata not provided by the DTO
            report.PatientId = appointment.PatientId;
            report.AppointmentId = appointmentId;
            report.FileName = $"Report_{appointment.Patient.FullName.Replace(" ", "_")}_{DateTime.UtcNow:yyyyMMdd}.pdf";
            report.FileType = "application/pdf";
            report.FileUrl = ""; // Placeholder for S3

            _context.MedicalReports.Add(report);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Report generated successfully", id = report.Id });
        }
    }
}