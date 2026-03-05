export default function StatCard({ icon: Icon, label, value, sub, color = "brand" }) {
  // Map color name to Tailwind classes
  const colorMap = {
    brand:  { bg: "bg-brand-50",  text: "text-brand-500" },
    mint:   { bg: "bg-mint-50",   text: "text-mint-500" },
    purple: { bg: "bg-purple-50", text: "text-purple-600" },
    amber:  { bg: "bg-amber-50",  text: "text-amber-500" },
    red:    { bg: "bg-red-50",    text: "text-red-500" },
  };

  const c = colorMap[color] || colorMap.brand;

  return (
    <div className="card-padded">
      <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center mb-4`}>
        <Icon size={20} className={c.text} />
      </div>
      <p className="text-3xl font-extrabold text-heading leading-none">{value}</p>
      <p className="text-sm text-gray-500 mt-1">
        {label}{sub && <span className="text-gray-600"> · {sub}</span>}
      </p>
    </div>
  );
}
