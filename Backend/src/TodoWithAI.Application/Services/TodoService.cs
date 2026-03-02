using TodoWithAI.Domain.Entities;
using TodoWithAI.Application.Interfaces.Repositories;
using TodoWithAI.Application.Interfaces.Services;

namespace TodoWithAI.Application.Services;

public class TodoService : ITodoService
{
    private readonly ITodoRepository _todoRepository;
    private readonly ITodoItemRepository _todoItemRepository;

    public TodoService(ITodoRepository todoRepository, ITodoItemRepository todoItemRepository)
    {
        _todoRepository = todoRepository;
        _todoItemRepository = todoItemRepository;
    }

    public async Task<Todo?> GetTodoWithItemsAsync(int id, string userId)
    {
        return await _todoRepository.GetByIdAsync(id, userId);
    }

    public async Task<TodoItem> AddItemToTodoAsync(int todoId, string userId, TodoItem item)
    {
        var todo = await _todoRepository.GetByIdAsync(todoId, userId);
        if (todo == null)
            throw new KeyNotFoundException($"Todo with id {todoId} not found or you do not have access.");

        item.TodoId = todoId;
        return await _todoItemRepository.AddAsync(item);
    }

    public async Task DeleteTodoWithItemsAsync(int id, string userId)
    {
        // Cascade delete will handle TodoItems via EF configuration
        await _todoRepository.DeleteAsync(id, userId);
    }
}
