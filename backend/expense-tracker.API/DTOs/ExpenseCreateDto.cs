namespace ExpenseTracker.API.DTOs;

public class ExpenseCreateDto
{
    public int UserId { get; set; }

    public int CategoryId { get; set; }

    public string Description { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public DateTime ExpenseDate { get; set; }
}