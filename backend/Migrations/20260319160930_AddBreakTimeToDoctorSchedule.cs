using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddBreakTimeToDoctorSchedule : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BreakEnd",
                table: "DoctorSchedules",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BreakStart",
                table: "DoctorSchedules",
                type: "text",
                nullable: true);

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
                table: "DoctorSchedules",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "BreakEnd", "BreakStart" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "DoctorSchedules",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "BreakEnd", "BreakStart" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "DoctorSchedules",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "BreakEnd", "BreakStart" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "DoctorSchedules",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "BreakEnd", "BreakStart" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "DoctorSchedules",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "BreakEnd", "BreakStart" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "DoctorSchedules",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "BreakEnd", "BreakStart" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "DoctorSchedules",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "BreakEnd", "BreakStart" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "DoctorSchedules",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "BreakEnd", "BreakStart" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "DoctorSchedules",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "BreakEnd", "BreakStart" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "DoctorSchedules",
                keyColumn: "Id",
                keyValue: 10,
                columns: new[] { "BreakEnd", "BreakStart" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "DoctorSchedules",
                keyColumn: "Id",
                keyValue: 11,
                columns: new[] { "BreakEnd", "BreakStart" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "DoctorSchedules",
                keyColumn: "Id",
                keyValue: 12,
                columns: new[] { "BreakEnd", "BreakStart" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "DoctorSchedules",
                keyColumn: "Id",
                keyValue: 13,
                columns: new[] { "BreakEnd", "BreakStart" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "DoctorSchedules",
                keyColumn: "Id",
                keyValue: 14,
                columns: new[] { "BreakEnd", "BreakStart" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "DoctorSchedules",
                keyColumn: "Id",
                keyValue: 15,
                columns: new[] { "BreakEnd", "BreakStart" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "DoctorSchedules",
                keyColumn: "Id",
                keyValue: 16,
                columns: new[] { "BreakEnd", "BreakStart" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "DoctorSchedules",
                keyColumn: "Id",
                keyValue: 17,
                columns: new[] { "BreakEnd", "BreakStart" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "DoctorSchedules",
                keyColumn: "Id",
                keyValue: 18,
                columns: new[] { "BreakEnd", "BreakStart" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "DoctorSchedules",
                keyColumn: "Id",
                keyValue: 19,
                columns: new[] { "BreakEnd", "BreakStart" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "DoctorSchedules",
                keyColumn: "Id",
                keyValue: 20,
                columns: new[] { "BreakEnd", "BreakStart" },
                values: new object[] { null, null });

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BreakEnd",
                table: "DoctorSchedules");

            migrationBuilder.DropColumn(
                name: "BreakStart",
                table: "DoctorSchedules");

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
    }
}
