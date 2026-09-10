namespace ExpenseTracker.API.DTOs;

public class ExpenseResponseDto
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int CategoryId { get; set; }

    public string Description { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public DateTime ExpenseDate { get; set; }

    public DateTime CreatedAt { get; set; }

    public string? CategoryName { get; set; }
}