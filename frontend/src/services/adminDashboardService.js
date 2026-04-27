import api from "./api.js";
import { getAllAppointments } from "./appointmentService";
import { getAllDoctors } from "./doctorService";
import { getAllPatients } from "./patientService";

export const getAdminStats = () => api.get("/api/admindashboard/stats");

const toArray = (value) => (Array.isArray(value) ? value : []);

const getDateLabel = (date) => {
	const d = new Date(date);
	return Number.isNaN(d.getTime())
		? "-"
		: d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const getMonthKey = (date) => {
	const d = new Date(date);
	if (Number.isNaN(d.getTime())) {
		return null;
	}
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const buildStatusData = (appointments) => {
	const counts = appointments.reduce((acc, appt) => {
		const status = (appt?.status || "Unknown").trim();
		acc[status] = (acc[status] || 0) + 1;
		return acc;
	}, {});

	const preferredOrder = ["Pending", "Confirmed", "Completed", "Cancelled"];
	const ordered = preferredOrder
		.filter((status) => counts[status])
		.map((status) => ({ name: status, value: counts[status] }));

	const extras = Object.entries(counts)
		.filter(([status]) => !preferredOrder.includes(status))
		.map(([name, value]) => ({ name, value }));

	return [...ordered, ...extras];
};

const buildSevenDayTrend = (appointments) => {
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const days = Array.from({ length: 7 }, (_, index) => {
		const day = new Date(today);
		day.setDate(today.getDate() - (6 - index));
		const key = day.toISOString().split("T")[0];
		return { key, label: getDateLabel(day), value: 0 };
	});

	const dayMap = new Map(days.map((d) => [d.key, d]));

	appointments.forEach((appt) => {
		if (!appt?.date) {
			return;
		}
		const normalized = new Date(appt.date);
		if (Number.isNaN(normalized.getTime())) {
			return;
		}
		const key = normalized.toISOString().split("T")[0];
		const target = dayMap.get(key);
		if (target) {
			target.value += 1;
		}
	});

	return days.map((day) => ({
		label: day.label,
		value: day.value,
		isoDate: day.key,
	}));
};

const buildTopSpecialties = (appointments) => {
	const counts = appointments.reduce((acc, appt) => {
		const specialty = (appt?.specialty || "Unspecified").trim();
		acc[specialty] = (acc[specialty] || 0) + 1;
		return acc;
	}, {});

	return Object.entries(counts)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 6)
		.map(([name, value]) => ({ name, value }));
};

const buildRegistrationTrend = (patients, doctors) => {
	const now = new Date();
	const months = Array.from({ length: 6 }, (_, index) => {
		const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
		const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
		return {
			key,
			label: date.toLocaleDateString("en-US", { month: "short" }),
			patients: 0,
			doctors: 0,
		};
	});

	const monthMap = new Map(months.map((month) => [month.key, month]));

	patients.forEach((patient) => {
		const key = getMonthKey(patient?.createdAt);
		if (!key || !monthMap.has(key)) {
			return;
		}
		monthMap.get(key).patients += 1;
	});

	doctors.forEach((doctor) => {
		const key = getMonthKey(doctor?.createdAt);
		if (!key || !monthMap.has(key)) {
			return;
		}
		monthMap.get(key).doctors += 1;
	});

	return months;
};

const getTodayCount = (appointments) => {
	const today = new Date();
	const todayKey = today.toISOString().split("T")[0];

	return appointments.filter((appt) => {
		if (!appt?.date) {
			return false;
		}
		const date = new Date(appt.date);
		if (Number.isNaN(date.getTime())) {
			return false;
		}
		return date.toISOString().split("T")[0] === todayKey;
	}).length;
};

const getPendingCount = (appointments) =>
	appointments.filter((appt) => (appt?.status || "").toLowerCase() === "pending")
		.length;

export const getAdminDashboardAnalytics = async () => {
	const [statsRes, appointmentsRes, doctorsRes, patientsRes] = await Promise.allSettled([
		getAdminStats(),
		getAllAppointments(),
		getAllDoctors(),
		getAllPatients(),
	]);

	const stats =
		statsRes.status === "fulfilled" && statsRes.value?.data
			? statsRes.value.data
			: null;

	const appointments =
		appointmentsRes.status === "fulfilled"
			? toArray(appointmentsRes.value?.data)
			: [];

	const doctors =
		doctorsRes.status === "fulfilled"
			? toArray(doctorsRes.value?.data)
			: [];

	const patients =
		patientsRes.status === "fulfilled"
			? toArray(patientsRes.value?.data)
			: [];

	const mergedStats = {
		totalPatients: stats?.totalPatients ?? patients.length,
		totalDoctors: stats?.totalDoctors ?? doctors.length,
		appointmentsToday: stats?.appointmentsToday ?? getTodayCount(appointments),
		pendingApprovals: stats?.pendingApprovals ?? getPendingCount(appointments),
		recentActivity: toArray(stats?.recentActivity),
	};

	return {
		stats: mergedStats,
		charts: {
			appointmentStatus: buildStatusData(appointments),
			appointmentTrend: buildSevenDayTrend(appointments),
			specialtyLoad: buildTopSpecialties(appointments),
			registrationTrend: buildRegistrationTrend(patients, doctors),
		},
	};
};
