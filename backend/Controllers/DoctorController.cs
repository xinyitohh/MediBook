using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
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
                    IsAvailable = d.IsAvailable,
                    Rating = d.Rating,
                    ReviewCount = d.ReviewCount,
                    ConsultationFee = d.ConsultationFee,
                    Experience = d.Experience
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
                IsAvailable = doctor.IsAvailable,
                Rating = doctor.Rating,
                ReviewCount = doctor.ReviewCount,
                ConsultationFee = doctor.ConsultationFee,
                Experience = doctor.Experience
            });
        }

        // GET api/doctor/5/slots?date=2026-03-10 - get available time slots
        [HttpGet("{id}/slots")]
        public async Task<IActionResult> GetSlots(int id, [FromQuery] string date)
        {
            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor == null)
                return NotFound(new { message = "Doctor not found" });

            if (!DateTime.TryParse(date, out var parsedDate))
                return BadRequest(new { message = "Invalid date format" });

            // All possible time slots
            var allSlots = new[]
            {
                "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
                "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM",
                "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
            };

            // Get booked slots for this doctor on this date
            var bookedSlots = await _context.Appointments
                .Where(a => a.DoctorId == id &&
                            a.AppointmentDate.Date == parsedDate.Date &&
                            a.Status != "Cancelled")
                .Select(a => a.TimeSlot)
                .ToListAsync();

            // Return only available slots
            var availableSlots = allSlots.Where(s => !bookedSlots.Contains(s)).ToArray();

            return Ok(availableSlots);
        }

        // PUT api/doctor/profile - doctor updates own profile
        [HttpPut("profile")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateDoctorProfileDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var doctor = await _context.Doctors
                .FirstOrDefaultAsync(d => d.UserId == userId);

            if (doctor == null)
                return NotFound(new { message = "Doctor profile not found" });

            doctor.FullName = dto.FullName;
            doctor.Phone = dto.Phone;
            doctor.Description = dto.Description;
            doctor.ConsultationFee = dto.ConsultationFee;
            doctor.Experience = dto.Experience;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Profile updated" });
        }

        // PUT api/doctor/availability - doctor updates availability
        [HttpPut("availability")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> UpdateAvailability([FromBody] UpdateAvailabilityDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var doctor = await _context.Doctors
                .FirstOrDefaultAsync(d => d.UserId == userId);

            if (doctor == null)
                return NotFound(new { message = "Doctor profile not found" });

            doctor.IsAvailable = dto.IsAvailable;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Availability updated" });
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
                Description = dto.Description,
                ConsultationFee = dto.ConsultationFee,
                Experience = dto.Experience
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
            doctor.ConsultationFee = dto.ConsultationFee;
            doctor.Experience = dto.Experience;

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
