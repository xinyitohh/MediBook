using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    public record DoctorChatRequest(
        string Message,
        List<ChatMessage>? History,
        string? AnalysisContext
    );

    [Route("api/doctor-chat")]
    [ApiController]
    [Authorize]
    public class DoctorChatController : BaseController
    {
        private readonly DoctorChatService _chatService;

        public DoctorChatController(DoctorChatService chatService)
        {
            _chatService = chatService;
        }

        // POST api/doctor-chat
        [HttpPost]
        public async Task<IActionResult> Chat([FromBody] DoctorChatRequest request)
        {
            if (UserRole != "Doctor")
                return Forbid();

            if (string.IsNullOrWhiteSpace(request.Message))
                return BadRequest(new { message = "Message is required" });

            var reply = await _chatService.ChatAsync(
                request.Message,
                request.History,
                request.AnalysisContext
            );

            return Ok(new { reply });
        }
    }
}
