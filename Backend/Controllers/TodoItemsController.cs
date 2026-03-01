using Backend.Models;
using Backend.Repositories;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TodoItemsController : ControllerBase
{
    private readonly ITodoItemRepository _repository;
    private readonly ITodoService _todoService;

    public TodoItemsController(ITodoItemRepository repository, ITodoService todoService)
    {
        _repository = repository;
        _todoService = todoService;
    }

    [HttpGet]
    public async Task<IEnumerable<TodoItem>> GetItems([FromQuery] int todoId)
    {
        return await _repository.GetByTodoIdAsync(todoId);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TodoItem>> GetItem(int id)
    {
        var item = await _repository.GetByIdAsync(id);
        if (item == null)
            return NotFound();
        return item;
    }

    [HttpPost]
    public async Task<ActionResult<TodoItem>> CreateItem(TodoItem item)
    {
        var created = await _todoService.AddItemToTodoAsync(item.TodoId, item);
        return CreatedAtAction(nameof(GetItem), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateItem(int id, TodoItem item)
    {
        if (id != item.Id)
            return BadRequest();

        await _repository.UpdateAsync(item);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteItem(int id)
    {
        var item = await _repository.GetByIdAsync(id);
        if (item == null)
            return NotFound();

        await _repository.DeleteAsync(id);
        return NoContent();
    }
}
