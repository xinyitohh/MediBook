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
    public class NotificationController : BaseController
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public NotificationController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/notification - Get all my notifications
        [HttpGet]
        public async Task<IActionResult> GetMyNotifications()
        {
            var notifications = await _context.Notifications
                .Where(n => n.UserId == CurrentUserId) // CurrentUserId from BaseController
                .OrderByDescending(n => n.CreatedAt)
                .ProjectTo<NotificationDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return Ok(notifications);
        }

        // GET: api/notification/unread-count
        [HttpGet("unread-count")]
        public async Task<IActionResult> GetUnreadCount()
        {
            var count = await _context.Notifications
                .CountAsync(n => n.UserId == CurrentUserId && !n.IsRead);

            return Ok(new { count });
        }

        // PUT: api/notification/{id}/read - Mark one as read
        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var notification = await _context.Notifications
                .FirstOrDefaultAsync(n => n.Id == id && n.UserId == CurrentUserId);

            if (notification == null)
                return NotFound();

            notification.IsRead = true;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Marked as read" });
        }

        // PUT: api/notification/read-all
        [HttpPut("read-all")]
        public async Task<IActionResult> MarkAllAsRead()
        {
            var unread = await _context.Notifications
                .Where(n => n.UserId == CurrentUserId && !n.IsRead)
                .ToListAsync();

            foreach (var n in unread)
            {
                n.IsRead = true;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "All marked as read" });
        }
    }
}