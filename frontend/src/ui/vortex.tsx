import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/utils';

interface VortexProps {
  children: React.ReactNode;
  backgroundColor?: string;
  className?: string;
}

export function Vortex({
  children,
  backgroundColor = 'black',
  className,
}: VortexProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // Update dimensions
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });

        if (canvasRef.current) {
          canvasRef.current.width = width;
          canvasRef.current.height = height;
        }
      }
    };

    // Initial size update
    updateDimensions();

    // Initialize particles
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const particles: Particle[] = [];
    const particleCount = 200;
    
    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      alpha: number;

      constructor() {
        this.x = Math.random() * dimensions.width;
        this.y = Math.random() * dimensions.height;
        this.size = Math.random() * 4 + 0.1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = '#ffffff';
        this.alpha = Math.random() * 0.5 + 0.1;
      }

      update() {
        // Create a vortex effect - particles move toward center
        const centerX = dimensions.width / 2;
        const centerY = dimensions.height / 2;
        const distX = centerX - this.x;
        const distY = centerY - this.y;
        const distance = Math.sqrt(distX * distX + distY * distY);
        
        // Calculate angle to center
        const angle = Math.atan2(distY, distX);
        
        // Tangential speed (perpendicular to center direction for swirl)
        const tangSpeed = 0.2 * (1 - distance / (dimensions.width / 2));
        
        // Add spiral effect
        this.speedX = Math.cos(angle + Math.PI / 2) * tangSpeed + distX * 0.0003;
        this.speedY = Math.sin(angle + Math.PI / 2) * tangSpeed + distY * 0.0003;
        
        this.x += this.speedX;
        this.y += this.speedY;

        // Reset particles if they go off screen
        if (this.x < 0 || this.x > dimensions.width || 
            this.y < 0 || this.y > dimensions.height) {
          this.x = Math.random() * dimensions.width;
          this.y = Math.random() * dimensions.height;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fill();
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Animation function
    const animate = () => {
      if (!canvasRef.current || !ctx) return;
      
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      
      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(ctx);
      }
      
      // Connect particles with lines
      connectParticles(particles, ctx);
      
      requestAnimationFrame(animate);
    };

    // Connect nearby particles with lines
    const connectParticles = (particles: Particle[], ctx: CanvasRenderingContext2D) => {
      const maxDistance = 100;
      
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.strokeStyle = '#ffffff';
            ctx.globalAlpha = 0.2 * (1 - distance / maxDistance);
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    // Start animation
    animate();
    
    // Handle resize
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [dimensions.width, dimensions.height]);

  return (
    <div 
      ref={containerRef} 
      className={cn("relative overflow-hidden", className || "")}
      style={{ backgroundColor }}
    >
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0"
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}