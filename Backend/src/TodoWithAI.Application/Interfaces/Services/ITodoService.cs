using TodoWithAI.Domain.Entities;

namespace TodoWithAI.Application.Interfaces.Services;

public interface ITodoService
{
    Task<Todo?> GetTodoWithItemsAsync(int id);
    Task<TodoItem> AddItemToTodoAsync(int todoId, TodoItem item);
    Task DeleteTodoWithItemsAsync(int id);
}
