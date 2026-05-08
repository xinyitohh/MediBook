using backend.Models;

public class ReportAnalysis
{
    public int Id { get; set; }
    public int MedicalReportId { get; set; }
    public string Summary { get; set; } = string.Empty;
    public string AbnormalFindings { get; set; } = string.Empty;  // JSON array
    public string NormalFindings { get; set; } = string.Empty;    // JSON array
    public string Recommendations { get; set; } = string.Empty;
    public string Status { get; set; } = "Processing";  // Processing, Completed, Failed
    public DateTime AnalyzedAt { get; set; } = DateTime.UtcNow;
    public string? RawText { get; set; }       // Full Textract output
    public string? RawEntities { get; set; }   // Comprehend Medical entities JSON

    public MedicalReport MedicalReport { get; set; } = null!;
}