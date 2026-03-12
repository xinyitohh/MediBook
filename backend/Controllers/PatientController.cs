using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs;
using AutoMapper;
using AutoMapper.QueryableExtensions; // Required for ProjectTo

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PatientController : BaseController // Inherits CurrentProfileId logic
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public PatientController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
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