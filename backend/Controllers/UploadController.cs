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
    public class UploadController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;
        private readonly IMapper _mapper; 

        public UploadController(AppDbContext context, IWebHostEnvironment env, IMapper mapper)
        {
            _context = context;
            _env = env;
            _mapper = mapper;
        }

        // POST api/upload/medical-report - upload a medical report file
        [HttpPost("medical-report")]
        public async Task<IActionResult> UploadMedicalReport(IFormFile file, [FromForm] string description = "")
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var patient = await _context.Patients
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (patient == null)
                return BadRequest(new { message = "Please complete your patient profile first" });

            if (file == null || file.Length == 0)
                return BadRequest(new { message = "No file provided" });

            // Save to local uploads folder
            var uploadsDir = Path.Combine(_env.ContentRootPath, "Uploads", "reports");
            Directory.CreateDirectory(uploadsDir);

            var uniqueName = $"{Guid.NewGuid()}_{file.FileName}";
            var filePath = Path.Combine(uploadsDir, uniqueName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var report = new MedicalReport
            {
                PatientId = patient.Id,
                FileName = file.FileName,
                FileType = file.ContentType,
                FileSize = file.Length,
                FileUrl = $"/uploads/reports/{uniqueName}",
                Description = description
            };

            _context.MedicalReports.Add(report);
            await _context.SaveChangesAsync();

            // AUTOMAPPER: Replaces the long 'new MedicalReportResponseDto { ... }' block
            // It automatically uses the UploadedAt formatting logic from your MappingProfile
            var response = _mapper.Map<MedicalReportResponseDto>(report);

            return Ok(response);
        }

        // POST api/upload/profile-image - upload doctor profile image
        [HttpPost("profile-image")]
        [Authorize(Roles = "Doctor,Admin")]
        public async Task<IActionResult> UploadProfileImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { message = "No file provided" });

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var doctor = await _context.Doctors
                .FirstOrDefaultAsync(d => d.UserId == userId);

            if (doctor == null)
                return NotFound(new { message = "Doctor profile not found" });

            // Save to local uploads folder
            var uploadsDir = Path.Combine(_env.ContentRootPath, "Uploads", "profiles");
            Directory.CreateDirectory(uploadsDir);

            var uniqueName = $"{Guid.NewGuid()}_{file.FileName}";
            var filePath = Path.Combine(uploadsDir, uniqueName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            doctor.ProfileImageUrl = $"/uploads/profiles/{uniqueName}";
            await _context.SaveChangesAsync();

            return Ok(new { message = "Profile image uploaded", imageUrl = doctor.ProfileImageUrl });
        }
    }
}