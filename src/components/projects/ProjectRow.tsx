import React from "react";

export const ProjectRow = ({
  id,
  title,
  roles,
  onClick,
}: {
  id: string;
  title: string;
  roles: { name: string; type: "design" | "dev" | "prototype" | "iconography" | "default" }[];
  onClick: (id: string, e: React.MouseEvent) => void;
}) => {
  const roleStyle = "bg-(--bg-tertiary) text-(--text-secondary) border-(--border-color) hover:text-(--text-primary) hover:border-(--text-muted)";

  return (
    <a 
      href={`/${id}`}
      onClick={(e) => onClick(id, e)}
      className="group flex items-center justify-between w-full py-3 cursor-pointer focus-visible:outline-none pl-1"
    >
      <div className="flex items-center gap-4 w-full">
        <span className="text-[15px] font-medium text-(--text-primary) whitespace-nowrap group-hover:text-(--text-highlight) transition-colors duration-200">
          {title}
        </span>
        <div className="flex-1 flex items-center h-full mx-2 overflow-hidden">
          <div className="w-1.5 h-1.5 rounded-full bg-(--border-color) shrink-0 group-hover:bg-(--text-muted) transition-colors duration-200"></div>
          <div className="flex-1 h-px border-t-2 border-dashed border-(--border-color) opacity-40 group-hover:opacity-100 transition-opacity duration-200 mx-2"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-(--border-color) shrink-0 group-hover:bg-(--text-muted) transition-colors duration-200"></div>
        </div>
        <div className="flex gap-2 shrink-0">
          {roles.map((role, idx) => (
            <span
              key={idx}
              className={`text-[11px] font-medium tracking-wide px-2 py-0.5 rounded border transition-colors duration-200 ease-out cursor-default ${roleStyle}`}
            >
              {role.name}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
};
