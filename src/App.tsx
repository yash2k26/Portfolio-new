import superteamImg from "./assets/superteam-hackathon.png"
import nomiPortfolio from "./assets/NOMI-portfolio.jpg"
import nomiHackathonImg from "./assets/NOmi-portfoli.jpg"
import predictProImg from "./assets/Predict-Pro.png"
import saasImg from "./assets/SaasAnalytics.png"
import dysonImg from "./assets/dyson.png"
import creditCardImg from "./assets/CreditCard.png"
import aiSendImg from "./assets/AI_send.png"
import spideyFifaImg from "./assets/spidey-fifa.png"
import bubbleNavbarImg from "./assets/bubblenavbar.png"
import { GitHubCalendar } from 'react-github-calendar';
import { useState, useEffect } from "react";
import "./index.css";


import {
  SunIcon,
  MoonIcon,
  HomeIcon,
  UserIcon,
  LayersIcon,
  GitHubIcon,
  ExternalLinkIcon,
  MailIcon,
  TwitterIcon,
  CopyIcon,
  CheckIcon,
} from "./components/Icons";
import { SectionMinimal } from "./components/ui/SectionMinimal";
import { NameFlip } from "./components/ui/NameFlip";
import { ExperienceRow } from "./components/ui/ExperienceRow";
import { TechBadge } from "./components/ui/TechBadge";
import { ProjectRow } from "./components/projects/ProjectRow";
import { ProjectCard } from "./components/projects/ProjectCard";
import { AboutSection } from "./components/about/AboutSection";
import { Footer } from "./components/layout/Footer";
import { LazyVideo } from "./components/ui/LazyVideo";
import { FloatingToolbar } from "./components/ui/FloatingToolbar";
import { SectionTabs } from "./components/ui/SectionTabs";

