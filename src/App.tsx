import { useRef } from "react";
import { gsap } from "gsap";
import IntroBanner from "./components/IntroBanner";
import Home from "./components/Home";

const App = () => {
  const introBannerRef = useRef<HTMLDivElement>(null);

  const handleEnterClick = () => {
    console.log("handleEnterClick called!");

    // Play slide/whoosh sound effect
    const audio = new Audio("/src/assets/audio/button-27.wav");
    audio.volume = 0.4;
    audio.play().catch((e) => console.log("Audio play failed:", e));

    // Create a master timeline for coordinated animations
    const masterTimeline = gsap.timeline();

    // Step 1: Animate IntroBanner sliding up
    masterTimeline
      .to(introBannerRef.current, {
        duration: 0.8,
        y: "-100vh",
        ease: "power2.inOut",
      })
      // Step 2: Trigger Hero3D ASDM animation after IntroBanner completes
      .to(
        "#header-asdm",
        {
          opacity: 1,
          y: 0,
          duration: 2,
          ease: "power2.out",
          delay: 0.1,
        },
        "-=3"
      ); // Start 0.1 seconds before IntroBanner animation ends
  };

  return (
    <div className="w-full min-h-screen relative">
      {/* Home component - normal document flow */}
      <div className="w-full">
        <Home />
      </div>

      {/* IntroBanner - slides up on top */}
      <div ref={introBannerRef} className="fixed inset-0 w-full h-screen z-50 overflow-hidden">
        <IntroBanner onEnterClick={handleEnterClick} />
      </div>
    </div>
  );
};

export default App;
