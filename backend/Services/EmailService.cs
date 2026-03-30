using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;

namespace backend.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string subject, string htmlBody);
    }

    public class SmtpEmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public SmtpEmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string htmlBody)
        {
            // Support two possible config shapes: Smtp:... (older) or EmailSettings:{SmtpHost,SmtpPort,...}
            var host = _configuration["Smtp:Host"] ?? _configuration["EmailSettings:SmtpHost"];
            var portStr = _configuration["Smtp:Port"] ?? _configuration["EmailSettings:SmtpPort"]?.ToString();
            var username = _configuration["Smtp:Username"] ?? _configuration["EmailSettings:SmtpUsername"];
            var password = _configuration["Smtp:Password"] ?? _configuration["EmailSettings:SmtpPassword"];
            var from = _configuration["Smtp:From"] ?? _configuration["EmailSettings:From"] ?? username;
            var senderName = _configuration["EmailSettings:SenderName"] ?? string.Empty;

            if (string.IsNullOrWhiteSpace(host))
            {
                throw new InvalidOperationException("SMTP host is not configured. Please set 'Smtp:Host' or 'EmailSettings:SmtpHost' in configuration.");
            }

            var port = 25;
            if (!string.IsNullOrWhiteSpace(portStr) && int.TryParse(portStr, out var p))
            {
                port = p;
            }

            var enableSslStr = _configuration["Smtp:EnableSsl"] ?? _configuration["EmailSettings:EnableSsl"]?.ToString();
            var enableSsl = true;
            if (!string.IsNullOrWhiteSpace(enableSslStr) && bool.TryParse(enableSslStr, out var ssl))
            {
                enableSsl = ssl;
            }

            using var client = new SmtpClient(host, port)
            {
                EnableSsl = enableSsl,
                Credentials = new NetworkCredential(username, password)
            };

            var mail = new MailMessage()
            {
                From = new MailAddress(from ?? string.Empty, senderName),
                Subject = subject,
                Body = htmlBody,
                IsBodyHtml = true
            };

            mail.To.Add(new MailAddress(toEmail));

            await client.SendMailAsync(mail);
        }
    }
}
