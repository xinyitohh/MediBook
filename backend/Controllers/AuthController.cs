using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.DTOs;
using backend.Models;
using backend.Data;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;

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

        public AuthController(UserManager<User> userManager, IConfiguration configuration, AppDbContext context, IMapper mapper)
        {
            _userManager = userManager;
            _configuration = configuration;
            _context = context;
            _mapper = mapper;
        }

        // POST api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var existingUser = await _userManager.FindByEmailAsync(dto.Email);
            if (existingUser != null)
                return BadRequest(new { message = "Email already registered" });

            // Start Transaction
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var user = _mapper.Map<User>(dto);
                user.UserName = dto.Email;

                var result = await _userManager.CreateAsync(user, dto.Password);
                if (!result.Succeeded)
                    return BadRequest(new { message = result.Errors.First().Description });

                var patientProfile = new Patient
                {
                    UserId = user.Id,
                    FullName = user.FullName,
                    Email = user.Email!
                };

                _context.Patients.Add(patientProfile);
                await _context.SaveChangesAsync();

                // Commit everything
                await transaction.CommitAsync();
                return Ok(new { message = "Registration successful" });
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "An error occurred during registration" });
            }
        }

        // 2. DOCTOR REGISTRATION (Admin-only)
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
                    Role = "Doctor"
                };

                // Admins set a default password for doctors
                var result = await _userManager.CreateAsync(user, "Doctor123!");
                if (!result.Succeeded)
                    return BadRequest(new { message = result.Errors.First().Description });

                // Doctors need a profile in the Doctors table
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

        // 3. ADMIN REGISTRATION (Admin-only)
        [HttpPost("register-admin")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RegisterAdmin([FromBody] StaffRegisterDto dto)
        {
            var existingUser = await _userManager.FindByEmailAsync(dto.Email);
            if (existingUser != null)
                return BadRequest(new { message = "Email already registered" });

            // Admins only exist in the Users table (no extra profile table)
            var user = _mapper.Map<User>(dto);
            user.UserName = dto.Email;
            user.Role = "Admin";

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
                return BadRequest(new { message = result.Errors.First().Description });

            return Ok(new { message = "Admin account created successfully" });
        }

        // POST api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
                return Unauthorized(new { message = "Invalid email or password" });

            var isPasswordValid = await _userManager.CheckPasswordAsync(user, dto.Password);
            if (!isPasswordValid)
                return Unauthorized(new { message = "Invalid email or password" });

            var token = GenerateJwtToken(user);

            // AUTOMAPPER: Maps User fields to AuthResponseDto 
            // and we manually attach the newly generated token
            var response = _mapper.Map<AuthResponseDto>(user);
            response.Token = token;

            return Ok(response);
        }

        private string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            // add profile id
            string profileId = "";
            if (user.Role == "Patient")
            {
                profileId = _context.Patients.FirstOrDefault(p => p.UserId == user.Id)?.Id.ToString() ?? "";
            }
            else if (user.Role == "Doctor")
            {
                profileId = _context.Doctors.FirstOrDefault(d => d.UserId == user.Id)?.Id.ToString() ?? "";
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