using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddSeedUsersAndRoles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DateOfBirth",
                table: "Doctors",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Gender",
                table: "Doctors",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "341743f0-dead-422c-afbf-59f706d72cf6", null, "Admin", "ADMIN" },
                    { "7d9b7113-a8f8-1767-99a7-a20dd400f6a3", null, "Doctor", "DOCTOR" },
                    { "7d9b7113-a8f8-4035-99a7-a20dd400f6a3", null, "Patient", "PATIENT" }
                });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "CreatedAt", "Email", "EmailConfirmed", "FullName", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "Role", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[,]
                {
                    { "02174cf0-9412-4cfe-afbf-59f706d72cf6", 0, "59c2abf0-e64c-4c64-9ea2-1403499ee85e", new DateTime(2026, 3, 10, 15, 30, 36, 358, DateTimeKind.Utc).AddTicks(592), "admin@2.com", true, "Admin 1", false, null, "ADMIN@2.COM", "ADMIN@2.COM", "AQAAAAIAAYagAAAAECISFWsVC0b8G2fLyjhKtgD0m6TEfWWEjSWNTypncbZVY28TWxw2wNkbkJoydI6tPA==", null, false, "Admin", "4c07bb7c-ecd2-472d-8dcf-81f30d49d761", false, "admin@2.com" },
                    { "040901f0-abcd-422c-afbf-59f706d72cf6", 0, "29d385d3-d771-49ab-8532-a88c65567593", new DateTime(2026, 3, 10, 15, 30, 36, 553, DateTimeKind.Utc).AddTicks(2430), "doctor@2.com", true, "Doctor 1", false, null, "DOCTOR@2.COM", "DOCTOR@2.COM", "AQAAAAIAAYagAAAAEHHzZYFvlgYuQWbXuW1HqVgDqc6n11KGT077cvmwGUy1RnMphAEy189o4clz9AGoEw==", null, false, "Doctor", "dcd468b6-5a40-40a3-9d44-c67f56dd713e", false, "doctor@2.com" },
                    { "341743f0-abcd-422c-afbf-59f706d72cf6", 0, "fa1f51cc-b71c-49c9-b733-8e2a19d8fe75", new DateTime(2026, 3, 10, 15, 30, 36, 455, DateTimeKind.Utc).AddTicks(5032), "patient@2.com", true, "Patient 1", false, null, "PATIENT@2.COM", "PATIENT@2.COM", "AQAAAAIAAYagAAAAEA9a3cTR4sEy/7zqRgLR/+hNy5STjlRaqJQPpc/2E97qkhKdeCzVuDYsyWOJNLCdBQ==", null, false, "Patient", "f1f00413-549c-440d-a3d1-1b9abf50f90c", false, "patient@2.com" }
                });

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "DateOfBirth", "Gender" },
                values: new object[] { new DateTime(2026, 3, 10, 15, 30, 36, 651, DateTimeKind.Utc).AddTicks(6579), "", "" });

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "DateOfBirth", "Gender" },
                values: new object[] { new DateTime(2026, 3, 10, 15, 30, 36, 651, DateTimeKind.Utc).AddTicks(6595), "", "" });

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "DateOfBirth", "Gender" },
                values: new object[] { new DateTime(2026, 3, 10, 15, 30, 36, 651, DateTimeKind.Utc).AddTicks(6600), "", "" });

            migrationBuilder.InsertData(
                table: "Patients",
                columns: new[] { "Id", "Address", "CreatedAt", "DateOfBirth", "Email", "FullName", "Gender", "MedicalReportUrl", "Phone", "UserId" },
                values: new object[] { 1, "Bukit Jalil, KL", new DateTime(2026, 3, 10, 15, 30, 36, 649, DateTimeKind.Utc).AddTicks(7199), "1998-09-24", "patient@2.com", "Petient 1", "Female", "", "012-3456789", "341743f0-abcd-422c-afbf-59f706d72cf6" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "RoleId", "UserId" },
                values: new object[,]
                {
                    { "341743f0-dead-422c-afbf-59f706d72cf6", "02174cf0-9412-4cfe-afbf-59f706d72cf6" },
                    { "7d9b7113-a8f8-1767-99a7-a20dd400f6a3", "040901f0-abcd-422c-afbf-59f706d72cf6" },
                    { "7d9b7113-a8f8-4035-99a7-a20dd400f6a3", "341743f0-abcd-422c-afbf-59f706d72cf6" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "341743f0-dead-422c-afbf-59f706d72cf6", "02174cf0-9412-4cfe-afbf-59f706d72cf6" });

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "7d9b7113-a8f8-1767-99a7-a20dd400f6a3", "040901f0-abcd-422c-afbf-59f706d72cf6" });

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "RoleId", "UserId" },
                keyValues: new object[] { "7d9b7113-a8f8-4035-99a7-a20dd400f6a3", "341743f0-abcd-422c-afbf-59f706d72cf6" });

            migrationBuilder.DeleteData(
                table: "Patients",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "341743f0-dead-422c-afbf-59f706d72cf6");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "7d9b7113-a8f8-1767-99a7-a20dd400f6a3");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "7d9b7113-a8f8-4035-99a7-a20dd400f6a3");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "02174cf0-9412-4cfe-afbf-59f706d72cf6");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "040901f0-abcd-422c-afbf-59f706d72cf6");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "341743f0-abcd-422c-afbf-59f706d72cf6");

            migrationBuilder.DropColumn(
                name: "DateOfBirth",
                table: "Doctors");

            migrationBuilder.DropColumn(
                name: "Gender",
                table: "Doctors");

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 6, 12, 42, 47, 820, DateTimeKind.Utc).AddTicks(2558));

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 6, 12, 42, 47, 820, DateTimeKind.Utc).AddTicks(2573));

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 6, 12, 42, 47, 820, DateTimeKind.Utc).AddTicks(2578));
        }
    }
}
