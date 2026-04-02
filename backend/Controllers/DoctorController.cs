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

        // GET api/doctor/5/schedule - public, get a doctor's weekly configuration
        [HttpGet("{id}/schedule")]
        public async Task<IActionResult> GetDoctorSchedule(int id)
        {
            var schedules = await _context.DoctorSchedules
                .Where(s => s.DoctorId == id)
                .Select(s => new DoctorScheduleDto
                {
                    DayOfWeek = s.DayOfWeek,
                    StartTime = s.StartTime,
                    EndTime = s.EndTime,
                    BreakStart = s.BreakStart,
                    BreakEnd = s.BreakEnd,
                    SlotDurationMinutes = s.SlotDurationMinutes,
                    IsActive = s.IsActive
                })
                .ToListAsync();

            return Ok(schedules);
        }

        // GET api/doctor/5/slots
        [HttpGet("{id}/slots")]
        public async Task<IActionResult> GetAvailableSlots(int id, [FromQuery] string date)
        {
            var parsedDate = DateTime.Parse(date);

            // Check if doctor is on leave on this date
            var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.Id == id);
            if (doctor != null && doctor.LeaveDates != null && doctor.LeaveDates.Any(ld => ld.Date == parsedDate.Date))
            {
                return Ok(new List<string>());
            }

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

        // GET api/doctor/profile - doctor views their own profile
        [HttpGet("profile")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> GetProfile()
        {
            var doctor = await _context.Doctors
                .Include(d => d.Specialty)
                .FirstOrDefaultAsync(d => d.Id == CurrentProfileId);

            if (doctor == null)
                return NotFound(new { message = "Doctor profile not found" });

            return Ok(_mapper.Map<DoctorDto>(doctor));
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

        // GET api/doctor/schedule
        [HttpGet("schedule")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> GetSchedule()
        {
            var schedules = await _context.DoctorSchedules
                .Where(s => s.DoctorId == CurrentProfileId)
                .Select(s => new DoctorScheduleDto
                {
                    DayOfWeek = s.DayOfWeek,
                    StartTime = s.StartTime,
                    EndTime = s.EndTime,
                    BreakStart = s.BreakStart,
                    BreakEnd = s.BreakEnd,
                    SlotDurationMinutes = s.SlotDurationMinutes,
                    IsActive = s.IsActive
                })
                .ToListAsync();

            return Ok(schedules);
        }

        // PUT api/doctor/schedule
        [HttpPut("schedule")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> UpdateSchedule([FromBody] UpdateScheduleDto dto)
        {
            var doctorId = CurrentProfileId;
            
            // Delete existing schedules and replace with new bulk data
            var existingSchedules = await _context.DoctorSchedules
                .Where(s => s.DoctorId == doctorId)
                .ToListAsync();
            
            _context.DoctorSchedules.RemoveRange(existingSchedules);

            foreach (var s in dto.Schedules)
            {
                _context.DoctorSchedules.Add(new DoctorSchedule
                {
                    DoctorId = doctorId,
                    DayOfWeek = s.DayOfWeek,
                    StartTime = s.StartTime,
                    EndTime = s.EndTime,
                    BreakStart = string.IsNullOrEmpty(s.BreakStart) ? null : s.BreakStart,
                    BreakEnd = string.IsNullOrEmpty(s.BreakEnd) ? null : s.BreakEnd,
                    SlotDurationMinutes = s.SlotDurationMinutes,
                    IsActive = s.IsActive
                });
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Schedule updated successfully" });
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

                var emailBody = GenerateWelcomeEmailHtml(dto.FullName, link, logoUrl);

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

            // Use a transaction so all related data is removed together
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var userId = doctor.UserId;

                // Delete all related records first (cascade delete)
                var appointments = await _context.Appointments.Where(a => a.DoctorId == id).ToListAsync();
                var reviews = await _context.Reviews.Where(r => r.DoctorId == id).ToListAsync();
                var schedules = await _context.DoctorSchedules.Where(s => s.DoctorId == id).ToListAsync();

                _context.Appointments.RemoveRange(appointments);
                _context.Reviews.RemoveRange(reviews);
                _context.DoctorSchedules.RemoveRange(schedules);

                // Delete the doctor
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

        // POST api/doctor/{id}/resend-setup
        [HttpPost("{id}/resend-setup")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ResendSetupLink(int id)
        {
            try
            {
                // Find the doctor
                var doctor = await _context.Doctors.FindAsync(id);
                if (doctor == null)
                    return NotFound(new { message = "Doctor not found" });

                // Get the associated Identity user
                var user = await _userManager.FindByIdAsync(doctor.UserId);
                if (user == null)
                    return BadRequest(new { message = "Doctor user account not found" });

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
                var email = user.Email ?? doctor.Email;
                var link = $"{frontendBase}/set-new-password?email={Uri.EscapeDataString(email)}&token={encodedToken}";
                var logoUrl = frontendBase.TrimEnd('/') + "/favicon.svg";

                // Generate and send welcome email using the helper method
                var emailBody = GenerateWelcomeEmailHtml(doctor.FullName, link, logoUrl);
                await _emailService.SendEmailAsync(email, "Action Required: Complete Your MediBook Account Setup", emailBody);

                return Ok(new { message = "Setup link resent successfully to doctor email." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to resend setup link", error = ex.Message });
            }
        }
    }
}