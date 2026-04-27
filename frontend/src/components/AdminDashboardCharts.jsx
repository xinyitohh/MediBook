import { useMemo } from "react";
import DashboardChartCard from "./DashboardChartCard";

const chartPalette = {
  brand: "#0F6FFF",
  mint: "#00C48C",
  purple: "#8B5CF6",
  amber: "#F59E0B",
  red: "#EF4444",
  slate: "#94A3B8",
};

const hasSeriesValues = (items = []) =>
  items.some((item) => Number(item?.value || 0) > 0);

export default function AdminDashboardCharts({ charts = {}, onNavigate }) {
  const statusData = useMemo(() => charts.appointmentStatus || [], [charts]);
  const trendData = useMemo(() => charts.appointmentTrend || [], [charts]);
  const specialtyData = useMemo(() => charts.specialtyLoad || [], [charts]);
  const registrationData = useMemo(() => charts.registrationTrend || [], [charts]);

  const statusPieOption = useMemo(
    () => ({
      tooltip: { trigger: "item" },
      legend: { bottom: 8, left: "center", itemGap: 18 },
      color: [
        chartPalette.amber,
        chartPalette.brand,
        chartPalette.mint,
        chartPalette.red,
        chartPalette.slate,
      ],
      series: [
        {
          name: "Appointments",
          type: "pie",
          radius: ["44%", "72%"],
          center: ["50%", "43%"],
          avoidLabelOverlap: true,
          itemStyle: { borderRadius: 6, borderWidth: 2, borderColor: "#ffffff" },
          label: { show: false },
          emphasis: { label: { show: true, fontSize: 12, fontWeight: 600 } },
          data: statusData,
        },
      ],
    }),
    [statusData]
  );

  const trendOption = useMemo(
    () => ({
      tooltip: { trigger: "axis" },
      grid: { left: 24, right: 20, top: 24, bottom: 30, containLabel: true },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: trendData.map((item) => item.label),
        axisLine: { lineStyle: { color: "#E5E7EB" } },
      },
      yAxis: {
        type: "value",
        minInterval: 1,
        splitLine: { lineStyle: { color: "#F3F4F6" } },
      },
      series: [
        {
          name: "Appointments",
          type: "line",
          smooth: true,
          data: trendData.map((item) => item.value),
          symbolSize: 7,
          lineStyle: { width: 3, color: chartPalette.brand },
          itemStyle: { color: chartPalette.brand },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: "rgba(15,111,255,0.22)" },
                { offset: 1, color: "rgba(15,111,255,0.04)" },
              ],
            },
          },
        },
      ],
    }),
    [trendData]
  );

  const specialtyOption = useMemo(
    () => ({
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      grid: { left: 24, right: 16, top: 22, bottom: 52, containLabel: true },
      xAxis: {
        type: "category",
        data: specialtyData.map((item) => item.name),
        axisLabel: { interval: 0, rotate: 18 },
        axisLine: { lineStyle: { color: "#E5E7EB" } },
      },
      yAxis: {
        type: "value",
        minInterval: 1,
        splitLine: { lineStyle: { color: "#F3F4F6" } },
      },
      series: [
        {
          type: "bar",
          barWidth: "42%",
          data: specialtyData.map((item) => item.value),
          itemStyle: {
            borderRadius: [8, 8, 0, 0],
            color: chartPalette.purple,
          },
        },
      ],
    }),
    [specialtyData]
  );

  const registrationOption = useMemo(
    () => ({
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      legend: { top: 4, right: 6 },
      grid: { left: 24, right: 16, top: 40, bottom: 24, containLabel: true },
      xAxis: {
        type: "category",
        data: registrationData.map((item) => item.label),
        axisLine: { lineStyle: { color: "#E5E7EB" } },
      },
      yAxis: {
        type: "value",
        minInterval: 1,
        splitLine: { lineStyle: { color: "#F3F4F6" } },
      },
      series: [
        {
          name: "Patients",
          type: "bar",
          stack: "users",
          data: registrationData.map((item) => item.patients),
          itemStyle: { color: chartPalette.mint, borderRadius: [6, 6, 0, 0] },
        },
        {
          name: "Doctors",
          type: "bar",
          stack: "users",
          data: registrationData.map((item) => item.doctors),
          itemStyle: { color: chartPalette.brand, borderRadius: [6, 6, 0, 0] },
        },
      ],
    }),
    [registrationData]
  );

  const statusEvents = {
    click: (params) => {
      if (!params?.name || params.name === "Unknown") {
        return;
      }
      onNavigate("appointments", { status: params.name });
    },
  };

  const trendEvents = {
    click: (params) => {
      const datePoint = trendData[params?.dataIndex];
      if (!datePoint?.isoDate) {
        return;
      }
      onNavigate("appointments", { date: datePoint.isoDate });
    },
  };

  const specialtyEvents = {
    click: (params) => {
      if (!params?.name || params.name === "Unspecified") {
        return;
      }
      onNavigate("appointments", { specialty: params.name });
    },
  };

  const registrationEvents = {
    click: (params) => {
      const monthPoint = registrationData[params?.dataIndex];
      if (!monthPoint?.key || !params?.seriesName) {
        return;
      }
      if (params.seriesName === "Patients") {
        onNavigate("patients", { month: monthPoint.key });
      }
      if (params.seriesName === "Doctors") {
        onNavigate("doctors", { month: monthPoint.key });
      }
    },
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
      <DashboardChartCard
        title="Appointment Status Mix"
        subtitle="Click a segment to open filtered appointments"
        option={statusPieOption}
        hasData={hasSeriesValues(statusData)}
        onEvents={statusEvents}
      />
      <DashboardChartCard
        title="Daily Appointment Volume"
        subtitle="Last 7 days · click a point to inspect date"
        option={trendOption}
        hasData={hasSeriesValues(trendData)}
        onEvents={trendEvents}
      />
      <DashboardChartCard
        title="Top Specialties by Demand"
        subtitle="Most booked specialties · click to filter"
        option={specialtyOption}
        hasData={hasSeriesValues(specialtyData)}
        onEvents={specialtyEvents}
      />
      <DashboardChartCard
        title="Registration Trend"
        subtitle="Doctors vs patients, last 6 months"
        option={registrationOption}
        hasData={registrationData.some(
          (item) =>
            Number(item?.patients || 0) > 0 || Number(item?.doctors || 0) > 0
        )}
        onEvents={registrationEvents}
      />
    </div>
  );
}
