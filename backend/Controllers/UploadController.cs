using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs;
using backend.Models;
using AutoMapper;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UploadController : BaseController // Inherits CurrentProfileId logic
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
            // Security: We ensure the current user is a Patient
            if (UserRole != "Patient")
                return BadRequest(new { message = "Only patients can upload reports" });

            if (file == null || file.Length == 0)
                return BadRequest(new { message = "No file provided" });

            long maxSizeInBytes = 10 * 1024 * 1024; // 10 Megabytes
            if (file.Length > maxSizeInBytes)
                return BadRequest(new { message = "File size exceeds the 10MB limit." });

            // File Type Validation (Extension & MIME Type)
            var allowedExtensions = new[] { ".pdf", ".jpg", ".jpeg", ".png" };
            var allowedMimeTypes = new[] { "application/pdf", "image/jpeg", "image/png" };

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            var mimeType = file.ContentType.ToLowerInvariant();

            if (string.IsNullOrEmpty(extension) || !allowedExtensions.Contains(extension) || !allowedMimeTypes.Contains(mimeType))
            {
                return BadRequest(new { message = "Invalid file type. Only PDF, JPG, and PNG files are allowed." });
            }

            // Check if the patient has ALREADY uploaded a file
            var existingReport = await _context.MedicalReports.FirstOrDefaultAsync(mr => mr.PatientId == CurrentProfileId && mr.UploadedByRole == "Patient");

            if (existingReport != null)
            {
                // Block the upload and tell the frontend exactly why
                return BadRequest(new { message = "You have already uploaded a medical report. Please delete your existing file before uploading a new one." });
            }

            // patient Verification
            var patientExists = await _context.Patients.AnyAsync(p => p.Id == CurrentProfileId);
            if (!patientExists)
                return BadRequest(new { message = "Patient profile not found" });

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
                PatientId = CurrentProfileId, // Using the shortcut
                FileName = file.FileName,
                FileType = file.ContentType,
                FileSize = file.Length,
                FileUrl = $"/uploads/reports/{uniqueName}",
                Description = description,
                UploadedByRole = "Patient"
            };

            _context.MedicalReports.Add(report);
            await _context.SaveChangesAsync();

            // AUTOMAPPER: Formats the response for the frontend
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

            // Use CurrentProfileId directly for the Doctor profile update
            var doctor = await _context.Doctors.FindAsync(CurrentProfileId);

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