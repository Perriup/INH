using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace INH_Back.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    CategoryId = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.CategoryId);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Sub = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Sub);
                });

            migrationBuilder.CreateTable(
                name: "Posts",
                columns: table => new
                {
                    PostId = table.Column<int>(type: "int", nullable: false),
                    CategoryId = table.Column<int>(type: "int", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UserSub = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Posts", x => new { x.CategoryId, x.PostId });
                    table.ForeignKey(
                        name: "FK_Posts_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "CategoryId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Posts_Users_UserSub",
                        column: x => x.UserSub,
                        principalTable: "Users",
                        principalColumn: "Sub");
                });

            migrationBuilder.CreateTable(
                name: "Comments",
                columns: table => new
                {
                    CommentId = table.Column<int>(type: "int", nullable: false),
                    PostId = table.Column<int>(type: "int", nullable: false),
                    CategoryId = table.Column<int>(type: "int", nullable: false),
                    Text = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Comments", x => new { x.CategoryId, x.PostId, x.CommentId });
                    table.ForeignKey(
                        name: "FK_Comments_Posts_CategoryId_PostId",
                        columns: x => new { x.CategoryId, x.PostId },
                        principalTable: "Posts",
                        principalColumns: new[] { "CategoryId", "PostId" },
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "CategoryId", "Name" },
                values: new object[,]
                {
                    { 1, "Category 1" },
                    { 2, "Category 2" },
                    { 3, "Category 3" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Sub", "Email", "Name", "Role" },
                values: new object[] { "1", "zymantas.petreikis@gmail.com", "User 1", "Admin" });

            migrationBuilder.InsertData(
                table: "Posts",
                columns: new[] { "CategoryId", "PostId", "Content", "Title", "UserSub" },
                values: new object[] { 1, 1, "Content 1", "Post 1", null });

            migrationBuilder.InsertData(
                table: "Posts",
                columns: new[] { "CategoryId", "PostId", "Content", "Title", "UserSub" },
                values: new object[] { 2, 2, "Content 2", "Post 2", null });

            migrationBuilder.InsertData(
                table: "Posts",
                columns: new[] { "CategoryId", "PostId", "Content", "Title", "UserSub" },
                values: new object[] { 3, 3, "Content 3", "Post 3", null });

            migrationBuilder.InsertData(
                table: "Comments",
                columns: new[] { "CategoryId", "CommentId", "PostId", "Text" },
                values: new object[] { 1, 1, 1, "Comment 1" });

            migrationBuilder.InsertData(
                table: "Comments",
                columns: new[] { "CategoryId", "CommentId", "PostId", "Text" },
                values: new object[] { 2, 2, 2, "Comment 2" });

            migrationBuilder.InsertData(
                table: "Comments",
                columns: new[] { "CategoryId", "CommentId", "PostId", "Text" },
                values: new object[] { 3, 3, 3, "Comment 3" });

            migrationBuilder.CreateIndex(
                name: "IX_Posts_UserSub",
                table: "Posts",
                column: "UserSub");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Comments");

            migrationBuilder.DropTable(
                name: "Posts");

            migrationBuilder.DropTable(
                name: "Categories");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
