using System.Text.Json;

namespace backend.DTOs
{
    public class MedicalReportResponseDto
    {
        public int Id { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string FileType { get; set; } = string.Empty;
        public long FileSize { get; set; }
        public string UploadedAt { get; set; } = string.Empty;
        public string FileUrl { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }

    public class GenerateReportDto
    {
        public string Diagnosis { get; set; } = string.Empty;
        public string Symptoms { get; set; } = string.Empty;
        public string Treatment { get; set; } = string.Empty;
        public List<MedicationDto> Medications { get; set; } = new();
        public string Notes { get; set; } = string.Empty;
        public string FollowUpDate { get; set; } = string.Empty;
    }

    public class MedicationDto
    {
        public string Name { get; set; } = string.Empty;
        public string Dosage { get; set; } = string.Empty;
        public string Frequency { get; set; } = string.Empty;
        public string Duration { get; set; } = string.Empty;
    }
}
