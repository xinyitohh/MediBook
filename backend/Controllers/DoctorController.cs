using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs;
using backend.Models;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DoctorController(AppDbContext context)
        {
            _context = context;
        }

        // GET api/doctor - public, anyone can view doctors
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var doctors = await _context.Doctors
                .Where(d => d.IsAvailable)
                .Select(d => new DoctorDto
                {
                    Id = d.Id,
                    FullName = d.FullName,
                    Specialty = d.Specialty,
                    Email = d.Email,
                    Phone = d.Phone,
                    ProfileImageUrl = d.ProfileImageUrl,
                    Description = d.Description,
                    IsAvailable = d.IsAvailable
                })
                .ToListAsync();

            return Ok(doctors);
        }

        // GET api/doctor/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var doctor = await _context.Doctors.FindAsync(id);

            if (doctor == null)
                return NotFound(new { message = "Doctor not found" });

            return Ok(new DoctorDto
            {
                Id = doctor.Id,
                FullName = doctor.FullName,
                Specialty = doctor.Specialty,
                Email = doctor.Email,
                Phone = doctor.Phone,
                ProfileImageUrl = doctor.ProfileImageUrl,
                Description = doctor.Description,
                IsAvailable = doctor.IsAvailable
            });
        }

        // POST api/doctor - only admin can add doctors
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] CreateDoctorDto dto)
        {
            var doctor = new Doctor
            {
                FullName = dto.FullName,
                Specialty = dto.Specialty,
                Email = dto.Email,
                Phone = dto.Phone,
                Description = dto.Description
            };

            _context.Doctors.Add(doctor);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Doctor created", id = doctor.Id });
        }

        // PUT api/doctor/5 - only admin can update
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateDoctorDto dto)
        {
            var doctor = await _context.Doctors.FindAsync(id);

            if (doctor == null)
                return NotFound(new { message = "Doctor not found" });

            doctor.FullName = dto.FullName;
            doctor.Specialty = dto.Specialty;
            doctor.Email = dto.Email;
            doctor.Phone = dto.Phone;
            doctor.Description = dto.Description;

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

            _context.Doctors.Remove(doctor);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Doctor deleted" });
        }
    }
}