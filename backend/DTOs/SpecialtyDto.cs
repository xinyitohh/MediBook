namespace backend.DTOs
{
    public class SpecialtyDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class CreateSpecialtyDto
    {
        public string Name { get; set; } = string.Empty;
    }

    public class UpdateSpecialtyDto
    {
        public string Name { get; set; } = string.Empty;
    }
}
