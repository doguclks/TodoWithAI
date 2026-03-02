namespace TodoWithAI.Domain.Entities;

public class Todo
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public DateTime Date { get; set; } = DateTime.UtcNow;

    public List<TodoItem> Items { get; set; } = new();
}
