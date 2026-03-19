using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddNewModelsAndRelationships : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "DoctorSchedules",
                keyColumn: "Id",
                keyValue: 21);

            migrationBuilder.AddColumn<string>(
                name: "Allergies",
                table: "Patients",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "BloodType",
                table: "Patients",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ChronicConditions",
                table: "Patients",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "EmergencyContactName",
                table: "Patients",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "EmergencyContactPhone",
                table: "Patients",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Languages",
                table: "Doctors",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Qualifications",
                table: "Doctors",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "AppointmentType",
                table: "Appointments",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CancellationReason",
                table: "Appointments",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "Announcements",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Content = table.Column<string>(type: "text", nullable: false),
                    CreatedByUserId = table.Column<string>(type: "text", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Announcements", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "HealthQuestionnaires",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AppointmentId = table.Column<int>(type: "integer", nullable: false),
                    PatientId = table.Column<int>(type: "integer", nullable: false),
                    ChiefComplaint = table.Column<string>(type: "text", nullable: false),
                    SymptomDuration = table.Column<string>(type: "text", nullable: false),
                    SeverityLevel = table.Column<int>(type: "integer", nullable: false),
                    CurrentMedications = table.Column<string>(type: "text", nullable: false),
                    Allergies = table.Column<string>(type: "text", nullable: false),
                    AdditionalNotes = table.Column<string>(type: "text", nullable: false),
                    SubmittedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HealthQuestionnaires", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HealthQuestionnaires_Appointments_AppointmentId",
                        column: x => x.AppointmentId,
                        principalTable: "Appointments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_HealthQuestionnaires_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Notifications",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Message = table.Column<string>(type: "text", nullable: false),
                    Type = table.Column<string>(type: "text", nullable: false),
                    IsRead = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Notifications_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ReportAnalyses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MedicalReportId = table.Column<int>(type: "integer", nullable: false),
                    Summary = table.Column<string>(type: "text", nullable: false),
                    AbnormalFindings = table.Column<string>(type: "text", nullable: false),
                    NormalFindings = table.Column<string>(type: "text", nullable: false),
                    Recommendations = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    AnalyzedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ReportAnalyses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ReportAnalyses_MedicalReports_MedicalReportId",
                        column: x => x.MedicalReportId,
                        principalTable: "MedicalReports",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Reviews",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PatientId = table.Column<int>(type: "integer", nullable: false),
                    DoctorId = table.Column<int>(type: "integer", nullable: false),
                    AppointmentId = table.Column<int>(type: "integer", nullable: false),
                    Rating = table.Column<int>(type: "integer", nullable: false),
                    Comment = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reviews", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Reviews_Appointments_AppointmentId",
                        column: x => x.AppointmentId,
                        principalTable: "Appointments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Reviews_Doctors_DoctorId",
                        column: x => x.DoctorId,
                        principalTable: "Doctors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Reviews_Patients_PatientId",
                        column: x => x.PatientId,
                        principalTable: "Patients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

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
                table: "DoctorSchedules",
                keyColumn: "Id",
                keyValue: 11,
                columns: new[] { "DayOfWeek", "DoctorId", "EndTime", "StartTime" },
                values: new object[] { 1, 3, "18:00", "10:00" });

            migrationBuilder.UpdateData(
                table: "DoctorSchedules",
                keyColumn: "Id",
                keyValue: 12,
                column: "DayOfWeek",
                value: 2);

            migrationBuilder.UpdateData(
                table: "DoctorSchedules",
                keyColumn: "Id",
                keyValue: 13,
                column: "DayOfWeek",
                value: 3);

            migrationBuilder.UpdateData(
                table: "DoctorSchedules",
                keyColumn: "Id",
                keyValue: 14,
                column: "DayOfWeek",
                value: 4);

            migrationBuilder.UpdateData(
                table: "DoctorSchedules",
                keyColumn: "Id",
                keyValue: 15,
                column: "DayOfWeek",
                value: 5);

            migrationBuilder.UpdateData(
                table: "DoctorSchedules",
                keyColumn: "Id",
                keyValue: 16,
                columns: new[] { "DayOfWeek", "DoctorId" },
                values: new object[] { 1, 4 });

            migrationBuilder.UpdateData(
                table: "DoctorSchedules",
                keyColumn: "Id",
                keyValue: 17,
                column: "DayOfWeek",
                value: 2);

            migrationBuilder.UpdateData(
                table: "DoctorSchedules",
                keyColumn: "Id",
                keyValue: 18,
                column: "DayOfWeek",
                value: 3);

            migrationBuilder.UpdateData(
                table: "DoctorSchedules",
                keyColumn: "Id",
                keyValue: 19,
                column: "DayOfWeek",
                value: 4);

            migrationBuilder.UpdateData(
                table: "DoctorSchedules",
                keyColumn: "Id",
                keyValue: 20,
                column: "DayOfWeek",
                value: 5);

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "Languages", "Qualifications" },
                values: new object[] { new DateTime(2026, 3, 12, 9, 4, 47, 128, DateTimeKind.Utc).AddTicks(1398), "", "" });

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "Languages", "Qualifications" },
                values: new object[] { new DateTime(2026, 3, 12, 9, 4, 47, 128, DateTimeKind.Utc).AddTicks(1437), "", "" });

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "Languages", "Qualifications" },
                values: new object[] { new DateTime(2026, 3, 12, 9, 4, 47, 128, DateTimeKind.Utc).AddTicks(1443), "", "" });

            migrationBuilder.UpdateData(
                table: "Doctors",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "Languages", "Qualifications" },
                values: new object[] { new DateTime(2026, 3, 12, 9, 4, 47, 128, DateTimeKind.Utc).AddTicks(1448), "", "" });

            migrationBuilder.UpdateData(
                table: "Patients",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Allergies", "BloodType", "ChronicConditions", "CreatedAt", "EmergencyContactName", "EmergencyContactPhone", "FullName" },
                values: new object[] { "", "", "", new DateTime(2026, 3, 12, 9, 4, 47, 124, DateTimeKind.Utc).AddTicks(6954), "", "", "Patient 1" });

            migrationBuilder.CreateIndex(
                name: "IX_HealthQuestionnaires_AppointmentId",
                table: "HealthQuestionnaires",
                column: "AppointmentId");

            migrationBuilder.CreateIndex(
                name: "IX_HealthQuestionnaires_PatientId",
                table: "HealthQuestionnaires",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_UserId",
                table: "Notifications",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ReportAnalyses_MedicalReportId",
                table: "ReportAnalyses",
                column: "MedicalReportId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_AppointmentId",
                table: "Reviews",
                column: "AppointmentId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_DoctorId",
                table: "Reviews",
                column: "DoctorId");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_PatientId",
                table: "Reviews",
                column: "PatientId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Announcements");

            migrationBuilder.DropTable(
                name: "HealthQuestionnaires");

            migrationBuilder.DropTable(
                name: "Notifications");

            migrationBuilder.DropTable(
                name: "ReportAnalyses");

            migrationBuilder.DropTable(
                name: "Reviews");

            migrationBuilder.DropColumn(
                name: "Allergies",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "BloodType",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "ChronicConditions",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "EmergencyContactName",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "EmergencyContactPhone",
                table: "Patients");

            migrationBuilder.DropColumn(
                name: "Languages",
                table: "Doctors");

            migrationBuilder.DropColumn(
                name: "Qualifications",
                table: "Doctors");

            migrationBuilder.DropColumn(
                name: "AppointmentType",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "CancellationReason",
                table: "Appointments");

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

            migrationBuilder.UpdateData(
                table: "DoctorSchedules",
                keyColumn: "Id",
                keyValue: 11,
                columns: new[] { "DayOfWeek", "DoctorId", "EndTime", "StartTime" },
                values: new object[] { 6, 2, "16:00", "08:00" });

            migrationBuilder.UpdateData(
                table: "DoctorSchedules",
                keyColumn: "Id",
                keyValue: 12,
                column: "DayOfWeek",
                value: 1);

            migrationBuilder.UpdateData(
                table: "DoctorSchedules",
                keyColumn: "Id",
                keyValue: 13,
                column: "DayOfWeek",
                value: 2);

            migrationBuilder.UpdateData(
                table: "DoctorSchedules",
                keyColumn: "Id",
                keyValue: 14,
                column: "DayOfWeek",
                value: 3);

            migrationBuilder.UpdateData(
                table: "DoctorSchedules",
                keyColumn: "Id",
                keyValue: 15,
                column: "DayOfWeek",
                value: 4);

            migrationBuilder.UpdateData(
                table: "DoctorSchedules",
                keyColumn: "Id",
                keyValue: 16,
                columns: new[] { "DayOfWeek", "DoctorId" },
                values: new object[] { 5, 3 });

            migrationBuilder.UpdateData(
                table: "DoctorSchedules",
                keyColumn: "Id",
                keyValue: 17,
                column: "DayOfWeek",
                value: 1);

            migrationBuilder.UpdateData(
                table: "DoctorSchedules",
                keyColumn: "Id",
                keyValue: 18,
                column: "DayOfWeek",
                value: 2);

            migrationBuilder.UpdateData(
                table: "DoctorSchedules",
                keyColumn: "Id",
                keyValue: 19,
                column: "DayOfWeek",
                value: 3);

            migrationBuilder.UpdateData(
                table: "DoctorSchedules",
                keyColumn: "Id",
                keyValue: 20,
                column: "DayOfWeek",
                value: 4);

            migrationBuilder.InsertData(
                table: "DoctorSchedules",
                columns: new[] { "Id", "DayOfWeek", "DoctorId", "EndTime", "IsActive", "SlotDurationMinutes", "StartTime" },
                values: new object[] { 21, 5, 4, "18:00", true, 30, "10:00" });

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
                columns: new[] { "CreatedAt", "FullName" },
                values: new object[] { new DateTime(2026, 3, 11, 7, 40, 34, 989, DateTimeKind.Utc).AddTicks(6270), "Petient 1" });
        }
    }
}
