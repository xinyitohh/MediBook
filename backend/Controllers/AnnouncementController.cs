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
    public class AnnouncementController : BaseController
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        private readonly INotificationService _notificationService;

        public AnnouncementController(AppDbContext context, IMapper mapper, INotificationService notificationService)
        {
            _context = context;
            _mapper = mapper;
            _notificationService = notificationService;
        }

        // GET: api/announcement/active - For the sliding carousel banner
        [HttpGet("active")]
        [AllowAnonymous] // Anyone can see the banner
        public async Task<IActionResult> GetActiveAnnouncements()
        {
            var announcements = await _context.Announcements
                .Where(a => a.IsActive)
                .OrderByDescending(a => a.CreatedAt)
                .ProjectTo<AnnouncementDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return Ok(announcements);
        }

        // POST: api/announcement - Admin creates announcement
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] CreateAnnouncementDto dto)
        {
            var announcement = _mapper.Map<Announcement>(dto);
            announcement.CreatedByUserId = CurrentUserId;

            _context.Announcements.Add(announcement);

            // Logic: If it's active, send a notification to everyone
            if (dto.IsActive)
            {
                await _notificationService.SendToAllAsync(
                    dto.Title,
                    "New System Announcement: " + dto.Title,
                    "System"
                );
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Announcement published and users notified" });
        }

        // DELETE: api/announcement/{id} - Admin removes announcement
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var announcement = await _context.Announcements.FindAsync(id);
            if (announcement == null) return NotFound();

            _context.Announcements.Remove(announcement);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Announcement deleted" });
        }
    }
}