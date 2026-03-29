using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions; // Required for ProjectTo
using Microsoft.AspNetCore.Identity;
using backend.Models;
using backend.Services;
using Microsoft.Extensions.Configuration;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PatientController : BaseController // Inherits CurrentProfileId logic
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        private readonly UserManager<User> _userManager;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;

        public PatientController(AppDbContext context, IMapper mapper, UserManager<User> userManager, IEmailService emailService, IConfiguration configuration)
        {
            _context = context;
            _mapper = mapper;
            _userManager = userManager;
            _emailService = emailService;
            _configuration = configuration;
        }

        // GET api/patient/profile - Get logged-in patient's profile
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            // Security: Ensure we are only looking for the ID stored in the token
            // FindAsync(id) is highly optimized for primary key lookups
            var patient = await _context.Patients.FindAsync(CurrentProfileId);

            if (patient == null)
                return NotFound(new { message = "Patient profile not found" });

            // Map the full Model to the safe DTO
            return Ok(_mapper.Map<PatientDto>(patient));
        }

        // POST api/patient/admin-register - Admin creates a patient and sends set-password link
        [HttpPost("admin-register")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AdminRegister([FromBody] PatientDto dto)
        {
            var existingUser = await _userManager.FindByEmailAsync(dto.Email);
            if (existingUser != null)
                return BadRequest(new { message = "Email already registered" });

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Create Identity user with random temp password
                var tempPassword = Guid.NewGuid().ToString("N").Substring(0, 12) + "A1!";
                var user = new User
                {
                    FullName = dto.FullName,
                    Email = dto.Email,
                    UserName = dto.Email,
                    Role = "Patient",
                    EmailConfirmed = false
                };

                var result = await _userManager.CreateAsync(user, tempPassword);
                if (!result.Succeeded)
                    return BadRequest(new { message = result.Errors.First().Description });

                // Create patient profile
                var patient = new Models.Patient
                {
                    UserId = user.Id,
                    FullName = dto.FullName,
                    Email = dto.Email,
                    Phone = dto.Phone ?? string.Empty,
                    DateOfBirth = dto.DateOfBirth ?? string.Empty,
                    Gender = dto.Gender ?? string.Empty,
                    Address = ""
                };

                _context.Patients.Add(patient);
                await _context.SaveChangesAsync();

                // Generate password reset token and encode it for use in URL
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                var tokenBytes = System.Text.Encoding.UTF8.GetBytes(token);
                var encodedToken = System.Convert.ToBase64String(tokenBytes)
                    .TrimEnd('=')
                    .Replace('+', '-')
                    .Replace('/', '_');

                var frontendBase = _configuration["Frontend:BaseUrl"] ?? "http://localhost:5173";
                var link = $"{frontendBase}/set-new-password?email={Uri.EscapeDataString(dto.Email)}&token={encodedToken}";
                var logoUrl = frontendBase.TrimEnd('/') + "/favicon.svg";

                var emailBody = $"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; margin: 0; padding: 40px 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
            
            <div style="text-align: center; margin-bottom: 30px;">
                <img src="{logoUrl}" alt="MediBook Logo" style="height: 60px; width: auto;">
            </div>

            <h2 style="color: #111827; text-align: center; font-size: 24px; margin-bottom: 20px;">Welcome to MediBook</h2>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                Hello <strong>{dto.FullName}</strong>,
            </p>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                An administrator has created a new account for you on the MediBook platform. To complete your registration and securely access your dashboard, please click the button below to set your password.
            </p>

            <div style="text-align: center; margin-bottom: 30px;">
                <a href="{link}" style="background-color: #0ea5e9; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; transition: background-color 0.3s;">
                    Set Your Password
                </a>
            </div>

            <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin-bottom: 10px;">
                If the button above does not work, copy and paste the following link into your web browser:
            </p>
            <p style="color: #0ea5e9; font-size: 12px; word-break: break-all; margin-bottom: 40px;">
                {link}
            </p>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin-bottom: 20px;">

            <p style="color: #9ca3af; font-size: 12px; text-align: center; line-height: 1.5; margin: 0;">
                This is an automated message generated by the MediBook system. <br>
                <strong>Please do not reply to this email.</strong> If you require assistance, contact your clinic administrator directly.
            </p>
            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 10px;">
                &copy; {DateTime.UtcNow.Year} MediBook Healthcare Systems. All rights reserved.
            </p>
        </div>
    </body>
    </html>
    """;

                await _emailService.SendEmailAsync(dto.Email, "Action Required: Complete Your MediBook Account Setup", emailBody);

                await transaction.CommitAsync();
                return Ok(new { message = "Patient account created and set-password link sent." });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "Error creating patient account", detail = ex.Message });
            }
        }

        // PUT api/patient/profile - Update personal profile
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdatePatientProfileDto dto)
        {
            // Find the existing record in the database
            var patient = await _context.Patients.FindAsync(CurrentProfileId);

            if (patient == null)
                return NotFound(new { message = "Profile not found" });

            // AUTOMAPPER: Overwrites database record fields with DTO fields
            _mapper.Map(dto, patient);

            await _context.SaveChangesAsync();

            return Ok(new { message = "Profile updated" });
        }

        // GET api/patient/all - Admin only view of all patients
        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            // Project patients to DTO and include EmailConfirmed from linked Identity user
            var patients = await _context.Patients
                .Select(p => new PatientDto
                {
                    Id = p.Id,
                    FullName = p.FullName,
                    Email = p.Email,
                    Phone = p.Phone,
                    DateOfBirth = p.DateOfBirth,
                    Gender = p.Gender,
                    BloodType = p.BloodType,
                    Allergies = p.Allergies,
                    ChronicConditions = p.ChronicConditions,
                    EmergencyContactName = p.EmergencyContactName,
                    EmergencyContactPhone = p.EmergencyContactPhone,
                    CreatedAt = p.CreatedAt,
                    EmailConfirmed = _context.Users.Where(u => u.Id == p.UserId).Select(u => u.EmailConfirmed).FirstOrDefault()
                })
                .ToListAsync();

            return Ok(patients);
        }

        // GET: api/patient/{id} - Admin/Doctor views a specific patient's profile
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Doctor")]
        public async Task<IActionResult> GetPatientById(int id)
        {
            var patient = await _context.Patients
                .ProjectTo<PatientDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (patient == null) return NotFound(new { message = "Patient not found" });

            return Ok(patient);
        }

        // DELETE: api/patient/{id} - Admin removes a patient account
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeletePatient(int id)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null) return NotFound();

            // Optional: Also find the User account linked to this patient to delete both
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == patient.UserId.ToString());

            if (user != null) _context.Users.Remove(user);
            _context.Patients.Remove(patient);

            await _context.SaveChangesAsync();
            return Ok(new { message = "Patient account and data deleted successfully" });
        }

        // PUT api/patient/{id} - Admin updates a patient record
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdatePatient(int id, [FromBody] UpdatePatientProfileDto dto)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null) return NotFound(new { message = "Patient not found" });

            // Only update allowed fields
            patient.FullName = dto.FullName;
            // Email is intentionally not updated by admin here
            patient.Phone = dto.Phone;
            patient.DateOfBirth = dto.DateOfBirth;
            patient.Gender = dto.Gender;
            patient.Address = dto.Address;
            patient.BloodType = dto.BloodType;
            patient.Allergies = dto.Allergies;
            patient.ChronicConditions = dto.ChronicConditions;
            patient.EmergencyContactName = dto.EmergencyContactName;
            patient.EmergencyContactPhone = dto.EmergencyContactPhone;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Patient updated" });
        }
    }
}