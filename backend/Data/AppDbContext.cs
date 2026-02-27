using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using backend.Models;

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

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

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
                    IsAvailable = true
                },
                new Doctor
                {
                    Id = 2,
                    FullName = "Dr. Michael Chen",
                    Specialty = "General Practice",
                    Email = "michael.chen@medibook.com",
                    Phone = "012-9876543",
                    Description = "General practitioner with focus on preventive care",
                    IsAvailable = true
                },
                new Doctor
                {
                    Id = 3,
                    FullName = "Dr. Aisha Rahman",
                    Specialty = "Dermatology",
                    Email = "aisha.rahman@medibook.com",
                    Phone = "011-2345678",
                    Description = "Skin specialist with expertise in cosmetic dermatology",
                    IsAvailable = true
                }
            );
        }
    }
}