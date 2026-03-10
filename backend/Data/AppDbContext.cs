using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using backend.Models;
using Microsoft.AspNetCore.Identity;

namespace backend.Data
{
    public class AppDbContext : IdentityDbContext<User>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<MedicalReport> MedicalReports { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // 1. Define GUIDs for Roles and Users
            string ADMIN_ID = "02174cf0-9412-4cfe-afbf-59f706d72cf6";
            string PATIENT_USER_ID = "341743f0-abcd-422c-afbf-59f706d72cf6";
            string DOCTOR_USER_ID = "040901f0-abcd-422c-afbf-59f706d72cf6";
            string ADMIN_ROLE_ID = "341743f0-dead-422c-afbf-59f706d72cf6";
            string PATIENT_ROLE_ID = "7d9b7113-a8f8-4035-99a7-a20dd400f6a3";
            string DOCTOR_ROLE_ID = "7d9b7113-a8f8-1767-99a7-a20dd400f6a3";

            // 2. Seed Roles
            builder.Entity<IdentityRole>().HasData(
                new IdentityRole { Id = ADMIN_ROLE_ID, Name = "Admin", NormalizedName = "ADMIN" },
                new IdentityRole { Id = PATIENT_ROLE_ID, Name = "Patient", NormalizedName = "PATIENT" },
                new IdentityRole { Id = DOCTOR_ROLE_ID, Name = "Doctor", NormalizedName = "DOCTOR" }
            );

            // 3. Setup Password Hasher
            var hasher = new PasswordHasher<User>();

            // 4. Seed Admin User
            builder.Entity<User>().HasData(new User
            {
                Id = ADMIN_ID,
                UserName = "admin@2.com",
                NormalizedUserName = "ADMIN@2.COM",
                Email = "admin@2.com",
                NormalizedEmail = "ADMIN@2.COM",
                EmailConfirmed = true,
                PasswordHash = hasher.HashPassword(null, "1"),
                FullName = "Admin 1",
                Role = "Admin"
            });

            // 5. Seed Patient User
            builder.Entity<User>().HasData(new User
            {
                Id = PATIENT_USER_ID,
                UserName = "patient@2.com",
                NormalizedUserName = "PATIENT@2.COM",
                Email = "patient@2.com",
                NormalizedEmail = "PATIENT@2.COM",
                EmailConfirmed = true,
                PasswordHash = hasher.HashPassword(null, "1"),
                FullName = "Patient 1",
                Role = "Patient"
            });

            builder.Entity<User>().HasData(new User
            {
                Id = DOCTOR_USER_ID,
                UserName = "doctor@2.com",
                NormalizedUserName = "DOCTOR@2.COM",
                Email = "doctor@2.com",
                NormalizedEmail = "DOCTOR@2.COM",
                EmailConfirmed = true,
                PasswordHash = hasher.HashPassword(null, "1"),
                FullName = "Doctor 1",
                Role = "Doctor"
            });

            // 6. Assign Roles to Users
            builder.Entity<IdentityUserRole<string>>().HasData(
                new IdentityUserRole<string> { RoleId = ADMIN_ROLE_ID, UserId = ADMIN_ID },
                new IdentityUserRole<string> { RoleId = PATIENT_ROLE_ID, UserId = PATIENT_USER_ID },
                new IdentityUserRole<string> { RoleId = DOCTOR_ROLE_ID, UserId = DOCTOR_USER_ID }
            );

            // 7. Seed the Patient Profile (Medical Record) linked to the Patient User
            builder.Entity<Patient>().HasData(new Patient
            {
                Id = 1,
                UserId = PATIENT_USER_ID,
                FullName = "Petient 1",
                Email = "patient@2.com",
                Phone = "012-3456789",
                Address = "Bukit Jalil, KL",
                Gender = "Female",
                DateOfBirth = "1998-09-24"
            });

            // Appointment → Doctor relationship
            builder.Entity<Appointment>()
                .HasOne(a => a.Doctor)
                .WithMany(d => d.Appointments)
                .HasForeignKey(a => a.DoctorId)
                .OnDelete(DeleteBehavior.Restrict);

            // Appointment → Patient relationship
            builder.Entity<Appointment>()
                .HasOne(a => a.Patient)
                .WithMany(p => p.Appointments)
                .HasForeignKey(a => a.PatientId)
                .OnDelete(DeleteBehavior.Restrict);

            // MedicalReport → Patient relationship
            builder.Entity<MedicalReport>()
                .HasOne(r => r.Patient)
                .WithMany()
                .HasForeignKey(r => r.PatientId)
                .OnDelete(DeleteBehavior.Restrict);

            // MedicalReport → Appointment relationship (optional)
            builder.Entity<MedicalReport>()
                .HasOne(r => r.Appointment)
                .WithMany()
                .HasForeignKey(r => r.AppointmentId)
                .OnDelete(DeleteBehavior.SetNull);

            // Seed some doctors for demo
            builder.Entity<Doctor>().HasData(
                new Doctor
                {
                    Id = 1,
                    FullName = "Dr. Sarah Johnson",
                    Specialty = "Cardiology",
                    Email = "sarah.johnson@medibook.com",
                    Phone = "012-3456789",
                    Description = "Specialist in heart diseases with 10 years experience",
                    IsAvailable = true,
                    Rating = 4.9,
                    ReviewCount = 312,
                    ConsultationFee = 200,
                    Experience = "10 years"
                },
                new Doctor
                {
                    Id = 2,
                    FullName = "Dr. Michael Chen",
                    Specialty = "General Practice",
                    Email = "michael.chen@medibook.com",
                    Phone = "012-9876543",
                    Description = "General practitioner with focus on preventive care",
                    IsAvailable = true,
                    Rating = 4.8,
                    ReviewCount = 187,
                    ConsultationFee = 85,
                    Experience = "15 years"
                },
                new Doctor
                {
                    Id = 3,
                    FullName = "Dr. Aisha Rahman",
                    Specialty = "Dermatology",
                    Email = "aisha.rahman@medibook.com",
                    Phone = "011-2345678",
                    Description = "Skin specialist with expertise in cosmetic dermatology",
                    IsAvailable = true,
                    Rating = 4.7,
                    ReviewCount = 156,
                    ConsultationFee = 150,
                    Experience = "10 years"
                }
            );
        }
    }
}
