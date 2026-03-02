using TodoWithAI.Domain.Entities;

namespace TodoWithAI.Application.Interfaces.Repositories;

public interface ITodoRepository
{
    Task<IEnumerable<Todo>> GetAllAsync(string? search = null);
    Task<Todo?> GetByIdAsync(int id);
    Task<Todo> AddAsync(Todo todo);
    Task UpdateAsync(Todo todo);
    Task UpdateOrderAsync(IEnumerable<(int Id, int Order)> orders);
    Task DeleteAsync(int id);
}
