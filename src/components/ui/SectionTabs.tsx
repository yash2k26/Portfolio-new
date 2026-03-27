import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Tab {
  label: string;
  targetId: string;
}

export const SectionTabs = ({ tabs }: { tabs: Tab[] }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const getRect = (index: number) => {
    const el = refs.current[index];
    if (!el) return { left: 0, width: 0 };
    const parentRect = el.parentElement!.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    return { left: rect.left - parentRect.left, width: rect.width };
  };

  const bgRect = hoveredIndex !== null ? getRect(hoveredIndex) : null;

  return (
    <div
      className="relative inline-flex items-center gap-0"
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {/* sliding bg */}
      <AnimatePresence>
        {bgRect && (
          <motion.div
            className="absolute inset-y-0 rounded-lg bg-(--bg-tertiary) border border-(--border-color)"
            initial={{ opacity: 0, x: bgRect.left, width: bgRect.width }}
            animate={{ opacity: 1, x: bgRect.left, width: bgRect.width }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
          />
        )}
      </AnimatePresence>

      {tabs.map((tab, index) => (
        <React.Fragment key={tab.targetId}>
          {index > 0 && (
            <span className="w-px h-3 bg-(--border-color) shrink-0 relative z-10" />
          )}
          <button
            ref={(el) => { refs.current[index] = el; }}
            onMouseEnter={() => setHoveredIndex(index)}
            onClick={() =>
              document.getElementById(tab.targetId)?.scrollIntoView({ behavior: "smooth" })
            }
            className="relative z-10 text-[12px] font-medium px-4 py-2 text-(--text-muted) hover:text-(--text-primary) transition-colors duration-150 cursor-pointer focus-visible:outline-none tracking-wide"
          >
            {tab.label}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};
