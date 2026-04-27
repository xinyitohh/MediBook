using System.Net.Http.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace backend.Services
{
    /// <summary>
    /// Contract for sending emails. All controllers depend on this interface.
    /// </summary>
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string subject, string htmlBody);
    }

    /// <summary>
    /// Sends emails through the serverless pipeline:
    ///   ASP.NET  →  HTTP POST  →  API Gateway  →  Lambda  →  SES
    ///
    /// Reads the API Gateway endpoint URL from configuration:
    ///   AWS:EmailApiUrl
    /// </summary>
    public class ApiGatewayEmailService : IEmailService
    {
        private readonly HttpClient _httpClient;
        private readonly string _emailApiUrl;
        private readonly ILogger<ApiGatewayEmailService> _logger;

        public ApiGatewayEmailService(
            HttpClient httpClient,
            IConfiguration configuration,
            ILogger<ApiGatewayEmailService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;

            _emailApiUrl = configuration["AWS:EmailApiUrl"]
                ?? throw new InvalidOperationException(
                    "AWS:EmailApiUrl is not configured. " +
                    "Please add it to appsettings.Development.json under the AWS section.");
        }

        public async Task SendEmailAsync(string toEmail, string subject, string htmlBody)
        {
            var payload = new
            {
                toEmail,
                subject,
                body = htmlBody
            };

            _logger.LogInformation(
                "Sending email via API Gateway → Lambda → SES | To: {Email} | Subject: {Subject}",
                toEmail, subject);

            try
            {
                var response = await _httpClient.PostAsJsonAsync(_emailApiUrl, payload);

                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadAsStringAsync();
                    _logger.LogInformation(
                        "Email sent successfully to {Email}. Response: {Response}",
                        toEmail, result);
                }
                else
                {
                    var errorBody = await response.Content.ReadAsStringAsync();
                    _logger.LogError(
                        "API Gateway returned {StatusCode} for email to {Email}. Body: {Body}",
                        (int)response.StatusCode, toEmail, errorBody);

                    throw new HttpRequestException(
                        $"Email API returned {(int)response.StatusCode}: {errorBody}");
                }
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex,
                    "Failed to send email to {Email} via API Gateway at {Url}",
                    toEmail, _emailApiUrl);
                throw;
            }
        }
    }
}
