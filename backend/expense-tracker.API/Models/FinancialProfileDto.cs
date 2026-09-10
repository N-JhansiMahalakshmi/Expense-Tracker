namespace ExpenseTracker.API.DTOs;

public class FinancialProfileDto
{
    public int UserId { get; set; }

    public decimal MonthlyIncome { get; set; }

    public decimal SavingsGoal { get; set; }
}