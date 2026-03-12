using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Services
{
    public class OtpService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<OtpService> _logger;

        public OtpService(AppDbContext context, ILogger<OtpService> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Generate a 6-digit OTP, save to DB, and "send" it.
        /// For local dev: prints to console.
        /// For AWS: replace SendOtp() with SES email.
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
            //  "SEND" THE OTP
            //  LOCAL DEV  → Console log (big visible banner)
            //  AWS LATER  → Replace with SES email send
            // ══════════════════════════════════════════════
            SendOtp(email, code, purpose);

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
        /// Send OTP to user. 
        /// LOCAL: Console log.
        /// TODO: Replace with AWS SES when deployed.
        /// </summary>
        private void SendOtp(string email, string code, string purpose)
        {
            var purposeText = purpose == "EmailVerification"
                ? "Email Verification"
                : "Password Reset";

            // ╔══════════════════════════════════════════════════════════╗
            // ║  LOCAL DEV — OTP printed to console                     ║
            // ║  Replace this method body with SES call for production  ║
            // ╚══════════════════════════════════════════════════════════╝

            _logger.LogWarning(
                "\n" +
                "╔══════════════════════════════════════════════════╗\n" +
                "║           MediBook OTP — {Purpose}              \n" +
                "║                                                  \n" +
                "║   Email:  {Email}                                \n" +
                "║   Code:   {Code}                                 \n" +
                "║   Expires: 10 minutes                            \n" +
                "║                                                  \n" +
                "║   (In production, this sends via AWS SES)        \n" +
                "╚══════════════════════════════════════════════════╝\n",
                purposeText, email, code
            );

            // ── AWS SES version (uncomment when deployed) ──────────
            // var client = new AmazonSimpleEmailServiceClient();
            // await client.SendEmailAsync(new SendEmailRequest
            // {
            //     Source = "noreply@medibook.com",
            //     Destination = new Destination { ToAddresses = { email } },
            //     Message = new Message
            //     {
            //         Subject = new Content($"MediBook — Your {purposeText} Code"),
            //         Body = new Body
            //         {
            //             Html = new Content(
            //                 $"<h2>Your verification code is: <b>{code}</b></h2>" +
            //                 $"<p>This code expires in 10 minutes.</p>"
            //             )
            //         }
            //     }
            // });
        }
    }
}