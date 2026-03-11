using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddDoctorScheduleTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DoctorSchedules",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    DoctorId = table.Column<int>(type: "integer", nullable: false),
                    DayOfWeek = table.Column<int>(type: "integer", nullable: false),
                    StartTime = table.Column<string>(type: "text", nullable: false),
                    EndTime = table.Column<string>(type: "text", nullable: false),
                    SlotDurationMinutes = table.Column<int>(type: "integer", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DoctorSchedules", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DoctorSchedules_Doctors_DoctorId",
                        column: x => x.DoctorId,
                        principalTable: "Doctors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "02174cf0-9412-4cfe-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "198171c2-0f0d-43b6-852d-b818d98470e8", new DateTime(2026, 3, 11, 7, 21, 13, 938, DateTimeKind.Utc).AddTicks(6551), "AQAAAAIAAYagAAAAEFrVX3mnByY2ZOFGAt3SSbypb2xiW7ovWvuZ3/G3MeCYJXOwq0UUQDvy2dO6AplsZw==", "445bca3f-51b1-46a8-89ed-34acb80dd7eb" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "040901f0-abcd-422c-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "267bf17c-aa2f-414d-94b4-950da68eb320", new DateTime(2026, 3, 11, 7, 21, 14, 134, DateTimeKind.Utc).AddTicks(5077), "AQAAAAIAAYagAAAAEOE6+PpCW806wIcLIJi5/HOhSHntWy0r8B80+GPihxFJdRukUWcSiZ15ylnhwMecBw==", "8c28fe9f-63da-4133-b964-7067553b4a1f" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "341743f0-abcd-422c-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "b628e80b-d168-4fab-ad48-ee5840c075a6", new DateTime(2026, 3, 11, 7, 21, 14, 37, DateTimeKind.Utc).AddTicks(2965), "AQAAAAIAAYagAAAAECG8Ozdj4ddnd6nGYPJAy6zkGtmQcjv/mp9enDM3BF8ohmTNMAgJ10YtmoBq/qY5oQ==", "71a43e9c-d7e9-4197-9db4-5abd16d76470" });

            migrationBuilder.InsertData(
                table: "DoctorSchedules",
                columns: new[] { "Id", "DayOfWeek", "DoctorId", "EndTime", "IsActive", "SlotDurationMinutes", "StartTime" },
                values: new object[,]
                {
                    { 1, 1, 1, "17:00", true, 30, "09:00" },
                    { 2, 2, 1, "17:00", true, 30, "09:00" },
                    { 3, 3, 1, "17:00", true, 30, "09:00" },
                    { 4, 4, 1, "17:00", true, 30, "09:00" },
                    { 5, 5, 1, "17:00", true, 30, "09:00" },
                    { 6, 1, 2, "16:00", true, 30, "08:00" },
                    { 7, 2, 2, "16:00", true, 30, "08:00" },
                    { 8, 3, 2, "16:00", true, 30, "08:00" },
                    { 9, 4, 2, "16:00", true, 30, "08:00" },
                    { 10, 5, 2, "16:00", true, 30, "08:00" },
                    { 11, 6, 2, "16:00", true, 30, "08:00" },
                    { 12, 1, 3, "18:00", true, 30, "10:00" },
                    { 13, 2, 3, "18:00", true, 30, "10:00" },
                    { 14, 3, 3, "18:00", true, 30, "10:00" },
                    { 15, 4, 3, "18:00", true, 30, "10:00" },
                    { 16, 5, 3, "18:00", true, 30, "10:00" }
                });

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 11, 7, 21, 14, 235, DateTimeKind.Utc).AddTicks(8449));

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 11, 7, 21, 14, 235, DateTimeKind.Utc).AddTicks(8491));

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 11, 7, 21, 14, 235, DateTimeKind.Utc).AddTicks(8496));

            migrationBuilder.UpdateData(
                table: "Patients",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 11, 7, 21, 14, 233, DateTimeKind.Utc).AddTicks(5878));

            migrationBuilder.CreateIndex(
                name: "IX_DoctorSchedules_DoctorId",
                table: "DoctorSchedules",
                column: "DoctorId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DoctorSchedules");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "02174cf0-9412-4cfe-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "59c2abf0-e64c-4c64-9ea2-1403499ee85e", new DateTime(2026, 3, 10, 15, 30, 36, 358, DateTimeKind.Utc).AddTicks(592), "AQAAAAIAAYagAAAAECISFWsVC0b8G2fLyjhKtgD0m6TEfWWEjSWNTypncbZVY28TWxw2wNkbkJoydI6tPA==", "4c07bb7c-ecd2-472d-8dcf-81f30d49d761" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "040901f0-abcd-422c-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "29d385d3-d771-49ab-8532-a88c65567593", new DateTime(2026, 3, 10, 15, 30, 36, 553, DateTimeKind.Utc).AddTicks(2430), "AQAAAAIAAYagAAAAEHHzZYFvlgYuQWbXuW1HqVgDqc6n11KGT077cvmwGUy1RnMphAEy189o4clz9AGoEw==", "dcd468b6-5a40-40a3-9d44-c67f56dd713e" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "341743f0-abcd-422c-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "fa1f51cc-b71c-49c9-b733-8e2a19d8fe75", new DateTime(2026, 3, 10, 15, 30, 36, 455, DateTimeKind.Utc).AddTicks(5032), "AQAAAAIAAYagAAAAEA9a3cTR4sEy/7zqRgLR/+hNy5STjlRaqJQPpc/2E97qkhKdeCzVuDYsyWOJNLCdBQ==", "f1f00413-549c-440d-a3d1-1b9abf50f90c" });

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 10, 15, 30, 36, 651, DateTimeKind.Utc).AddTicks(6579));

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 10, 15, 30, 36, 651, DateTimeKind.Utc).AddTicks(6595));

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 10, 15, 30, 36, 651, DateTimeKind.Utc).AddTicks(6600));

            migrationBuilder.UpdateData(
                table: "Patients",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 10, 15, 30, 36, 649, DateTimeKind.Utc).AddTicks(7199));
        }
    }
}
