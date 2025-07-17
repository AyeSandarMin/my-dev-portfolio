import { useEffect } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

const About = () => {
  useEffect(() => {
    let hasAnimated = false;

    gsap.set("#about-title", { visibility: "hidden" });
    gsap.set("#about-desc", { visibility: "hidden" });
    gsap.set(".about-paragraph", { visibility: "hidden" });
    gsap.set("#resume-link", { visibility: "hidden" });
    gsap.set("#profile-image", { clipPath: "inset(100% 0 0 0)" });

    const revealTitle = () => {
      gsap.set("#about-title", { visibility: "visible" });

      const titleSplit = new SplitText("#about-title", {
        type: "chars",
        charsClass: "title-char",
      });

      gsap.set(titleSplit.chars, {
        opacity: 0,
        y: 20,
      });

      const indices = titleSplit.chars.map((_, index) => index);
      const shuffledIndices = indices.sort(() => Math.random() - 0.5);

      shuffledIndices.forEach((index, i) => {
        gsap.to(titleSplit.chars[index], {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
          delay: i * 0.05,
        });
      });

      return titleSplit;
    };

    const revealDescription = () => {
      gsap.set("#about-desc", { visibility: "visible" });

      const descSplit = new SplitText("#about-desc", {
        type: "words",
        wordsClass: "desc-word",
      });

      gsap.set(descSplit.words, {
        opacity: 0,
        y: 20,
      });

      gsap.to(descSplit.words, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.05,
      });

      return descSplit;
    };

    const revealParagraphs = () => {
      const paragraphs = document.querySelectorAll(".about-paragraph");
      const splits: SplitText[] = [];

      paragraphs.forEach((paragraph, paragraphIndex) => {
        gsap.set(paragraph, { visibility: "visible" });

        const paragraphSplit = new SplitText(paragraph, {
          type: "chars",
          charsClass: "paragraph-char",
        });

        gsap.set(paragraphSplit.chars, {
          opacity: 0,
          y: 20,
        });

        const indices = paragraphSplit.chars.map((_, index) => index);
        const shuffledIndices = indices.sort(() => Math.random() - 0.5);

        shuffledIndices.forEach((index, i) => {
          gsap.to(paragraphSplit.chars[index], {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out",
            delay: paragraphIndex * 0.8 + i * 0.03,
          });
        });

        splits.push(paragraphSplit);
      });

      return splits;
    };

    const revealResumeLink = () => {
      gsap.set("#resume-link", { visibility: "visible" });

      const resumeLink = new SplitText("#resume-link", {
        type: "chars",
        charsClass: "resume-char",
      });

      gsap.set(resumeLink.chars, {
        opacity: 0,
        y: 20,
      });

      const indices = resumeLink.chars.map((_, index) => index);
      const shuffledIndices = indices.sort(() => Math.random() - 0.5);

      shuffledIndices.forEach((index, i) => {
        gsap.to(resumeLink.chars[index], {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
          delay: i * 0.05,
        });
      });

      return resumeLink;
    };

    const revealProfileImage = () => {
      gsap.to("#profile-image", {
        clipPath: "inset(0% 0 0 0)",
        duration: 1.2,
        ease: "power2.out",
      });
    };

    const handleAboutSectionVisible = () => {
      console.log(
        "About section becoming visible - checking if should animate"
      );

      if (hasAnimated) {
        console.log("About animations already triggered, skipping");
        return;
      }

      hasAnimated = true;
      console.log("Starting About entry animations for the first time");

      gsap.set("#about-title", { visibility: "hidden" });
      gsap.set("#about-desc", { visibility: "hidden" });
      gsap.set(".about-paragraph", { visibility: "hidden" });
      gsap.set("#resume-link", { visibility: "hidden" });
      gsap.set("#profile-image", { clipPath: "inset(100% 0 0 0)" });

      gsap.set("#about-content", { y: 0, x: 0, opacity: 1 });
      gsap.set("#profile-image", { y: 0, x: 0, opacity: 1 });

      setTimeout(() => {
        const titleSplit = revealTitle();

        setTimeout(() => {
          const descSplit = revealDescription();

          setTimeout(() => {
            const resumeSplit = revealResumeLink();

            setTimeout(() => {
              const paragraphSplits = revealParagraphs();

              setTimeout(() => {
                revealProfileImage();
              }, 500);

              setTimeout(() => {
                titleSplit.revert();
                descSplit.revert();
                resumeSplit.revert();
                paragraphSplits.forEach((split) => split.revert());
              }, 2000);
            }, 800);
          }, 1240);
        }, 800);
      }, 300);
    };

    window.addEventListener("aboutSectionVisible", handleAboutSectionVisible);

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      window.removeEventListener(
        "aboutSectionVisible",
        handleAboutSectionVisible
      );
    };
  }, []);

  return (
    <div
      id="about-section"
      className="w-full h-screen bg-white flex items-center"
    >
      <div className="max-w-7xl mx-auto px-8 flex items-center h-full">
        <div id="about-content" className="w-2/3 pr-12">
          <h1
            id="about-title"
            className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8"
          >
            About Me
          </h1>

          <div
            id="about-desc"
            className="space-y-6 text-lg text-gray-600 leading-relaxed"
          >
            <p>
              I'm a front-end-focused software engineer from Myanmar, currently
              based in Bangkok. Since 2018, I’ve been crafting websites and web
              apps that blend interactivity, functionality, and beautiful
              design.
            </p>
            <p>
              I'm passionate about creating digital experiences that not only
              work well but feel seamless and visually engaging. Inspired by
              creative developers and designers around the world, I’m always
              exploring new ways to make the web more dynamic and user-friendly.
            </p>
            <p>
              Outside of work, I keep my creativity alive through cooking,
              planting, and cycling.
            </p>
          </div>

          <div className="mt-8">
            <a
              href="/aye-resume-2025.pdf"
              id="resume-link"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200 cursor-pointer border-b border-gray-300 hover:border-gray-500"
            >
              see my resume
            </a>
          </div>
        </div>

        <div className="w-1/3 h-full flex items-center justify-center">
          <div
            id="profile-image"
            className="w-80 h-80 overflow-hidden shadow-2xl border-gray-100"
          >
            <img
              src="/my-profile.jpeg"
              alt="Profile"
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
