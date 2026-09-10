using ExpenseTracker.API.Data;
using ExpenseTracker.API.DTOs;
using ExpenseTracker.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace ExpenseTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FinancialProfileController : ControllerBase
{
    private readonly AppDbContext _context;

    public FinancialProfileController(AppDbContext context)
    {
        _context = context;
    }

    // ==============================
    // GET PROFILE
    // ==============================

    [HttpGet]
    public async Task<ActionResult> GetProfile()
    {
        var userId = GetUserId();

        var profile = await _context.FinancialProfiles
            .AsNoTracking()
            .FirstOrDefaultAsync(
                p => p.UserId == userId
            );

        if (profile == null)
        {
            return Ok(new
            {
                userId = userId,
                monthlyIncome = 0,
                savingsGoal = 0
            });
        }

        return Ok(new
        {
            userId = profile.UserId,
            monthlyIncome = profile.MonthlyIncome,
            savingsGoal = profile.SavingsGoal
        });
    }


    // ==============================
    // SAVE / UPDATE PROFILE
    // ==============================

    [HttpPut]
    public async Task<ActionResult> SaveProfile(
        FinancialProfileDto dto)
    {
        var userId = GetUserId();

        if (dto.MonthlyIncome < 0)
        {
            return BadRequest(
                "Monthly income cannot be negative."
            );
        }

        if (dto.SavingsGoal < 0)
        {
            return BadRequest(
                "Savings goal cannot be negative."
            );
        }

        var profile = await _context.FinancialProfiles
            .FirstOrDefaultAsync(
                p => p.UserId == userId
            );

        if (profile == null)
        {
            profile = new FinancialProfile
            {
                UserId = userId,
                MonthlyIncome = dto.MonthlyIncome,
                SavingsGoal = dto.SavingsGoal
            };

            _context.FinancialProfiles.Add(profile);
        }
        else
        {
            profile.MonthlyIncome =
                dto.MonthlyIncome;

            profile.SavingsGoal =
                dto.SavingsGoal;
        }

        await _context.SaveChangesAsync();

        return Ok(new
        {
            userId = profile.UserId,
            monthlyIncome = profile.MonthlyIncome,
            savingsGoal = profile.SavingsGoal
        });
    }


    // ==============================
    // GET USER ID FROM JWT
    // ==============================

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(
            ClaimTypes.NameIdentifier
        );

        if (userIdClaim == null)
        {
            throw new UnauthorizedAccessException();
        }

        return int.Parse(userIdClaim.Value);
    }
}