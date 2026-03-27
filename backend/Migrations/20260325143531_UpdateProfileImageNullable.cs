using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateProfileImageNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ProfileImageUrl",
                table: "Patients",
                type: "text",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "02174cf0-9412-4cfe-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "ff6c09a8-6958-42c1-b754-5fbfa0c3507c", new DateTime(2026, 3, 25, 14, 35, 30, 118, DateTimeKind.Utc).AddTicks(3817), "AQAAAAIAAYagAAAAEIqaZDYpVNXPux+lu8NhZE0SISyvxZr/uuHFowggLDfijCpgDH7pemqzz2fWcbiN1Q==", "79a9b5c4-2879-4729-8723-85acb3efa879" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "040901f0-abcd-422c-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "61dbe8d8-7581-4c1f-b1bc-19ec501399fb", new DateTime(2026, 3, 25, 14, 35, 30, 252, DateTimeKind.Utc).AddTicks(2804), "AQAAAAIAAYagAAAAEAn++ZeaK1r1kwHeBXuifEdSsXWwlbX6QIYd0OvDM2qp/iDVgvQGjUTzN3kXNb4+2w==", "83475ad1-200f-4465-b40e-25cfa1a7205f" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "341743f0-abcd-422c-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "a75fa41f-51d0-44eb-a022-16768e6ce6e7", new DateTime(2026, 3, 25, 14, 35, 30, 185, DateTimeKind.Utc).AddTicks(613), "AQAAAAIAAYagAAAAED9rKvKgx7UBA0FvCH99Avtv6hWytyQDWdaY10gHyMgGqRQqZ9PDFTWTPPSWpwgYpQ==", "650165f0-ad88-4d90-8ed0-e3a7e8f82eeb" });

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 25, 14, 35, 30, 323, DateTimeKind.Utc).AddTicks(7591));

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 25, 14, 35, 30, 323, DateTimeKind.Utc).AddTicks(7605));

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 25, 14, 35, 30, 323, DateTimeKind.Utc).AddTicks(7608));

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 25, 14, 35, 30, 323, DateTimeKind.Utc).AddTicks(7610));

            migrationBuilder.UpdateData(
                table: "Patients",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "ProfileImageUrl" },
                values: new object[] { new DateTime(2026, 3, 25, 14, 35, 30, 321, DateTimeKind.Utc).AddTicks(5359), null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProfileImageUrl",
                table: "Patients");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "02174cf0-9412-4cfe-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "2c297e3e-f5f0-4c38-804d-955c71690f15", new DateTime(2026, 3, 19, 16, 9, 29, 661, DateTimeKind.Utc).AddTicks(277), "AQAAAAIAAYagAAAAEJya7yZBAHl4ebqWq3PY6B/Mgmia16cbN3UKcG+YmwzM0lIfBJ2SaBQQ/8ZZ/LK/HA==", "3a91dc7b-42a9-4128-af62-693645f48927" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "040901f0-abcd-422c-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "13440f1b-23a8-4508-9f88-5edf6a61e6ef", new DateTime(2026, 3, 19, 16, 9, 29, 808, DateTimeKind.Utc).AddTicks(3073), "AQAAAAIAAYagAAAAEOR+HrLG28o1HNrmcOKHeOVTF41DJBUNzWFfDZSGzm1X6qE43JZk4FW3Fnd4FxEQ6Q==", "f61ca5b7-8607-48e3-ba9a-93ee2dcf5def" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "341743f0-abcd-422c-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "fe39068f-4d36-462f-a4ba-809763948d20", new DateTime(2026, 3, 19, 16, 9, 29, 735, DateTimeKind.Utc).AddTicks(8030), "AQAAAAIAAYagAAAAEEJevtUYKZLS7lJG+NHClWRENY0swSJ+2453IJb/6CdJjy3PDgsXSbPd59h12quDeQ==", "e45f97b2-4766-4281-880c-ad5c04c4026d" });

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 19, 16, 9, 29, 885, DateTimeKind.Utc).AddTicks(3727));

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 19, 16, 9, 29, 885, DateTimeKind.Utc).AddTicks(3739));

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 19, 16, 9, 29, 885, DateTimeKind.Utc).AddTicks(3743));

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 19, 16, 9, 29, 885, DateTimeKind.Utc).AddTicks(3745));

            migrationBuilder.UpdateData(
                table: "Patients",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 19, 16, 9, 29, 883, DateTimeKind.Utc).AddTicks(4625));
        }
    }
}
