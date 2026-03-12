using backend.Models;
using backend.DTOs;
using System.Text.Json;

namespace backend.Profiles
{
    public class MappingProfile : AutoMapper.Profile
    {
        public MappingProfile()
        {
            // --- Appointment Mappings ---
            CreateMap<Appointment, AppointmentResponseDto>()
                .ForMember(dest => dest.Doctor, opt => opt.MapFrom(src => src.Doctor.FullName))
                .ForMember(dest => dest.Specialty, opt => opt.MapFrom(src => src.Doctor.Specialty))
                .ForMember(dest => dest.Patient, opt => opt.MapFrom(src => src.Patient.FullName))
                .ForMember(dest => dest.Date, opt => opt.MapFrom(src => src.AppointmentDate.ToString("yyyy-MM-dd")))
                .ForMember(dest => dest.Time, opt => opt.MapFrom(src => src.TimeSlot));

            CreateMap<CreateAppointmentDto, Appointment>();

            // --- Doctor Mappings ---
            CreateMap<Doctor, DoctorDto>();
            CreateMap<CreateDoctorDto, Doctor>();
            CreateMap<UpdateDoctorProfileDto, Doctor>();

            // --- Schedule Mappings ---
            CreateMap<DoctorSchedule, DoctorScheduleDto>()
                .ForMember(dest => dest.DayName, opt => opt.MapFrom(src => ((DayOfWeek)src.DayOfWeek).ToString()));

            CreateMap<CreateDoctorScheduleDto, DoctorSchedule>();
            CreateMap<UpdateDoctorScheduleDto, DoctorSchedule>();

            // --- Medical Report Mappings ---
            CreateMap<MedicalReport, MedicalReportResponseDto>()
                .ForMember(dest => dest.UploadedAt, opt => opt.MapFrom(src => src.UploadedAt.ToString("yyyy-MM-dd HH:mm")));

            // FIXED: Removed the null cast to resolve CS8600 warning
            CreateMap<GenerateReportDto, MedicalReport>()
                .ForMember(dest => dest.Medications, opt => opt.MapFrom(src => JsonSerializer.Serialize(src.Medications, (JsonSerializerOptions?)null)));

            // --- Patient Mappings ---
            CreateMap<Patient, PatientDto>();
            CreateMap<UpdatePatientProfileDto, Patient>();

            // --- Announcement Mappings ---
            CreateMap<Announcement, AnnouncementDto>();
            CreateMap<CreateAnnouncementDto, Announcement>();

            // --- Health Questionnaire Mappings ---
            CreateMap<HealthQuestionnaire, HealthQuestionnaireDto>();

            // --- Notification Mappings ---
            CreateMap<Notification, NotificationDto>();

            // --- Review Mappings ---
            CreateMap<Review, ReviewDto>()
                .ForMember(dest => dest.PatientName, opt => opt.MapFrom(src => src.Patient.FullName));

            CreateMap<CreateReviewDto, Review>();

            // --- Report Analysis Mappings ---
            CreateMap<ReportAnalysis, ReportAnalysisDto>();

            // --- Auth Mappings ---
            CreateMap<User, AuthResponseDto>();
        }
    }
}