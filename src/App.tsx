import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import IntroBanner from "./components/IntroBanner";
import Hero3D from "./components/Hero3D";
import About from "./components/About";
import ProjectsSection from "./components/ProjectsSection";

gsap.registerPlugin(ScrollTrigger);

const App = () => {
  const introBannerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);

  const handleEnterClick = () => {
    const audio = new Audio("/src/assets/audio/button-27.wav");
    audio.volume = 0.4;
    audio.play().catch((e) => console.log("Audio play failed:", e));

    const masterTimeline = gsap.timeline();

    masterTimeline
      .to(introBannerRef.current, {
        duration: 0.8,
        y: "-100vh",
        ease: "power2.inOut",
      })

      .call(() => {
        if (heroRef.current) {
          gsap.set(heroRef.current, {
            opacity: 1,
            y: 0,
            zIndex: 10,
          });
        }
        setTimeout(() => {
          const event = new CustomEvent("heroSubtitleReveal");
          window.dispatchEvent(event);
        }, 200);
      });
  };

  useEffect(() => {
    let currentSection = 0;
    let isAnimating = false;
    let aboutAnimationTriggered = false;
    let projectsAnimationTriggered = false;

    if (aboutRef.current) {
      gsap.set(aboutRef.current, { y: "100vh" });
    }
    if (projectsRef.current) {
      gsap.set(projectsRef.current, { x: "-100vw" });
    }

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (isAnimating) {
        return;
      }

      console.log(
        `BEFORE: Current section: ${currentSection}, Scroll direction: ${
          e.deltaY > 0 ? "down" : "up"
        }`
      );

      if (e.deltaY > 0) {
        if (currentSection === 0) {
          console.log("=== STARTING Hero -> About ===");
          isAnimating = true;
          currentSection = 1;

          if (projectsRef.current) {
            gsap.set(projectsRef.current, { x: "-100vw" });
            console.log("Projects section forced to x: -100vw");
          }
          gsap.to(aboutRef.current, {
            y: "0vh",
            duration: 1.5,
            ease: "power2.inOut",
            onStart: () => {
              console.log("About animation started");
            },
            onComplete: () => {
              isAnimating = false;
              console.log(
                "=== About animation complete - staying in About section ==="
              );
              if (!aboutAnimationTriggered) {
                aboutAnimationTriggered = true;
                const event = new CustomEvent("aboutSectionVisible");
                window.dispatchEvent(event);
              }
            },
          });
        } else if (currentSection === 1) {
          isAnimating = true;
          currentSection = 2;

          gsap.to(projectsRef.current, {
            x: "0vw",
            duration: 1.5,
            ease: "power2.inOut",
            onStart: () => {
              console.log("Projects animation started");
            },
            onComplete: () => {
              isAnimating = false;
              if (!projectsAnimationTriggered) {
                projectsAnimationTriggered = true;
                const event = new CustomEvent("projectsSectionVisible");
                window.dispatchEvent(event);
              }
            },
          });
        } else {
          console.log("No more sections to scroll to");
        }
      } else if (e.deltaY < 0) {
        if (currentSection === 2) {
          isAnimating = true;
          currentSection = 1;

          projectsAnimationTriggered = false;
          gsap.to(projectsRef.current, {
            x: "-100vw",
            duration: 1.5,
            ease: "power2.inOut",
            onStart: () => {
              console.log("Projects slide back started");
            },
            onComplete: () => {
              isAnimating = false;
            },
          });
        } else if (currentSection === 1) {
          isAnimating = true;
          currentSection = 0;

          aboutAnimationTriggered = false;

          gsap.to(aboutRef.current, {
            y: "100vh",
            duration: 1.5,
            ease: "power2.inOut",
            onComplete: () => {
              isAnimating = false;
            },
          });
        } else {
          console.log("Already at Hero section");
        }
      }

      console.log(`AFTER: Current section will be: ${currentSection}`);
    };

    const navigateToProjects = () => {
      if (isAnimating) return;
      isAnimating = true;
      currentSection = 2;

      gsap.set(projectsRef.current, { x: "-100vw" });
      const directNavTimeline = gsap.timeline({
        onComplete: () => {
          isAnimating = false;
        },
      });

      directNavTimeline
        .to(aboutRef.current, {
          y: "0vh",
          duration: 0.6,
          ease: "power2.out",
          onStart: () => {
            console.log("About quick animation started (direct navigation)");
          },
        })
        .to(
          projectsRef.current,
          {
            x: "0vw",
            duration: 0.6,
            ease: "power2.out",
            onStart: () => {
              console.log(
                "Projects quick animation started (direct navigation)"
              );
            },
            onComplete: () => {
              if (!projectsAnimationTriggered) {
                projectsAnimationTriggered = true;
                const event = new CustomEvent("projectsSectionVisible");
                window.dispatchEvent(event);
              }
            },
          },
          "-=0.2"
        );
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("navigateToProjects", navigateToProjects);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("navigateToProjects", navigateToProjects);
    };
  }, []);

  return (
    <div className="w-full min-h-screen relative overflow-hidden">
      <div ref={heroRef} className="fixed inset-0 w-full h-screen z-10">
        <Hero3D />
      </div>

      <div
        ref={aboutRef}
        className="fixed inset-0 w-full h-screen z-20"
        style={{ transform: "translateY(100vh)" }}
      >
        <About />
      </div>

      <div
        ref={projectsRef}
        className="fixed inset-0 w-full h-screen z-30"
        style={{ transform: "translateX(-100vw)" }}
      >
        <ProjectsSection />
      </div>

      <div
        ref={introBannerRef}
        className="fixed inset-0 w-full h-screen z-50 overflow-hidden"
      >
        <IntroBanner onEnterClick={handleEnterClick} />
      </div>
    </div>
  );
};

export default App;
