using TodoWithAI.Domain.Entities;
using TodoWithAI.Application.Interfaces.Repositories;
using TodoWithAI.Application.Interfaces.Services;
using TodoWithAI.Application.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace TodoWithAI.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TodosController : ControllerBase
{
    private readonly ITodoRepository _repository;
    private readonly ITodoService _todoService;

    public TodosController(ITodoRepository repository, ITodoService todoService)
    {
        _repository = repository;
        _todoService = todoService;
    }

    [HttpGet]
    public async Task<IEnumerable<Todo>> GetTodos([FromQuery] string? search)
    {
        return await _repository.GetAllAsync(search);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Todo>> GetTodo(int id)
    {
        var todo = await _todoService.GetTodoWithItemsAsync(id);
        if (todo == null)
            return NotFound();
        return todo;
    }

    [HttpPost]
    public async Task<ActionResult<Todo>> CreateTodo(Todo todo)
    {
        var created = await _repository.AddAsync(todo);
        return CreatedAtAction(nameof(GetTodo), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTodo(int id, Todo todo)
    {
        if (id != todo.Id)
            return BadRequest();

        await _repository.UpdateAsync(todo);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTodo(int id)
    {
        await _todoService.DeleteTodoWithItemsAsync(id);
        return NoContent();
    }

    [HttpPatch("{id}/pin")]
    public async Task<IActionResult> PinTodo(int id)
    {
        var todo = await _repository.GetByIdAsync(id);
        if (todo == null) return NotFound();

        todo.IsPinned = true;
        await _repository.UpdateAsync(todo);
        return NoContent();
    }

    [HttpPatch("{id}/unpin")]
    public async Task<IActionResult> UnpinTodo(int id)
    {
        var todo = await _repository.GetByIdAsync(id);
        if (todo == null) return NotFound();

        todo.IsPinned = false;
        await _repository.UpdateAsync(todo);
        return NoContent();
    }

    [HttpPut("order")]
    public async Task<IActionResult> UpdateOrders([FromBody] List<TodoOrderUpdate> updates)
    {
        await _repository.UpdateOrderAsync(updates.Select(x => (x.Id, x.Order)));
        return NoContent();
    }
}
