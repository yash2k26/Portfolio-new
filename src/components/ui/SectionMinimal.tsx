import React from "react";

export const SectionMinimal = ({
  children,
  title,
  id,
}: {
  children: React.ReactNode;
  title: string;
  id?: string;
}) => (
  <section id={id} className="py-2">
    <h2 className="text-[11px] font-bold tracking-[0.2em] text-(--text-muted) uppercase mb-6 pl-1 transition-colors duration-200 ease-out">
      {title}
    </h2>
    {children}
  </section>
);
