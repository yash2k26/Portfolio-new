import React, { useRef, useEffect } from "react";

export const LazyVideo = ({
  src,
  className,
}: {
  src: string;
  className: string;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Set src lazily — browser downloads nothing until this point
          if (!el.src || el.src === window.location.href) {
            el.src = src;
          }
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [src]);

  return (
    <video
      ref={videoRef}
      loop
      muted
      playsInline
      preload="none"
      className={className}
    />
  );
};
