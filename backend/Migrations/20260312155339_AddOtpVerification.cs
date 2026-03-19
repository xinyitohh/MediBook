using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddOtpVerification : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "OtpVerifications",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Email = table.Column<string>(type: "text", nullable: false),
                    Code = table.Column<string>(type: "text", nullable: false),
                    Purpose = table.Column<string>(type: "text", nullable: false),
                    IsUsed = table.Column<bool>(type: "boolean", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OtpVerifications", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "02174cf0-9412-4cfe-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "4155cdc0-948e-4294-b6fe-ceec240d527c", new DateTime(2026, 3, 12, 15, 53, 38, 527, DateTimeKind.Utc).AddTicks(2853), "AQAAAAIAAYagAAAAEHErasxT5UIttszVpNR/SDx9+4k7L+W31VLa03k/6+iLIDB1IQU+5bawaWLBIs5JIQ==", "b31c8dbd-d279-47c1-a024-e9aa15a05fc5" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "040901f0-abcd-422c-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "2dd46ed9-e2ee-4c83-a9d1-253695ed619d", new DateTime(2026, 3, 12, 15, 53, 38, 722, DateTimeKind.Utc).AddTicks(824), "AQAAAAIAAYagAAAAELK3JEJmkxz6OpecVexWuKQBgUYkGZin1Bf/Nbe7xmWWWIssK1kUDUJaVHfeIkE4Eg==", "a273ef7b-8233-4c07-91c0-55abd8d94d3f" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "341743f0-abcd-422c-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "5823a64f-d11b-4f8c-9343-037142cf0f3a", new DateTime(2026, 3, 12, 15, 53, 38, 625, DateTimeKind.Utc).AddTicks(4087), "AQAAAAIAAYagAAAAEI72fwXPCWtNUErGxQ4hu7648DTp63+8DMMbc9qwFoVhY960AcvqpQOETnUngK7pug==", "1309efa7-0f13-4cf4-b2e7-3ae583a12be9" });

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 12, 15, 53, 38, 832, DateTimeKind.Utc).AddTicks(8619));

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 12, 15, 53, 38, 832, DateTimeKind.Utc).AddTicks(8675));

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 12, 15, 53, 38, 832, DateTimeKind.Utc).AddTicks(8681));

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 12, 15, 53, 38, 832, DateTimeKind.Utc).AddTicks(8686));

            migrationBuilder.UpdateData(
                table: "Patients",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 12, 15, 53, 38, 829, DateTimeKind.Utc).AddTicks(4054));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OtpVerifications");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "02174cf0-9412-4cfe-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "c01088cb-734c-4899-b499-af5af1c7807e", new DateTime(2026, 3, 12, 14, 15, 24, 620, DateTimeKind.Utc).AddTicks(5436), "AQAAAAIAAYagAAAAEAzFLmlYrb5dN8SXea0II09vZJJAf0hIT3jX3Wmp5g9udo0Wlmw8LYn8+6oUCbrdwA==", "f09052a0-5b3d-4e3e-af55-570aa6ec977a" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "040901f0-abcd-422c-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "2ecec7e3-4a8a-412a-9a01-be52522959cd", new DateTime(2026, 3, 12, 14, 15, 24, 815, DateTimeKind.Utc).AddTicks(99), "AQAAAAIAAYagAAAAED+KJoDQFm3DWDTyDajU9JiQ6tE76w6krs9vCGaVfdHqU8lFXqM4jk+8zPQHAD7Cyg==", "fbeb91c7-b382-4013-9c1a-3dcd3b1d9cc1" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "341743f0-abcd-422c-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "684a555b-5771-4f17-b291-b26141ab1bdb", new DateTime(2026, 3, 12, 14, 15, 24, 716, DateTimeKind.Utc).AddTicks(6819), "AQAAAAIAAYagAAAAEP2XUaEpwrLz4fGiSp3v9Bv/0MRJ+3riRBwB1JDay9gEZL/X0QcmtBzjMYgmK4r5xA==", "ee27d128-984e-4604-b1ec-cd4455538413" });

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 12, 14, 15, 24, 913, DateTimeKind.Utc).AddTicks(4438));

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 12, 14, 15, 24, 913, DateTimeKind.Utc).AddTicks(4455));

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 12, 14, 15, 24, 913, DateTimeKind.Utc).AddTicks(4460));

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 12, 14, 15, 24, 913, DateTimeKind.Utc).AddTicks(4544));

            migrationBuilder.UpdateData(
                table: "Patients",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 12, 14, 15, 24, 910, DateTimeKind.Utc).AddTicks(7085));
        }
    }
}
