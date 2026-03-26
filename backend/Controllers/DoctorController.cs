using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs;
using backend.Models;
using AutoMapper;
using AutoMapper.QueryableExtensions;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorController : BaseController
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public DoctorController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET api/doctor - public, anyone can view doctors
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            // ProjectTo makes the SQL query efficient by only selecting DTO fields
            var doctors = await _context.Doctors
                .Where(d => d.IsAvailable)
                .ProjectTo<DoctorDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return Ok(doctors);
        }

        // GET api/doctor/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            // FindAsync is fine here as we want the full object for a single detail view
            var doctor = await _context.Doctors.FindAsync(id);

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

        // POST api/doctor - only admin can add doctors
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] CreateDoctorDto dto)
        {
            var doctor = _mapper.Map<Doctor>(dto);

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

            _context.Doctors.Remove(doctor);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Doctor deleted" });
        }
    }
}