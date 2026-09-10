using ExpenseTracker.API.Data;
using ExpenseTracker.API.DTOs;
using ExpenseTracker.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
namespace ExpenseTracker.API.Controllers;
using System.Security.Claims;
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ExpensesController : ControllerBase
{
    private readonly AppDbContext _context;

    public ExpensesController(AppDbContext context)
    {
        _context = context;
    }
 private int GetUserId()
    {
        var userIdClaim = User.FindFirst(
            ClaimTypes.NameIdentifier
        );

        if (userIdClaim == null)
            throw new UnauthorizedAccessException();

        return int.Parse(userIdClaim.Value);
    }
    // GET: api/Expenses
    [HttpGet]
// public async Task<ActionResult<List<ExpenseResponseDto>>> GetExpenses()
// {
//     var userIdClaim = User.FindFirst(
//         System.Security.Claims.ClaimTypes.NameIdentifier
//     );

//     if (userIdClaim == null)
//     {
//         return Unauthorized();
//     }

//     var userId = int.Parse(userIdClaim.Value);

//     var expenses = await _context.Expenses
//         .AsNoTracking()
//         .Include(e => e.Category)
//         .Where(e => e.UserId == userId)
//         .OrderByDescending(e => e.ExpenseDate)
//         .Select(e => new ExpenseResponseDto
//         {
//             Id = e.Id,
//             UserId = e.UserId,
//             CategoryId = e.CategoryId,
//             Description = e.Description,
//             Amount = e.Amount,
//             ExpenseDate = e.ExpenseDate,
//             CreatedAt = e.CreatedAt,
//             CategoryName = e.Category != null
//                 ? e.Category.Name
//                 : "Other"
//         })
//         .ToListAsync();

//     return Ok(expenses);
// }
    // GET: api/Expenses/5
    // [HttpGet("{id}")]
  public async Task<ActionResult<List<ExpenseResponseDto>>> GetExpenses()
{
    var userId = GetUserId();

    var expenses = await _context.Expenses
        .AsNoTracking()
        .Include(e => e.Category)
        .Where(e => e.UserId == userId)
        .OrderByDescending(e => e.ExpenseDate)
        .Select(e => new ExpenseResponseDto
        {
            Id = e.Id,
            UserId = e.UserId,
            CategoryId = e.CategoryId,
            Description = e.Description,
            Amount = e.Amount,
            ExpenseDate = e.ExpenseDate,
            CreatedAt = e.CreatedAt,
            CategoryName = e.Category != null
                ? e.Category.Name
                : "Other"
        })
        .ToListAsync();

    return Ok(expenses);
}
[HttpGet("{id}")]
public async Task<ActionResult<ExpenseResponseDto>> GetExpense(int id)
{
    var userId = GetUserId();

    var expense = await _context.Expenses
        .AsNoTracking()
        .Include(e => e.Category)
        .Where(e => e.Id == id && e.UserId == userId)
        .Select(e => new ExpenseResponseDto
        {
            Id = e.Id,
            UserId = e.UserId,
            CategoryId = e.CategoryId,
            Description = e.Description,
            Amount = e.Amount,
            ExpenseDate = e.ExpenseDate,
            CreatedAt = e.CreatedAt,
            CategoryName = e.Category != null
                ? e.Category.Name
                : "Other"
        })
        .FirstOrDefaultAsync();

    if (expense == null)
    {
        return NotFound("Expense not found.");
    }

    return Ok(expense);
}
    // POST: api/Expenses

[HttpPost]
public async Task<ActionResult<ExpenseResponseDto>> CreateExpense(
    ExpenseCreateDto dto)
{
    var userId = GetUserId();

    var category = await _context.Categories
        .FirstOrDefaultAsync(c => c.Id == dto.CategoryId);

    if (category == null)
    {
        return BadRequest("Invalid category.");
    }

    if (string.IsNullOrWhiteSpace(dto.Description))
    {
        return BadRequest("Description is required.");
    }

    if (dto.Amount <= 0)
    {
        return BadRequest("Amount must be greater than zero.");
    }

    var expense = new Expense
    {
        UserId = userId,
        CategoryId = dto.CategoryId,
        Description = dto.Description.Trim(),
        Amount = dto.Amount,
        ExpenseDate = dto.ExpenseDate,
        CreatedAt = DateTime.UtcNow
    };

    _context.Expenses.Add(expense);

    await _context.SaveChangesAsync();

    var response = new ExpenseResponseDto
    {
        Id = expense.Id,
        UserId = expense.UserId,
        CategoryId = expense.CategoryId,
        Description = expense.Description,
        Amount = expense.Amount,
        ExpenseDate = expense.ExpenseDate,
        CreatedAt = expense.CreatedAt,
        CategoryName = category.Name
    };

    return CreatedAtAction(
        nameof(GetExpense),
        new { id = expense.Id },
        response
    );
}

// PUT: api/Expenses/5
// [HttpPut("{id}")]
[HttpPut("{id}")]
public async Task<ActionResult<ExpenseResponseDto>> UpdateExpense(
    int id,
    ExpenseCreateDto dto)
{
    var userId = GetUserId();

    var expense = await _context.Expenses
        .Include(e => e.Category)
        .FirstOrDefaultAsync(
            e => e.Id == id &&
                 e.UserId == userId
        );

    if (expense == null)
    {
        return NotFound("Expense not found.");
    }

    var category = await _context.Categories
        .FirstOrDefaultAsync(
            c => c.Id == dto.CategoryId
        );

    if (category == null)
    {
        return BadRequest("Invalid category.");
    }

    if (string.IsNullOrWhiteSpace(dto.Description))
    {
        return BadRequest("Description is required.");
    }

    if (dto.Amount <= 0)
    {
        return BadRequest("Amount must be greater than zero.");
    }

    expense.CategoryId = dto.CategoryId;
    expense.Description = dto.Description.Trim();
    expense.Amount = dto.Amount;
    expense.ExpenseDate = dto.ExpenseDate;

    await _context.SaveChangesAsync();

    var response = new ExpenseResponseDto
    {
        Id = expense.Id,
        UserId = expense.UserId,
        CategoryId = expense.CategoryId,
        Description = expense.Description,
        Amount = expense.Amount,
        ExpenseDate = expense.ExpenseDate,
        CreatedAt = expense.CreatedAt,
        CategoryName = category.Name
    };

    return Ok(response);
}
  // DELETE: api/Expenses/5
[HttpDelete("{id}")]
public async Task<IActionResult> DeleteExpense(int id)
{
    var userId = GetUserId();

    var expense = await _context.Expenses
        .FirstOrDefaultAsync(
            e => e.Id == id &&
                 e.UserId == userId
        );

    if (expense == null)
    {
        return NotFound("Expense not found.");
    }

    _context.Expenses.Remove(expense);

    await _context.SaveChangesAsync();

    return NoContent();
}
}