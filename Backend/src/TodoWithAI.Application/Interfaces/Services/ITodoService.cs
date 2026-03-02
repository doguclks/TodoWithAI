using TodoWithAI.Domain.Entities;

namespace TodoWithAI.Application.Interfaces.Services;

public interface ITodoService
{
    Task<Todo?> GetTodoWithItemsAsync(int id, string userId);
    Task<TodoItem> AddItemToTodoAsync(int todoId, string userId, TodoItem item);
    Task DeleteTodoWithItemsAsync(int id, string userId);
}
