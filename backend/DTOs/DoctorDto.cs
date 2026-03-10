namespace backend.DTOs
{
    public class DoctorDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Specialty { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string ProfileImageUrl { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool IsAvailable { get; set; }
        public double Rating { get; set; }
        public int ReviewCount { get; set; }
        public decimal ConsultationFee { get; set; }
        public string Experience { get; set; } = string.Empty;
    }

    public class CreateDoctorDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Specialty { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal ConsultationFee { get; set; }
        public string Experience { get; set; } = string.Empty;
    }

    public class UpdateDoctorProfileDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal ConsultationFee { get; set; }
        public string Experience { get; set; } = string.Empty;
    }

    public class UpdateAvailabilityDto
    {
        public bool IsAvailable { get; set; }
    }
}
