import { useEffect, useRef } from 'react';

export const ParticlesBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // ---- 1) PRIMERO: tamaño real ANTES de crear partículas ----
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;

      const body = document.body;
      const html = document.documentElement;
      const height = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      );

      canvas.height = height;
    };

    updateCanvasSize(); // se asegura tamaño correcto

    // ---- 2) Crear partículas RECIÉN cuando el canvas ya está bien ----
    let particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
    }> = [];

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < 150; i++) {
        particles.push({
          x: Math.random() * canvas.width, // aleatorio real
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
        });
      }
    };

    initParticles();

    // ---- 3) Resize correcto: recalcular tamaño + regenerar partículas ----
    const handleResize = () => {
      updateCanvasSize();
      initParticles(); // se crean nuevas con el nuevo tamaño real
    };

    window.addEventListener('resize', handleResize);

    // ---- 4) Animación ----
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Rebotes
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

        // Estilo original
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 pointer-events-none"
      style={{ width: '100%', zIndex: 0 }}
    />
  );
};