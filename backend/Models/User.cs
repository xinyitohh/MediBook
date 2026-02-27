using Microsoft.AspNetCore.Identity;

namespace backend.Models
{
    public class User : IdentityUser
    {
        public string FullName { get; set; } = string.Empty;
        public string Role { get; set; } = "Patient"; // Patient, Doctor, Admin
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}