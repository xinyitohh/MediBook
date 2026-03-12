namespace backend.DTOs
{
    public class AdminDashboardDto
    {
        public int TotalPatients { get; set; }
        public int TotalDoctors { get; set; }
        public int AppointmentsToday { get; set; }
        public int PendingApprovals { get; set; } // We can count "Pending" appointments here
        public List<RecentActivityDto> RecentActivity { get; set; } = new();
    }

    public class RecentActivityDto
    {
        public string Action { get; set; } = string.Empty;
        public string Detail { get; set; } = string.Empty;
        public string Time { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty; // For the little dots in Oscar's UI
    }
}