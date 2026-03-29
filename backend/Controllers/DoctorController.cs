using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs;
using backend.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using backend.Services;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorController : BaseController
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        private readonly UserManager<User> _userManager;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;

        public DoctorController(AppDbContext context, IMapper mapper, UserManager<User> userManager, IEmailService emailService, IConfiguration configuration)
        {
            _context = context;
            _mapper = mapper;
            _userManager = userManager;
            _emailService = emailService;
            _configuration = configuration;
        }

        // GET api/doctor - public, anyone can view doctors
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            // Project doctors to DTO and include EmailConfirmed by looking up the linked Identity user
            var doctors = await _context.Doctors
                .Include(d => d.Specialty)
                .Where(d => d.IsAvailable)
                .Select(d => new DoctorDto
                {
                    Id = d.Id,
                    FullName = d.FullName,
                    SpecialtyId = d.SpecialtyId,
                    Specialty = d.Specialty != null ? d.Specialty.Name : null,
                    Email = d.Email,
                    Phone = d.Phone,
                    ProfileImageUrl = d.ProfileImageUrl,
                    Description = d.Description,
                    IsAvailable = d.IsAvailable,
                    Rating = d.Rating,
                    ReviewCount = d.ReviewCount,
                    ConsultationFee = d.ConsultationFee,
                    CreatedAt = d.CreatedAt,
                    Experience = d.Experience,
                    Qualifications = d.Qualifications,
                    Languages = d.Languages,
                    EmailConfirmed = _context.Users.Where(u => u.Id == d.UserId).Select(u => u.EmailConfirmed).FirstOrDefault()
                })
                .ToListAsync();

            return Ok(doctors);
        }

        // GET api/doctor/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            // Include specialty relationship so the DTO can map the specialty name
            var doctor = await _context.Doctors.Include(d => d.Specialty).FirstOrDefaultAsync(d => d.Id == id);

            if (doctor == null)
                return NotFound(new { message = "Doctor not found" });

            return Ok(_mapper.Map<DoctorDto>(doctor));
        }

        // GET api/doctor/5/slots
        [HttpGet("{id}/slots")]
        public async Task<IActionResult> GetAvailableSlots(int id, [FromQuery] string date)
        {
            var parsedDate = DateTime.Parse(date);
            var dayOfWeek = (int)parsedDate.DayOfWeek;

            var schedule = await _context.DoctorSchedules
                .FirstOrDefaultAsync(s => s.DoctorId == id
                                       && s.DayOfWeek == dayOfWeek
                                       && s.IsActive);

            if (schedule == null)
                return Ok(new List<string>());

            var allSlots = new List<string>();

            var start = TimeSpan.Parse(schedule.StartTime);
            var end = TimeSpan.Parse(schedule.EndTime);
            var duration = TimeSpan.FromMinutes(schedule.SlotDurationMinutes);

            var breakStart = string.IsNullOrEmpty(schedule.BreakStart)
                ? (TimeSpan?)null
                : TimeSpan.Parse(schedule.BreakStart);

            var breakEnd = string.IsNullOrEmpty(schedule.BreakEnd)
                ? (TimeSpan?)null
                : TimeSpan.Parse(schedule.BreakEnd);

            for (var time = start; time + duration <= end; time += duration)
            {
                // Skip lunch break
                if (breakStart.HasValue && breakEnd.HasValue &&
                    time >= breakStart && time < breakEnd)
                {
                    continue;
                }

                allSlots.Add(parsedDate.Date.Add(time).ToString("HH:mm"));
            }

            var bookedSlots = await _context.Appointments
                .Where(a => a.DoctorId == id
                          && a.AppointmentDate.Date == parsedDate.Date
                          && a.Status != "Cancelled")
                .Select(a => a.TimeSlot)
                .ToListAsync();

            var available = allSlots.Except(bookedSlots).ToList();

            return Ok(available);
        }

        // PUT api/doctor/profile - doctor updates own profile
        [HttpPut("profile")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateDoctorProfileDto dto)
        {
            var doctor = await _context.Doctors
                .FirstOrDefaultAsync(d => d.Id == CurrentProfileId);

            if (doctor == null)
                return NotFound(new { message = "Doctor profile not found" });

            _mapper.Map(dto, doctor);

            await _context.SaveChangesAsync();
            return Ok(new { message = "Profile updated" });
        }

        // PUT api/doctor/availability - doctor updates availability
        [HttpPut("availability")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> UpdateAvailability([FromBody] UpdateAvailabilityDto dto)
        {
            var doctor = await _context.Doctors
                .FirstOrDefaultAsync(d => d.Id == CurrentProfileId);

            if (doctor == null)
                return NotFound(new { message = "Doctor profile not found" });

            doctor.IsAvailable = dto.IsAvailable;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Availability updated" });
        }

        // POST api/doctor/admin-register - Admin creates a doctor account and sends set-password link
        [HttpPost("admin-register")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AdminRegister([FromBody] CreateDoctorDto dto)
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
                    Role = "Doctor",
                    EmailConfirmed = false
                };

                var result = await _userManager.CreateAsync(user, tempPassword);
                if (!result.Succeeded)
                    return BadRequest(new { message = result.Errors.First().Description });

                // Create doctor profile and link to Identity user
                var doctor = _mapper.Map<Doctor>(dto);
                doctor.UserId = user.Id;

                _context.Doctors.Add(doctor);
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
                return Ok(new { message = "Doctor account created and set-password link sent." });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "Error creating doctor account", detail = ex.Message });
            }
        }

        // PUT api/doctor/5 - only admin can update
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] AdminUpdateDoctorDto dto)
        {
            var doctor = await _context.Doctors.FindAsync(id);

            if (doctor == null)
                return NotFound(new { message = "Doctor not found" });

            // AutoMapper will map the properties automatically based on matching names
            _mapper.Map(dto, doctor);

            await _context.SaveChangesAsync();
            return Ok(new { message = "Doctor updated" });
        }

        // DELETE api/doctor/5 - only admin
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var doctor = await _context.Doctors.FindAsync(id);

            if (doctor == null)
                return NotFound(new { message = "Doctor not found" });

            // Use a transaction so both doctor and associated Identity user are removed together
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var userId = doctor.UserId;

                _context.Doctors.Remove(doctor);
                await _context.SaveChangesAsync();

                // If a linked Identity user exists, attempt to delete it so the email can be reused
                if (!string.IsNullOrEmpty(userId) && _userManager != null)
                {
                    var user = await _userManager.FindByIdAsync(userId);
                    if (user != null)
                    {
                        var deleteResult = await _userManager.DeleteAsync(user);
                        if (!deleteResult.Succeeded)
                        {
                            await transaction.RollbackAsync();
                            return StatusCode(500, new { message = "Failed to delete associated user." });
                        }
                    }
                }

                await transaction.CommitAsync();
                return Ok(new { message = "Doctor deleted" });
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
    }
}