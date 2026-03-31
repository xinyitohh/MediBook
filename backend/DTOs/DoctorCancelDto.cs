using System.ComponentModel.DataAnnotations;

public class DoctorCancelDto
{
    [Required(ErrorMessage = "A cancellation reason is required.")]
    [MinLength(5, ErrorMessage = "Reason must be at least 5 characters long.")]
    public string Reason { get; set; } = string.Empty;
}