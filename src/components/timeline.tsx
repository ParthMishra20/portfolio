"use client"

import React, { useState, useEffect } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { Briefcase, GraduationCap, Award, Star } from 'lucide-react';
import { useTheme } from 'next-themes';
import styles from './timeline.module.css'; // Import our custom CSS module

const Timeline = () => {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Set mounted to true on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Only render the theme-dependent content on the client side
  const isDark = mounted ? theme === 'dark' || (theme === 'system' && systemTheme === 'dark') : false;
  
  const iconStyle = {
    background: isDark ? '#1e293b' : '#ffffff',
    color: isDark ? '#e2e8f0' : '#334155',
    boxShadow: isDark ? '0 0 0 4px #0f172a' : '0 0 0 4px #f1f5f9'
  };
  
  const contentStyle = {
    background: isDark ? '#1e293b' : '#ffffff',
    color: isDark ? '#e2e8f0' : '#1e293b'
  };
  
  const contentArrowStyle = {
    borderRight: isDark ? '7px solid #1e293b' : '7px solid #ffffff'
  };
  
  // Custom date style to improve visibility
  const dateStyle = {
    color: isDark ? '#38bdf8' : '#1e40af', // Bright blue for dark mode, dark blue for light mode
    fontWeight: 600,
  };

  return (
    <VerticalTimeline lineColor={isDark ? '#334155' : '#cbd5e1'}>
      {/* Education */}
      <VerticalTimelineElement
        className="vertical-timeline-element--education"
        date="2022 - 2026"
        dateClassName="vertical-timeline-element-date"
        contentStyle={contentStyle}
        contentArrowStyle={contentArrowStyle}
        iconStyle={{...iconStyle, background: isDark ? '#1e40af' : '#3b82f6'}}
        icon={<GraduationCap className="w-5 h-5" />}
      >
        <h3 className="font-bold text-xl">Bachelor of Technology in Computer Science and Engineering</h3>
        <h4 className="font-semibold">Bennett University</h4>
        <p>
          Currently pursuing a B.Tech specializing in Cloud Computing. Gaining hands-on experience in 
          cloud technologies and cutting-edge innovations through coursework and practical projects.
        </p>
      </VerticalTimelineElement>

      {/* Leadership Roles */}
      <VerticalTimelineElement
        className="vertical-timeline-element--work"
        date="Aug 2023 - Apr 2024"
        dateClassName="vertical-timeline-element-date"
        contentStyle={contentStyle}
        contentArrowStyle={contentArrowStyle}
        iconStyle={iconStyle}
        icon={<Briefcase className="w-5 h-5" />}
      >
        <h3 className="font-bold text-xl">General Secretary of Product Design & Technology</h3>
        <h4 className="font-semibold">Bennett University</h4>
        <p>
          Led initiatives to foster innovation and collaboration within the tech and design communities on campus.
          Organized workshops, events, and projects to enhance students' practical skills and industry exposure.
        </p>
      </VerticalTimelineElement>

      <VerticalTimelineElement
        className="vertical-timeline-element--work"
        date="Aug 2023 - Apr 2024"
        dateClassName="vertical-timeline-element-date"
        contentStyle={contentStyle}
        contentArrowStyle={contentArrowStyle}
        iconStyle={iconStyle}
        icon={<Briefcase className="w-5 h-5" />}
      >
        <h3 className="font-bold text-xl">Head of Design</h3>
        <h4 className="font-semibold">Bennett Cloud Computing Club</h4>
        <p>
          Led the design team to create engaging visual content and enhance the club's presence in cloud computing 
          events and initiatives. Developed branding materials and interactive resources for workshops and seminars.
        </p>
      </VerticalTimelineElement>

      {/* Achievement */}
      <VerticalTimelineElement
        className="vertical-timeline-element--award"
        date="April 2024"
        dateClassName="vertical-timeline-element-date"
        contentStyle={contentStyle}
        contentArrowStyle={contentArrowStyle}
        iconStyle={{...iconStyle, background: isDark ? '#b91c1c' : '#ef4444'}}
        icon={<Award className="w-5 h-5" />}
      >
        <h3 className="font-bold text-xl">AWS Certified Cloud Practitioner</h3>
        <h4 className="font-semibold">Amazon Web Services</h4>
        <p>
          Earned the AWS Certified Cloud Practitioner certification, showcasing proficiency in cloud concepts, 
          AWS core services, and cloud architecture fundamentals. Gained hands-on knowledge of cloud best practices 
          for effective solution deployment and management.
        </p>
      </VerticalTimelineElement>

      {/* Internship Experience */}
      <VerticalTimelineElement
        className="vertical-timeline-element--work"
        date="Aug 2024 - Oct 2024"
        dateClassName="vertical-timeline-element-date"
        contentStyle={contentStyle}
        contentArrowStyle={contentArrowStyle}
        iconStyle={iconStyle}
        icon={<Briefcase className="w-5 h-5" />}
      >
        <h3 className="font-bold text-xl">Frontend Development Intern</h3>
        <h4 className="font-semibold">Shiksak - Maidenhead, UK</h4>
        <p>
          Enhanced the Shiksak platform's frontend by designing intuitive, responsive interfaces for students, 
          faculty, and administrators. Developed dashboards to streamline course management, attendance tracking, 
          and user engagement monitoring.
        </p>
      </VerticalTimelineElement>

      <VerticalTimelineElement
        iconStyle={{
          background: isDark ? '#059669' : '#10b981',
          color: '#ffffff',
        }}
        icon={<Star className="w-5 h-5" />}
      />
    </VerticalTimeline>
  );
};

export default Timeline;