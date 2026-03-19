using backend.Models;

public class HealthQuestionnaire
{
    public int Id { get; set; }
    public int AppointmentId { get; set; }
    public int PatientId { get; set; }
    public string ChiefComplaint { get; set; } = string.Empty;
    public string SymptomDuration { get; set; } = string.Empty;
    public int SeverityLevel { get; set; }     // 1-10
    public string CurrentMedications { get; set; } = string.Empty;
    public string Allergies { get; set; } = string.Empty;
    public string AdditionalNotes { get; set; } = string.Empty;
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;

    public Appointment Appointment { get; set; } = null!;
    public Patient Patient { get; set; } = null!;
}