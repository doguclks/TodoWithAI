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
public class TodosController : ControllerBase
{
    private readonly ITodoRepository _repository;
    private readonly ITodoService _todoService;

    public TodosController(ITodoRepository repository, ITodoService todoService)
    {
        _repository = repository;
        _todoService = todoService;
    }

    private string GetUserId()
    {
        return User.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new UnauthorizedAccessException("User not authenticated.");
    }

    [HttpGet]
    public async Task<IEnumerable<Todo>> GetTodos([FromQuery] string? search)
    {
        return await _repository.GetAllAsync(GetUserId(), search);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Todo>> GetTodo(int id)
    {
        var todo = await _todoService.GetTodoWithItemsAsync(id, GetUserId());
        if (todo == null)
            return NotFound();
        return todo;
    }

    [HttpPost]
    public async Task<ActionResult<Todo>> CreateTodo(TodoDto dto)
    {
        var todo = new Todo
        {
            Title = dto.Title,
            Icon = dto.Icon,
            IsPinned = dto.IsPinned,
            Order = dto.Order,
            UserId = GetUserId()
        };
        var created = await _repository.AddAsync(todo);
        return CreatedAtAction(nameof(GetTodo), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTodo(int id, TodoDto dto)
    {
        if (id != dto.Id)
            return BadRequest();

        var existing = await _repository.GetByIdAsync(id, GetUserId());
        if (existing == null) return NotFound();

        existing.Title = dto.Title;
        existing.Icon = dto.Icon;
        existing.IsPinned = dto.IsPinned;
        existing.Order = dto.Order;

        await _repository.UpdateAsync(existing);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTodo(int id)
    {
        await _todoService.DeleteTodoWithItemsAsync(id, GetUserId());
        return NoContent();
    }

    [HttpPatch("{id}/pin")]
    public async Task<IActionResult> PinTodo(int id)
    {
        var todo = await _repository.GetByIdAsync(id, GetUserId());
        if (todo == null) return NotFound();

        todo.IsPinned = true;
        await _repository.UpdateAsync(todo);
        return NoContent();
    }

    [HttpPatch("{id}/unpin")]
    public async Task<IActionResult> UnpinTodo(int id)
    {
        var todo = await _repository.GetByIdAsync(id, GetUserId());
        if (todo == null) return NotFound();

        todo.IsPinned = false;
        await _repository.UpdateAsync(todo);
        return NoContent();
    }

    [HttpPut("order")]
    public async Task<IActionResult> UpdateOrders([FromBody] List<TodoOrderUpdate> updates)
    {
        await _repository.UpdateOrderAsync(updates.Select(x => (x.Id, x.Order)), GetUserId());
        return NoContent();
    }
}
