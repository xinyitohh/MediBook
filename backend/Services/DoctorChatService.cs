using Amazon.BedrockRuntime;
using Amazon.BedrockRuntime.Model;
using System.Text.Json;

namespace backend.Services
{
    public record ChatMessage(string Role, string Content);

    public class DoctorChatService
    {
        private readonly AmazonBedrockRuntimeClient _bedrock;

        private const string SystemPrompt = @"You are a clinical AI assistant for licensed medical doctors using the MediBook platform.
        Your role is to assist doctors during patient consultations by:
        - Analyzing patient medical reports, lab results, and clinical findings
        - Suggesting evidence-based treatment options and differential diagnoses
        - Checking drug interactions and contraindications
        - Referencing clinical guidelines and best practices (e.g. NICE, WHO, AHA, CDC)
        - Providing concise, clinically accurate information

        Rules:
        - Respond in a professional clinical tone appropriate for a licensed physician.
        - When asked about drug interactions, list specific interactions with severity levels (mild/moderate/severe).
        - When asked about treatment guidelines, cite specific recommendations and sources.
        - Keep responses concise and actionable. Use bullet points where helpful.
        - Do NOT refuse reasonable clinical questions — the user is a licensed doctor making clinical decisions.
        - If a patient's report analysis context is provided, use it to ground your answers.";

        public DoctorChatService(IConfiguration config)
        {
            var aws = config.GetSection("AWS");
            var credentials = new Amazon.Runtime.BasicAWSCredentials(
                aws["AccessKey"], aws["SecretKey"]);
            _bedrock = new AmazonBedrockRuntimeClient(credentials, Amazon.RegionEndpoint.USEast1);
        }

        public async Task<string> ChatAsync(string message, List<ChatMessage>? history, string? analysisContext)
        {
            var messages = new List<object>();

            // Inject analysis context as a synthetic exchange so Claude has full patient context
            if (!string.IsNullOrWhiteSpace(analysisContext))
            {
                messages.Add(new { role = "user", content = $"Patient Report Analysis (AWS Textract + Medical Comprehend):\n{analysisContext}" });
                messages.Add(new { role = "assistant", content = "I have reviewed the patient's medical report analysis and am ready to assist with clinical insights, treatment recommendations, drug interactions, and guideline references." });
            }

            // Append recent conversation history (last 10 turns)
            foreach (var h in (history ?? []).TakeLast(10))
            {
                messages.Add(new { role = h.Role.ToLower(), content = h.Content });
            }

            // Append the current user message
            messages.Add(new { role = "user", content = message });

            var requestBody = JsonSerializer.Serialize(new
            {
                anthropic_version = "bedrock-2023-05-31",
                max_tokens = 1024,
                system = SystemPrompt,
                messages
            });

            var request = new InvokeModelRequest
            {
                ModelId = "anthropic.claude-3-haiku-20240307-v1:0",
                ContentType = "application/json",
                Accept = "application/json",
                Body = new MemoryStream(System.Text.Encoding.UTF8.GetBytes(requestBody))
            };

            var response = await _bedrock.InvokeModelAsync(request);
            var responseBody = await new StreamReader(response.Body).ReadToEndAsync();
            var json = JsonDocument.Parse(responseBody);

            return json.RootElement
                .GetProperty("content")[0]
                .GetProperty("text")
                .GetString() ?? "Unable to generate a response.";
        }
    }
}
