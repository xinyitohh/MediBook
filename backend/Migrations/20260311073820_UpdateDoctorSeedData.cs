using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDoctorSeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "Patients",
                type: "timestamp without time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AlterColumn<DateTime>(
                name: "UploadedAt",
                table: "MedicalReports",
                type: "timestamp without time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "Doctors",
                type: "timestamp without time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "AspNetUsers",
                type: "timestamp without time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "Appointments",
                type: "timestamp without time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

            migrationBuilder.AlterColumn<DateTime>(
                name: "AppointmentDate",
                table: "Appointments",
                type: "timestamp without time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp with time zone");

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

            migrationBuilder.InsertData(
                table: "Doctors",
                columns: new[] { "Id", "ConsultationFee", "CreatedAt", "DateOfBirth", "Description", "Email", "Experience", "FullName", "Gender", "IsAvailable", "Phone", "ProfileImageUrl", "Rating", "ReviewCount", "Specialty", "UserId" },
                values: new object[] { 4, 50m, new DateTime(2026, 3, 11, 7, 38, 19, 398, DateTimeKind.Utc).AddTicks(4000), "", "Demo doctor account.", "doctor@2.com", "1 year", "Doctor 1", "", true, "011-9999999", "", 0.0, 0, "General Practice", "040901f0-abcd-422c-afbf-59f706d72cf6" });

            migrationBuilder.UpdateData(
                table: "Patients",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 3, 11, 7, 38, 19, 396, DateTimeKind.Utc).AddTicks(83));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "Patients",
                type: "timestamp with time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp without time zone");

            migrationBuilder.AlterColumn<DateTime>(
                name: "UploadedAt",
                table: "MedicalReports",
                type: "timestamp with time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp without time zone");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "Doctors",
                type: "timestamp with time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp without time zone");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "AspNetUsers",
                type: "timestamp with time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp without time zone");

            migrationBuilder.AlterColumn<DateTime>(
                name: "CreatedAt",
                table: "Appointments",
                type: "timestamp with time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp without time zone");

            migrationBuilder.AlterColumn<DateTime>(
                name: "AppointmentDate",
                table: "Appointments",
                type: "timestamp with time zone",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "timestamp without time zone");

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
        }
    }
}
