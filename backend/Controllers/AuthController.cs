using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.DTOs;
using backend.Models;
using backend.Data;
using backend.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _configuration;
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        private readonly OtpService _otpService;

        public AuthController(
            UserManager<User> userManager,
            IConfiguration configuration,
            AppDbContext context,
            IMapper mapper,
            OtpService otpService)
        {
            _userManager = userManager;
            _configuration = configuration;
            _context = context;
            _mapper = mapper;
            _otpService = otpService;
        }

        public class SetNewPasswordDto
        {
            public string Email { get; set; } = string.Empty;
            public string Token { get; set; } = string.Empty; // Base64Url encoded
            public string NewPassword { get; set; } = string.Empty;
        }

        // ════════════════════════════════════════════════════
        //  REGISTER — Creates account + Patient Profile + OTP
        // ════════════════════════════════════════════════════
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var existingUser = await _userManager.FindByEmailAsync(dto.Email);
            if (existingUser != null)
                return BadRequest(new { message = "Email already registered" });

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var user = _mapper.Map<User>(dto);
                user.UserName = dto.Email;
                user.Role = "Patient";
                user.EmailConfirmed = false; // Block login until OTP verified

                var result = await _userManager.CreateAsync(user, dto.Password);
                if (!result.Succeeded)
                    return BadRequest(new { message = result.Errors.First().Description });

                // Create the Patient Profile immediately
                var patientProfile = new Patient
                {
                    UserId = user.Id,
                    FullName = user.FullName,
                    Email = user.Email!
                };

                _context.Patients.Add(patientProfile);
                await _context.SaveChangesAsync();

                // Generate and send OTP via Email
                await _otpService.GenerateAndSendOtp(dto.Email, "EmailVerification");

                await transaction.CommitAsync();
                return Ok(new
                {
                    message = "Registration successful. Please verify your email with the OTP sent.",
                    email = dto.Email,
                    requiresVerification = true
                });
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "An error occurred during registration" });
            }
        }

        // ════════════════════════════════════════════════════
        //  VERIFY EMAIL — Marks account as active
        // ════════════════════════════════════════════════════
        [HttpPost("verify-email")]
        public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null) return NotFound(new { message = "User not found" });

            if (user.EmailConfirmed) return BadRequest(new { message = "Email already verified" });

            var isValid = await _otpService.VerifyOtp(dto.Email, dto.Code, "EmailVerification");
            if (!isValid) return BadRequest(new { message = "Invalid or expired code" });

            user.EmailConfirmed = true;
            await _userManager.UpdateAsync(user);

            return Ok(new { message = "Email verified successfully. You can now log in." });
        }

        // ════════════════════════════════════════════════════
        //  RESEND OTP — If user didn't receive or code expired
        // ════════════════════════════════════════════════════

        [HttpPost("resend-otp")]
        public async Task<IActionResult> ResendOtp([FromBody] ResendOtpDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
                return NotFound(new { message = "User not found" });

            if (user.EmailConfirmed)
                return BadRequest(new { message = "Email is already verified" });

            await _otpService.GenerateAndSendOtp(dto.Email, "EmailVerification");

            return Ok(new { message = "New verification code sent" });
        }

        // ════════════════════════════════════════════════════
        //  VERIFY RESET CODE — Step 2: Check code is valid
        //  (Optional step so frontend can show the new password
        //   form only after code is confirmed valid)
        // ════════════════════════════════════════════════════

        [HttpPost("verify-reset-code")]
        public async Task<IActionResult> VerifyResetCode([FromBody] VerifyResetCodeDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
                return BadRequest(new { message = "Invalid request" });

            // Just check if code is valid WITHOUT marking it as used
            // (It will be used in the reset-password step)
            var isValid = await _otpService.VerifyOtp(dto.Email, dto.Code, "PasswordReset");
            if (!isValid)
                return BadRequest(new { message = "Invalid or expired reset code" });

            // Generate a temporary single-use token for the password reset
            var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);

            return Ok(new
            {
                message = "Code verified. You can now set a new password.",
                resetToken   // Frontend sends this back in reset-password
            });
        }

        // ════════════════════════════════════════════════════
        //  REGISTER DOCTOR — Admin creating a Doctor
        // ════════════════════════════════════════════════════
        [HttpPost("register-doctor")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RegisterDoctor([FromBody] CreateDoctorDto dto)
        {
            var existingUser = await _userManager.FindByEmailAsync(dto.Email);
            if (existingUser != null)
                return BadRequest(new { message = "Email already registered" });

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var user = new User
                {
                    FullName = dto.FullName,
                    Email = dto.Email,
                    UserName = dto.Email,
                    Role = "Doctor",
                    EmailConfirmed = true // Admins create active accounts
                };

                // Use the provided password from the DTO so admin can set the initial password.
                if (string.IsNullOrWhiteSpace(dto.Password) || dto.Password.Length < 6)
                {
                    return BadRequest(new { message = "Password is required and must be at least 6 characters." });
                }

                var result = await _userManager.CreateAsync(user, dto.Password);
                if (!result.Succeeded)
                    return BadRequest(new { message = result.Errors.First().Description });

                var doctorProfile = _mapper.Map<Doctor>(dto);
                doctorProfile.UserId = user.Id;

                _context.Doctors.Add(doctorProfile);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { message = "Doctor account and profile created successfully" });
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "Error creating doctor account" });
            }
        }

        // ════════════════════════════════════════════════════
        //  LOGIN — Blocks unverified patients
        // ════════════════════════════════════════════════════
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
                return Unauthorized(new { message = "Invalid email or password" });

            var isPasswordValid = await _userManager.CheckPasswordAsync(user, dto.Password);
            if (!isPasswordValid)
                return Unauthorized(new { message = "Invalid email or password" });

            // Block unverified accounts
            if (!user.EmailConfirmed)
            {
                return StatusCode(403, new
                {
                    message = "Please verify your email before logging in",
                    email = user.Email,
                    requiresVerification = true
                });
            }

            var token = await GenerateJwtToken(user);
            var response = _mapper.Map<AuthResponseDto>(user);
            response.Token = token;

            return Ok(response);
        }

        // ════════════════════════════════════════════════════
        //  FORGOT & RESET PASSWORD
        // ════════════════════════════════════════════════════
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user != null)
            {
                await _otpService.GenerateAndSendOtp(dto.Email, "PasswordReset");
            }
            return Ok(new { message = "If the email exists, a reset code has been sent" });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null) return BadRequest(new { message = "Invalid request" });

            // 'dto.Code' here is the 6-digit OTP
            var isValid = await _otpService.VerifyOtp(dto.Email, dto.Code, "PasswordReset");
            if (!isValid) return BadRequest(new { message = "Invalid or expired reset code" });

            // Identity needs a reset token to actually change the password
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, token, dto.NewPassword);

            if (!result.Succeeded)
                return BadRequest(new { message = result.Errors.First().Description });

            return Ok(new { message = "Password reset successful." });
        }

        // POST api/auth/set-new-password - Accepts email, Base64Url token, and new password
        [HttpPost("set-new-password")]
        public async Task<IActionResult> SetNewPassword([FromBody] SetNewPasswordDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null) return BadRequest(new { message = "Invalid request" });

            // Decode Base64Url token to original token string
            try
            {
                var padded = dto.Token.Replace('-', '+').Replace('_', '/');
                switch (padded.Length % 4)
                {
                    case 2: padded += "=="; break;
                    case 3: padded += "="; break;
                }
                var tokenBytes = System.Convert.FromBase64String(padded);
                var token = System.Text.Encoding.UTF8.GetString(tokenBytes);

                var result = await _userManager.ResetPasswordAsync(user, token, dto.NewPassword);
                if (!result.Succeeded)
                    return BadRequest(new { message = result.Errors.First().Description });

                user.EmailConfirmed = true;
                await _userManager.UpdateAsync(user);

                return Ok(new { message = "Password set successfully." });
            }
            catch (Exception)
            {
                return BadRequest(new { message = "Invalid token" });
            }
        }

        // ════════════════════════════════════════════════════
        //  HELPER: JWT Token Generation (Includes ProfileId)
        // ════════════════════════════════════════════════════
        private async Task<string> GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            string profileId = "";

            if (user.Role == "Patient")
            {
                var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == user.Id);
                profileId = patient?.Id.ToString() ?? "";
            }
            else if (user.Role == "Doctor")
            {
                var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.UserId == user.Id);
                profileId = doctor?.Id.ToString() ?? "";
            }

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email!),
                new Claim(ClaimTypes.Name, user.FullName),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("ProfileId", profileId)
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}