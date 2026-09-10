using ExpenseTracker.API.Data;
using ExpenseTracker.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ExpenseTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
// [Authorize]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthController(
        AppDbContext context,
        IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }


    // ==============================
    // REGISTER
    // ==============================

    [HttpPost("register")]
public async Task<ActionResult> Register(
    RegisterRequest request)
{
    if (string.IsNullOrWhiteSpace(request.Username))
        return BadRequest("Username is required.");

    if (string.IsNullOrWhiteSpace(request.Email))
        return BadRequest("Email is required.");

    if (string.IsNullOrWhiteSpace(request.Password))
        return BadRequest("Password is required.");

    var username = request.Username.Trim();
    var email = request.Email.Trim();

    var existingUser = await _context.Users
        .FirstOrDefaultAsync(u =>
            u.Username.ToLower() ==
            username.ToLower());

    if (existingUser != null)
        return BadRequest("Username already exists.");

    var existingEmail = await _context.Users
        .FirstOrDefaultAsync(u =>
            u.Email.ToLower() ==
            email.ToLower());

    if (existingEmail != null)
        return BadRequest("Email already exists.");

    // ==============================
    // HASH PASSWORD
    // ==============================

    var passwordHash =
        BCrypt.Net.BCrypt.HashPassword(
            request.Password);

    var user = new User
    {
        Username = username,
        Email = email,
        PasswordHash = passwordHash,
        CreatedAt = DateTime.UtcNow
    };

    _context.Users.Add(user);

    await _context.SaveChangesAsync();

    // ==============================
    // CREATE JWT
    // ==============================

    var claims = new[]
    {
        new Claim(
            ClaimTypes.NameIdentifier,
            user.Id.ToString()),

        new Claim(
            ClaimTypes.Name,
            user.Username),

        new Claim(
            ClaimTypes.Email,
            user.Email)
    };

    var jwtKey =
        _configuration["Jwt:Key"];

    var key =
        new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtKey!));

    var credentials =
        new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(
        issuer:
            _configuration["Jwt:Issuer"],

        audience:
            _configuration["Jwt:Audience"],

        claims: claims,

        expires:
            DateTime.UtcNow.AddHours(2),

        signingCredentials:
            credentials
    );

    var tokenString =
        new JwtSecurityTokenHandler()
            .WriteToken(token);

    // ==============================
    // RETURN USER + JWT
    // ==============================

    return Ok(new
    {
        id = user.Id,
        username = user.Username,
        email = user.Email,
        token = tokenString
    });
}


    // ==============================
    // LOGIN
    // ==============================

    [HttpPost("login")]
    public async Task<ActionResult> Login(
        LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Username))
            return BadRequest("Username is required.");

        if (string.IsNullOrWhiteSpace(request.Password))
            return BadRequest("Password is required.");


        var username = request.Username.Trim();


        var user = await _context.Users
            .FirstOrDefaultAsync(u =>
                u.Username.ToLower() ==
                username.ToLower());


        if (user == null)
            return Unauthorized(
                "Invalid username or password.");


        // VERIFY HASHED PASSWORD
        var passwordValid =
            BCrypt.Net.BCrypt.Verify(
                request.Password,
                user.PasswordHash);


        if (!passwordValid)
            return Unauthorized(
                "Invalid username or password.");


        // ==============================
        // CREATE JWT
        // ==============================

        var claims = new[]
        {
            new Claim(
                ClaimTypes.NameIdentifier,
                user.Id.ToString()),

            new Claim(
                ClaimTypes.Name,
                user.Username),

            new Claim(
                ClaimTypes.Email,
                user.Email)
        };


        var jwtKey =
            _configuration["Jwt:Key"];

        var key =
            new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey!));


        var credentials =
            new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256);


        var token = new JwtSecurityToken(
            issuer:
                _configuration["Jwt:Issuer"],

            audience:
                _configuration["Jwt:Audience"],

            claims: claims,

            expires:
                DateTime.UtcNow.AddHours(2),

            signingCredentials:
                credentials
        );


        var tokenString =
            new JwtSecurityTokenHandler()
                .WriteToken(token);


        return Ok(new
        {
            id = user.Id,
            username = user.Username,
            email = user.Email,

            // JWT TOKEN
            token = tokenString
        });
    }
}


// ==============================
// REGISTER REQUEST
// ==============================

public class RegisterRequest
{
    public string Username { get; set; }
        = string.Empty;

    public string Email { get; set; }
        = string.Empty;

    public string Password { get; set; }
        = string.Empty;
}


// ==============================
// LOGIN REQUEST
// ==============================

public class LoginRequest
{
    public string Username { get; set; }
        = string.Empty;

    public string Password { get; set; }
        = string.Empty;
}