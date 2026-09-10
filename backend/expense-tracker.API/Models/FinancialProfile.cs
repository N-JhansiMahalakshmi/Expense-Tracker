namespace ExpenseTracker.API.Models;

public class FinancialProfile
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public decimal MonthlyIncome { get; set; }

    public decimal SavingsGoal { get; set; }

    public User User { get; set; } = null!;
}