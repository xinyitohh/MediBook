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

                var emailBody = GenerateWelcomeEmailHtml(dto.FullName, link, logoUrl);

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

        // GET api/patient/all - Admin and Doctor view of all patients
        [HttpGet("all")]
        [Authorize(Roles = "Admin,Doctor")]
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
            var patient = await _context.Patients
                .Include(p => p.Appointments)
                .FirstOrDefaultAsync(p => p.Id == id);
            
            if (patient == null) return NotFound();

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Delete all related records first (cascade delete)
                var appointments = await _context.Appointments.Where(a => a.PatientId == id).ToListAsync();
                var reviews = await _context.Reviews.Where(r => r.PatientId == id).ToListAsync();
                var questionnaires = await _context.HealthQuestionnaires.Where(h => h.PatientId == id).ToListAsync();
                var medicalReports = await _context.MedicalReports.Where(m => m.PatientId == id).ToListAsync();

                _context.Appointments.RemoveRange(appointments);
                _context.Reviews.RemoveRange(reviews);
                _context.HealthQuestionnaires.RemoveRange(questionnaires);
                _context.MedicalReports.RemoveRange(medicalReports);

                // Delete the patient
                _context.Patients.Remove(patient);

                // Also delete the associated User account
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == patient.UserId);
                if (user != null)
                {
                    _context.Users.Remove(user);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { message = "Patient account and all associated data deleted successfully" });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "Error deleting patient", details = ex.Message });
            }
        }

        // PUT api/patient/{id} - Admin updates a patient record
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdatePatient(int id, [FromBody] AdminUpdatePatientDto dto)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null) return NotFound(new { message = "Patient not found" });

            _mapper.Map(dto, patient);

            await _context.SaveChangesAsync();
            return Ok(new { message = "Patient updated" });
        }

        // POST api/patient/{id}/resend-setup
        [HttpPost("{id}/resend-setup")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ResendSetupLink(int id)
        {
            try
            {
                // Find the patient
                var patient = await _context.Patients.FindAsync(id);
                if (patient == null)
                    return NotFound(new { message = "Patient not found" });

                // Get the associated Identity user
                var user = await _userManager.FindByIdAsync(patient.UserId);
                if (user == null)
                    return BadRequest(new { message = "Patient user account not found" });

                // Check if account is already confirmed
                if (user.EmailConfirmed)
                    return BadRequest(new { message = "Account is already active. Cannot resend setup link for confirmed accounts." });

                // Generate a new password reset token
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                var tokenBytes = System.Text.Encoding.UTF8.GetBytes(token);
                var encodedToken = System.Convert.ToBase64String(tokenBytes)
                    .TrimEnd('=')
                    .Replace('+', '-')
                    .Replace('/', '_');

                var frontendBase = _configuration["Frontend:BaseUrl"] ?? "http://localhost:5173";
                var email = user.Email ?? patient.Email;
                var link = $"{frontendBase}/set-new-password?email={Uri.EscapeDataString(email)}&token={encodedToken}";
                var logoUrl = frontendBase.TrimEnd('/') + "/favicon.svg";

                // Generate and send welcome email using the helper method
                var emailBody = GenerateWelcomeEmailHtml(patient.FullName, link, logoUrl);
                await _emailService.SendEmailAsync(email, "Action Required: Complete Your MediBook Account Setup", emailBody);

                return Ok(new { message = "Setup link resent successfully to patient email." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to resend setup link", error = ex.Message });
            }
        }
    }
}