using FluentAssertions;
using TodoWithAI.Domain.Entities;
using Xunit;

namespace TodoWithAI.Tests.Unit.Domain;

public class TodoTests
{
    [Fact]
    public void Todo_Should_InitializeWithEmptyItems()
    {
        // Arrange & Act
        var todo = new Todo();

        // Assert
        todo.Items.Should().NotBeNull();
        todo.Items.Should().BeEmpty();
    }

    [Fact]
    public void Todo_Should_SetPropertiesCorrectly()
    {
        // Arrange
        var title = "Test Todo";
        var icon = "📝";
        var date = DateTime.UtcNow;

        // Act
        var todo = new Todo
        {
            Title = title,
            Icon = icon,
            Date = date,
            IsPinned = true,
            Order = 1
        };

        // Assert
        todo.Title.Should().Be(title);
        todo.Icon.Should().Be(icon);
        todo.Date.Should().Be(date);
        todo.IsPinned.Should().BeTrue();
        todo.Order.Should().Be(1);
    }
}
