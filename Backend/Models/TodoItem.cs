using System.Text.Json.Serialization;
using Backend.Enums;

namespace Backend.Models;

public class TodoItem
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public TodoStatus Status { get; set; } = TodoStatus.Todo;

    public int TodoId { get; set; }

    [JsonIgnore]
    public Todo? Todo { get; set; }
}
