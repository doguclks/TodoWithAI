using Backend.Models;
using Backend.Repositories;

namespace Backend.Services;

public class TodoService : ITodoService
{
    private readonly ITodoRepository _todoRepository;
    private readonly ITodoItemRepository _todoItemRepository;

    public TodoService(ITodoRepository todoRepository, ITodoItemRepository todoItemRepository)
    {
        _todoRepository = todoRepository;
        _todoItemRepository = todoItemRepository;
    }

    public async Task<Todo?> GetTodoWithItemsAsync(int id)
    {
        return await _todoRepository.GetByIdAsync(id);
    }

    public async Task<TodoItem> AddItemToTodoAsync(int todoId, TodoItem item)
    {
        var todo = await _todoRepository.GetByIdAsync(todoId);
        if (todo == null)
            throw new KeyNotFoundException($"Todo with id {todoId} not found.");

        item.TodoId = todoId;
        return await _todoItemRepository.AddAsync(item);
    }

    public async Task DeleteTodoWithItemsAsync(int id)
    {
        // Cascade delete will handle TodoItems via EF configuration
        await _todoRepository.DeleteAsync(id);
    }
}
