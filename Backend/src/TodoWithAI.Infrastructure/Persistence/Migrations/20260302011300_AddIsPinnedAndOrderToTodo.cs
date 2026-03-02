using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TodoWithAI.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddIsPinnedAndOrderToTodo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsPinned",
                table: "Todos",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "Todos",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsPinned",
                table: "Todos");

            migrationBuilder.DropColumn(
                name: "Order",
                table: "Todos");
        }
    }
}
