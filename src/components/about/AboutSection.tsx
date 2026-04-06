import React from "react";
import { SectionMinimal } from "../ui/SectionMinimal";
import faviconImg from "../../assets/favicon.png";

export const AboutSection = () => (
  <SectionMinimal title="About Me" id="about-section">
    <div className="flex flex-col md:flex-row gap-8 items-start pl-1">
      <div className="relative group w-32 h-32 shrink-0 overflow-hidden rounded-xl border border-(--border-color) hover:border-(--text-muted) transition-colors duration-200 ease-out shadow-sm hover:shadow-md bg-(--bg-tertiary)">
        <img
          src={faviconImg}
          alt="Yash Bharadwaj Avatar"
          width={128}
          height={128}
          className="w-full h-full object-cover transition-transform duration-300 ease-out scale-100 group-hover:scale-[1.03]"
        />
      </div>
      <div>
        <h3 className="text-lg font-medium text-(--text-primary) mb-1">
          Yash Bharadwaj
        </h3>
        <div className="flex items-center gap-1.5 text-[13px] text-(--text-highlight) font-medium mb-4">
          <span>Delhi, India</span>
          <span className="opacity-40">•</span>
          <div className="h-4.5 overflow-hidden inline-flex flex-col relative top-[0.5px]">
            <div className="animate-flip leading-4.5">
              <span className="block h-4.5">Design Engineer</span>
              <span className="block h-4.5">Interaction Designer</span>
              <span className="block h-4.5">Design Engineer</span>
            </div>
          </div>
        </div>
        <p className="text-(--text-secondary) text-[15px] leading-relaxed mb-4 max-w-lg">
          I bridge design and engineering — crafting interfaces that are both
          beautiful and functional. Shipped{" "}
          <span className="font-medium text-(--text-primary)">NOMI</span>,
          a production Solana dApp published on the{" "}
          <span className="font-medium text-(--text-primary)">Solana dApp Store</span>
          {" "}that gained real user traction post-launch.
        </p>
      </div>
    </div>
  </SectionMinimal>
);
