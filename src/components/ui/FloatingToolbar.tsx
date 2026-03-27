import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ToolbarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
}

interface FloatingToolbarProps {
  items: ToolbarItem[];
  activeId?: string;
  separator?: number;
}

export const FloatingToolbar = ({
  items,
  activeId,
  separator,
}: FloatingToolbarProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [direction, setDirection] = useState(0);

  const handleHover = (id: string | null) => {
    if (hoveredId !== null && id !== null) {
      const prevIndex = items.findIndex((item) => item.id === hoveredId);
      const nextIndex = items.findIndex((item) => item.id === id);
      setDirection(nextIndex > prevIndex ? 1 : -1);
    }
    setHoveredId(id);
  };

  const hoveredItem = items.find((item) => item.id === hoveredId);
  const hoveredIndex = items.findIndex((item) => item.id === hoveredId);

  const ITEM_SIZE = 44;
  const GAP = 8;
  const PADDING = 12;
  const SEPARATOR_WIDTH = 17;

  const getItemX = (index: number) => {
    let x = PADDING + index * (ITEM_SIZE + GAP);
    if (separator !== undefined && index > separator) {
      x += SEPARATOR_WIDTH;
    }
    return x;
  };

  const bgX = hoveredItem ? getItemX(hoveredIndex) : 0;
  const tooltipX = hoveredItem ? getItemX(hoveredIndex) + ITEM_SIZE / 2 : 0;

  return (
    <div
      className="relative flex items-center gap-2 px-3 py-2 rounded-2xl bg-(--bg-secondary)/80 backdrop-blur-xl border border-(--border-color) shadow-lg"
      onMouseLeave={() => setHoveredId(null)}
    >
      <AnimatePresence>
        {hoveredId && (
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 left-0 rounded-xl bg-(--bg-tertiary)"
            style={{ width: ITEM_SIZE, height: ITEM_SIZE }}
            initial={{ opacity: 0, x: bgX, scale: 0.95 }}
            animate={{ opacity: 1, x: bgX, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
      </AnimatePresence>

      {items.map((item, index) => (
        <React.Fragment key={item.id}>
          {separator !== undefined && index === separator + 1 && (
            <div className="w-px h-5 bg-(--border-color) mx-0.5" />
          )}
          <button
            onClick={item.onClick}
            onMouseEnter={() => handleHover(item.id)}
            className={`relative flex items-center justify-center w-11 h-11 rounded-xl transition-colors duration-200 outline-none cursor-pointer active:scale-[0.95] ${
              activeId === item.id
                ? "text-(--text-primary)"
                : "text-(--text-muted) hover:text-(--text-primary)"
            }`}
          >
            <span className="relative z-10">{item.icon}</span>
            {activeId === item.id && (
              <motion.div
                layoutId="active-dot"
                className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-(--text-primary)"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        </React.Fragment>
      ))}

      <AnimatePresence>
        {hoveredItem && (
          <motion.div
            key="tooltip"
            className="absolute -top-10 left-0 px-2.5 py-1 bg-(--bg-secondary) border border-(--border-color) rounded-lg shadow-lg whitespace-nowrap z-50 pointer-events-none"
            initial={{
              opacity: 0,
              y: 6,
              scale: 0.95,
              x: tooltipX,
              translateX: "-50%",
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              x: tooltipX,
              translateX: "-50%",
            }}
            exit={{
              opacity: 0,
              y: 6,
              scale: 0.95,
              transition: { duration: 0.12 },
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <AnimatePresence mode="popLayout" initial={false} custom={direction}>
              <motion.span
                key={hoveredItem.id}
                className="text-[11px] font-medium text-(--text-primary) block"
                custom={direction}
                initial={{ opacity: 0, y: direction * 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: direction * -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                {hoveredItem.label}
              </motion.span>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
