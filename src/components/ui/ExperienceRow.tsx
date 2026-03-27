import React from "react";

export const ExperienceRow = ({
  role,
  company,
  duration,
  description,
}: {
  role: string;
  company: React.ReactNode;
  duration: string;
  description?: string;
}) => (
  <div className="group pl-1">
    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
      <div className="flex items-center gap-3">
        <div className="font-medium text-(--text-primary)">
          {company}
        </div>
        <div className="text-xs font-medium text-(--text-secondary) bg-(--bg-tertiary) px-2.5 py-1 rounded-md border border-(--border-color) transition-colors duration-200 ease-out">
          {role}
        </div>
      </div>
      <div className="text-xs text-(--text-muted) font-mono mt-1 sm:mt-0 opacity-60 transition-colors hover:opacity-100 hover:text-(--text-primary) cursor-default">
        {duration}
      </div>
    </div>
    {description && (
      <p className="text-sm text-(--text-secondary) leading-relaxed max-w-2xl transition-colors duration-200 ease-out">
        {description}
      </p>
    )}
  </div>
);
