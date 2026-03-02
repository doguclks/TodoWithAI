namespace TodoWithAI.Domain.Entities;

public class Todo
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public DateTime Date { get; set; } = DateTime.UtcNow;

    public bool IsPinned { get; set; }
    public int Order { get; set; }

    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;

    public List<TodoItem> Items { get; set; } = new();
}
