import React from "react";
import { LayersIcon, GitHubIcon, ExternalLinkIcon, PlayIcon } from "../Icons";
import { LazyVideo } from "../ui/LazyVideo";

export const ProjectCard = ({
  id,
  title,
  description,
  tech,
  githubUrl,
  liveUrl,
  image,
  video,
  onDetailClick,
}: {
  id: string;
  title: string;
  description: string;
  tech: string[];
  githubUrl?: string;
  liveUrl?: string;
  image?: string;
  video?: string;
  onDetailClick?: (e: React.MouseEvent) => void;
}) => {
  const targetUrl = liveUrl || githubUrl || "#";
  const Content = (
    <div className="group relative bg-(--bg-secondary) rounded-2xl border border-(--border-color) hover:border-(--text-muted) transition-all duration-300 ease-out overflow-hidden shadow-sm hover:shadow-md flex flex-col h-full cursor-pointer">
      {(image || video) && (
        <div className="w-full h-48 overflow-hidden relative shrink-0">
          {image ? (
            <img
              src={image}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
            />
          ) : (
            <LazyVideo
              src={video!}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
        </div>
      )}

      {!video && !image && (
        <div className="w-full h-48 bg-(--bg-tertiary) border-b border-(--border-color) flex items-center justify-center shrink-0">
          <div className="text-(--text-muted) opacity-50">
            <LayersIcon />
          </div>
        </div>
      )}

      <div className="p-6 flex flex-col grow">
        <div className="flex items-start justify-between mb-3 gap-4">
          <h3 className="text-lg font-semibold text-(--text-primary) tracking-tight group-hover:text-(--text-highlight) transition-colors duration-200 ease-out">
            {title}
          </h3>
          <div className="flex gap-2 shrink-0">
            {onDetailClick && (
              <button
                onClick={(e) => { e.preventDefault(); onDetailClick(e); }}
                className="text-(--text-muted) hover:text-(--text-primary) transition-colors duration-200 ease-out p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--border-color) rounded cursor-pointer"
                aria-label="View Detail"
              >
                <PlayIcon />
              </button>
            )}
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-(--text-muted) hover:text-(--text-primary) transition-colors duration-200 ease-out p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--border-color) rounded"
                aria-label="GitHub Repository"
              >
                <GitHubIcon />
              </a>
            )}
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-(--text-muted) hover:text-(--text-primary) transition-colors duration-200 ease-out p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--border-color) rounded"
                aria-label="Live Site"
              >
                <ExternalLinkIcon />
              </a>
            )}
          </div>
        </div>

        <p className="text-(--text-secondary) text-sm leading-relaxed mb-6 grow">
          {description}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-auto">
          {tech.map((t) => (
            <span
              key={t}
              className="text-[11px] font-medium text-(--text-secondary) bg-(--bg-tertiary) px-2 py-0.5 rounded border border-(--border-color)"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  return targetUrl !== "#" ? (
    <a
      href={targetUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--text-muted) rounded-2xl"
    >
      {Content}
    </a>
  ) : (
    <div className="h-full">{Content}</div>
  );
};
