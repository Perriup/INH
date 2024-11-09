using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace INH_Back.Migrations
{
    public partial class InitialMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UserGUID",
                table: "Posts",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    GUID = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.GUID);
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "GUID", "Email", "Name", "Role" },
                values: new object[] { "1", "zymantas.petreikis@gmail.com", "User 1", "Admin" });

            migrationBuilder.CreateIndex(
                name: "IX_Posts_UserGUID",
                table: "Posts",
                column: "UserGUID");

            migrationBuilder.AddForeignKey(
                name: "FK_Posts_Users_UserGUID",
                table: "Posts",
                column: "UserGUID",
                principalTable: "Users",
                principalColumn: "GUID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Posts_Users_UserGUID",
                table: "Posts");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Posts_UserGUID",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "UserGUID",
                table: "Posts");
        }
    }
}
