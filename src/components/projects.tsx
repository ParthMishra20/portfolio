"use client"

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  githubLink: string;
  liveLink?: string; // Optional, as not all projects will have a live site
}

const projectsData: Project[] = [
  {
    id: 1,
    title: "Interactive E-commerce Platform",
    description: "A modern shopping experience with 3D product previews that allows users to visualize products before purchasing.",
    tags: ["React", "Three.js", "Node.js", "MongoDB"],
    githubLink: "https://github.com/yourusername/interactive-ecommerce",
    liveLink: "https://interactive-ecommerce.example.com"
  },
  {
    id: 2,
    title: "Educational Web Application",
    description: "Platform for interactive learning with gamification elements designed to make education engaging for all ages.",
    tags: ["Next.js", "TypeScript", "Firebase", "Framer Motion"],
    githubLink: "https://github.com/yourusername/educational-app",
  },
  {
    id: 3,
    title: "Agency Portfolio Site",
    description: "Award-winning creative agency website with unique interactions and animations that showcase design expertise.",
    tags: ["Three.js", "GSAP", "React", "Tailwind CSS"],
    githubLink: "https://github.com/yourusername/agency-portfolio",
    liveLink: "https://agency-portfolio.example.com"
  },
  {
    id: 4,
    title: "Data Visualization Dashboard",
    description: "Interactive dashboard for visualizing complex datasets with real-time filtering and dynamic chart generation.",
    tags: ["D3.js", "React", "Node.js", "PostgreSQL"],
    githubLink: "https://github.com/yourusername/data-dashboard",
  },
];

const Projects = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Set mounted to true on client
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Used for gradient backgrounds
  const getGradient = (index: number) => {
    const gradients = [
      "from-blue-500 to-purple-600",
      "from-green-400 to-blue-500",
      "from-yellow-400 to-orange-500",
      "from-pink-500 to-red-500",
    ];
    return gradients[index % gradients.length];
  };

  // Apply default styling for server-side rendering
  // and update styling after client-side hydration
  const cardStyle = mounted
    ? theme === "dark" 
      ? "bg-gray-800/80" 
      : "bg-gray-100"
    : "bg-gray-800/80"; // Default to dark mode for SSR
    
  const textStyle = mounted
    ? theme === "dark" 
      ? "text-gray-300" 
      : "text-gray-700"
    : "text-gray-300"; // Default to dark mode for SSR
    
  const labelStyle = mounted
    ? theme === "dark" 
      ? "text-gray-400" 
      : "text-gray-500"
    : "text-gray-400"; // Default to dark mode for SSR
    
  const tagStyle = mounted
    ? theme === "dark" 
      ? "bg-gray-700 text-gray-300" 
      : "bg-gray-200 text-gray-700"
    : "bg-gray-700 text-gray-300"; // Default to dark mode for SSR
    
  const buttonStyle = mounted
    ? theme === "dark" 
      ? "bg-gray-700 hover:bg-gray-600 text-white" 
      : "bg-gray-200 hover:bg-gray-300 text-gray-800"
    : "bg-gray-700 hover:bg-gray-600 text-white"; // Default to dark mode for SSR

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
      {projectsData.map((project, index) => (
        <motion.div
          key={project.id}
          className={`rounded-lg overflow-hidden shadow-lg ${cardStyle} hover:shadow-xl transition-all`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5 }}
        >
          {/* Card Header with gradient background */}
          <div 
            className={`h-24 bg-gradient-to-r ${getGradient(index)} flex items-center justify-center p-6`}
          >
            <h3 className="text-2xl font-bold text-white">{project.title}</h3>
          </div>
          
          <div className="p-6">
            {/* Description */}
            <p className={`mb-6 ${textStyle}`}>
              {project.description}
            </p>
            
            {/* Tech Stack */}
            <div>
              <h4 className={`text-sm uppercase font-semibold mb-2 ${labelStyle}`}>
                Tech Stack
              </h4>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((tag, i) => (
                  <span
                    key={i}
                    className={`px-3 py-1 text-sm rounded-md ${tagStyle}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 mt-4">
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-4 py-2 rounded-md ${buttonStyle} transition-colors`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.09.682-.217.682-.482 0-.237-.009-.866-.014-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.532 1.03 1.532 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.308.678.917.678 1.847 0 1.334-.012 2.41-.012 2.737 0 .267.18.577.688.48C19.137 20.166 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                GitHub Repository
              </a>
              
              {project.liveLink && (
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                    mounted ? (theme === "dark"
                      ? "bg-blue-600 hover:bg-blue-500 text-white"
                      : "bg-blue-500 hover:bg-blue-600 text-white")
                    : "bg-blue-600 hover:bg-blue-500 text-white" // Default for SSR
                  } transition-colors`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View Live
                </a>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Projects;