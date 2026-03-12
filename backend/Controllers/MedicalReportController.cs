using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs;
using backend.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;

namespace backend.Controllers
{
    [Route("api/medical-report")]
    [ApiController]
    [Authorize]
    public class MedicalReportController : BaseController // Inherits CurrentProfileId and UserRole
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
            // Efficiency: ProjectTo writes a clean SQL SELECT for only DTO fields
            var reports = await _context.MedicalReports
                .Where(r => r.PatientId == CurrentProfileId) // Uses ID from Token
                .OrderByDescending(r => r.UploadedAt)
                .ProjectTo<MedicalReportResponseDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return Ok(reports);
        }

        // DELETE api/medical-report/5 - delete a report
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReport(int id)
        {
            // Security: Only allow deletion if the report belongs to the current patient
            var report = await _context.MedicalReports
                .FirstOrDefaultAsync(r => r.Id == id && r.PatientId == CurrentProfileId);

            if (report == null)
                return NotFound(new { message = "Report not found or unauthorized" });

            _context.MedicalReports.Remove(report);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Report deleted" });
        }

        // POST api/medical-report/generate/5 - doctor generates report for appointment
        [HttpPost("generate/{appointmentId}")]
        [Authorize(Roles = "Doctor,Admin")]
        public async Task<IActionResult> GenerateReport(int appointmentId, [FromBody] GenerateReportDto dto)
        {
            // Fetch appointment and ensure the doctor owns it (if not Admin)
            var query = _context.Appointments
                .Include(a => a.Patient)
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

            // AUTOMAPPER: Maps DTO to Model (handles JSON serialization of medications)
            var report = _mapper.Map<MedicalReport>(dto);

            // Metadata
            report.PatientId = appointment.PatientId;
            report.AppointmentId = appointmentId;
            report.FileName = $"Report_{appointment.Patient.FullName.Replace(" ", "_")}_{DateTime.UtcNow:yyyyMMdd}.pdf";
            report.FileType = "application/pdf";
            report.FileUrl = "";

            _context.MedicalReports.Add(report);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Report generated successfully", id = report.Id });
        }
    }
}