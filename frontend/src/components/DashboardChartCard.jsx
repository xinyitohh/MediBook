import ReactECharts from "echarts-for-react";

export default function DashboardChartCard({
  title,
  subtitle,
  option,
  height = 320,
  hasData = true,
  onEvents,
  className = "",
}) {
  return (
    <div className={`card ${className}`}>
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-base font-bold text-heading">{title}</h3>
        {subtitle ? <p className="mt-1 text-sm text-gray-500">{subtitle}</p> : null}
      </div>

      <div className="relative px-2 py-2">
        <ReactECharts
          option={option}
          style={{ height, width: "100%" }}
          notMerge
          lazyUpdate
          onEvents={onEvents}
        />
        {!hasData ? (
          <div className="absolute inset-0 m-2 flex items-center justify-center rounded-xl bg-white/75 text-sm font-medium text-gray-500 backdrop-blur-[1px]">
            No chart data available yet.
          </div>
        ) : null}
      </div>
    </div>
  );
}
