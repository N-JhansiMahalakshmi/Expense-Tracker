namespace ExpenseTracker.API.Models;

public class Expense
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int CategoryId { get; set; }

    public string Description { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public DateTime ExpenseDate { get; set; }
        = DateTime.UtcNow;

    public DateTime CreatedAt { get; set; }
        = DateTime.UtcNow;

    public User User { get; set; } = null!;

    public Category Category { get; set; } = null!;
}