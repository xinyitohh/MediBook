namespace backend.DTOs
{
    public class ReviewDto
    {
        public int Id { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
        public string PatientName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class CreateReviewDto
    {
        public int AppointmentId { get; set; }
        public int Rating { get; set; } // 1-5
        public string Comment { get; set; } = string.Empty;
    }
}