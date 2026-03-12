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

            var user = _mapper.Map<User>(dto);
            user.UserName = dto.Email; // Identity requires UserName

            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded)
                return BadRequest(new { message = result.Errors.First().Description });

            // Create patient profile
            var patientProfile = new Patient
            {
                UserId = user.Id,
                FullName = user.FullName,
                Email = user.Email!
            };

            _context.Patients.Add(patientProfile);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Registration successful" });
        }

        // POST api/auth/register-staff
        [HttpPost("register-staff")]
        [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
        public async Task<IActionResult> RegisterStaff([FromBody] StaffRegisterDto dto)
        {
            if (dto.Role != "Admin")
                return BadRequest(new { message = "Role must be Admin" });

            var existingUser = await _userManager.FindByEmailAsync(dto.Email);
            if (existingUser != null)
                return BadRequest(new { message = "Email already registered" });

            var user = _mapper.Map<User>(dto);
            user.UserName = dto.Email;

            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded)
                return BadRequest(new { message = result.Errors.First().Description });

            return Ok(new { message = $"{dto.Role} account created successfully" });
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