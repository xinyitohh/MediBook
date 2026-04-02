using backend.Models;
using backend.DTOs;
using System.Text.Json;
using AutoMapper;

namespace backend.Profiles
{
    public class MappingProfile : AutoMapper.Profile
    {
        public MappingProfile()
        {
            // --- AUTH MAPPINGS ---
            // These allow the AuthController to create User objects from registration DTOs
            CreateMap<RegisterDto, User>();
            CreateMap<AdminRegisterDto, User>();
            CreateMap<User, AuthResponseDto>();

            // --- APPOINTMENT MAPPINGS ---
            CreateMap<Appointment, AppointmentResponseDto>()
                .ForMember(dest => dest.Doctor, opt => opt.MapFrom(src => src.Doctor.FullName))
                .ForMember(dest => dest.Specialty, opt => opt.MapFrom(src => src.Doctor.Specialty != null ? src.Doctor.Specialty.Name : ""))
                .ForMember(dest => dest.Patient, opt => opt.MapFrom(src => src.Patient.FullName))
                .ForMember(dest => dest.Date, opt => opt.MapFrom(src => src.AppointmentDate.ToString("yyyy-MM-dd")))
                .ForMember(dest => dest.Time, opt => opt.MapFrom(src => src.TimeSlot))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt))
                .ForMember(dest => dest.CancellationReason, opt => opt.MapFrom(src => src.CancellationReason ?? ""))
                .ForMember(dest => dest.Duration, opt => opt.MapFrom(src => 
                    src.Doctor.Schedules.Where(s => s.DayOfWeek == (int)src.AppointmentDate.DayOfWeek).Select(s => s.SlotDurationMinutes).FirstOrDefault() == 0 ? 30 : src.Doctor.Schedules.Where(s => s.DayOfWeek == (int)src.AppointmentDate.DayOfWeek).Select(s => s.SlotDurationMinutes).FirstOrDefault()))
                .ForMember(dest => dest.HasDoctorReport, opt => opt.MapFrom(src => src.Patient.MedicalReports.Any(r => r.AppointmentId == src.Id && r.UploadedByRole == "Doctor")))
                .ForMember(dest => dest.PatientReportUrl, opt => opt.MapFrom(src => src.Patient.MedicalReports.Where(r => r.AppointmentId == src.Id && r.UploadedByRole == "Patient").OrderByDescending(r => r.UploadedAt).Select(r => r.FileUrl).FirstOrDefault()));

            CreateMap<CreateAppointmentDto, Appointment>();
            CreateMap<CompleteAppointmentDto, Appointment>();

            // --- DOCTOR MAPPINGS ---
            CreateMap<Doctor, DoctorDto>()
                .ForMember(dest => dest.Specialty, opt => opt.MapFrom(src => src.Specialty != null ? src.Specialty.Name : null))
                .ForMember(dest => dest.SpecialtyId, opt => opt.MapFrom(src => src.SpecialtyId));
            CreateMap<CreateDoctorDto, Doctor>();
            CreateMap<AdminUpdateDoctorDto, Doctor>();
            CreateMap<UpdateDoctorProfileDto, Doctor>();

            // --- SCHEDULE MAPPINGS ---
            CreateMap<DoctorSchedule, DoctorScheduleDto>()
                .ForMember(dest => dest.DayName, opt => opt.MapFrom(src => ((DayOfWeek)src.DayOfWeek).ToString()));

            CreateMap<CreateDoctorScheduleDto, DoctorSchedule>();
            CreateMap<UpdateDoctorScheduleDto, DoctorSchedule>();

            // --- MEDICAL REPORT MAPPINGS ---
            CreateMap<MedicalReport, MedicalReportResponseDto>()
                .ForMember(dest => dest.UploadedAt, opt => opt.MapFrom(src => src.UploadedAt.ToString("yyyy-MM-dd HH:mm")));

            CreateMap<GenerateReportDto, MedicalReport>()
                .ForMember(dest => dest.Medications, opt => opt.MapFrom(src => JsonSerializer.Serialize(src.Medications, (JsonSerializerOptions?)null)));

            // --- PATIENT MAPPINGS ---
            CreateMap<Patient, PatientDto>();
            CreateMap<UpdatePatientProfileDto, Patient>();
            CreateMap<AdminUpdatePatientDto, Patient>();

            // --- ANNOUNCEMENT MAPPINGS ---
            CreateMap<Announcement, AnnouncementDto>();
            CreateMap<CreateAnnouncementDto, Announcement>();

            // --- HEALTH QUESTIONNAIRE MAPPINGS ---
            CreateMap<HealthQuestionnaire, HealthQuestionnaireDto>();

            // --- NOTIFICATION MAPPINGS ---
            CreateMap<Notification, NotificationDto>();

            // --- REVIEW MAPPINGS ---
            CreateMap<Review, ReviewDto>()
                .ForMember(dest => dest.PatientName, opt => opt.MapFrom(src => src.Patient.FullName));

            CreateMap<CreateReviewDto, Review>();

            // --- REPORT ANALYSIS MAPPINGS ---
            CreateMap<ReportAnalysis, ReportAnalysisDto>();
        }
    }
}