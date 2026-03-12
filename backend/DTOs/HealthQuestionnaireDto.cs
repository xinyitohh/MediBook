namespace backend.DTOs
{
    public class HealthQuestionnaireDto
    {
        public int Id { get; set; }
        public int AppointmentId { get; set; }
        public string ChiefComplaint { get; set; } = string.Empty;
        public string SymptomDuration { get; set; } = string.Empty;
        public int SeverityLevel { get; set; }
        public string CurrentMedications { get; set; } = string.Empty;
        public string Allergies { get; set; } = string.Empty;
        public string AdditionalNotes { get; set; } = string.Empty;
        public DateTime SubmittedAt { get; set; }
    }

    public class CreateHealthQuestionnaireDto
    {
        public int AppointmentId { get; set; }
        public string ChiefComplaint { get; set; } = string.Empty; // e.g., "Chest pain"
        public string SymptomDuration { get; set; } = string.Empty; // e.g., "3 days"
        public int SeverityLevel { get; set; } // 1-10
        public string CurrentMedications { get; set; } = string.Empty;
        public string Allergies { get; set; } = string.Empty;
        public string AdditionalNotes { get; set; } = string.Empty;
    }
}