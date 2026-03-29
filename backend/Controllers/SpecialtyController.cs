using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.DTOs;
using backend.Models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SpecialtyController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SpecialtyController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/specialty - Get all specialties
        [HttpGet]
        public async Task<IActionResult> GetAllSpecialties()
        {
            try
            {
                var specialties = await _context.Specialties
                    .OrderBy(s => s.Name)
                    .ToListAsync();

                var dtos = specialties.Select(s => new SpecialtyDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    CreatedAt = s.CreatedAt
                }).ToList();

                return Ok(dtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving specialties", error = ex.Message });
            }
        }

        // GET: api/specialty/{id} - Get specialty by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSpecialtyById(int id)
        {
            try
            {
                var specialty = await _context.Specialties.FindAsync(id);
                if (specialty == null)
                    return NotFound(new { message = "Specialty not found" });

                var dto = new SpecialtyDto
                {
                    Id = specialty.Id,
                    Name = specialty.Name,
                    CreatedAt = specialty.CreatedAt
                };

                return Ok(dto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error retrieving specialty", error = ex.Message });
            }
        }

        // POST: api/specialty - Create new specialty
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateSpecialty([FromBody] CreateSpecialtyDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                return BadRequest(new { message = "Specialty name is required" });

            try
            {
                // Check if specialty already exists
                var existing = await _context.Specialties
                    .FirstOrDefaultAsync(s => s.Name == dto.Name);
                
                if (existing != null)
                    return BadRequest(new { message = "Specialty already exists" });

                var specialty = new Specialty
                {
                    Name = dto.Name.Trim(),
                    CreatedAt = DateTime.UtcNow
                };

                _context.Specialties.Add(specialty);
                await _context.SaveChangesAsync();

                var responseDto = new SpecialtyDto
                {
                    Id = specialty.Id,
                    Name = specialty.Name,
                    CreatedAt = specialty.CreatedAt
                };

                return CreatedAtAction(nameof(GetSpecialtyById), new { id = specialty.Id }, responseDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating specialty", error = ex.Message });
            }
        }

        // PUT: api/specialty/{id} - Update specialty
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateSpecialty(int id, [FromBody] UpdateSpecialtyDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                return BadRequest(new { message = "Specialty name is required" });

            try
            {
                var specialty = await _context.Specialties.FindAsync(id);
                if (specialty == null)
                    return NotFound(new { message = "Specialty not found" });

                // Check for duplicate names
                var duplicate = await _context.Specialties
                    .FirstOrDefaultAsync(s => s.Name == dto.Name && s.Id != id);
                
                if (duplicate != null)
                    return BadRequest(new { message = "Specialty name already exists" });

                specialty.Name = dto.Name.Trim();
                _context.Specialties.Update(specialty);
                await _context.SaveChangesAsync();

                var responseDto = new SpecialtyDto
                {
                    Id = specialty.Id,
                    Name = specialty.Name,
                    CreatedAt = specialty.CreatedAt
                };

                return Ok(responseDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating specialty", error = ex.Message });
            }
        }

        // DELETE: api/specialty/{id} - Delete specialty
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteSpecialty(int id)
        {
            try
            {
                var specialty = await _context.Specialties
                    .Include(s => s.Doctors)
                    .FirstOrDefaultAsync(s => s.Id == id);

                if (specialty == null)
                    return NotFound(new { message = "Specialty not found" });

                // Check if specialty is in use
                if (specialty.Doctors.Any())
                    return BadRequest(new { message = "Cannot delete specialty that is assigned to doctors" });

                _context.Specialties.Remove(specialty);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Specialty deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting specialty", error = ex.Message });
            }
        }
    }
}
