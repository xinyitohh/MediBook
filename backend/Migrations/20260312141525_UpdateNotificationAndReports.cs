using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateNotificationAndReports : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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
    }
}
