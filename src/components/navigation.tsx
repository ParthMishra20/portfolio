"use client"

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const Navigation = () => {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const { theme } = useTheme();

  // Navigation items with icons, reordered as requested
  const navItems: NavItem[] = [
    {
      name: 'Home',
      href: '#home',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
        </svg>
      ),
    },
    {
      name: 'Terminal',
      href: '#terminal',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
      ),
    },
    {
      name: 'Timeline',
      href: '#timeline',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
      ),
    },
    {
      name: 'Projects',
      href: '#projects',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
        </svg>
      ),
    },
  ];

  // Handle scroll events to update navigation state
  useEffect(() => {
    const handleScroll = () => {
      // Update navbar style on scroll
      setIsScrolled(window.scrollY > 10);
      
      // Update active section based on scroll position
      const sections = document.querySelectorAll('section');
      const scrollPosition = window.scrollY + 200; // Offset for better UX
      
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollPosition >= sectionTop && scrollPosition <= sectionTop + sectionHeight) {
          const id = section.getAttribute('id') || '';
          if (id) {
            setActiveSection(id === '' ? 'home' : id);
          }
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smoothly scroll to a section
  const scrollToSection = (sectionId: string) => {
    if (sectionId === '#') {
      // Scroll to the very top of the page when Home is clicked
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      const element = document.querySelector(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false); // Close mobile menu after click
  };

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`hidden md:flex fixed top-4 left-1/2 transform -translate-x-1/2 z-50 rounded-full px-4 py-2 ${
          isScrolled
            ? `bg-gray-900/90 backdrop-blur-lg shadow-lg border border-gray-800/50`
            : 'bg-transparent'
        } transition-all duration-300`}
      >
        <ul className="flex space-x-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.href);
                }}
                className={`flex items-center gap-1 px-4 py-2 rounded-full transition-colors ${
                  activeSection === item.href.replace('#', '') || 
                  (item.href === '#' && activeSection === 'home')
                    ? `bg-indigo-600 text-white`
                    : `hover:bg-gray-800 text-gray-300`
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </motion.nav>

      {/* Mobile Navigation Button */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-3 rounded-full shadow-lg bg-indigo-600 text-white"
          aria-label="Navigation menu"
        >
          <svg
            className={`w-6 h-6 transition-transform ${isMobileMenuOpen ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="md:hidden fixed bottom-20 right-6 z-50 bg-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-800"
        >
          <ul className="divide-y divide-gray-800">
            {navItems.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.href);
                  }}
                  className={`flex items-center gap-2 p-4 ${
                    activeSection === item.href.replace('#', '') || 
                    (item.href === '#' && activeSection === 'home')
                      ? `bg-indigo-900/30 text-indigo-400`
                      : `hover:bg-gray-800`
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </>
  );
};

export default Navigation;