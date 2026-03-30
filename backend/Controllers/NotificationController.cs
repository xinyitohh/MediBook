using AutoMapper;
using AutoMapper.QueryableExtensions;
using backend.Data;
using backend.DTOs;
using backend.Models;
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

        // DELETE: api/notification/{id} - Delete a specific notification
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNotification(int id)
        {
            var notification = await _context.Notifications
                .FirstOrDefaultAsync(n => n.Id == id && n.UserId == CurrentUserId);

            if (notification == null)
                return NotFound(new { message = "Notification not found or unauthorized" });

            _context.Notifications.Remove(notification);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Notification deleted" });
        }

        // DELETE: api/notification/all - Clear all notifications for the user
        [HttpDelete("all")]
        public async Task<IActionResult> DeleteAllNotifications()
        {
            var notifications = await _context.Notifications
                .Where(n => n.UserId == CurrentUserId)
                .ToListAsync();

            if (notifications.Any())
            {
                _context.Notifications.RemoveRange(notifications);
                await _context.SaveChangesAsync();
            }

            return Ok(new { message = "All notifications cleared" });
        }

        // POST: api/notification/admin/push - Admin sends push notifications to target audience
        [HttpPost("admin/push")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> SendPushNotification([FromBody] SendPushNotificationDto dto)
        {
            // Validation
            if (string.IsNullOrWhiteSpace(dto.Title) || string.IsNullOrWhiteSpace(dto.Message))
            {
                return BadRequest(new { message = "Title and Message are required." });
            }

            if (string.IsNullOrWhiteSpace(dto.TargetAudience))
            {
                return BadRequest(new { message = "TargetAudience is required (all, doctors, patients, specific)." });
            }

            if (dto.TargetAudience == "specific" && string.IsNullOrWhiteSpace(dto.TargetUserId))
            {
                return BadRequest(new { message = "TargetUserId is required when TargetAudience is 'specific'." });
            }

            // Query users based on target audience
            IQueryable<User> usersQuery = _context.Users;

            switch (dto.TargetAudience.ToLower())
            {
                case "all":
                    // All active users (no filter)
                    break;

                case "doctors":
                    usersQuery = usersQuery.Where(u => u.Role == "Doctor");
                    break;

                case "patients":
                    usersQuery = usersQuery.Where(u => u.Role == "Patient");
                    break;

                case "specific":
                    usersQuery = usersQuery.Where(u => u.Id == dto.TargetUserId);
                    break;

                default:
                    return BadRequest(new { message = "Invalid TargetAudience. Use: all, doctors, patients, or specific." });
            }

            var targetUsers = await usersQuery.ToListAsync();

            if (!targetUsers.Any())
            {
                return NotFound(new { message = "No users found for the specified target audience." });
            }

            // Create notification for each target user
            var now = DateTime.UtcNow;
            var notifications = targetUsers.Select(u => new Notification
            {
                UserId = u.Id,
                Title = dto.Title,
                Message = dto.Message,
                Type = dto.Type,
                IsRead = false,
                CreatedAt = now
            }).ToList();

            _context.Notifications.AddRange(notifications);
            await _context.SaveChangesAsync();

            return Ok(new { 
                message = $"Push notification sent to {notifications.Count} user(s).",
                recipientCount = notifications.Count
            });
        }

        // GET: api/notification/admin/history - Get admin push notification history
        [HttpGet("admin/history")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetNotificationHistory()
        {
            var history = await _context.Notifications
                .GroupBy(n => new { n.Title, n.Message, n.Type, SendDate = n.CreatedAt.Date })
                .Select(g => new PushNotificationHistoryDto
                {
                    Title = g.Key.Title,
                    Message = g.Key.Message,
                    Type = g.Key.Type,
                    SentDate = g.Key.SendDate,
                    RecipientCount = g.Count()
                })
                .OrderByDescending(h => h.SentDate)
                .ToListAsync();

            return Ok(history);
        }
    }
}