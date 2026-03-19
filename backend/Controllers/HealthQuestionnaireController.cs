using AutoMapper;
using AutoMapper.QueryableExtensions;
using backend.Data;
using backend.DTOs;
using backend.Models;
using backend.Services;
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
        private readonly INotificationService _notificationService;

        public HealthQuestionnaireController(AppDbContext context, IMapper mapper, INotificationService notificationService)
        {
            _context = context;
            _mapper = mapper;
            _notificationService = notificationService;
        }

        // POST: api/healthquestionnaire - Patient submits symptoms
        [HttpPost]
        public async Task<IActionResult> SubmitQuestionnaire([FromBody] CreateHealthQuestionnaireDto dto)
        {
            // 1. Verify appointment exists and belongs to the current patient
            var appointment = await _context.Appointments
                .Include(a => a.Doctor)
                .Include(a => a.Patient)
                .FirstOrDefaultAsync(a => a.Id == dto.AppointmentId
                                     && a.PatientId == CurrentProfileId
                                     && a.Status != "Cancelled");

            if (appointment == null)
                return BadRequest(new { message = "Invalid or cancelled appointment." });

            // 2. Prevent multiple submissions
            var exists = await _context.HealthQuestionnaires.AnyAsync(q => q.AppointmentId == dto.AppointmentId);
            if (exists)
                return BadRequest(new { message = "Questionnaire already submitted for this visit." });

            // 3. Map and Save
            var questionnaire = _mapper.Map<HealthQuestionnaire>(dto);
            questionnaire.PatientId = CurrentProfileId;

            _context.HealthQuestionnaires.Add(questionnaire);
            await _context.SaveChangesAsync();

            // 4. TRIGGER: Notify the Doctor that symptoms have been submitted
            await _notificationService.SendAsync(
                appointment.Doctor.UserId,
                "Pre-Visit Questionnaire Received",
                $"{appointment.Patient.FullName} has submitted symptoms for the appointment on {appointment.AppointmentDate:dd MMM}.",
                "Medical"
            );

            return Ok(new { message = "Questionnaire submitted. Your doctor has been notified." });
        }

        // GET: api/healthquestionnaire/appointment/{appointmentId}
        [HttpGet("appointment/{appointmentId}")]
        public async Task<IActionResult> GetByAppointment(int appointmentId)
        {
            var query = _context.HealthQuestionnaires.AsQueryable();

            if (UserRole == "Patient")
            {
                query = query.Where(q => q.AppointmentId == appointmentId && q.PatientId == CurrentProfileId);
            }
            else if (UserRole == "Doctor")
            {
                var ownsAppointment = await _context.Appointments
                    .AnyAsync(a => a.Id == appointmentId && a.DoctorId == CurrentProfileId);

                if (!ownsAppointment) return Unauthorized();

                query = query.Where(q => q.AppointmentId == appointmentId);
            }

            var result = await query
                .ProjectTo<HealthQuestionnaireDto>(_mapper.ConfigurationProvider)
                .FirstOrDefaultAsync();

            if (result == null) return NotFound(new { message = "No questionnaire found." });

            return Ok(result);
        }
    }
}