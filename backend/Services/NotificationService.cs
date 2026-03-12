using backend.Data;
using backend.Models;

namespace backend.Services
{
    public interface INotificationService
    {
        Task SendAsync(string userId, string title, string message, string type);
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
    }
}