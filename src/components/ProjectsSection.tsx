import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
}

const ProjectsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  const projects: Project[] = [
    {
      id: 1,
      title: "E-Commerce Platform",
      description:
        "A full-stack e-commerce solution with modern UI/UX, payment integration, and real-time inventory management. Built with scalability and performance in mind.",
      image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
      technologies: ["React", "Node.js", "PostgreSQL", "Stripe"],
    },
    {
      id: 2,
      title: "AI-Powered Analytics Dashboard",
      description:
        "Interactive dashboard featuring machine learning insights, real-time data visualization, and predictive analytics for business intelligence.",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      technologies: ["Python", "TensorFlow", "D3.js", "FastAPI"],
    },
    {
      id: 3,
      title: "Mobile Fitness App",
      description:
        "Cross-platform fitness tracking application with workout plans, progress monitoring, and social features to keep users motivated.",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
      technologies: ["React Native", "Firebase", "Redux", "Node.js"],
    },
    {
      id: 4,
      title: "Blockchain Voting System",
      description:
        "Secure and transparent voting platform utilizing blockchain technology to ensure election integrity and voter privacy.",
      image:
        "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop",
      technologies: ["Solidity", "Web3.js", "Ethereum", "React"],
    },
    {
      id: 5,
      title: "Real-time Chat Platform",
      description:
        "Scalable messaging platform with end-to-end encryption, file sharing, and video calling capabilities for seamless communication.",
      image:
        "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=600&h=400&fit=crop",
      technologies: ["Socket.io", "Express", "MongoDB", "WebRTC"],
    },
  ];

  useEffect(() => {
    const cards = cardsRef.current;
    if (!cards.length) return;

    gsap.set(cards, {
      y: 60,
      opacity: 0,
      scale: 0.9,
      rotateX: 10,
    });

    const handleProjectsSectionVisible = () => {
      console.log(
        "Projects section becoming visible - starting entry animations"
      );

      const tl = gsap.timeline({ delay: 0.3 });

      cards.forEach((card, index) => {
        tl.to(
          card,
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotateX: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          index * 0.15
        );
      });
    };

    window.addEventListener(
      "projectsSectionVisible",
      handleProjectsSectionVisible
    );

    return () => {
      window.removeEventListener(
        "projectsSectionVisible",
        handleProjectsSectionVisible
      );
    };
  }, []);

  const addCardRef = (el: HTMLDivElement | null, index: number) => {
    if (el) {
      cardsRef.current[index] = el;
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">
            Featured Projects
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover my latest work showcasing innovative solutions and
            cutting-edge technologies
          </p>
        </div>

        <div ref={sectionRef} className="relative max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="relative w-full max-w-4xl">
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  ref={(el) => addCardRef(el, index)}
                  className="w-full mb-8"
                  style={{
                    transformStyle: "preserve-3d",
                    perspective: "1000px",
                  }}
                >
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                    <div className="grid md:grid-cols-2 gap-0 h-96">
                      <div className="relative overflow-hidden">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-transparent"></div>
                      </div>

                      <div className="p-8 flex flex-col justify-center">
                        <div className="mb-4">
                          <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium mb-3">
                            Project {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>

                        <h3 className="text-3xl font-bold text-white mb-4">
                          {project.title}
                        </h3>

                        <p className="text-gray-300 text-lg leading-relaxed mb-6">
                          {project.description}
                        </p>

                        <div className="mb-6">
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, techIndex) => (
                              <span
                                key={techIndex}
                                className="px-3 py-1 bg-white/10 text-white rounded-lg text-sm border border-white/20"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2">
                            <span>View Project</span>
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </button>
                          <button className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors duration-200 border border-white/20">
                            GitHub
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsSection;
