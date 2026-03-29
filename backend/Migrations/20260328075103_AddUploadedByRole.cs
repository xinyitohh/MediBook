using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddUploadedByRole : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UploadedByRole",
                table: "MedicalReports",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "02174cf0-9412-4cfe-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "70671476-1f58-4b49-bb3d-48a02f2b7ade", new DateTime(2026, 3, 28, 7, 51, 2, 432, DateTimeKind.Utc).AddTicks(4422), "AQAAAAIAAYagAAAAELcFK7WJnHM5a2Of1/De0hJIVyOZ3/Ff2RQYruX9wuVh60a4SXXmpDt6aZHNVoPzLA==", "d28141e5-92cc-4565-bd95-96ee8f8e6ee4" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "040901f0-abcd-422c-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "bfd24c66-0b2c-4a2a-a6a1-77a55afbf021", new DateTime(2026, 3, 28, 7, 51, 2, 533, DateTimeKind.Utc).AddTicks(3022), "AQAAAAIAAYagAAAAEB+q9K01uijG+146f9E452MczTR1FKYcu0Ld3qcTBeD31aZrCSuPJKh5NgfxrnY5ow==", "044190fa-692e-4477-954c-b274f6324b30" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "341743f0-abcd-422c-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "12844941-1962-4992-9c7b-f28482b2925d", new DateTime(2026, 3, 28, 7, 51, 2, 482, DateTimeKind.Utc).AddTicks(9060), "AQAAAAIAAYagAAAAEFVrBxIZ6GS0lUyodAs0YSvfbnfqQrv8znZg2pNgGtNiUVhuBGB1GEIgm7aMMtGorQ==", "991be299-d82a-47b2-a2ce-e70c6954e949" });

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 28, 7, 51, 2, 591, DateTimeKind.Utc).AddTicks(292));

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 28, 7, 51, 2, 591, DateTimeKind.Utc).AddTicks(304));

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 28, 7, 51, 2, 591, DateTimeKind.Utc).AddTicks(307));

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 28, 7, 51, 2, 591, DateTimeKind.Utc).AddTicks(309));

            migrationBuilder.UpdateData(
                table: "Patients",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 28, 7, 51, 2, 589, DateTimeKind.Utc).AddTicks(5942));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UploadedByRole",
                table: "MedicalReports");

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
