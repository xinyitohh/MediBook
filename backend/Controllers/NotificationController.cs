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

            // Query users based on target audience (exclude Admins)
            IQueryable<User> usersQuery = _context.Users.Where(u => u.Role != "Admin");
            string targetAudienceLabel = "";

            switch (dto.TargetAudience.ToLower())
            {
                case "all":
                    // All active users except admins (no additional filter)
                    targetAudienceLabel = "all";
                    break;

                case "doctors":
                    usersQuery = usersQuery.Where(u => u.Role == "Doctor");
                    targetAudienceLabel = "doctors";
                    break;

                case "patients":
                    usersQuery = usersQuery.Where(u => u.Role == "Patient");
                    targetAudienceLabel = "patients";
                    break;

                case "specific":
                    var specificUser = await _context.Users.FirstOrDefaultAsync(u => u.Id == dto.TargetUserId);
                    if (specificUser == null)
                        return NotFound(new { message = "User not found." });
                    
                    usersQuery = usersQuery.Where(u => u.Id == dto.TargetUserId);
                    targetAudienceLabel = specificUser.FullName;
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
                .Join(_context.Users, n => n.UserId, u => u.Id, (n, u) => new { n, u })
                .GroupBy(x => new { x.n.Title, x.n.Message, x.n.Type, x.n.CreatedAt })
                .Select(g => new PushNotificationHistoryDto
                {
                    Title = g.Key.Title,
                    Message = g.Key.Message,
                    Type = g.Key.Type,
                    SentDate = g.Key.CreatedAt,
                    RecipientCount = g.Count(),
                    // Determine target audience based on the roles of recipients
                    TargetedAudience = g.Select(x => x.u.Role).Distinct().Count() > 1 ? "all" : 
                                     g.First().u.Role == "Doctor" ? "doctors" :
                                     g.First().u.Role == "Patient" ? "patients" : "specific"
                })
                .OrderByDescending(h => h.SentDate)
                .ToListAsync();

            return Ok(history);
        }

        // GET: api/notification/admin/users - Get list of users for push notification targeting
        [HttpGet("admin/users")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetUsersForNotification()
        {
            var users = await _context.Users
                .Where(u => u.Role != "Admin") // Exclude admins
                .Select(u => new
                {
                    u.Id,
                    u.FullName,
                    u.Email,
                    u.Role
                })
                .OrderBy(u => u.FullName)
                .ToListAsync();

            return Ok(users);
        }
    }
}