export function App() {
  const [isDark, setIsDark] = useState(true);
  const [copied, setCopied] = useState(false);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateTo = (path: string, event?: React.MouseEvent) => {
    if (event) event.preventDefault();
    if (path.includes("#")) {
      const [base, hash] = path.split("#");
      const targetBase = base || "/";

      if (currentPath !== targetBase) {
        window.history.pushState({}, "", path);
        setCurrentPath(targetBase);
        if (hash) {
          setTimeout(() => {
            document
              .getElementById(hash)
              ?.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }
      } else {
        window.history.pushState({}, "", path);
        if (hash) {
          document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
        }
      }
    } else {
      window.history.pushState({}, "", path);
      setCurrentPath(path);
      window.scrollTo(0, 0);
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText("bharadwaj465@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    if (stored === "light" || (!stored && !prefersDark)) {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    } else {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = (event: React.MouseEvent) => {
    const isSwitchingToDark = !isDark;

    const toggle = () => {
      setIsDark(isSwitchingToDark);
      if (isSwitchingToDark) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    };

    if (!("startViewTransition" in document)) {
      toggle();
      return;
    }

    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = (document as any).startViewTransition(toggle);

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 900,
          easing: "cubic-bezier(0.32, 0.72, 0, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  };

  const projects = [
    {
      id: "nomi",
      title: "NOMI",
      description:
        "A mobile Solana dApp where you own and care for a living virtual companion NFT. Feed it, dress it, evolve it - every action is a real on-chain transaction. Published on the Solana dApp Store, with active users, revenue, and 72+ reviews.",
      tech: ["React Native", "Expo", "TypeScript", "React Three Fiber", "Three.js", "NativeWind", "Zustand", "Solana Web3.js", "Metaplex", "Wallet Adapter"],
      roles: [{ name: "Design Engineer", type: "design" }] as const,
      githubUrl: "https://github.com/yash2k26/NomiApp",
      liveUrl: "https://x.com/Yassshhu/status/2029313865331425700",
      video: "/nomi.mp4",
      image: nomiPortfolio,
    },
    {
      id: "predictpro",
      title: "PredictPro",
      description:
        "A real-time aggregator that pulls and displays prediction markets from Polymarket and Kalshi in a unified feed. Browse, filter by venue, sort by volume/liquidity/price, and view probability charts for individual markets.",
      tech: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS v4", "Turborepo", "pnpm", "Node.js", "Express", "WebSockets", "Recharts", "Framer Motion"],
      roles: [{ name: "Design Engineer", type: "design" }] as const,
      githubUrl: "https://github.com/yash2k26/PreditPro",
      liveUrl: "https://predictpro.yashb.xyz/",
      video: "/predictpro.mp4",
      image: predictProImg,
    },
    {
      id: "saas-analytics",
      title: "SaaS Analytics",
      description:
        "A multi-workspace analytics platform that tracks key product metrics - revenue, signups, page views, and button events - with live animated charts and a fully themeable UI. Users can switch between workspaces and create new ones, with each workspace showing its own distinct dataset.",
      tech: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4", "Recharts", "Motion", "Lucide React", "PostgreSQL", "Prisma", "JWT", "bcrypt", "Axios", "Express 5"],
      roles: [{ name: "Design Engineer", type: "design" }] as const,
      githubUrl: "https://github.com/yash2k26/SaasAnalystics",
      liveUrl: "https://saas-analytics.yashb.xyz/",
      video: "/saasVideo.mp4",
      image: saasImg,
    },
    {
      id: "dyson-landing-page",
      title: "Dyson Landing Page",
      description:
        "A cinematic Dyson-inspired landing experience built with Next.js, React, Tailwind, and Motion. It uses smooth scroll-driven storytelling with frame-by-frame hero visuals, premium text reveals, and immersive product highlight sections to present headphone features in an Apple-like, high-end style.",
      tech: ["Next.js", "React", "Tailwind CSS", "Framer Motion"],
      roles: [{ name: "Design Engineer", type: "design" }] as const,
      githubUrl: "https://github.com/yash2k26/DysonDashboard",
      liveUrl: "https://dyson.yashb.xyz/",
      video: "/dyson.mp4",
      image: dysonImg,
    },
  ];

  const contributions = [
    {
      title: "NOMI - Solana Mobile Hackathon",
      description:
        "Designed and engineered NOMI - a living virtual companion NFT dApp - at the Solana Mobile Hackathon. 3D pet model, on-chain actions, listed on the Solana dApp Store.",
      tech: ["React Native", "TypeScript", "Solana"],
      githubUrl: "https://github.com/yash2k26/NomiApp",
      image: nomiHackathonImg,
    },
    {
      title: "Superteam Solana Hackathon",
      description:
        "Built and shipped a Web3 project at the Superteam Solana Hackathon. Live on Vercel.",
      tech: ["Solana", "TypeScript", "React"],
      githubUrl: "https://github.com/yash2k26/WEB3hackathon",
      liveUrl: "https://web-3hackathon.vercel.app/",
      image: superteamImg,
    },
  ];

  const components = [
    {
      title: "AI Send Button",
      description: "A stylized animated AI chat send button UI demo. Features a WebGL liquid metal shader effect on the button surface.",
      tech: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS v4", "Motion", "WebGL Shaders"],
      image: aiSendImg,
      liveUrl: "https://buttonai.yashb.xyz/",
      githubUrl: "https://github.com/yash2k26/AI-send-button",
    },
    {
      title: "Credit Card UI",
      description: "An interactive credit card form with a live-preview card that animates as you type. Card flips to show front/back, digits animate in, and long names are auto-abbreviated.",
      tech: ["Next.js 15", "TypeScript", "Tailwind CSS", "Framer Motion", "React Context"],
      image: creditCardImg,
      liveUrl: "https://creditcard.yashb.xyz/",
      githubUrl: "https://github.com/yash2k26/CreditCardComponent",
    },
    {
      title: "Spidey FIFA Card Carousel",
      description: "A Spider-Verse themed interactive card carousel built with Next.js, React, Tailwind CSS, and Framer Motion. It showcases multiple Spider-Man variants with custom images, animated 3D card tilt effects, smooth carousel transitions, and both button + keyboard arrow navigation.",
      tech: ["Next.js", "React", "Tailwind CSS", "Framer Motion"],
      image: spideyFifaImg,
      liveUrl: "https://spidey-fifa-cards.yashb.xyz/",
      githubUrl: "https://github.com/yash2k26/SpideyFifaCards",
    },
    {
      title: "Bubble Navbar",
      description: "A minimal Next.js app showcasing a centered, pill-shaped animated navbar built with React, Tailwind CSS, and Motion. It features interactive hover/click states with smooth transitions and a clean dark UI focused only on the navigation component.",
      tech: ["Next.js", "React", "Tailwind CSS", "Framer Motion"],
      image: bubbleNavbarImg,
      liveUrl: "https://bubblenavbar.yashb.xyz/",
      githubUrl: "https://github.com/yash2k26/BubbleNavbar",
    },
  ];

  const techStack = [
    { name: "Figma", colorClass: "badge-figma" },
    { name: "Framer Motion", colorClass: "badge-framermotion" },
    { name: "React", colorClass: "badge-react" },
    { name: "Next.js", colorClass: "badge-nextjs" },
    { name: "TypeScript", colorClass: "badge-typescript" },
    { name: "Tailwind", colorClass: "badge-tailwind" },
    { name: "GSAP", colorClass: "badge-gsap" },
    { name: "Three.js", colorClass: "badge-threejs" },
    { name: "Spline", colorClass: "" },
    { name: "Rive", colorClass: "badge-rive" },
  ];

  const menuItems = [
    { id: "home", icon: <HomeIcon />, label: "Home", targetPath: "/" },
    {
      id: "projects",
      icon: <LayersIcon />,
      label: "Projects",
      targetPath: "/projects",
    },
    { id: "about", icon: <UserIcon />, label: "About", targetPath: "/about" },
  ];

  return (
    <div className="min-h-screen bg-(--bg-primary) text-(--text-primary) selection:bg-(--text-primary) selection:text-(--bg-primary) font-sans overflow-x-hidden">
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <FloatingToolbar
          items={[
            ...menuItems.map((item) => ({
              id: item.id,
              label: item.label,
              icon: item.icon,
              onClick: (e: React.MouseEvent) => navigateTo(item.targetPath, e),
            })),
            {
              id: "theme",
              label: isDark ? "Light Mode" : "Dark Mode",
              icon: isDark ? <SunIcon /> : <MoonIcon />,
              onClick: toggleTheme,
            },
          ]}
          activeId={
            currentPath === "/" || currentPath === ""
              ? "home"
              : currentPath === "/projects"
                ? "projects"
                : currentPath === "/about"
                  ? "about"
                  : undefined
          }
          separator={2}
        />
      </nav>

      {currentPath === "/about" ? (
        <main className="max-w-2xl mx-auto px-6 py-20 space-y-12 transition-all  min-h-[80vh] pb-24">
          <div className="animate-in fade-in duration-300 slide-in-from-bottom-4 space-y-8">
            <AboutSection />
            <SectionMinimal title="Technologies">
              <div className="flex flex-wrap gap-x-2 gap-y-2 pl-1 mb-8">
                {techStack.map((tech) => (
                  <TechBadge key={tech.name} {...tech} />
                ))}
              </div>
            </SectionMinimal>

            <SectionMinimal title="GitHub">
              <div className="bg-(--bg-secondary) border border-(--border-color) rounded-2xl p-4 sm:p-5">
                <div className="w-full flex justify-center">
                  <GitHubCalendar
                    username="yash2k26"
                    year="last"
                    theme={{
                      light: ["#fbc9c9", "#f87171", "#ef4444", "#b91c1c", "#7f1d1d"],
                      dark:  ["#3d0f0f", "#7f1d1d", "#b91c1c", "#dc2626", "#ef4444"],
                    }}
                    colorScheme={isDark ? "dark" : "light"}
                    blockSize={8}
                    blockMargin={2}
                    fontSize={11}
                    showWeekdayLabels={["mon", "wed", "fri"]}
                  />
                </div>
              </div>
            </SectionMinimal>
          </div>
        </main>
      ) : currentPath === "/projects" ? (
        <main className="max-w-2xl mx-auto px-6 py-20 space-y-12 transition-all  min-h-[80vh] pb-24">
          <div className="animate-in fade-in duration-300 slide-in-from-bottom-4">
            <div className="pl-1 mb-8">
              <SectionTabs
                tabs={[
                  { label: "Projects", targetId: "projects-section" },
                  { label: "Components", targetId: "components-section" },
                  { label: "Hackathons", targetId: "oss-section" },
                ]}
              />
            </div>

            <SectionMinimal title="Projects" id="projects-section">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pl-1">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    {...project}
                    onDetailClick={(e) => navigateTo(`/${project.id}`, e)}
                  />
                ))}
              </div>
            </SectionMinimal>

            <div className="mt-16" id="components-section">
              <SectionMinimal title="Components">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pl-1">
                  {components.map((comp) => (
                    <div key={comp.title} className="group flex flex-col bg-(--bg-secondary) rounded-2xl border border-(--border-color) hover:border-(--text-muted) transition-all duration-300 ease-out overflow-hidden shadow-sm hover:shadow-md">
                      <a href={comp.liveUrl} target="_blank" rel="noopener noreferrer" className="block overflow-hidden shrink-0">
                        <div className="w-full h-40 overflow-hidden relative bg-(--bg-tertiary)">
                          <img
                            src={comp.image}
                            alt={comp.title}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
                          />
                        </div>
                      </a>
                      <div className="p-4 flex flex-col grow">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[14px] font-semibold text-(--text-primary)">{comp.title}</span>
                          <div className="flex items-center gap-2 text-(--text-muted) shrink-0 ml-2">
                            <a href={comp.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-(--text-primary) transition-colors duration-200">
                              <GitHubIcon />
                            </a>
                            <a href={comp.liveUrl} target="_blank" rel="noopener noreferrer" className="hover:text-(--text-primary) transition-colors duration-200">
                              <ExternalLinkIcon />
                            </a>
                          </div>
                        </div>
                        <p className="text-[13px] text-(--text-secondary) leading-relaxed mb-3">{comp.description}</p>
                        <div className="flex flex-wrap gap-1.5 mt-auto">
                          {comp.tech.map((t) => (
                            <span key={t} className="text-[11px] font-medium text-(--text-secondary) bg-(--bg-tertiary) px-2 py-0.5 rounded border border-(--border-color)">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionMinimal>
            </div>

            <div className="mt-16" id="oss-section">
              <SectionMinimal title="Hackathons">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pl-1">
                  {contributions.map((contrib) => (
                    <a
                      key={contrib.title}
                      href={contrib.liveUrl || contrib.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative bg-(--bg-secondary) rounded-2xl border border-(--border-color) hover:border-(--text-muted) transition-all duration-300 ease-out overflow-hidden shadow-sm hover:shadow-md flex flex-col h-full cursor-pointer"
                    >
                      <div className="w-full h-32 bg-(--bg-tertiary) border-b border-(--border-color) overflow-hidden relative flex items-center justify-center">
                        {contrib.image ? (
                          <img
                            src={contrib.image}
                            alt={contrib.title}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
                          />
                        ) : (
                          <GitHubIcon />
                        )}
                      </div>
                      <div className="p-6 flex flex-col grow">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-(--text-primary) tracking-tight group-hover:text-(--text-highlight) transition-colors duration-200 ease-out">
                            {contrib.title}
                          </h3>
                          <div className="flex items-center gap-2 shrink-0 ml-2 text-(--text-muted) group-hover:text-(--text-primary) transition-colors duration-200">
                            {contrib.githubUrl && <GitHubIcon />}
                            {contrib.liveUrl && <ExternalLinkIcon />}
                          </div>
                        </div>
                        <p className="text-(--text-secondary) text-sm leading-relaxed mb-4">
                          {contrib.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-auto">
                          {contrib.tech.map((t) => (
                            <span
                              key={t}
                              className="text-[11px] font-medium text-(--text-secondary) bg-(--bg-tertiary) px-2 py-0.5 rounded border border-(--border-color)"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </SectionMinimal>
            </div>
          </div>
        </main>
      ) : currentPath !== "/" &&
        currentPath !== "" &&
        !currentPath.includes("#") &&
        projects.find((p) => p.id === currentPath.slice(1)) ? (
        <main className="max-w-2xl mx-auto px-6 py-20 space-y-12 transition-all  min-h-[80vh] pb-24">
          {(() => {
            const project = projects.find(
              (p) => p.id === currentPath.slice(1),
            )!;
            return (
              <div className="animate-in fade-in duration-300 slide-in-from-bottom-4">
                <SectionMinimal title="Project Details">
                  {project.video && (
                    <div className="w-full rounded-2xl border border-(--border-color) bg-(--bg-secondary) mb-10 flex items-center justify-center px-4 py-8 md:px-6">
                      <div
                        className={`w-full rounded-2xl overflow-hidden border border-(--border-color) shadow-md ${
                          project.id === "nomi"
                            ? "max-w-[18rem]"
                            : "max-w-[42rem]"
                        }`}
                      >
                        <LazyVideo
                          src={project.video}
                          className="w-full h-auto"
                        />
                      </div>
                    </div>
                  )}

                  <h1 className="text-3xl font-bold text-(--text-primary) tracking-tight mb-6 pl-1">
                    {project.title}
                  </h1>

                  <div className="flex flex-wrap gap-2 mb-8 pl-1">
                    {project.tech.map((t) => (
                      <TechBadge key={t} name={t} colorClass="" />
                    ))}
                  </div>

                  <p className="text-(--text-secondary) text-[15px] leading-relaxed max-w-xl mb-10 pl-1">
                    {project.description}
                  </p>

                  <div className="flex gap-4 pl-1">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 text-[13px] font-medium bg-(--text-primary) text-(--bg-primary) rounded-lg hover:bg-(--text-secondary) transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--text-muted)"
                      >
                        Visit Website <ExternalLinkIcon />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 text-[13px] font-medium bg-(--bg-tertiary) border border-(--border-color) text-(--text-primary) rounded-lg hover:bg-(--border-color) transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--border-color)"
                      >
                        <GitHubIcon /> View Source
                      </a>
                    )}
                  </div>
                </SectionMinimal>
              </div>
            );
          })()}
        </main>
      ) : (
        <main className="max-w-2xl mx-auto px-6 py-20 space-y-12  transition-all min-h-[80vh] pb-24">
          <header id="home" className="flex flex-col pl-1 scroll-mt-24">
            <NameFlip />

            <div className="flex flex-col gap-6 mt-4">
              <p className="text-(--text-secondary) text-[15px] leading-relaxed max-w-lg font-normal">
                Design engineer based in{" "}
                <span className="font-medium text-(--text-primary)">
                  Delhi, India
                </span>
                . I work at the intersection of design and code - turning
                ideas into interfaces that feel{" "}
                <span className="font-medium text-(--text-primary)">
                  just right
                </span>
                .
                <br />
                <br />
                Shipped{" "}
                <a
                  href="https://github.com/yash2k26/NomiApp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium wavy-link"
                >
                  NOMI
                </a>{" "}
                - a production Solana dApp published on the{" "}
                <span className="font-medium text-(--text-primary)">
                  Solana dApp Store
                </span>
                , now generating revenue with real user traction.
                <br />
                Currently building{" "}
                <span className="font-medium text-(--text-primary)">
                  Aurora
                </span>
                {" "}-
                an AI-powered personal growth journal for daily reflection,
                streak and pattern tracking, and assistant-led conversations
                with journal entries for deeper insights.
              </p>

              <div className="flex flex-col gap-3">
                <div className="inline-flex items-center flex-wrap gap-2 text-[15px]">
                  <span className="text-(--text-secondary)">Get in touch:</span>
                  <span className="font-medium text-(--text-primary)">
                    bharadwaj465@gmail.com
                  </span>
                  <button
                    onClick={copyEmail}
                    className="p-1.5 rounded-md hover:bg-(--bg-tertiary) text-(--text-muted) hover:text-(--text-primary) transition-colors duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--border-color) ml-1 cursor-pointer"
                    title="Copy email"
                  >
                    {copied ? <CheckIcon /> : <CopyIcon />}
                  </button>
                </div>
                <div className="flex gap-x-4">
                  <a
                    href="mailto:bharadwaj465@gmail.com"
                    className="group flex items-center gap-2 text-[13px] font-medium text-(--text-muted) hover:text-(--text-primary) transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--border-color) rounded-md"
                  >
                    <span className="p-1.5 rounded-md bg-(--bg-tertiary) border border-(--border-color) group-hover:border-(--text-muted) transition-colors duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] group-active:scale-[0.97]">
                      <MailIcon />
                    </span>
                    <span>Email</span>
                  </a>
                  <a
                    href="https://github.com/yash2k26"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 text-[13px] font-medium text-(--text-muted) hover:text-(--text-primary) transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--border-color) rounded-md"
                  >
                    <span className="p-1.5 rounded-md bg-(--bg-tertiary) border border-(--border-color) group-hover:border-(--text-muted) transition-colors duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] group-active:scale-[0.97]">
                      <GitHubIcon />
                    </span>
                    <span>GitHub</span>
                  </a>
                  <a
                    href="https://x.com/Yassshhu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 text-[13px] font-medium text-(--text-muted) hover:text-(--text-primary) transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--border-color) rounded-md"
                  >
                    <span className="p-1.5 rounded-md bg-(--bg-tertiary) border border-(--border-color) group-hover:border-(--text-muted) transition-colors duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] group-active:scale-[0.97]">
                      <TwitterIcon />
                    </span>
                    <span>Twitter</span>
                  </a>
                </div>
              </div>
            </div>
          </header>

          <SectionMinimal title="Experience" id="experience">
            <div className="flex flex-col gap-6">
              <ExperienceRow
                role="Design Engineer"
                company={
                  <span className="text-[15px] font-medium text-(--text-primary)">
                    Freelance
                  </span>
                }
                duration="2025 - Present"
              />
              <ExperienceRow
                role="Design Engineer"
                company={
                  <span className="text-[15px] font-medium text-(--text-primary)">
                    Solana Mobile Hackathon
                  </span>
                }
                duration="2025"
              />
            </div>
          </SectionMinimal>
          <SectionMinimal title="Hackathons" id="hackathons">
            <div className="flex flex-col gap-6">
              <ExperienceRow
                role="NOMI"
                company={
                  <span className="text-[15px] font-medium text-(--text-primary)">
                    Solana Mobile Hackathon
                  </span>
                }
                duration="2025"
              />
              <ExperienceRow
                role="Web3 Project"
                company={
                  <span className="text-[15px] font-medium text-(--text-primary)">
                    Superteam Solana Hackathon
                  </span>
                }
                duration="2025"
              />
            </div>
          </SectionMinimal>

          <SectionMinimal title="Work" id="projects">
            <div className="flex flex-col gap-1">
              {projects.slice(0, 3).map((project) => (
                <ProjectRow
                  key={project.id}
                  id={project.id}
                  title={project.title}
                  roles={project.roles as any}
                  onClick={(id, e) => navigateTo(`/${id}`, e)}
                />
              ))}
            </div>
            <div className="mt-6 pl-1">
              <a
                href="/projects"
                onClick={(e) => navigateTo("/projects", e)}
                className="group inline-flex items-center gap-2 text-sm font-medium text-(--text-muted) hover:text-(--text-primary) transition-colors duration-200 ease-out focus-visible:outline-none cursor-pointer"
              >
                <span>All projects</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-200 ease-out group-hover:translate-x-0.5"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </a>
            </div>
          </SectionMinimal>
        </main>
      )}

      <Footer />
    </div>
  );
}

export default App;
