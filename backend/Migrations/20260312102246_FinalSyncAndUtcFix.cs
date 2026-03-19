using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class FinalSyncAndUtcFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "02174cf0-9412-4cfe-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "b2d897d9-6002-425c-8ad3-561202d9fc9d", new DateTime(2026, 3, 12, 9, 4, 46, 827, DateTimeKind.Utc).AddTicks(6368), "AQAAAAIAAYagAAAAEJB1oMxxSRJQIC+dC+1VP5JAvYW2P8eKiswd5upNLAP1W7zwvHT0jmn3N9idQluOvw==", "0a5a7b66-7bd2-4409-b9c9-b99443b873c1" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "040901f0-abcd-422c-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "85c2567b-7070-4778-b9f2-1ef6d74113c9", new DateTime(2026, 3, 12, 9, 4, 47, 29, DateTimeKind.Utc).AddTicks(22), "AQAAAAIAAYagAAAAEBhYNoQ+F5tXXEQ8KXvbHW7+M+op4CwPL6sUkIYfWJJJgas25OIvYzx8NpyOpp5wYw==", "2400f543-f51b-4fad-8249-142b6db2ef5b" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "341743f0-abcd-422c-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "af7ae6e6-b6ce-418f-94fa-e16bf7fab4d2", new DateTime(2026, 3, 12, 9, 4, 46, 922, DateTimeKind.Utc).AddTicks(9247), "AQAAAAIAAYagAAAAEFHoThctA0pSvSjdvm/lbLEiFvSRIpL2VCz9f1wstkmV3aBRlbzBkBZ+Ch4Dkw3VbQ==", "dd58c5b3-0d5a-41e2-8ce2-3382acb99c91" });

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 12, 9, 4, 47, 128, DateTimeKind.Utc).AddTicks(1398));

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 12, 9, 4, 47, 128, DateTimeKind.Utc).AddTicks(1437));

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 12, 9, 4, 47, 128, DateTimeKind.Utc).AddTicks(1443));

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 12, 9, 4, 47, 128, DateTimeKind.Utc).AddTicks(1448));

            migrationBuilder.UpdateData(
                table: "Patients",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 12, 9, 4, 47, 124, DateTimeKind.Utc).AddTicks(6954));
        }
    }
}
