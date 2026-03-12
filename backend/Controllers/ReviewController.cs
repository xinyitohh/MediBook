using AutoMapper;
using AutoMapper.QueryableExtensions;
using backend.Data;
using backend.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ReviewController : BaseController
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public ReviewController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // POST: api/review - Patient submits a review
        [HttpPost]
        public async Task<IActionResult> SubmitReview([FromBody] CreateReviewDto dto)
        {
            // 1. Validate: Appointment must be Completed and belong to this Patient
            var appointment = await _context.Appointments
                .FirstOrDefaultAsync(a => a.Id == dto.AppointmentId
                                     && a.PatientId == CurrentProfileId
                                     && a.Status == "Completed");

            if (appointment == null)
                return BadRequest(new { message = "You can only review completed appointments from your own visits." });

            // 2. Prevent duplicate reviews for the same appointment
            var exists = await _context.Reviews.AnyAsync(r => r.AppointmentId == dto.AppointmentId);
            if (exists)
                return BadRequest(new { message = "You have already reviewed this appointment." });

            // 3. Create Review
            var review = _mapper.Map<Review>(dto);
            review.PatientId = CurrentProfileId;
            review.DoctorId = appointment.DoctorId;

            _context.Reviews.Add(review);

            // 4. Update Doctor's Aggregate Stats (Rating & ReviewCount)
            var doctor = await _context.Doctors.FindAsync(appointment.DoctorId);
            if (doctor != null)
            {
                // Simple math: New Average = ((Old Avg * Old Count) + New Rating) / (Old Count + 1)
                double totalRatingPoints = (doctor.Rating * doctor.ReviewCount) + dto.Rating;
                doctor.ReviewCount += 1;
                doctor.Rating = Math.Round(totalRatingPoints / doctor.ReviewCount, 1);
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Review submitted successfully" });
        }

        // GET: api/review/doctor/{doctorId} - Publicly view reviews for a doctor
        [HttpGet("doctor/{doctorId}")]
        [AllowAnonymous] // Anyone can read reviews
        public async Task<IActionResult> GetDoctorReviews(int doctorId)
        {
            var reviews = await _context.Reviews
                .Where(r => r.DoctorId == doctorId)
                .OrderByDescending(r => r.CreatedAt)
                .ProjectTo<ReviewDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return Ok(reviews);
        }
    }
}