using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public interface INotificationService
    {
        Task SendAsync(string userId, string title, string message, string type);

        Task SendToAllAsync(string title, string message, string type);
    }

    public class NotificationService : INotificationService
    {
        private readonly AppDbContext _context;

        public NotificationService(AppDbContext context)
        {
            _context = context;
        }

        public async Task SendAsync(string userId, string title, string message, string type)
        {
            var notification = new Notification
            {
                UserId = userId,
                Title = title,
                Message = message,
                Type = type, // e.g., "Appointment", "System", "Report"
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
        }

        public async Task SendToAllAsync(string title, string message, string type)
        {
            var userIds = await _context.Users.Select(u => u.Id).ToListAsync();

            var notifications = userIds.Select(id => new Notification
            {
                UserId = id,
                Title = title,
                Message = message,
                Type = type,
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            }).ToList();

            _context.Notifications.AddRange(notifications);
            await _context.SaveChangesAsync();
        }
    }
}