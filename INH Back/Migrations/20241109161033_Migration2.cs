using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace INH_Back.Migrations
{
    public partial class Migration2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Posts_Users_UserGUID",
                table: "Posts");

            migrationBuilder.RenameColumn(
                name: "GUID",
                table: "Users",
                newName: "Sub");

            migrationBuilder.RenameColumn(
                name: "UserGUID",
                table: "Posts",
                newName: "UserSub");

            migrationBuilder.RenameIndex(
                name: "IX_Posts_UserGUID",
                table: "Posts",
                newName: "IX_Posts_UserSub");

            migrationBuilder.AddForeignKey(
                name: "FK_Posts_Users_UserSub",
                table: "Posts",
                column: "UserSub",
                principalTable: "Users",
                principalColumn: "Sub");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Posts_Users_UserSub",
                table: "Posts");

            migrationBuilder.RenameColumn(
                name: "Sub",
                table: "Users",
                newName: "GUID");

            migrationBuilder.RenameColumn(
                name: "UserSub",
                table: "Posts",
                newName: "UserGUID");

            migrationBuilder.RenameIndex(
                name: "IX_Posts_UserSub",
                table: "Posts",
                newName: "IX_Posts_UserGUID");

            migrationBuilder.AddForeignKey(
                name: "FK_Posts_Users_UserGUID",
                table: "Posts",
                column: "UserGUID",
                principalTable: "Users",
                principalColumn: "GUID");
        }
    }
}
