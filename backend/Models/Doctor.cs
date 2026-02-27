namespace backend.Models
{
    public class Doctor
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Specialty { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string ProfileImageUrl { get; set; } = string.Empty; // S3 URL
        public string Description { get; set; } = string.Empty;
        public bool IsAvailable { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property - one doctor has many appointments
        public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
    }
}