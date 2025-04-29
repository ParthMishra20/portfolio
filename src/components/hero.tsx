"use client"

import React, { useEffect, useRef } from 'react';
import Typed from 'typed.js';

const Hero = () => {
  // Reference to store the Typed instance
  const el = useRef<HTMLSpanElement>(null);
  const typed = useRef<Typed | null>(null);

  useEffect(() => {
    if (el.current) {
      typed.current = new Typed(el.current, {
        strings: [
          'Hello, I\'m <span class="text-blue-500 font-bold">Parth Mishra</span>',
          'I build cool stuff that <span class="text-green-500 font-bold">(usually)</span> works',
          'I built this portfolio with <span class="text-rose-500 font-bold">ChatGPT 🤖</span>'
        ]
        ,
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 1500,
        startDelay: 500,
        loop: true,
        smartBackspace: true,
        cursorChar: '|',
        autoInsertCss: true,
        contentType: 'html',
      });
    }

    return () => {
      // Destroy Typed instance to prevent memory leaks
      typed.current?.destroy();
    };
  }, []);

  return (
    <div className="z-10 text-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-6">
        <span ref={el}></span>
      </h1>
      <div className="flex gap-4 justify-center mb-6">
        <a
          href="#projects"
          className="px-8 py-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          View My Work
        </a>
        <a
          href="#terminal"
          className="px-8 py-3 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          Try The Terminal
        </a>
      </div>
      
      {/* Social Media Links with Tooltips */}
      <div className="flex gap-4 justify-center mt-4">
        <div className="relative group">
          <a 
            href="https://github.com/ParthMishra20" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors inline-flex"
            aria-label="GitHub"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            GitHub
          </span>
        </div>

        <div className="relative group">
          <a 
            href="https://www.linkedin.com/in/parthmishra121202004" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors inline-flex"
            aria-label="LinkedIn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            LinkedIn
          </span>
        </div>

        <div className="relative group">
          <a 
            href="https://x.com/ParthM1210" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-black hover:bg-gray-800 text-white transition-colors inline-flex"
            aria-label="X (Twitter)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16.99 0H20.298L13.071 8.26L21.573 19.5H14.916L9.702 12.683L3.736 19.5H0.426L8.156 10.665L0 0H6.826L11.539 6.231L16.99 0ZM15.829 17.52H17.662L5.83 1.876H3.863L15.829 17.52Z"/>
            </svg>
          </a>
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            X
          </span>
        </div>

        <div className="relative group">
          <a 
            href="mailto:parthm172@gmail.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors inline-flex"
            aria-label="Email"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </a>
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Contact Me
          </span>
        </div>

        <div className="relative group">
          <a 
            href="https://drive.google.com/file/d/1wZG6x9QHsS2LjPWm8eQkEmYGV1kGzZbx/view?usp=sharing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white transition-colors inline-flex"
            aria-label="Resume"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h5v7h7v9H6z"/>
              <path d="M10 13h4v1h-4zm0 2h4v1h-4zm0 2h4v1h-4z"/>
            </svg>
          </a>
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Resume
          </span>
        </div>
      </div>
    </div>
  );
};

export default Hero;