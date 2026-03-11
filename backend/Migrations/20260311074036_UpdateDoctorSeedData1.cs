using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDoctorSeedData1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "02174cf0-9412-4cfe-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "ffa1ee89-101f-4730-bbe0-fb653a49ce12", new DateTime(2026, 3, 11, 7, 40, 34, 680, DateTimeKind.Utc).AddTicks(2030), "AQAAAAIAAYagAAAAED8bIG+cx7K4aLJaKb6qSgl0fg8jUrb/Rcql15IZoWvWAb3c2qrfVl0MyrftmUrObA==", "79cee205-1270-4b72-8e09-347830eb3c71" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "040901f0-abcd-422c-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "c7e20ba2-36e6-46e5-971b-20c0aa8fa683", new DateTime(2026, 3, 11, 7, 40, 34, 889, DateTimeKind.Utc).AddTicks(7123), "AQAAAAIAAYagAAAAEIKxZTpampV8+u33VfyaftxRO+58JM2LVa/R+LXcbaRruS1JglDIBVTITVZpJcRbjw==", "443d1bd2-01b9-4a9b-b40f-e6300fa671c2" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "341743f0-abcd-422c-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "03b60ff4-35f6-4275-8fdb-19f22f8c8ca2", new DateTime(2026, 3, 11, 7, 40, 34, 783, DateTimeKind.Utc).AddTicks(9325), "AQAAAAIAAYagAAAAEIu6f+AC74VcTdhEWTnF8RRybZvqoSdrBtsGcHnm/QJOBf5CP3D2rzXrjFQ9QpkNgQ==", "34ed2eca-394f-41b8-bb06-3aecf5b7d919" });

            migrationBuilder.InsertData(
                table: "DoctorSchedules",
                columns: new[] { "Id", "DayOfWeek", "DoctorId", "EndTime", "IsActive", "SlotDurationMinutes", "StartTime" },
                values: new object[,]
                {
                    { 17, 1, 4, "18:00", true, 30, "10:00" },
                    { 18, 2, 4, "18:00", true, 30, "10:00" },
                    { 19, 3, 4, "18:00", true, 30, "10:00" },
                    { 20, 4, 4, "18:00", true, 30, "10:00" },
                    { 21, 5, 4, "18:00", true, 30, "10:00" }
                });

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 11, 7, 40, 34, 992, DateTimeKind.Utc).AddTicks(184));

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 11, 7, 40, 34, 992, DateTimeKind.Utc).AddTicks(229));

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 11, 7, 40, 34, 992, DateTimeKind.Utc).AddTicks(235));

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 11, 7, 40, 34, 992, DateTimeKind.Utc).AddTicks(240));

            migrationBuilder.UpdateData(
                table: "Patients",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 11, 7, 40, 34, 989, DateTimeKind.Utc).AddTicks(6270));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "DoctorSchedules",
                keyColumn: "Id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "DoctorSchedules",
                keyColumn: "Id",
                keyValue: 18);

            migrationBuilder.DeleteData(
                table: "DoctorSchedules",
                keyColumn: "Id",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "DoctorSchedules",
                keyColumn: "Id",
                keyValue: 20);

            migrationBuilder.DeleteData(
                table: "DoctorSchedules",
                keyColumn: "Id",
                keyValue: 21);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "02174cf0-9412-4cfe-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "cc729140-a10f-48eb-9071-397255706b04", new DateTime(2026, 3, 11, 7, 38, 19, 102, DateTimeKind.Utc).AddTicks(5766), "AQAAAAIAAYagAAAAEMNIzfqpO2ufYqYyKnn4OJecoYZGWidmxLafkg5G2WnW3La1YJHfZHlIzS6wlbPq6Q==", "b3185cb2-0fd6-4aff-8bcc-41ad5d84db52" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "040901f0-abcd-422c-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "bcd02240-1ba9-47a5-bbe6-1dcbf0c218e2", new DateTime(2026, 3, 11, 7, 38, 19, 298, DateTimeKind.Utc).AddTicks(4368), "AQAAAAIAAYagAAAAEHS9xsaCjOoKQlGY1CkmrJk5n94V2U0glUw5lHkiYRcOA6xe9TZBbcp0mFFpadfrhw==", "a4937f2e-5cd0-4be5-9a01-7d9217f823b0" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "341743f0-abcd-422c-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "fe3d3343-614e-4666-b0d6-e7db0df5b0b0", new DateTime(2026, 3, 11, 7, 38, 19, 200, DateTimeKind.Utc).AddTicks(6593), "AQAAAAIAAYagAAAAEIG3B1omj0qRMPMQHfjqYBo9zRA/AwJDuRcaGdvUnLdP1ynFkOrkwKGrHh+expG0/A==", "cc3407b1-8b01-4015-aaf2-387f0067b9b4" });

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 11, 7, 38, 19, 398, DateTimeKind.Utc).AddTicks(3945));

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 11, 7, 38, 19, 398, DateTimeKind.Utc).AddTicks(3991));

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 11, 7, 38, 19, 398, DateTimeKind.Utc).AddTicks(3996));

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 11, 7, 38, 19, 398, DateTimeKind.Utc).AddTicks(4000));

            migrationBuilder.UpdateData(
                table: "Patients",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 11, 7, 38, 19, 396, DateTimeKind.Utc).AddTicks(83));
        }
    }
}
