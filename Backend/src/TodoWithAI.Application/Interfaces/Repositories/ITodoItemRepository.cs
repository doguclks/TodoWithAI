using TodoWithAI.Domain.Entities;

namespace TodoWithAI.Application.Interfaces.Repositories;

public interface ITodoItemRepository
{
    Task<IEnumerable<TodoItem>> GetByTodoIdAsync(int todoId, string userId);
    Task<TodoItem?> GetByIdAsync(int id, string userId);
    Task<TodoItem> AddAsync(TodoItem item);
    Task UpdateAsync(TodoItem item, string userId);
    Task DeleteAsync(int id, string userId);
}
