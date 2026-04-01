import { motion } from "framer-motion";

export function QuickReplies({ items, onSelect, disabled }) {
  return (
    <motion.div
      className="flex flex-wrap gap-1.5 mt-2.5"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
    >
      {items.map((item, i) => (
        <motion.button
          key={i}
          variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}
          onClick={() => !disabled && onSelect(item)}
          disabled={disabled}
          className={`border rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
            disabled
              ? "border-gray-200 text-gray-400 cursor-not-allowed"
              : "border-brand-400 text-brand-500 hover:bg-brand-50 hover:border-brand-500 cursor-pointer active:scale-95"
          }`}
        >
          {item.label}
        </motion.button>
      ))}
    </motion.div>
  );
}
