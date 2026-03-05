export default function FilterTabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-5">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`
            px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
            ${active === tab
              ? "bg-white text-heading shadow-sm"
              : "text-gray-500 hover:text-gray-700"
            }
          `}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
