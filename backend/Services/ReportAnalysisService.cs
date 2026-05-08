using Amazon.Textract;
using Amazon.Textract.Model;
using Amazon.ComprehendMedical;
using Amazon.ComprehendMedical.Model;
using Amazon.BedrockRuntime;
using Amazon.BedrockRuntime.Model;
using System.Text.Json;

namespace backend.Services
{
    public class ReportAnalysisService
    {
        private readonly AmazonTextractClient _textract;
        private readonly AmazonComprehendMedicalClient _comprehend;
        private readonly AmazonBedrockRuntimeClient _bedrock;
        private readonly string _bucketName;

        public ReportAnalysisService(IConfiguration config)
        {

            var aws = config.GetSection("AWS");
            var credentials = new Amazon.Runtime.BasicAWSCredentials(
                aws["AccessKey"], aws["SecretKey"]);
            var region = Amazon.RegionEndpoint.USEast1;

            _textract = new AmazonTextractClient(credentials, region);
            _comprehend = new AmazonComprehendMedicalClient(credentials, region);
            _bedrock = new AmazonBedrockRuntimeClient(credentials, region);
            _bucketName = aws["BucketName"]!;
        }

        // STEP 1: Extract raw text from the S3 file
        public async Task<string> ExtractTextAsync(string s3Key)
        {
            if (s3Key.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase))
            {
                // PDF requires asynchronous Textract API
                var startRequest = new StartDocumentTextDetectionRequest
                {
                    DocumentLocation = new DocumentLocation
                    {
                        S3Object = new Amazon.Textract.Model.S3Object { Bucket = _bucketName, Name = s3Key }
                    }
                };
                var startResponse = await _textract.StartDocumentTextDetectionAsync(startRequest);
                var jobId = startResponse.JobId;

                GetDocumentTextDetectionResponse getResponse;
                do
                {
                    await Task.Delay(3000); // Polling interval
                    getResponse = await _textract.GetDocumentTextDetectionAsync(new GetDocumentTextDetectionRequest { JobId = jobId });
                } while (getResponse.JobStatus == Amazon.Textract.JobStatus.IN_PROGRESS);

                if (getResponse.JobStatus != Amazon.Textract.JobStatus.SUCCEEDED)
                {
                    return "";
                }

                var textBuilder = new System.Text.StringBuilder();
                var blocks = getResponse.Blocks;
                string? nextToken = getResponse.NextToken;

                // Process first page of results
                foreach (var block in blocks.Where(b => b.BlockType == "LINE"))
                {
                    textBuilder.Append(block.Text).Append(" ");
                }

                // Process subsequent pages if PDF is long
                while (!string.IsNullOrEmpty(nextToken))
                {
                    getResponse = await _textract.GetDocumentTextDetectionAsync(new GetDocumentTextDetectionRequest 
                    { 
                        JobId = jobId,
                        NextToken = nextToken
                    });
                    
                    foreach (var block in getResponse.Blocks.Where(b => b.BlockType == "LINE"))
                    {
                        textBuilder.Append(block.Text).Append(" ");
                    }
                    nextToken = getResponse.NextToken;
                }

                return textBuilder.ToString();
            }
            else
            {
                // Images can use synchronous API
                var request = new DetectDocumentTextRequest
                {
                    Document = new Document
                    {
                        S3Object = new Amazon.Textract.Model.S3Object
                        {
                            Bucket = _bucketName,
                            Name = s3Key
                        }
                    }
                };

                var response = await _textract.DetectDocumentTextAsync(request);

                // Join all LINE blocks into one string
                var text = string.Join(" ", response.Blocks
                    .Where(b => b.BlockType == "LINE")
                    .Select(b => b.Text));

                return text;
            }
        }

        // STEP 2: Detect medical entities from extracted text
        public async Task<List<Entity>> ExtractMedicalEntitiesAsync(string text)
        {
            // Comprehend Medical has a 20,000 char limit
            if (text.Length > 20000)
                text = text.Substring(0, 20000);

            var request = new DetectEntitiesV2Request { Text = text };
            var response = await _comprehend.DetectEntitiesV2Async(request);
            return response.Entities;
        }

        // STEP 3: Ask Bedrock (Claude) to summarize for the doctor
        public async Task<string> SummarizeAsync(string rawText, string entitiesJson)
        {
            var prompt = $@"You are a medical AI assistant helping a doctor quickly understand a patient's uploaded medical report.

            Raw Report Text:
            {rawText}

            Detected Medical Entities:
            {entitiesJson}

            Please provide a concise structured summary with these sections:
            1. Key Findings (important values, diagnoses, abnormal results)
            2. Medications Detected
            3. Recommendations or follow-up actions
            Keep it under 250 words. Be professional and factual.";

            var requestBody = JsonSerializer.Serialize(new
            {
                anthropic_version = "bedrock-2023-05-31",
                max_tokens = 1024,
                messages = new[]
                {
                    new { role = "user", content = prompt }
                }
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
                .GetString() ?? "Unable to generate summary.";
        }
    }
}