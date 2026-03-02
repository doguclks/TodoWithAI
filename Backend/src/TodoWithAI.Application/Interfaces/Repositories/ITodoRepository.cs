using TodoWithAI.Domain.Entities;

namespace TodoWithAI.Application.Interfaces.Repositories;

public interface ITodoRepository
{
    Task<IEnumerable<Todo>> GetAllAsync(string userId, string? search = null);
    Task<Todo?> GetByIdAsync(int id, string userId);
    Task<Todo> AddAsync(Todo todo);
    Task UpdateAsync(Todo todo);
    Task UpdateOrderAsync(IEnumerable<(int Id, int Order)> orders, string userId);
    Task DeleteAsync(int id, string userId);
}
