namespace backend.DTOs
{
    // Used for Sending Doctor data to the Frontend (GET)
    public class DoctorDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public int? SpecialtyId { get; set; }
        public string? Specialty { get; set; } // Specialty name for display
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string ProfileImageUrl { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public bool IsAvailable { get; set; }
        public double Rating { get; set; }
        public int ReviewCount { get; set; }
        public decimal ConsultationFee { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool EmailConfirmed { get; set; }
        public string DateOfBirth { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public string Experience { get; set; } = string.Empty;
        public string Qualifications { get; set; } = string.Empty;
        public string Languages { get; set; } = string.Empty;
        public List<DateTime> LeaveDates { get; set; } = new List<DateTime>();
    }

    // Used by Admin to Register a new Doctor (POST)
    public class CreateDoctorDto
    {
        public string FullName { get; set; } = string.Empty;
        public int? SpecialtyId { get; set; } // Use specialty ID instead of name
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal ConsultationFee { get; set; }
        public string DateOfBirth { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public string Experience { get; set; } = string.Empty;
        public string Qualifications { get; set; } = string.Empty;
        public string Languages { get; set; } = string.Empty;
    }

    // Used specifically for Admin updating an existing doctor
    public class AdminUpdateDoctorDto
    {
        public string FullName { get; set; } = string.Empty;
        public int? SpecialtyId { get; set; } // Use specialty ID instead of name
        public string Phone { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal ConsultationFee { get; set; }
        public string DateOfBirth { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public string Experience { get; set; } = string.Empty;
        public string Qualifications { get; set; } = string.Empty;
        public string Languages { get; set; } = string.Empty;
    }

    // Used by Doctor to update their own profile (PUT)
    public class UpdateDoctorProfileDto
    {
        public string FullName { get; set; } = string.Empty;
        public int? SpecialtyId { get; set; } // Use specialty ID instead of name
        public string Phone { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal ConsultationFee { get; set; }
        public string DateOfBirth { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public string Experience { get; set; } = string.Empty;
        public string Qualifications { get; set; } = string.Empty;
        public string Languages { get; set; } = string.Empty;
        public List<DateTime> LeaveDates { get; set; } = new List<DateTime>();
    }

    public class UpdateAvailabilityDto
    {
        public bool IsAvailable { get; set; }
    }

}