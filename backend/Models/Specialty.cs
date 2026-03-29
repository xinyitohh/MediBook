namespace backend.Models
{
    public class Specialty
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property - one specialty has many doctors
        public ICollection<Doctor> Doctors { get; set; } = new List<Doctor>();
    }
}
