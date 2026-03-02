using Microsoft.AspNetCore.Identity;

namespace TodoWithAI.Domain.Entities;

public class ApplicationUser : IdentityUser
{
    public List<Todo> Todos { get; set; } = new();
}
