using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddDoctorLeaveDates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<List<DateTime>>(
                name: "LeaveDates",
                table: "Doctors",
                type: "timestamp without time zone[]",
                nullable: false,
                defaultValue: new List<DateTime>());

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LeaveDates",
                table: "Doctors");

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
                column: "CreatedAt",
                value: new DateTime(2026, 3, 29, 14, 25, 36, 442, DateTimeKind.Utc).AddTicks(6930));

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 29, 14, 25, 36, 442, DateTimeKind.Utc).AddTicks(6940));

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 29, 14, 25, 36, 442, DateTimeKind.Utc).AddTicks(6950));

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 29, 14, 25, 36, 442, DateTimeKind.Utc).AddTicks(6950));

            migrationBuilder.UpdateData(
                table: "Patients",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 29, 14, 25, 36, 442, DateTimeKind.Utc).AddTicks(1700));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 29, 14, 25, 36, 442, DateTimeKind.Utc).AddTicks(6900));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 29, 14, 25, 36, 442, DateTimeKind.Utc).AddTicks(6900));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 29, 14, 25, 36, 442, DateTimeKind.Utc).AddTicks(6900));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 29, 14, 25, 36, 442, DateTimeKind.Utc).AddTicks(6900));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 29, 14, 25, 36, 442, DateTimeKind.Utc).AddTicks(6900));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 29, 14, 25, 36, 442, DateTimeKind.Utc).AddTicks(6900));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 29, 14, 25, 36, 442, DateTimeKind.Utc).AddTicks(6900));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 29, 14, 25, 36, 442, DateTimeKind.Utc).AddTicks(6900));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 29, 14, 25, 36, 442, DateTimeKind.Utc).AddTicks(6900));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 10,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 29, 14, 25, 36, 442, DateTimeKind.Utc).AddTicks(6900));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 11,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 29, 14, 25, 36, 442, DateTimeKind.Utc).AddTicks(6900));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 12,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 29, 14, 25, 36, 442, DateTimeKind.Utc).AddTicks(6910));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 13,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 29, 14, 25, 36, 442, DateTimeKind.Utc).AddTicks(6910));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 14,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 29, 14, 25, 36, 442, DateTimeKind.Utc).AddTicks(6910));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 15,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 29, 14, 25, 36, 442, DateTimeKind.Utc).AddTicks(6910));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 16,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 29, 14, 25, 36, 442, DateTimeKind.Utc).AddTicks(6910));
        }
    }
}
