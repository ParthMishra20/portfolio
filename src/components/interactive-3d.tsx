"use client"

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTheme } from 'next-themes';
import * as THREE from 'three';

// Define a proper type for the points object
interface ExtendedPoints extends THREE.Points {
  geometry: THREE.BufferGeometry & {
    attributes: {
      position: {
        array: Float32Array;
        needsUpdate: boolean;
      }
    }
  }
}

// Moving stars particle system
const StarField = ({ count = 1000, speed = 0.3 }) => {
  // Fix the ref type for THREE.Points
  const pointsRef = useRef<ExtendedPoints>(null);
  const { viewport } = useThree();
  const scrollY = useRef(0);
  const lastScrollY = useRef(0);
  
  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      scrollY.current = window.scrollY;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Create star positions with more concentration at the bottom
  const positions = React.useMemo(() => {
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Stars are spread across the screen width but concentrated at the bottom
      positions[i3] = (Math.random() - 0.5) * viewport.width * 1.5; 
      positions[i3 + 1] = Math.random() * viewport.height * 1.2 - viewport.height; // Start below screen
      positions[i3 + 2] = (Math.random() - 0.5) * 10;
    }
    
    return positions;
  }, [count, viewport]);
  
  // Create varying star sizes
  const sizes = React.useMemo(() => {
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // Make stars much smaller, like dots
      sizes[i] = Math.random() * 0.6 + 0.2;
      
      // Make a very few stars slightly larger, but still small
      if (Math.random() > 0.98) {
        sizes[i] = Math.random() * 0.8 + 0.4;
      }
    }
    
    return sizes;
  }, [count]);
  
  // Move stars upward on each frame - adjust for scrolling
  useFrame(() => {
    if (pointsRef.current) {
      const points = pointsRef.current;
      if (points.geometry && points.geometry.attributes.position) {
        const positions = points.geometry.attributes.position.array;
        
        // Calculate scroll offset for smoother animation during scrolling
        const scrollDelta = scrollY.current - lastScrollY.current;
        lastScrollY.current = scrollY.current;
        
        for (let i = 0; i < positions.length; i += 3) {
          // Move particles upward with steady speed
          positions[i + 1] += speed * 0.2;
          
          // Adjust position when scrolling to create smooth effect
          // This makes stars appear fixed relative to scroll position
          if (Math.abs(scrollDelta) > 0) {
            positions[i + 1] += scrollDelta * 0.01; 
          }
          
          // Reset position when they go off screen
          if (positions[i + 1] > viewport.height) {
            positions[i] = (Math.random() - 0.5) * viewport.width * 1.5;
            positions[i + 1] = -viewport.height;
            positions[i + 2] = (Math.random() - 0.5) * 10;
          }
        }
        
        points.geometry.attributes.position.needsUpdate = true;
      }
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
          count={count}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05} // Reduced from 0.1 to make dots smaller
        color="#ffffff"
        transparent
        opacity={0.6} // Reduced opacity for subtlety
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors={false}
      />
    </points>
  );
};

// Subtle gradient backdrop
const GradientBackground = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  // Adjust the size to cover viewport
  const width = viewport.width * 1.2;
  const height = viewport.height * 1.5;

  // Create gradient texture matching site colors
  const texture = React.useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 128;
    
    const context = canvas.getContext('2d');
    
    // Add null check for context
    if (context) {
      const gradient = context.createLinearGradient(0, 0, 0, 128);
      
      if (isDark) {
        // Dark theme - matching the #0a0a0a site background
        gradient.addColorStop(0, 'rgba(10, 10, 10, 0.2)');
        gradient.addColorStop(0.5, 'rgba(10, 10, 10, 0.05)');
        gradient.addColorStop(1, 'rgba(10, 10, 10, 0.2)');
      } else {
        // Light theme - matching the #121212 site background
        gradient.addColorStop(0, 'rgba(18, 18, 18, 0.2)');
        gradient.addColorStop(0.5, 'rgba(18, 18, 18, 0.05)');
        gradient.addColorStop(1, 'rgba(18, 18, 18, 0.2)');
      }
      
      context.fillStyle = gradient;
      context.fillRect(0, 0, 32, 128);
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    
    return texture;
  }, [isDark]);

  return (
    <mesh ref={meshRef} position={[0, 0, -10]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} transparent opacity={0.5} />
    </mesh>
  );
};

const Interactive3D = () => {
  const [mounted, setMounted] = useState(false);

  // Handle client-side only rendering to prevent hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Render nothing on server-side to prevent hydration mismatch
  if (!mounted) return null;
  
  return (
    <div className="h-full w-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        {/* Gradient background */}
        <GradientBackground />
        
        {/* Rising stars - slower speed and fewer stars for subtlety */}
        <StarField count={150} speed={0.03} />
      </Canvas>
    </div>
  );
};

export default Interactive3D;