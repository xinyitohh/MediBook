using backend.Data;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    public record DoctorChatRequest(
        string Message,
        List<ChatMessage>? History,
        int? MedicalReportId
    );

    [Route("api/doctor-chat")]
    [ApiController]
    [Authorize]
    public class DoctorChatController : BaseController
    {
        private readonly DoctorChatService _chatService;
        private readonly AppDbContext _context;

        public DoctorChatController(DoctorChatService chatService, AppDbContext context)
        {
            _chatService = chatService;
            _context = context;
        }

        // POST api/doctor-chat
        [HttpPost]
        public async Task<IActionResult> Chat([FromBody] DoctorChatRequest request)
        {
            if (UserRole != "Doctor")
                return Forbid();

            if (string.IsNullOrWhiteSpace(request.Message))
                return BadRequest(new { message = "Message is required" });

            string? rawText = null;
            string? rawEntities = null;
            string? summary = null;

            if (request.MedicalReportId.HasValue)
            {
                var analysis = await _context.ReportAnalyses
                    .FirstOrDefaultAsync(r => r.MedicalReportId == request.MedicalReportId.Value
                                           && r.Status == "Completed");
                if (analysis != null)
                {
                    rawText = analysis.RawText;
                    rawEntities = analysis.RawEntities;
                    summary = analysis.Summary;
                }
            }

            var reply = await _chatService.ChatAsync(
                request.Message,
                request.History,
                rawText,
                rawEntities,
                summary
            );

            return Ok(new { reply });
        }
    }
}
