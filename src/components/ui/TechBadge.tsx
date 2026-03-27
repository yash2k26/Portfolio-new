import React from "react";

export const TechBadge = ({ name }: { name: string; colorClass: string }) => (
  <span className="inline-flex items-center text-[13px] font-medium px-3 py-1.5 rounded-lg bg-(--bg-tertiary) border border-(--border-color) text-(--text-secondary) transition-colors duration-200 ease-out hover:text-(--text-primary) hover:border-(--text-muted) cursor-default">
    <span>{name}</span>
  </span>
);
