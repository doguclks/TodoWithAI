using TodoWithAI.Domain.Entities;
using TodoWithAI.Application.Interfaces.Repositories;
using TodoWithAI.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace TodoWithAI.Infrastructure.Persistence.Repositories;

public class TodoItemRepository : ITodoItemRepository
{
    private readonly TodoContext _context;

    public TodoItemRepository(TodoContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<TodoItem>> GetByTodoIdAsync(int todoId, string userId)
    {
        return await _context.TodoItems
            .Include(i => i.Todo)
            .Where(i => i.TodoId == todoId && i.Todo.UserId == userId)
            .ToListAsync();
    }

    public async Task<TodoItem?> GetByIdAsync(int id, string userId)
    {
        return await _context.TodoItems
            .Include(i => i.Todo)
            .FirstOrDefaultAsync(i => i.Id == id && i.Todo.UserId == userId);
    }

    public async Task<TodoItem> AddAsync(TodoItem item)
    {
        _context.TodoItems.Add(item);
        await _context.SaveChangesAsync();
        return item;
    }

    public async Task UpdateAsync(TodoItem item, string userId)
    {
        var existingItem = await GetByIdAsync(item.Id, userId);
        if (existingItem != null)
        {
            _context.Entry(existingItem).CurrentValues.SetValues(item);
            await _context.SaveChangesAsync();
        }
    }

    public async Task DeleteAsync(int id, string userId)
    {
        var item = await GetByIdAsync(id, userId);
        if (item != null)
        {
            _context.TodoItems.Remove(item);
            await _context.SaveChangesAsync();
        }
    }
}
