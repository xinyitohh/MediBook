using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Services
{
    public class OtpService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<OtpService> _logger;
        private readonly IEmailService _emailService;

        public OtpService(AppDbContext context, ILogger<OtpService> logger, IEmailService emailService)
        {
            _context = context;
            _logger = logger;
            _emailService = emailService;
        }

        /// <summary>
        /// Generate a 6-digit OTP, save to DB, and send it via the
        /// serverless email pipeline (API Gateway → Lambda → SES).
        /// </summary>
        public async Task<string> GenerateAndSendOtp(string email, string purpose, int expiryMinutes = 10)
        {
            // Invalidate any existing unused OTPs for this email + purpose
            var existing = await _context.OtpVerifications
                .Where(o => o.Email == email && o.Purpose == purpose && !o.IsUsed)
                .ToListAsync();

            foreach (var old in existing)
            {
                old.IsUsed = true;
            }

            // Generate 6-digit code
            var code = new Random().Next(100000, 999999).ToString();

            // Save to DB
            var otp = new OtpVerification
            {
                Email = email,
                Code = code,
                Purpose = purpose,
                IsUsed = false,
                ExpiresAt = DateTime.UtcNow.AddMinutes(expiryMinutes),
                CreatedAt = DateTime.UtcNow
            };

            _context.OtpVerifications.Add(otp);
            await _context.SaveChangesAsync();

            // ══════════════════════════════════════════════
            //  SEND THE OTP via Serverless Email Pipeline
            //  API Gateway → Lambda → Amazon SES
            // ══════════════════════════════════════════════
            await SendOtpEmailAsync(email, code, purpose);

            return code;
        }

        /// <summary>
        /// Verify an OTP code. Returns true if valid, false if expired/wrong/used.
        /// </summary>
        public async Task<bool> VerifyOtp(string email, string code, string purpose)
        {
            var otp = await _context.OtpVerifications
                .Where(o => o.Email == email
                          && o.Code == code
                          && o.Purpose == purpose
                          && !o.IsUsed
                          && o.ExpiresAt > DateTime.UtcNow)
                .OrderByDescending(o => o.CreatedAt)
                .FirstOrDefaultAsync();

            if (otp == null)
                return false;

            // Mark as used so it can't be reused
            otp.IsUsed = true;
            await _context.SaveChangesAsync();

            return true;
        }

        /// <summary>
        /// Send OTP to user via the serverless email pipeline.
        /// Builds a professional HTML email and delegates to IEmailService.
        /// </summary>
        private async Task SendOtpEmailAsync(string email, string code, string purpose)
        {
            var purposeText = purpose == "EmailVerification"
                ? "Email Verification"
                : "Password Reset";

            var subject = $"MediBook — Your {purposeText} Code";

            var htmlBody = $@"
            <div style='font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; border: 1px solid #e0e0e0; border-radius: 12px;'>
                <h2 style='color: #1a73e8; text-align: center;'>MediBook</h2>
                <p style='font-size: 16px; color: #333;'>Hello,</p>
                <p style='font-size: 16px; color: #333;'>
                    Your <strong>{purposeText}</strong> code is:
                </p>
                <div style='text-align: center; margin: 24px 0;'>
                    <span style='font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1a73e8;
                                 background: #f0f4ff; padding: 12px 24px; border-radius: 8px; display: inline-block;'>
                        {code}
                    </span>
                </div>
                <p style='font-size: 14px; color: #666;'>
                    This code expires in <strong>10 minutes</strong>. Do not share it with anyone.
                </p>
                <hr style='border: none; border-top: 1px solid #eee; margin: 24px 0;'/>
                <p style='font-size: 12px; color: #999; text-align: center;'>
                    If you did not request this code, please ignore this email.
                </p>
            </div>";

            try
            {
                await _emailService.SendEmailAsync(email, subject, htmlBody);
                _logger.LogInformation("OTP email sent to {Email} for {Purpose}", email, purposeText);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send OTP email to {Email} for {Purpose}", email, purposeText);
                // Don't throw — the OTP is still saved in the DB; the user can request a resend
            }
        }
    }
}