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

    public async Task<IEnumerable<TodoItem>> GetByTodoIdAsync(int todoId)
    {
        return await _context.TodoItems.Where(i => i.TodoId == todoId).ToListAsync();
    }

    public async Task<TodoItem?> GetByIdAsync(int id)
    {
        return await _context.TodoItems.FindAsync(id);
    }

    public async Task<TodoItem> AddAsync(TodoItem item)
    {
        _context.TodoItems.Add(item);
        await _context.SaveChangesAsync();
        return item;
    }

    public async Task UpdateAsync(TodoItem item)
    {
        _context.Entry(item).State = EntityState.Modified;
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var item = await _context.TodoItems.FindAsync(id);
        if (item != null)
        {
            _context.TodoItems.Remove(item);
            await _context.SaveChangesAsync();
        }
    }
}
