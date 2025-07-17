import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { SplitText } from "gsap/SplitText";
import { useState } from "react";

gsap.registerPlugin(ScrambleTextPlugin, SplitText);

interface IntroBannerProps {
  onEnterClick?: () => void;
}

const IntroBanner = ({ onEnterClick }: IntroBannerProps) => {
  const defaultCharacter = "NIMRADNASEYAVRTULMNVIVFDFWJS";
  const [isWelcomeAnimationActive, setIsWelcomeAnimationActive] =
    useState(true);

  useGSAP(() => {
    const tl = gsap.timeline();

    gsap.set("#im-text", { opacity: 0, y: 30 });
    gsap.set("#first-banner-name", {
      innerHTML: "AYE SANDAR MIN",
      opacity: 1,
    });
    gsap.set("#header-asdm", { opacity: 0, y: -20 });
    gsap.set("#footer-button", { opacity: 0, y: 20 });

    const heroSplit = new SplitText("#first-banner-name", {
      type: "chars, words",
    });

    gsap.set(heroSplit.chars, {
      yPercent: 100,
      opacity: 0,
    });

    const animateText = (text: string, duration = 0.4) => {
      return new Promise<void>((resolve) => {
        gsap.set("#welcome-text", { innerHTML: "", opacity: 0 });

        setTimeout(() => {
          gsap.set("#welcome-text", { innerHTML: text, opacity: 1 });
          const split = new SplitText("#welcome-text", {
            type: "chars, words",
          });
          gsap.set(split.chars, { yPercent: 100, opacity: 0 });

          gsap.to(split.chars, {
            duration: duration,
            yPercent: 0,
            opacity: 1,
            ease: "expo.out",
            stagger: 0.05,
            onComplete: () => {
              setTimeout(() => {
                gsap.to(split.chars, {
                  duration: 0.2,
                  yPercent: -100,
                  opacity: 0,
                  ease: "power2.in",
                  stagger: 0.02,
                  onComplete: () => {
                    split.revert();
                    gsap.set("#welcome-text", { innerHTML: "", opacity: 0 });
                    resolve();
                  },
                });
              }, 1000);
            },
          });
        }, 100);
      });
    };

    tl.call(() => {
      animateText("HELLO!").then(() => {
        gsap.to("#welcome-text", {
          duration: 0.5,
          opacity: 0,
          y: -30,
          ease: "power2.in",
        });

        setTimeout(() => {
          gsap.to("#im-text", {
            duration: 0.2,
            opacity: 1,
            y: 0,
            ease: "power2.out",
          });

          setTimeout(() => {
            gsap.to(heroSplit.chars, {
              duration: 0.2,
              yPercent: 0,
              opacity: 1,
              ease: "expo.out",
              stagger: 0.05,
              onComplete: () => {
                gsap.to("#header-asdm", {
                  duration: 0.6,
                  opacity: 1,
                  y: 0,
                  ease: "power2.out",
                });
                gsap.to("#footer-button", {
                  duration: 0.6,
                  opacity: 1,
                  y: 0,
                  ease: "power2.out",
                  delay: 0.2,
                });

                setIsWelcomeAnimationActive(false);
              },
            });
          }, 500);
        }, 200);
      });
    });
  }, []);

  const handleMouseEnter = () => {
    if (!isWelcomeAnimationActive) {
      gsap.to("#first-banner-name", {
        duration: 0.8,
        ease: "sine.in",
        scrambleText: {
          text: "AYE SANDAR MIN",
          speed: 2,
          chars: defaultCharacter,
        },
      });
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      <div className="flex justify-center items-center pt-6">
        <h6 id="header-asdm">ASDM</h6>
      </div>
      <div className="flex-1 flex justify-center items-center">
        <div className="relative text-center">
          <h2
            id="welcome-text"
            className="font-bold text-8xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
          ></h2>

          <div className="flex justify-center items-center">
            <h6 id="im-text" className="mr-4 text-2xl cursor-pointer">
              I'm
            </h6>
            <h1
              id="first-banner-name"
              className="font-bold text-8xl cursor-pointer"
              style={{ width: "max-content", minWidth: "800px" }}
              onMouseEnter={handleMouseEnter}
            ></h1>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center pb-6">
        <button
          id="footer-button"
          className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 cursor-pointer transition-all duration-200"
          onClick={onEnterClick}
        >
          LET'S GO!
        </button>
      </div>
    </div>
  );
};

export default IntroBanner;
