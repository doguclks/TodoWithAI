using TodoWithAI.Application.DTOs;

namespace TodoWithAI.Application.Interfaces.Services;

public interface IAuthService
{
    Task<AuthResponseDto?> RegisterAsync(RegisterDto registerDto);
    Task<AuthResponseDto?> LoginAsync(LoginDto loginDto);
}
