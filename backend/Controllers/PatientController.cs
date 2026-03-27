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
                    Phone = dto.Phone
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

                var html = $"<p>Hello {dto.FullName},</p><p>An account has been created for you. Please set your password using the link below:</p><p><a href=\"{link}\">Set your password</a></p>";

                await _emailService.SendEmailAsync(dto.Email, "Set your MediBook password", html);

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
            // Efficiency: ProjectTo tells SQL to only fetch columns defined in PatientDto
            // This avoids loading massive data (like medical reports or addresses) unless needed
            var patients = await _context.Patients
                .ProjectTo<PatientDto>(_mapper.ConfigurationProvider)
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
    }
}