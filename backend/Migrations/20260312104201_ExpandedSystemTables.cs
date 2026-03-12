using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class ExpandedSystemTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "02174cf0-9412-4cfe-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "4832c99b-b8ce-42f6-9d81-582b26ce28e6", new DateTime(2026, 3, 12, 10, 41, 59, 970, DateTimeKind.Utc).AddTicks(2922), "AQAAAAIAAYagAAAAEPFdtjVBQ49kErlCJApLLuPAOW5ZIWw2h0u5z/LzBiKqV2XjIkYjYAQz1UEYc1B2aQ==", "6fe4e22b-6415-4963-affa-1fbeea822719" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "040901f0-abcd-422c-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "afe72560-714a-43c1-85af-cfd0c66fab4f", new DateTime(2026, 3, 12, 10, 42, 0, 170, DateTimeKind.Utc).AddTicks(6103), "AQAAAAIAAYagAAAAEDFx3oAI1uk/OE0KO1Lqkov0T6YHmm2vygNBHHW5/6aIGSoyVhazwhWu5SwpJ6RTSg==", "3b9f0da4-bb3f-4628-b68a-966087b25602" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "341743f0-abcd-422c-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "26b37f0d-a27c-4169-9cc8-b47c5d661fdd", new DateTime(2026, 3, 12, 10, 42, 0, 68, DateTimeKind.Utc).AddTicks(3250), "AQAAAAIAAYagAAAAEJk+ZQqbJ84IdMvuSwVxPsEvk1kSzjEywxp97ze0kppq5aTlBe4WYNBX71sjfPSNYg==", "9ce2fe70-466f-4ed5-aa26-8340c613cfba" });

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 12, 10, 42, 0, 272, DateTimeKind.Utc).AddTicks(6425));

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 12, 10, 42, 0, 272, DateTimeKind.Utc).AddTicks(6468));

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 12, 10, 42, 0, 272, DateTimeKind.Utc).AddTicks(6474));

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 12, 10, 42, 0, 272, DateTimeKind.Utc).AddTicks(6478));

            migrationBuilder.UpdateData(
                table: "Patients",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 12, 10, 42, 0, 269, DateTimeKind.Utc).AddTicks(2543));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "02174cf0-9412-4cfe-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "9dabc86b-e8e7-4928-a31d-065ead6bc74a", new DateTime(2026, 3, 12, 10, 22, 45, 461, DateTimeKind.Utc).AddTicks(7449), "AQAAAAIAAYagAAAAEHO0b0pD0bXNp5V757Th7e/hpBW9pa7Q4f0HWC7s9cvjcaJclfsw5dSOajdmboP1jg==", "fb75955f-0260-4d0a-ad48-2fe9b0eff45f" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "040901f0-abcd-422c-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "27ba9664-ebcb-4813-8faa-0ffc5007ec96", new DateTime(2026, 3, 12, 10, 22, 45, 654, DateTimeKind.Utc).AddTicks(5490), "AQAAAAIAAYagAAAAEDDZ1sRYXkW3fPfCwp80hWkmG1fF9bw02WRBYiHyVoBp3EwbzFZmWpg7ufnpq2f1Fg==", "449580e7-598e-4e9f-8af2-957e9c4366c7" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "341743f0-abcd-422c-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "be024059-6a71-49d1-831f-8bb706398d4f", new DateTime(2026, 3, 12, 10, 22, 45, 557, DateTimeKind.Utc).AddTicks(8904), "AQAAAAIAAYagAAAAEIVVumlLTwtU6ZWruELj+CBjzetzCDPSSUixqY16yIhQLw4rF0Xy5nSHipbgEni3TQ==", "82502787-949c-4af4-91fe-cabb03ac75a5" });

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 12, 10, 22, 45, 752, DateTimeKind.Utc).AddTicks(7415));

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 12, 10, 22, 45, 752, DateTimeKind.Utc).AddTicks(7441));

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 12, 10, 22, 45, 752, DateTimeKind.Utc).AddTicks(7446));

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 12, 10, 22, 45, 752, DateTimeKind.Utc).AddTicks(7451));

            migrationBuilder.UpdateData(
                table: "Patients",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 12, 10, 22, 45, 749, DateTimeKind.Utc).AddTicks(9021));
        }
    }
}
