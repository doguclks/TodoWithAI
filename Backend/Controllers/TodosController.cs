using Backend.Models;
using Backend.Repositories;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

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
    public async Task<IEnumerable<Todo>> GetTodos()
    {
        return await _repository.GetAllAsync();
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
}
