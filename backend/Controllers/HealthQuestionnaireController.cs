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
    public class HealthQuestionnaireController : BaseController
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public HealthQuestionnaireController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // POST: api/healthquestionnaire - Patient submits symptoms before visit
        [HttpPost]
        public async Task<IActionResult> SubmitQuestionnaire([FromBody] CreateHealthQuestionnaireDto dto)
        {
            // 1. Verify appointment belongs to patient and isn't cancelled
            var appointment = await _context.Appointments
                .FirstOrDefaultAsync(a => a.Id == dto.AppointmentId
                                     && a.PatientId == CurrentProfileId
                                     && a.Status != "Cancelled");

            if (appointment == null)
                return BadRequest(new { message = "Invalid appointment." });

            // 2. Prevent multiple submissions for one appointment
            var exists = await _context.HealthQuestionnaires.AnyAsync(q => q.AppointmentId == dto.AppointmentId);
            if (exists)
                return BadRequest(new { message = "Questionnaire already submitted for this visit." });

            // 3. Map and Save
            var questionnaire = _mapper.Map<HealthQuestionnaire>(dto);
            questionnaire.PatientId = CurrentProfileId;

            _context.HealthQuestionnaires.Add(questionnaire);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Questionnaire submitted. The doctor will review it before your visit." });
        }

        // GET: api/healthquestionnaire/appointment/{appointmentId} - Doctor/Patient views it
        [HttpGet("appointment/{appointmentId}")]
        public async Task<IActionResult> GetByAppointment(int appointmentId)
        {
            var query = _context.HealthQuestionnaires.AsQueryable();

            // Security: If Patient, can only see their own. If Doctor, can only see if they are the assigned doctor.
            if (UserRole == "Patient")
            {
                query = query.Where(q => q.AppointmentId == appointmentId && q.PatientId == CurrentProfileId);
            }
            else if (UserRole == "Doctor")
            {
                // Verify this doctor is the one for this appointment
                var ownsAppointment = await _context.Appointments
                    .AnyAsync(a => a.Id == appointmentId && a.DoctorId == CurrentProfileId);

                if (!ownsAppointment) return Unauthorized();

                query = query.Where(q => q.AppointmentId == appointmentId);
            }

            var result = await query
                .ProjectTo<HealthQuestionnaireDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();

            if (result == null) return NotFound(new { message = "No questionnaire found for this appointment." });

            return Ok(result);
        }
    }
}