using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "02174cf0-9412-4cfe-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "306c022a-fa15-4125-b358-166a303237ec", new DateTime(2026, 5, 9, 6, 6, 45, 638, DateTimeKind.Utc).AddTicks(2004), "AQAAAAIAAYagAAAAECGCljlGOjgHg4pWstevnS4VKAgikbjXPh/mZ85FzVsMpmV8ypTQmilZn+lMxmjSJg==", "130642a5-f6ee-4074-83bb-7bffc9bbbedd" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "040901f0-abcd-422c-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "6aba02e4-eee6-4d97-9e5b-de750fc99e2c", new DateTime(2026, 5, 9, 6, 6, 45, 833, DateTimeKind.Utc).AddTicks(7294), "AQAAAAIAAYagAAAAEMCi/OO9UIVfkMic1+OeNe4c120U+9hYJkUva83crVGRCNY3kjKjN36O0zwWKbOqmw==", "25efdaf5-b6af-47aa-bf48-a5253b1a01dd" });

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "341743f0-abcd-422c-afbf-59f706d72cf6",
                columns: new[] { "ConcurrencyStamp", "CreatedAt", "PasswordHash", "SecurityStamp" },
                values: new object[] { "4d6fffe0-9979-41a7-a7b4-30fecae81b0b", new DateTime(2026, 5, 9, 6, 6, 45, 737, DateTimeKind.Utc).AddTicks(4506), "AQAAAAIAAYagAAAAEJtWuy6tG0ncW+ifNNsdgCr0fpARz/dKQv0ooKjyms/PNulB8AgicXKzXkwDkrpD/A==", "fbc7c27a-e7f9-4945-b764-a9433074503c" });

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "LeaveDates" },
                values: new object[] { new DateTime(2026, 5, 9, 6, 6, 45, 932, DateTimeKind.Utc).AddTicks(5418), new List<DateTime>() });

            migrationBuilder.UpdateData(
                table: "Patients",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 9, 6, 6, 45, 929, DateTimeKind.Utc).AddTicks(5591));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 9, 6, 6, 45, 932, DateTimeKind.Utc).AddTicks(5207));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 9, 6, 6, 45, 932, DateTimeKind.Utc).AddTicks(5290));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 3,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 9, 6, 6, 45, 932, DateTimeKind.Utc).AddTicks(5292));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 4,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 9, 6, 6, 45, 932, DateTimeKind.Utc).AddTicks(5294));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 5,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 9, 6, 6, 45, 932, DateTimeKind.Utc).AddTicks(5296));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 6,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 9, 6, 6, 45, 932, DateTimeKind.Utc).AddTicks(5298));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 7,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 9, 6, 6, 45, 932, DateTimeKind.Utc).AddTicks(5299));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 8,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 9, 6, 6, 45, 932, DateTimeKind.Utc).AddTicks(5301));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 9,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 9, 6, 6, 45, 932, DateTimeKind.Utc).AddTicks(5302));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 10,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 9, 6, 6, 45, 932, DateTimeKind.Utc).AddTicks(5304));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 11,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 9, 6, 6, 45, 932, DateTimeKind.Utc).AddTicks(5306));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 12,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 9, 6, 6, 45, 932, DateTimeKind.Utc).AddTicks(5307));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 13,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 9, 6, 6, 45, 932, DateTimeKind.Utc).AddTicks(5309));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 14,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 9, 6, 6, 45, 932, DateTimeKind.Utc).AddTicks(5310));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 15,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 9, 6, 6, 45, 932, DateTimeKind.Utc).AddTicks(5312));

            migrationBuilder.UpdateData(
                table: "Specialties",
                keyColumn: "Id",
                keyValue: 16,
                column: "CreatedAt",
                value: new DateTime(2026, 5, 9, 6, 6, 45, 932, DateTimeKind.Utc).AddTicks(5313));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
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
                keyValue: 4,
                columns: new[] { "CreatedAt", "LeaveDates" },
                values: new object[] { new DateTime(2026, 5, 8, 10, 50, 57, 438, DateTimeKind.Utc).AddTicks(7625), new List<DateTime>() });

            migrationBuilder.InsertData(
                table: "Doctors",
                columns: new[] { "Id", "ConsultationFee", "CreatedAt", "DateOfBirth", "Description", "Email", "Experience", "FullName", "Gender", "IsAvailable", "Languages", "LeaveDates", "Phone", "ProfileImageUrl", "Qualifications", "Rating", "ReviewCount", "SpecialtyId", "UserId" },
                values: new object[,]
                {
                    { 1, 200m, new DateTime(2026, 5, 8, 10, 50, 57, 438, DateTimeKind.Utc).AddTicks(7593), "", "Specialist in heart diseases with 10 years experience", "sarah.johnson@medibook.com", "10 years", "Dr. Sarah Johnson", "", true, "", new List<DateTime>(), "012-3456789", "", "", 4.9000000000000004, 312, 1, "" },
                    { 2, 85m, new DateTime(2026, 5, 8, 10, 50, 57, 438, DateTimeKind.Utc).AddTicks(7613), "", "General practitioner with focus on preventive care", "michael.chen@medibook.com", "15 years", "Dr. Michael Chen", "", true, "", new List<DateTime>(), "012-9876543", "", "", 4.7999999999999998, 187, 5, "" },
                    { 3, 150m, new DateTime(2026, 5, 8, 10, 50, 57, 438, DateTimeKind.Utc).AddTicks(7619), "", "Skin specialist with expertise in cosmetic dermatology", "aisha.rahman@medibook.com", "10 years", "Dr. Aisha Rahman", "", true, "", new List<DateTime>(), "011-2345678", "", "", 4.7000000000000002, 156, 2, "" }
                });

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
    }
}
