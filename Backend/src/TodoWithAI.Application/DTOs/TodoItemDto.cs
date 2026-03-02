using TodoWithAI.Domain.Entities;
using TodoWithAI.Domain.Enums;


namespace TodoWithAI.Application.DTOs;

public class TodoItemDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public TodoStatus Status { get; set; }
    public int TodoId { get; set; }
}
