import { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import SharedAvatar from "./SharedAvatar";

gsap.registerPlugin(SplitText);

export default function Hero3D() {
  const hasAnimated = useRef(false);
  const subtitleSplitRef = useRef<SplitText | null>(null);

  const handleHeroTrigger = () => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const revealHeader = () => {
      gsap.to("#header-asdm", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.1,
      });
    };

    const revealSubtitle = () => {
      if (subtitleSplitRef.current) {
        gsap.to(subtitleSplitRef.current.words, {
          yPercent: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.1,
        });
      }
    };

    const revealProjectsLink = () => {
      gsap.set("#projects-link", { visibility: "visible" });

      const projectsLink = new SplitText("#projects-link", {
        type: "chars",
        charsClass: "projects-char",
      });

      gsap.set(projectsLink.chars, {
        opacity: 0,
        y: 20,
      });

      const indices = projectsLink.chars.map((_, index) => index);
      const shuffledIndices = indices.sort(() => Math.random() - 0.5);

      shuffledIndices.forEach((index, i) => {
        gsap.to(projectsLink.chars[index], {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
          delay: i * 0.05,
        });
      });

      return projectsLink;
    };

    const startTerminalAnimation = () => {
      const terminalItems = [
        "5+ years of experiences",
        "50% confident - 50% imposter mood",
        "Turns anxiety into pixel magic",
        "Emotionally debugged on the daily",
        "Coffee is my co-pilot",
        "Code cute, fail forward, repeat",
      ];

      gsap.to("#terminal-list", {
        opacity: 1,
        y: 0,
        duration: 0.35,
        ease: "power2.out",
      });

      let cumulativeDelay = 0;
      terminalItems.forEach((item, index) => {
        setTimeout(() => {
          typeText(`terminal-item-${index}`, item, 50, () => {});
        }, cumulativeDelay);

        const typingTime = item.length * 50;
        const pauseAfterLine = 600;
        cumulativeDelay += typingTime + pauseAfterLine + 100;
      });
    };

    const typeText = (
      elementId: string,
      text: string,
      speed: number,
      onComplete?: () => void
    ) => {
      const element = document.getElementById(elementId);
      if (!element) return;

      const textSpan = element.querySelector(".terminal-text") as HTMLElement;
      const leafIcon = element.querySelector(".leaf-icon") as HTMLElement;
      const cursor = element.querySelector(".terminal-cursor") as HTMLElement;
      if (!textSpan || !leafIcon || !cursor) return;

      leafIcon.style.visibility = "visible";

      setTimeout(() => {
        cursor.style.visibility = "visible";
        cursor.style.animation = "blink 1s infinite";

        textSpan.textContent = "";
        element.style.opacity = "1";

        let i = 0;
        const typeInterval = setInterval(() => {
          if (i < text.length) {
            textSpan.textContent += text.charAt(i);
            i++;
          } else {
            cursor.style.visibility = "hidden";
            clearInterval(typeInterval);

            if (onComplete) {
              onComplete();
            }
          }
        }, speed);
      }, 100);
    };

    const masterTimeline = gsap.timeline();

    masterTimeline
      .add(() => {
        revealHeader();
      })
      .add(() => {
        revealSubtitle();
      }, "+=0.3")
      .add(() => {
        console.log("Starting projects link animation");
        const projectsSplit = revealProjectsLink();
        gsap.delayedCall(1, () => {
          projectsSplit.revert();
        });
      }, "+=0.8")
      .add(() => {
        console.log("Starting terminal animation");
        startTerminalAnimation();
      }, "+=0.5")
      .call(
        () => {
          console.log("Hero animations completed");
        },
        [],
        "+=2"
      );
  };

  useEffect(() => {
    console.log("Hero3D useEffect running");
    gsap.set("#header-asdm", { opacity: 0, y: -20 });
    gsap.set("#hero-subtitle", { opacity: 1 });
    gsap.set("#terminal-list", { opacity: 0, y: 20 });
    gsap.set("#projects-link", { visibility: "hidden" });

    const subtitleSplit = new SplitText("#hero-subtitle", {
      type: "words",
      wordsClass: "split-word",
    });
    subtitleSplitRef.current = subtitleSplit;

    gsap.set(subtitleSplit.words, {
      yPercent: 100,
      opacity: 0,
    });
    const terminalItems = document.querySelectorAll('[id^="terminal-item-"]');
    terminalItems.forEach((item) => {
      const textSpan = item.querySelector(".terminal-text") as HTMLElement;
      const leafIcon = item.querySelector(".leaf-icon") as HTMLElement;
      const cursor = item.querySelector(".terminal-cursor") as HTMLElement;

      if (textSpan && leafIcon && cursor) {
        leafIcon.style.visibility = "hidden";
        cursor.style.visibility = "hidden";
        (item as HTMLElement).style.opacity = "0";
        textSpan.textContent = "";
      }
    });

    const handleAnimationTrigger = () => {
      console.log("Received heroSubtitleReveal event");
      handleHeroTrigger();
    };

    window.addEventListener("heroSubtitleReveal", handleAnimationTrigger);

    return () => {
      if (subtitleSplitRef.current) {
        subtitleSplitRef.current.revert();
      }
      window.removeEventListener("heroSubtitleReveal", handleAnimationTrigger);
    };
  }, []);

  return (
    <div className="w-full h-screen flex flex-col bg-white relative">
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
        `,
        }}
      />

      <div className="flex justify-center items-center pt-6 absolute w-full z-10">
        <h6 id="header-asdm">ayesandarmin</h6>
      </div>

      <div className="absolute left-30 top-1/2 transform -translate-y-1/2 z-10">
        <h2
          id="hero-subtitle"
          className="text-2xl font-light text-gray-700 leading-relaxed max-w-md overflow-hidden"
          style={{
            maskImage: "linear-gradient(to bottom, black 0%, black 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 100%)",
          }}
        >
          {" "}
          Hi, I'm <span className="font-bold">Aye</span>.<br />A
          <span className="font-bold"> Full-stack developer </span>blending
          <br />
          function, form, and flow.
        </h2>

        <div className="mt-6">
          <a
            href="#projects"
            id="projects-link"
            className="text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200 cursor-pointer border-b border-gray-300 hover:border-gray-500"
            onClick={(e) => {
              e.preventDefault();
              const event = new CustomEvent("navigateToProjects");
              window.dispatchEvent(event);
            }}
          >
            see my projects
          </a>
        </div>
      </div>

      <div className="absolute right-33 top-1/2 transform -translate-y-1/2 z-10">
        <div id="terminal-list" className="font-mono text-sm max-w-md">
          <div className="space-y-12">
            <div id="terminal-item-0" className="text-gray-700 relative">
              <span className="terminal-text pl-6"></span>
              <span className="terminal-cursor invisible">|</span>
              <div className="absolute left-0 top-0 w-4 h-4 invisible leaf-icon">
                <img src="/leaf.gif" alt="leaf" className="w-full h-full" />
              </div>
            </div>
            <div id="terminal-item-1" className="text-gray-700 relative ml-4">
              <span className="terminal-text pl-6"></span>
              <span className="terminal-cursor invisible">|</span>
              <div className="absolute left-0 top-0 w-4 h-4 invisible leaf-icon">
                <img src="/leaf.gif" alt="leaf" className="w-full h-full" />
              </div>
            </div>
            <div id="terminal-item-2" className="text-gray-700 relative ml-2">
              <span className="terminal-text pl-6"></span>
              <span className="terminal-cursor invisible">|</span>
              <div className="absolute left-0 top-0 w-4 h-4 invisible leaf-icon">
                <img src="/leaf.gif" alt="leaf" className="w-full h-full" />
              </div>
            </div>
            <div id="terminal-item-3" className="text-gray-700 relative ml-6">
              <span className="terminal-text pl-6"></span>
              <span className="terminal-cursor invisible">|</span>
              <div className="absolute left-0 top-0 w-4 h-4 invisible leaf-icon">
                <img src="/leaf.gif" alt="leaf" className="w-full h-full" />
              </div>
            </div>
            <div id="terminal-item-4" className="text-gray-700 relative ml-1">
              <span className="terminal-text pl-6"></span>
              <span className="terminal-cursor invisible">|</span>
              <div className="absolute left-0 top-0 w-4 h-4 invisible leaf-icon">
                <img src="/leaf.gif" alt="leaf" className="w-full h-full" />
              </div>
            </div>
            <div id="terminal-item-5" className="text-gray-700 relative ml-3">
              <span className="terminal-text pl-6"></span>
              <span className="terminal-cursor invisible">|</span>
              <div className="absolute left-0 top-0 w-4 h-4 invisible leaf-icon">
                <img src="/leaf.gif" alt="leaf" className="w-full h-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Canvas
        camera={{ position: [0, 1.4, 2.23], fov: 40 }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <pointLight position={[-5, 5, 5]} intensity={0.5} />
        <Suspense fallback={null}>
          <SharedAvatar enableRotation={true} />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={true}
            autoRotate={true}
            autoRotateSpeed={0.5}
            target={[0, 1.5, 0]}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
