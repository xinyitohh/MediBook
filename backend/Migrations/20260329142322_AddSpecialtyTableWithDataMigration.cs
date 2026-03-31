using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddSpecialtyTableWithDataMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProfileImageUrl",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "Specialty",
                table: "Doctors");

            migrationBuilder.AddColumn<int>(
                name: "SpecialtyId",
                table: "Doctors",
                type: "integer",
                nullable: true); // Make it nullable temporarily

            migrationBuilder.CreateTable(
                name: "Specialties",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Specialties", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "02174cf0-9412-4cfe-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "7e7533f7-a8bc-4f76-9439-f8f0e0d296f9", new DateTime(2026, 3, 29, 14, 23, 22, 494, DateTimeKind.Utc).AddTicks(6210), "AQAAAAIAAYagAAAAEH0jDCsEPCXkenpafZhF7dZ9Ut9QSW0UseB1imQ1jH3Z/Fx1RY/zJuAaosOGJjycsw==", "f6636915-27e4-4c9b-9821-bea36b80e6c9" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "040901f0-abcd-422c-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "e7f71e7e-0560-45d5-8f0e-d8e8e27d1fe4", new DateTime(2026, 3, 29, 14, 23, 22, 571, DateTimeKind.Utc).AddTicks(470), "AQAAAAIAAYagAAAAEMS6a3X2OauiP2ivD8YRAHDypFam6NzZmA0Yn3z1u7MC7aZ472Nzq9D+xNMyfRNclw==", "089ce3ad-a895-493a-9c4a-2a9162d3a583" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "341743f0-abcd-422c-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "333d6aca-ae56-499c-ae97-9d1638367940", new DateTime(2026, 3, 29, 14, 23, 22, 533, DateTimeKind.Utc).AddTicks(4810), "AQAAAAIAAYagAAAAEGlDkuAcrEbV3a/gSZB4nCZqigtFe+JPw/QHHKzX+wwNMZxse+/OD1hSJFL4FFJbcw==", "e08f95c2-9fa2-4167-9629-f12411e24e3b" });

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "SpecialtyId" },
                values: new object[] { new DateTime(2026, 3, 29, 14, 23, 22, 609, DateTimeKind.Utc).AddTicks(1630), 1 });

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "SpecialtyId" },
                values: new object[] { new DateTime(2026, 3, 29, 14, 23, 22, 609, DateTimeKind.Utc).AddTicks(1640), 5 });

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "SpecialtyId" },
                values: new object[] { new DateTime(2026, 3, 29, 14, 23, 22, 609, DateTimeKind.Utc).AddTicks(1640), 2 });

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "SpecialtyId" },
                values: new object[] { new DateTime(2026, 3, 29, 14, 23, 22, 609, DateTimeKind.Utc).AddTicks(1640), 5 });

            migrationBuilder.UpdateData(
                table: "Patients",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 29, 14, 23, 22, 608, DateTimeKind.Utc).AddTicks(5350));

            migrationBuilder.InsertData(
                table: "Specialties",
                columns: new[] { "Id", "CreatedAt", "Name" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 3, 29, 14, 23, 22, 609, DateTimeKind.Utc).AddTicks(1590), "Cardiology" },
                    { 2, new DateTime(2026, 3, 29, 14, 23, 22, 609, DateTimeKind.Utc).AddTicks(1590), "Dermatology" },
                    { 3, new DateTime(2026, 3, 29, 14, 23, 22, 609, DateTimeKind.Utc).AddTicks(1590), "Endocrinology" },
                    { 4, new DateTime(2026, 3, 29, 14, 23, 22, 609, DateTimeKind.Utc).AddTicks(1590), "Gastroenterology" },
                    { 5, new DateTime(2026, 3, 29, 14, 23, 22, 609, DateTimeKind.Utc).AddTicks(1600), "General Practice" },
                    { 6, new DateTime(2026, 3, 29, 14, 23, 22, 609, DateTimeKind.Utc).AddTicks(1600), "Neurology" },
                    { 7, new DateTime(2026, 3, 29, 14, 23, 22, 609, DateTimeKind.Utc).AddTicks(1600), "Obstetrics & Gynecology" },
                    { 8, new DateTime(2026, 3, 29, 14, 23, 22, 609, DateTimeKind.Utc).AddTicks(1600), "Oncology" },
                    { 9, new DateTime(2026, 3, 29, 14, 23, 22, 609, DateTimeKind.Utc).AddTicks(1600), "Ophthalmology" },
                    { 10, new DateTime(2026, 3, 29, 14, 23, 22, 609, DateTimeKind.Utc).AddTicks(1600), "Orthopedics" },
                    { 11, new DateTime(2026, 3, 29, 14, 23, 22, 609, DateTimeKind.Utc).AddTicks(1600), "Pediatrics" },
                    { 12, new DateTime(2026, 3, 29, 14, 23, 22, 609, DateTimeKind.Utc).AddTicks(1600), "Psychiatry" },
                    { 13, new DateTime(2026, 3, 29, 14, 23, 22, 609, DateTimeKind.Utc).AddTicks(1600), "Pulmonology" },
                    { 14, new DateTime(2026, 3, 29, 14, 23, 22, 609, DateTimeKind.Utc).AddTicks(1600), "Radiology" },
                    { 15, new DateTime(2026, 3, 29, 14, 23, 22, 609, DateTimeKind.Utc).AddTicks(1600), "Surgery" },
                    { 16, new DateTime(2026, 3, 29, 14, 23, 22, 609, DateTimeKind.Utc).AddTicks(1600), "Urology" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Doctors_SpecialtyId",
                table: "Doctors",
                column: "SpecialtyId");

            migrationBuilder.AddForeignKey(
                name: "FK_Doctors_Specialties_SpecialtyId",
                table: "Doctors",
                column: "SpecialtyId",
                principalTable: "Specialties",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Doctors_Specialties_SpecialtyId",
                table: "Doctors");

            migrationBuilder.DropTable(
                name: "Specialties");

            migrationBuilder.DropIndex(
                name: "IX_Doctors_SpecialtyId",
                table: "Doctors");

            migrationBuilder.DropColumn(
                name: "SpecialtyId",
                table: "Doctors");

            migrationBuilder.AddColumn<string>(
                name: "ProfileImageUrl",
                table: "Patients",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Specialty",
                table: "Doctors",
                type: "text",
                nullable: false,
                defaultValue: "");

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
                columns: new[] { "CreatedAt", "Specialty" },
                values: new object[] { new DateTime(2026, 3, 25, 14, 35, 30, 323, DateTimeKind.Utc).AddTicks(7591), "Cardiology" });

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "Specialty" },
                values: new object[] { new DateTime(2026, 3, 25, 14, 35, 30, 323, DateTimeKind.Utc).AddTicks(7605), "General Practice" });

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "Specialty" },
                values: new object[] { new DateTime(2026, 3, 25, 14, 35, 30, 323, DateTimeKind.Utc).AddTicks(7608), "Dermatology" });

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "Specialty" },
                values: new object[] { new DateTime(2026, 3, 25, 14, 35, 30, 323, DateTimeKind.Utc).AddTicks(7610), "General Practice" });

            migrationBuilder.UpdateData(
                table: "Patients",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "ProfileImageUrl" },
                values: new object[] { new DateTime(2026, 3, 25, 14, 35, 30, 321, DateTimeKind.Utc).AddTicks(5359), null });
        }
    }
}
