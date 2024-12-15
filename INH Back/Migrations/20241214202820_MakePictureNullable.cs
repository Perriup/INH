using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace INH_Back.Migrations
{
    public partial class MakePictureNullable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Picture",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Sub",
                keyValue: "1",
                column: "Picture",
                value: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fpixabay.com%2Fvectors%2Fblank-profile-picture-mystery-man-973460%2F&psig=AOvVaw3jsKXntUlwhE4yR_Wt5sGJ&ust=1734294411586000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCNDE9byMqIoDFQAAAAAdAAAAABAE");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Picture",
                table: "Users");
        }
    }
}
