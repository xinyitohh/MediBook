using AutoMapper;
using backend.Data;
using backend.DTOs;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AnalysisController : BaseController
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;
        private readonly ReportAnalysisService _analysisService;

        public AnalysisController(
            AppDbContext context,
            IMapper mapper,
            ReportAnalysisService analysisService)
        {
            _context = context;
            _mapper = mapper;
            _analysisService = analysisService;
        }

        // POST api/analysis/analyze/{medicalReportId}
        // Doctor calls this to trigger AI analysis of a patient's uploaded report
        [HttpPost("analyze/{medicalReportId}")]
        public async Task<IActionResult> AnalyzeReport(int medicalReportId)
        {
            // Only doctors can analyze
            if (UserRole != "Doctor")
                return BadRequest(new { message = "Only doctors can analyze reports" });

            // Find the report
            var report = await _context.MedicalReports.FindAsync(medicalReportId);
            if (report == null)
                return NotFound(new { message = "Report not found" });

            // Make sure it's a patient-uploaded file (has a real S3 file)
            if (string.IsNullOrEmpty(report.FileUrl) || report.UploadedByRole != "Patient")
                return BadRequest(new { message = "This report has no uploaded file to analyze" });

            // If already analyzed, just return the cached result
            var existing = await _context.ReportAnalyses
                .FirstOrDefaultAsync(r => r.MedicalReportId == medicalReportId);

            if (existing != null && existing.Status == "Completed")
                return Ok(_mapper.Map<ReportAnalysisDto>(existing));

            // Create a "Processing" record immediately so doctor knows it's running
            var analysis = existing ?? new ReportAnalysis
            {
                MedicalReportId = medicalReportId,
                Status = "Processing"
            };

            if (existing == null)
            {
                _context.ReportAnalyses.Add(analysis);
                await _context.SaveChangesAsync();
            }

            try
            {
                // STEP 1: Textract — extract text from the S3 file
                var rawText = await _analysisService.ExtractTextAsync(report.FileUrl);

                if (string.IsNullOrWhiteSpace(rawText))
                {
                    analysis.Status = "Failed";
                    analysis.Summary = "Could not extract text from this file. It may be a scanned image without readable text.";
                    await _context.SaveChangesAsync();
                    return Ok(_mapper.Map<ReportAnalysisDto>(analysis));
                }

                // STEP 2: Comprehend Medical — detect medications, conditions, dosages
                var entities = await _analysisService.ExtractMedicalEntitiesAsync(rawText);
                var entitiesJson = JsonSerializer.Serialize(
                    entities.Select(e => new { e.Text, e.Category, e.Type })
                );

                // STEP 3: Bedrock — generate plain-English summary for doctor
                var summary = await _analysisService.SummarizeAsync(rawText, entitiesJson);

                // Parse the JSON summary from Bedrock
                var analysisDataJson = JsonDocument.Parse(summary).RootElement;

                // Save results
                analysis.Summary = summary;
                try {
                    analysis.AbnormalFindings = JsonSerializer.Serialize(
                        analysisDataJson.GetProperty("redFlags").EnumerateArray()
                            .Select(x => x.GetString()).ToList()
                    );
                    analysis.NormalFindings = JsonSerializer.Serialize(
                        analysisDataJson.GetProperty("medications").EnumerateArray()
                            .Select(x => x.GetString()).ToList()
                    );
                    analysis.Recommendations = JsonSerializer.Serialize(
                        analysisDataJson.GetProperty("plan").EnumerateArray()
                            .Select(x => x.GetString()).ToList()
                    );
                } catch {
                    // Fallback if parsing specific arrays fails
                    analysis.AbnormalFindings = "[]";
                    analysis.NormalFindings = "[]";
                    analysis.Recommendations = "[]";
                }
                
                analysis.Status = "Completed";
                analysis.AnalyzedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(_mapper.Map<ReportAnalysisDto>(analysis));
            }
            catch (Exception ex)
            {
                analysis.Status = "Failed";
                analysis.Summary = "Analysis failed. Please try again.";
                await _context.SaveChangesAsync();

                return StatusCode(500, new { message = "Analysis failed", error = ex.Message });
            }
        }

        // GET api/analysis/{medicalReportId}
        // Doctor fetches existing analysis result without re-running it
        [HttpGet("{medicalReportId}")]
        public async Task<IActionResult> GetAnalysis(int medicalReportId)
        {
            if (UserRole != "Doctor")
                return BadRequest(new { message = "Only doctors can view analysis" });

            var analysis = await _context.ReportAnalyses
                .FirstOrDefaultAsync(r => r.MedicalReportId == medicalReportId);

            if (analysis == null)
                return NotFound(new { message = "No analysis found. Click Analyze to start." });

            return Ok(_mapper.Map<ReportAnalysisDto>(analysis));
        }
    }
}