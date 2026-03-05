export default function PageHeader({ title, subtitle, children }) {
  return (
    <div className="flex items-start justify-between mb-7">
      <div>
        <h1 className="text-[28px] font-extrabold text-heading leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[15px] text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
      {/* Right side — for action buttons */}
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
}
