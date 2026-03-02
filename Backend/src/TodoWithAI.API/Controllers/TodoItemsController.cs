using TodoWithAI.Domain.Entities;
using TodoWithAI.Application.Interfaces.Repositories;
using TodoWithAI.Application.Interfaces.Services;
using TodoWithAI.Application.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace TodoWithAI.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TodoItemsController : ControllerBase
{
    private readonly ITodoItemRepository _repository;
    private readonly ITodoService _todoService;

    public TodoItemsController(ITodoItemRepository repository, ITodoService todoService)
    {
        _repository = repository;
        _todoService = todoService;
    }

    private string GetUserId()
    {
        return User.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new UnauthorizedAccessException("User not authenticated.");
    }

    [HttpGet]
    public async Task<IEnumerable<TodoItem>> GetItems([FromQuery] int todoId)
    {
        return await _repository.GetByTodoIdAsync(todoId, GetUserId());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TodoItem>> GetItem(int id)
    {
        var item = await _repository.GetByIdAsync(id, GetUserId());
        if (item == null)
            return NotFound();
        return item;
    }

    [HttpPost]
    public async Task<ActionResult<TodoItem>> CreateItem(TodoItemDto dto)
    {
        var item = new TodoItem
        {
            Title = dto.Title,
            Status = dto.Status,
            TodoId = dto.TodoId
        };
        var created = await _todoService.AddItemToTodoAsync(item.TodoId, GetUserId(), item);
        return CreatedAtAction(nameof(GetItem), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateItem(int id, TodoItemDto dto)
    {
        if (id != dto.Id)
            return BadRequest();

        var existing = await _repository.GetByIdAsync(id, GetUserId());
        if (existing == null) return NotFound();

        existing.Title = dto.Title;
        existing.Status = dto.Status;

        await _repository.UpdateAsync(existing, GetUserId());
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteItem(int id)
    {
        var item = await _repository.GetByIdAsync(id, GetUserId());
        if (item == null)
            return NotFound();

        await _repository.DeleteAsync(id, GetUserId());
        return NoContent();
    }
}
