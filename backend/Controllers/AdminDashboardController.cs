using backend.Data;
using backend.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")] // Strictly for Admins
    public class AdminDashboardController : BaseController
    {
        private readonly AppDbContext _context;

        public AdminDashboardController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var today = DateTime.UtcNow.Date;

            // 1. Gather the 4 main counts
            var stats = new AdminDashboardDto
            {
                TotalPatients = await _context.Patients.CountAsync(),
                TotalDoctors = await _context.Doctors.CountAsync(),
                AppointmentsToday = await _context.Appointments
                    .CountAsync(a => a.AppointmentDate.Date == today),
                PendingApprovals = await _context.Appointments
                    .CountAsync(a => a.Status == "Pending")
            };

            // 2. Gather Recent Activity (Last 5 events)
            // We'll pull recent appointments as a proxy for "Activity"
            var recentAppointments = await _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                .OrderByDescending(a => a.CreatedAt)
                .Take(5)
                .ToListAsync();

            foreach (var apt in recentAppointments)
            {
                stats.RecentActivity.Add(new RecentActivityDto
                {
                    Action = apt.Status == "Pending" ? "New Booking" : $"Appointment {apt.Status}",
                    Detail = $"{apt.Patient.FullName} → Dr. {apt.Doctor.FullName}",
                    Time = GetTimeAgo(apt.CreatedAt),
                    Color = GetStatusColor(apt.Status)
                });
            }

            return Ok(stats);
        }

        private string GetStatusColor(string status) => status switch
        {
            "Confirmed" => "bg-mint-500",
            "Pending" => "bg-brand-500",
            "Cancelled" => "bg-red-500",
            "Completed" => "bg-purple-500",
            _ => "bg-gray-500"
        };

        // Helper to turn dates into "2 min ago" strings
        private string GetTimeAgo(DateTime dateTime)
        {
            var span = DateTime.UtcNow - dateTime;
            if (span.TotalMinutes < 60) return $"{(int)span.TotalMinutes} min ago";
            if (span.TotalHours < 24) return $"{(int)span.TotalHours} hours ago";
            return dateTime.ToString("dd MMM");
        }
    }
}