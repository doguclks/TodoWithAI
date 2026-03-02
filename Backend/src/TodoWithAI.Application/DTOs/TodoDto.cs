namespace TodoWithAI.Application.DTOs;

public class TodoDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public bool IsPinned { get; set; }
    public int Order { get; set; }
}
