using TodoWithAI.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace TodoWithAI.Infrastructure.Persistence;

public class TodoContext : DbContext
{
    public TodoContext(DbContextOptions<TodoContext> options) : base(options) { }

    public DbSet<Todo> Todos { get; set; }
    public DbSet<TodoItem> TodoItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Todo>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasMany(t => t.Items)
                .WithOne(i => i.Todo)
                .HasForeignKey(i => i.TodoId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
