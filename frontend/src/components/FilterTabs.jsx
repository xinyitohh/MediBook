import { motion } from "framer-motion";

export default function FilterTabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-5 relative">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`
            relative px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 cursor-pointer z-10
            ${active === tab ? "text-heading" : "text-gray-500 hover:text-gray-700"}
          `}
        >
          {/* This is the sliding background */}
          {active === tab && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-white rounded-lg shadow-sm"
              transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
            />
          )}

          {/* The label needs to be relative and higher z-index to stay above the sliding div */}
          <span className="relative z-20">{tab}</span>
        </button>
      ))}
    </div>
  );
}
