import { useEffect, useRef } from 'react';

export default function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const colors = [
      '#e11d48', // Red (Peru Flag)
      '#ffffff', // White
      '#0033a0', // JJC Corporate Blue
      '#f59e0b', // Gold/Yellow
      '#3b82f6', // Light Blue
    ];

    interface Particle {
      x: number;
      y: number;
      size: number;
      color: string;
      speedX: number;
      speedY: number;
      rotation: number;
      rotationSpeed: number;
    }

    const particles: Particle[] = Array.from({ length: 120 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height - height,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedX: Math.random() * 4 - 2,
      speedY: Math.random() * 4 + 3,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 4 - 2,
    }));

    const updateAndDraw = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotationSpeed;

        // Reset if goes off-screen
        if (p.y > height) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width || p.x < 0) {
          p.speedX *= -1;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        
        // Add subtle shadow to confetti for premium look
        ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
        ctx.shadowBlur = 4;

        // Draw rectangle
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(updateAndDraw);
    };

    updateAndDraw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
      id="confetti-canvas"
    />
  );
}
