using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class RenamePatientMedicalReportUrlToProfileImage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "MedicalReportUrl",
                table: "Patients",
                newName: "ProfileImageUrl");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ProfileImageUrl",
                table: "Patients",
                newName: "MedicalReportUrl");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "02174cf0-9412-4cfe-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "7ac59873-b399-4fe5-ad73-482ecc91089c", new DateTime(2026, 4, 1, 11, 12, 27, 656, DateTimeKind.Utc).AddTicks(6210), "AQAAAAIAAYagAAAAEOtbQZkMo8xOA3rgkbxPFOtg1l2rPA3LOB1tJFEG+C29uRndBAcP5iQLWY3o+cQf/w==", "34f654a0-7755-437d-8c80-a707fe762904" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "040901f0-abcd-422c-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "3d0ba512-b627-45d2-82c5-6ca1eddb9d6d", new DateTime(2026, 4, 1, 11, 12, 27, 735, DateTimeKind.Utc).AddTicks(6990), "AQAAAAIAAYagAAAAEM8sTNWtgT0JOySViRYb4UJYxq0ROyQvV4BjfWndMikQmoYMV2JC93Ct9lqAKbH/bQ==", "ac8f4e9a-9320-437e-a87a-b15bc53f73af" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "341743f0-abcd-422c-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "ed70c71b-5810-4ca1-80f2-3058d55717ef", new DateTime(2026, 4, 1, 11, 12, 27, 695, DateTimeKind.Utc).AddTicks(6060), "AQAAAAIAAYagAAAAEJhsUwVCKvtD0NeDWA0B6PsAmBMKdgL29dPiNFnP0a98QddenKIO0/pwgnWCp+L7IQ==", "7baaa677-7b94-4d93-a9e9-c85f6548aa57" });

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "LeaveDates" },
                values: new object[] { new DateTime(2026, 4, 1, 11, 12, 27, 774, DateTimeKind.Utc).AddTicks(1120), new List<DateTime>() });

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "LeaveDates" },
                values: new object[] { new DateTime(2026, 4, 1, 11, 12, 27, 774, DateTimeKind.Utc).AddTicks(1130), new List<DateTime>() });

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "LeaveDates" },
                values: new object[] { new DateTime(2026, 4, 1, 11, 12, 27, 774, DateTimeKind.Utc).AddTicks(1130), new List<DateTime>() });

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "LeaveDates" },
                values: new object[] { new DateTime(2026, 4, 1, 11, 12, 27, 774, DateTimeKind.Utc).AddTicks(1130), new List<DateTime>() });

            migrationBuilder.UpdateData(
                table: "Patients",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 1, 11, 12, 27, 773, DateTimeKind.Utc).AddTicks(4700));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 1, 11, 12, 27, 774, DateTimeKind.Utc).AddTicks(1040));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 1, 11, 12, 27, 774, DateTimeKind.Utc).AddTicks(1040));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 1, 11, 12, 27, 774, DateTimeKind.Utc).AddTicks(1050));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 1, 11, 12, 27, 774, DateTimeKind.Utc).AddTicks(1050));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 1, 11, 12, 27, 774, DateTimeKind.Utc).AddTicks(1050));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 1, 11, 12, 27, 774, DateTimeKind.Utc).AddTicks(1050));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 1, 11, 12, 27, 774, DateTimeKind.Utc).AddTicks(1050));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 1, 11, 12, 27, 774, DateTimeKind.Utc).AddTicks(1080));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 1, 11, 12, 27, 774, DateTimeKind.Utc).AddTicks(1080));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 10,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 1, 11, 12, 27, 774, DateTimeKind.Utc).AddTicks(1090));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 11,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 1, 11, 12, 27, 774, DateTimeKind.Utc).AddTicks(1090));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 12,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 1, 11, 12, 27, 774, DateTimeKind.Utc).AddTicks(1090));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 13,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 1, 11, 12, 27, 774, DateTimeKind.Utc).AddTicks(1090));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 14,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 1, 11, 12, 27, 774, DateTimeKind.Utc).AddTicks(1090));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 15,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 1, 11, 12, 27, 774, DateTimeKind.Utc).AddTicks(1090));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 16,
                column: "CreatedAt",
                value: new DateTime(2026, 4, 1, 11, 12, 27, 774, DateTimeKind.Utc).AddTicks(1090));
        }
    }
}
