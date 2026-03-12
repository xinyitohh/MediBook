namespace backend.DTOs
{
    public class ReportAnalysisDto
    {
        public int Id { get; set; }
        public int MedicalReportId { get; set; }
        public string Summary { get; set; } = string.Empty;
        public string AbnormalFindings { get; set; } = string.Empty;
        public string NormalFindings { get; set; } = string.Empty;
        public string Recommendations { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime AnalyzedAt { get; set; }
    }
}
