using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddSpecialtyTable : Migration
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
                nullable: true);

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
                values: new object[] { "4e0e1a32-07f5-41c4-9f32-b51d507145d8", new DateTime(2026, 3, 29, 14, 25, 36, 329, DateTimeKind.Utc).AddTicks(5880), "AQAAAAIAAYagAAAAEGmFT5Hyo+XYsImq7a99VjM/pmhY2noR9h7avmnpoFvT8/zl+P1y5DM+eCVBFkmtew==", "5a0f8c7b-156d-45fe-97c7-a993aef52a5d" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "040901f0-abcd-422c-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "5039ff11-48d8-4ab3-95d9-74fc289d1e58", new DateTime(2026, 3, 29, 14, 25, 36, 404, DateTimeKind.Utc).AddTicks(6050), "AQAAAAIAAYagAAAAEMbQf+rwabKl+MHkBuyEarNRnPi6KQCgITaWwsMiXDWjgkF3KBpFx3TYWuvcb1OjWQ==", "ef16de84-4555-4cb6-9b12-6324e2a62c35" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "341743f0-abcd-422c-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "2399723c-ee71-4f0e-b077-9ca881b35c1b", new DateTime(2026, 3, 29, 14, 25, 36, 367, DateTimeKind.Utc).AddTicks(330), "AQAAAAIAAYagAAAAENO3XK0p7CqIKdGwqzMkdDcI5SA4kEgzZ3fx90LgNIoC9GOCmiDcPmR/KZGxvG7A1A==", "549c8f8b-e275-471a-acd5-07e52054e928" });

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "SpecialtyId" },
                values: new object[] { new DateTime(2026, 3, 29, 14, 25, 36, 442, DateTimeKind.Utc).AddTicks(6930), 1 });

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "SpecialtyId" },
                values: new object[] { new DateTime(2026, 3, 29, 14, 25, 36, 442, DateTimeKind.Utc).AddTicks(6940), 5 });

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "SpecialtyId" },
                values: new object[] { new DateTime(2026, 3, 29, 14, 25, 36, 442, DateTimeKind.Utc).AddTicks(6950), 2 });

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "SpecialtyId" },
                values: new object[] { new DateTime(2026, 3, 29, 14, 25, 36, 442, DateTimeKind.Utc).AddTicks(6950), 5 });

            migrationBuilder.UpdateData(
                table: "Patients",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 29, 14, 25, 36, 442, DateTimeKind.Utc).AddTicks(1700));

            migrationBuilder.InsertData(
                table: "Specialties",
                columns: new[] { "Id", "CreatedAt", "Name" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 3, 29, 14, 25, 36, 442, DateTimeKind.Utc).AddTicks(6900), "Cardiology" },
                    { 2, new DateTime(2026, 3, 29, 14, 25, 36, 442, DateTimeKind.Utc).AddTicks(6900), "Dermatology" },
                    { 3, new DateTime(2026, 3, 29, 14, 25, 36, 442, DateTimeKind.Utc).AddTicks(6900), "Endocrinology" },
                    { 4, new DateTime(2026, 3, 29, 14, 25, 36, 442, DateTimeKind.Utc).AddTicks(6900), "Gastroenterology" },
                    { 5, new DateTime(2026, 3, 29, 14, 25, 36, 442, DateTimeKind.Utc).AddTicks(6900), "General Practice" },
                    { 6, new DateTime(2026, 3, 29, 14, 25, 36, 442, DateTimeKind.Utc).AddTicks(6900), "Neurology" },
                    { 7, new DateTime(2026, 3, 29, 14, 25, 36, 442, DateTimeKind.Utc).AddTicks(6900), "Obstetrics & Gynecology" },
                    { 8, new DateTime(2026, 3, 29, 14, 25, 36, 442, DateTimeKind.Utc).AddTicks(6900), "Oncology" },
                    { 9, new DateTime(2026, 3, 29, 14, 25, 36, 442, DateTimeKind.Utc).AddTicks(6900), "Ophthalmology" },
                    { 10, new DateTime(2026, 3, 29, 14, 25, 36, 442, DateTimeKind.Utc).AddTicks(6900), "Orthopedics" },
                    { 11, new DateTime(2026, 3, 29, 14, 25, 36, 442, DateTimeKind.Utc).AddTicks(6900), "Pediatrics" },
                    { 12, new DateTime(2026, 3, 29, 14, 25, 36, 442, DateTimeKind.Utc).AddTicks(6910), "Psychiatry" },
                    { 13, new DateTime(2026, 3, 29, 14, 25, 36, 442, DateTimeKind.Utc).AddTicks(6910), "Pulmonology" },
                    { 14, new DateTime(2026, 3, 29, 14, 25, 36, 442, DateTimeKind.Utc).AddTicks(6910), "Radiology" },
                    { 15, new DateTime(2026, 3, 29, 14, 25, 36, 442, DateTimeKind.Utc).AddTicks(6910), "Surgery" },
                    { 16, new DateTime(2026, 3, 29, 14, 25, 36, 442, DateTimeKind.Utc).AddTicks(6910), "Urology" }
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
