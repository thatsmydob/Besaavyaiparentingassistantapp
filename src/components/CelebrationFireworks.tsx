/**
 * CelebrationFireworks Component
 * Visible, celebratory fireworks animation for Step 3 completion screen
 * 
 * DESIGN SPECS:
 * - Multiple firework bursts at different positions
 * - Particles radiate outward from burst points
 * - Vibrant but soft pastel colors
 * - Higher opacity for visibility (0.6-0.8)
 * - Gentle but noticeable celebration effect
 * - Triggers once on mount
 */
import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface FireworkParticle {
  id: string;
  burstX: number;
  burstY: number;
  angle: number;
  distance: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
}

interface FloatingConfetti {
  id: string;
  x: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
  rotation: number;
}

export function CelebrationFireworks() {
  const [particles, setParticles] = useState<FireworkParticle[]>([]);
  const [floatingConfetti, setFloatingConfetti] = useState<FloatingConfetti[]>([]);

  // Vibrant but soft pastel colors - more saturated for visibility
  const colors = [
    '#10B981', // Emerald green
    '#3B82F6', // Bright blue
    '#A78BFA', // Purple
    '#F59E0B', // Amber
    '#EC4899', // Pink
    '#14B8A6', // Teal
    '#8B5CF6', // Violet
    '#10B981', // Emerald (duplicate for more green)
  ];

  useEffect(() => {
    // Generate firework bursts
    const newParticles: FireworkParticle[] = [];
    
    // Define 4 burst points - positioned strategically for better coverage
    const burstPoints = [
      { x: 25, y: 20, delay: 0 },      // Top left
      { x: 75, y: 18, delay: 0.25 },   // Top right
      { x: 50, y: 30, delay: 0.5 },    // Center
      { x: 50, y: 15, delay: 0.75 },   // Top center (finale)
    ];

    burstPoints.forEach((burst, burstIndex) => {
      // Each burst has 18 particles radiating outward
      const particlesPerBurst = 18;
      
      for (let i = 0; i < particlesPerBurst; i++) {
        const angle = (360 / particlesPerBurst) * i;
        const distance = 70 + Math.random() * 50; // 70-120 units - larger spread
        
        newParticles.push({
          id: `burst-${burstIndex}-particle-${i}`,
          burstX: burst.x,
          burstY: burst.y,
          angle,
          distance,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 8 + 10, // 10-18px - much larger for visibility
          delay: burst.delay,
          duration: 1.4 + Math.random() * 0.6, // 1.4-2.0s - longer duration
        });
      }
    });

    setParticles(newParticles);

    // Add some floating confetti that falls from the top
    const confettiPieces: FloatingConfetti[] = [];
    for (let i = 0; i < 25; i++) {
      confettiPieces.push({
        id: `confetti-${i}`,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 6, // 6-12px
        delay: Math.random() * 1 + 0.5, // 0.5-1.5s delay
        duration: Math.random() * 1.5 + 2, // 2-3.5s
        rotation: Math.random() * 360,
      });
    }
    setFloatingConfetti(confettiPieces);
  }, []);

  return (
    <div 
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 1 }}
    >
      {particles.map((particle) => {
        // Calculate end position based on angle and distance
        const radians = (particle.angle * Math.PI) / 180;
        const endX = particle.burstX + Math.cos(radians) * particle.distance;
        const endY = particle.burstY + Math.sin(radians) * particle.distance;

        return (
          <motion.div
            key={particle.id}
            initial={{
              x: `${particle.burstX}%`,
              y: `${particle.burstY}%`,
              opacity: 0,
              scale: 0,
            }}
            animate={{
              x: `${endX}%`,
              y: `${endY}%`,
              opacity: [0, 0.9, 0.8, 0], // High opacity for visibility
              scale: [0, 1.2, 1, 0.8],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              ease: 'easeOut',
              opacity: {
                times: [0, 0.1, 0.5, 1],
                duration: particle.duration,
              },
              scale: {
                times: [0, 0.2, 0.4, 1],
                duration: particle.duration,
              },
            }}
            style={{
              position: 'absolute',
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              borderRadius: '50%',
              boxShadow: `0 0 12px ${particle.color}, 0 0 6px ${particle.color}80`, // Enhanced glow
              border: `1px solid ${particle.color}`,
            }}
          />
        );
      })}
      
      {/* Add sparkle trails for extra visibility */}
      {particles.slice(0, 12).map((particle) => {
        const radians = (particle.angle * Math.PI) / 180;
        const midX = particle.burstX + Math.cos(radians) * (particle.distance * 0.6);
        const midY = particle.burstY + Math.sin(radians) * (particle.distance * 0.6);

        return (
          <motion.div
            key={`trail-${particle.id}`}
            initial={{
              x: `${particle.burstX}%`,
              y: `${particle.burstY}%`,
              opacity: 0,
              scale: 0,
            }}
            animate={{
              x: `${midX}%`,
              y: `${midY}%`,
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0.5],
            }}
            transition={{
              duration: particle.duration * 0.7,
              delay: particle.delay + 0.1,
              ease: 'easeOut',
            }}
            style={{
              position: 'absolute',
              width: particle.size * 0.5,
              height: particle.size * 0.5,
              backgroundColor: particle.color,
              borderRadius: '50%',
              filter: 'blur(1px)',
            }}
          />
        );
      })}

      {/* Floating confetti falling from above */}
      {floatingConfetti.map((confetti) => (
        <motion.div
          key={confetti.id}
          initial={{
            x: `${confetti.x}%`,
            y: -10,
            opacity: 0,
            rotate: confetti.rotation,
          }}
          animate={{
            x: `${confetti.x + (Math.random() - 0.5) * 20}%`,
            y: 110,
            opacity: [0, 0.85, 0.7, 0],
            rotate: confetti.rotation + 360 + Math.random() * 180,
          }}
          transition={{
            duration: confetti.duration,
            delay: confetti.delay,
            ease: 'easeIn',
            opacity: {
              times: [0, 0.1, 0.6, 1],
            },
          }}
          style={{
            position: 'absolute',
            width: confetti.size,
            height: confetti.size * 0.7,
            backgroundColor: confetti.color,
            borderRadius: '3px',
            boxShadow: `0 0 6px ${confetti.color}60`,
          }}
        />
      ))}
    </div>
  );
}
