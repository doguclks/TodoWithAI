using TodoWithAI.Domain.Entities;

namespace TodoWithAI.Application.Interfaces.Repositories;

public interface ITodoItemRepository
{
    Task<IEnumerable<TodoItem>> GetByTodoIdAsync(int todoId);
    Task<TodoItem?> GetByIdAsync(int id);
    Task<TodoItem> AddAsync(TodoItem item);
    Task UpdateAsync(TodoItem item);
    Task DeleteAsync(int id);
}
