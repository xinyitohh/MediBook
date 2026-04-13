using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs;
using backend.Models;
using AutoMapper;
using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Configuration;

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
        private readonly IConfiguration _config;
        private readonly IAmazonS3 _s3Client;

        public UploadController(AppDbContext context, IWebHostEnvironment env, IMapper mapper, IConfiguration config)
        {
            _context = context;
            _env = env;
            _mapper = mapper;
            _config = config;

            var awsOptions = _config.GetSection("AWS");
            _s3Client = new AmazonS3Client(
                awsOptions["AccessKey"],
                awsOptions["SecretKey"],
                awsOptions["SessionToken"],
                Amazon.RegionEndpoint.USEast1
            );
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

            // patient Verification
            var patientExists = await _context.Patients.AnyAsync(p => p.Id == CurrentProfileId);
            if (!patientExists)
                return BadRequest(new { message = "Patient profile not found" });

            // Save to local uploads folder
            //var uploadsDir = Path.Combine(_env.ContentRootPath, "Uploads", "reports");
            //Directory.CreateDirectory(uploadsDir);

            //var uniqueName = $"{Guid.NewGuid()}_{file.FileName}";
            //var filePath = Path.Combine(uploadsDir, uniqueName);

            //using (var stream = new FileStream(filePath, FileMode.Create))
            //{
            //    await file.CopyToAsync(stream);
            //}

            var bucketName = _config["AWS:BucketName"];
            var uniqueName = $"reports/{Guid.NewGuid()}_{file.FileName}";

            var putRequest = new PutObjectRequest
            {
                BucketName = bucketName,
                Key = uniqueName, // This acts as the file path inside your S3 bucket
                InputStream = file.OpenReadStream(),
                ContentType = file.ContentType
            };

            await _s3Client.PutObjectAsync(putRequest);

            var report = new MedicalReport
            {
                PatientId = CurrentProfileId, // Using the shortcut
                FileName = file.FileName,
                FileType = file.ContentType,
                FileSize = file.Length,
                FileUrl = uniqueName,
                Description = description,
                UploadedByRole = "Patient"
            };

            _context.MedicalReports.Add(report);
            await _context.SaveChangesAsync();

            // AUTOMAPPER: Formats the response for the frontend
            var response = _mapper.Map<MedicalReportResponseDto>(report);

            return Ok(response);
        }

        // GET api/upload/view-patient-report/{appointmentId}
        [HttpGet("view-patient-report/{appointmentId}")]
        public async Task<IActionResult> GetSecurePatientReportUrl(int appointmentId)
        {
            // Find the specific report uploaded by the patient for this appointment
            var report = await _context.MedicalReports
                .FirstOrDefaultAsync(r => r.AppointmentId == appointmentId && r.UploadedByRole == "Patient");

            if (report == null)
                return NotFound(new { message = "No patient report found for this appointment." });

            var request = new GetPreSignedUrlRequest
            {
                BucketName = _config["AWS:BucketName"],
                Key = report.FileUrl, 
                Expires = DateTime.UtcNow.AddMinutes(5)
            };

            string temporaryUrl = _s3Client.GetPreSignedURL(request);
          
            return Ok(new { secureUrl = temporaryUrl, fileType = report.FileType });
        }

        // POST api/upload/profile-image - upload doctor profile image
        [HttpPost("profile-image")]
        [Authorize]
        public async Task<IActionResult> UploadProfileImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { message = "No file provided" });

            var bucketName = _config["AWS:BucketName"];
            string? oldImageUrl = null;

            if (UserRole == "Doctor")
            {
                var doctor = await _context.Doctors.FindAsync(CurrentProfileId);

                if (doctor == null) {
                    return NotFound(new { message = "Profile not found" });
                }

                oldImageUrl = doctor.ProfileImageUrl;
            }
            else if (UserRole == "Patient")
            {
                var patient = await _context.Patients.FindAsync(CurrentProfileId);

                if (patient == null)
                {
                    return NotFound(new { message = "Profile not found" });
                }

                oldImageUrl = patient.ProfileImageUrl;
            }

            // check whether have an old image
            if (!string.IsNullOrEmpty(oldImageUrl))
            {
                try
                {
                    var deleteRequest = new DeleteObjectRequest
                    {
                        BucketName = bucketName,
                        Key = oldImageUrl // The exact path/key of the old file
                    };
                    await _s3Client.DeleteObjectAsync(deleteRequest);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"S3 Deletion Error: {ex.Message}");
                }
            }

            // upload new image to S3
            var uniqueName = $"profiles/{Guid.NewGuid()}_{file.FileName}";
            var putRequest = new PutObjectRequest
            {
                BucketName = bucketName,
                Key = uniqueName,
                InputStream = file.OpenReadStream(),
                ContentType = file.ContentType
            };

            await _s3Client.PutObjectAsync(putRequest);

            // Save new key to db
            if (UserRole == "Doctor")
            {
                var doctor = await _context.Doctors.FindAsync(CurrentProfileId);
                if (doctor != null) {
                    doctor.ProfileImageUrl = uniqueName;
                }
                
            }
            else if (UserRole == "Patient")
            {
                var patient = await _context.Patients.FindAsync(CurrentProfileId);
                if (patient != null) {
                    patient.ProfileImageUrl = uniqueName;
                }
                
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Profile image uploaded", fileKey = uniqueName });
        }

        [HttpGet("image")]
        public IActionResult GetImage([FromQuery] string key)
        {
            if (string.IsNullOrEmpty(key)) return BadRequest();

            var request = new GetPreSignedUrlRequest
            {
                BucketName = _config["AWS:BucketName"],
                Key = key,
                Expires = DateTime.UtcNow.AddMinutes(60)
            };

            return Ok(new { imageUrl = _s3Client.GetPreSignedURL(request) });
        }
    }
}