using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddRawTextToReportAnalysis : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "RawEntities",
                table: "ReportAnalyses",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RawText",
                table: "ReportAnalyses",
                type: "text",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "02174cf0-9412-4cfe-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "245a622a-965f-445e-b692-1fca853f9799", new DateTime(2026, 5, 8, 10, 50, 57, 147, DateTimeKind.Utc).AddTicks(7097), "AQAAAAIAAYagAAAAEP2yP+zjonbOzhnyVxggAKmq9PQE4/qOc3kGr+jrdnhncGfWo0UUuw+UR3nZgjj0NA==", "a2c97e9f-5fc5-4de3-a8a9-5533ab433ce5" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "040901f0-abcd-422c-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "ba39c23a-d1e6-4d26-a1a6-bba8b3edf095", new DateTime(2026, 5, 8, 10, 50, 57, 339, DateTimeKind.Utc).AddTicks(8403), "AQAAAAIAAYagAAAAEFw+dD2fJWJoO3NMMvwZ1KndlR7SJJZHF2UBfR3nnKFJsdUbF3EWc5LNZn86lf6J7A==", "273fe737-aa35-4608-bc0b-5abb2398c439" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "341743f0-abcd-422c-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "b68eab91-7c02-4406-8335-00f077dab573", new DateTime(2026, 5, 8, 10, 50, 57, 244, DateTimeKind.Utc).AddTicks(4554), "AQAAAAIAAYagAAAAEMGla0oJ6ZC28aPeou8wxhn7CZgTXAN/G67BiJv6FryoDxCnMgBGM7VJUCYVsXJNPw==", "5dd917ec-51ef-488c-aa21-2659c73568b9" });

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "LeaveDates" },
                values: new object[] { new DateTime(2026, 5, 8, 10, 50, 57, 438, DateTimeKind.Utc).AddTicks(7593), new List<DateTime>() });

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "LeaveDates" },
                values: new object[] { new DateTime(2026, 5, 8, 10, 50, 57, 438, DateTimeKind.Utc).AddTicks(7613), new List<DateTime>() });

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "LeaveDates" },
                values: new object[] { new DateTime(2026, 5, 8, 10, 50, 57, 438, DateTimeKind.Utc).AddTicks(7619), new List<DateTime>() });

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "LeaveDates" },
                values: new object[] { new DateTime(2026, 5, 8, 10, 50, 57, 438, DateTimeKind.Utc).AddTicks(7625), new List<DateTime>() });

            migrationBuilder.UpdateData(
                table: "Patients",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 8, 10, 50, 57, 435, DateTimeKind.Utc).AddTicks(8143));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 8, 10, 50, 57, 438, DateTimeKind.Utc).AddTicks(7470));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 8, 10, 50, 57, 438, DateTimeKind.Utc).AddTicks(7478));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 8, 10, 50, 57, 438, DateTimeKind.Utc).AddTicks(7481));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 8, 10, 50, 57, 438, DateTimeKind.Utc).AddTicks(7483));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 8, 10, 50, 57, 438, DateTimeKind.Utc).AddTicks(7484));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 8, 10, 50, 57, 438, DateTimeKind.Utc).AddTicks(7486));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 8, 10, 50, 57, 438, DateTimeKind.Utc).AddTicks(7488));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 8, 10, 50, 57, 438, DateTimeKind.Utc).AddTicks(7489));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 8, 10, 50, 57, 438, DateTimeKind.Utc).AddTicks(7491));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 10,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 8, 10, 50, 57, 438, DateTimeKind.Utc).AddTicks(7492));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 11,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 8, 10, 50, 57, 438, DateTimeKind.Utc).AddTicks(7494));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 12,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 8, 10, 50, 57, 438, DateTimeKind.Utc).AddTicks(7495));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 13,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 8, 10, 50, 57, 438, DateTimeKind.Utc).AddTicks(7496));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 14,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 8, 10, 50, 57, 438, DateTimeKind.Utc).AddTicks(7498));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 15,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 8, 10, 50, 57, 438, DateTimeKind.Utc).AddTicks(7499));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 16,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 8, 10, 50, 57, 438, DateTimeKind.Utc).AddTicks(7501));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RawEntities",
                table: "ReportAnalyses");

            migrationBuilder.DropColumn(
                name: "RawText",
                table: "ReportAnalyses");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "02174cf0-9412-4cfe-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "8b9d44df-7fdf-413a-bced-e01846d12582", new DateTime(2026, 4, 12, 14, 35, 17, 589, DateTimeKind.Utc).AddTicks(6593), "AQAAAAIAAYagAAAAEEQVz0ztbRlXjFYaTMCoRFvLwYwyZH2D1D8IH/wnBaW/+GLJwYRf+aYOo9O4I31Tdg==", "6b1e63fb-3a94-41ec-a190-d5046da0988d" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "040901f0-abcd-422c-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "99d13afe-1576-4c98-b1a8-ddc4b08b357f", new DateTime(2026, 4, 12, 14, 35, 17, 690, DateTimeKind.Utc).AddTicks(6666), "AQAAAAIAAYagAAAAELEMRHzTUgwwxrSYeSjf9vN4iN2ZJT9SBWHGr+9WCI/O7uzQ/vJLg5lWRzajLhTTwg==", "40537251-f58e-4d78-914f-c7ba8776ab6b" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "341743f0-abcd-422c-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "fec4acda-8cd2-45fc-8c37-0049bd1f88c1", new DateTime(2026, 4, 12, 14, 35, 17, 640, DateTimeKind.Utc).AddTicks(3187), "AQAAAAIAAYagAAAAEMwpZqTq8ybn68AXF/2R44ALL71iq9TbFSZkLEeXp2vv7mFPV51VBPOQPHTN2RRT8w==", "ee351f9d-e994-439a-9bbc-a77755d3c581" });

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "LeaveDates" },
                values: new object[] { new DateTime(2026, 4, 12, 14, 35, 17, 745, DateTimeKind.Utc).AddTicks(5866), new List<DateTime>() });

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "LeaveDates" },
                values: new object[] { new DateTime(2026, 4, 12, 14, 35, 17, 745, DateTimeKind.Utc).AddTicks(5879), new List<DateTime>() });

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "LeaveDates" },
                values: new object[] { new DateTime(2026, 4, 12, 14, 35, 17, 745, DateTimeKind.Utc).AddTicks(5882), new List<DateTime>() });

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "LeaveDates" },
                values: new object[] { new DateTime(2026, 4, 12, 14, 35, 17, 745, DateTimeKind.Utc).AddTicks(5884), new List<DateTime>() });

            migrationBuilder.UpdateData(
                table: "Patients",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 12, 14, 35, 17, 743, DateTimeKind.Utc).AddTicks(9357));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 12, 14, 35, 17, 745, DateTimeKind.Utc).AddTicks(5802));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 12, 14, 35, 17, 745, DateTimeKind.Utc).AddTicks(5807));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 12, 14, 35, 17, 745, DateTimeKind.Utc).AddTicks(5808));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 12, 14, 35, 17, 745, DateTimeKind.Utc).AddTicks(5809));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 12, 14, 35, 17, 745, DateTimeKind.Utc).AddTicks(5809));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 12, 14, 35, 17, 745, DateTimeKind.Utc).AddTicks(5810));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 12, 14, 35, 17, 745, DateTimeKind.Utc).AddTicks(5811));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 12, 14, 35, 17, 745, DateTimeKind.Utc).AddTicks(5812));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 12, 14, 35, 17, 745, DateTimeKind.Utc).AddTicks(5813));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 10,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 12, 14, 35, 17, 745, DateTimeKind.Utc).AddTicks(5813));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 11,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 12, 14, 35, 17, 745, DateTimeKind.Utc).AddTicks(5814));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 12,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 12, 14, 35, 17, 745, DateTimeKind.Utc).AddTicks(5815));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 13,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 12, 14, 35, 17, 745, DateTimeKind.Utc).AddTicks(5815));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 14,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 12, 14, 35, 17, 745, DateTimeKind.Utc).AddTicks(5816));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 15,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 12, 14, 35, 17, 745, DateTimeKind.Utc).AddTicks(5817));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 16,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 12, 14, 35, 17, 745, DateTimeKind.Utc).AddTicks(5817));
        }
    }
}
