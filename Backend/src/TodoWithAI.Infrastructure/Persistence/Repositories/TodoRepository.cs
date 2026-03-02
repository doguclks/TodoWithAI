using TodoWithAI.Domain.Entities;
using TodoWithAI.Application.Interfaces.Repositories;
using TodoWithAI.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace TodoWithAI.Infrastructure.Persistence.Repositories;

public class TodoRepository : ITodoRepository
{
    private readonly TodoContext _context;

    public TodoRepository(TodoContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Todo>> GetAllAsync(string userId, string? search = null)
    {
        var query = _context.Todos.Include(t => t.Items).Where(t => t.UserId == userId).AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(t => EF.Functions.Like(t.Title, $"%{search}%"));
        }

        return await query
            .OrderByDescending(t => t.IsPinned)
            .ThenBy(t => t.Order)
            .ToListAsync();
    }

    public async Task<Todo?> GetByIdAsync(int id, string userId)
    {
        return await _context.Todos.Include(t => t.Items).FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
    }

    public async Task<Todo> AddAsync(Todo todo)
    {
        _context.Todos.Add(todo);
        await _context.SaveChangesAsync();
        return todo;
    }

    public async Task UpdateAsync(Todo todo)
    {
        _context.Entry(todo).State = EntityState.Modified;
        await _context.SaveChangesAsync();
    }

    public async Task UpdateOrderAsync(IEnumerable<(int Id, int Order)> orders, string userId)
    {
        foreach (var (id, order) in orders)
        {
            var todo = await _context.Todos.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
            if (todo != null)
            {
                todo.Order = order;
            }
        }
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id, string userId)
    {
        var todo = await _context.Todos.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
        if (todo != null)
        {
            _context.Todos.Remove(todo);
            await _context.SaveChangesAsync();
        }
    }
}
