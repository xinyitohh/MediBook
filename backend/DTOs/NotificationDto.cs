namespace backend.DTOs
{
    public class NotificationDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class SendPushNotificationDto
    {
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string TargetAudience { get; set; } = string.Empty; // "all", "doctors", "patients", "specific"
        public string? TargetUserId { get; set; } // Required if TargetAudience is "specific"
    }

    public class PushNotificationHistoryDto
    {
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public DateTime SentDate { get; set; }
        public int RecipientCount { get; set; }
    }
}
