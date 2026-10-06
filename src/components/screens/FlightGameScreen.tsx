import React, { useEffect, useRef, useState, useCallback } from 'react';
import { sound } from '../../utils/audio';

interface Obstacle {
  x: number;
  width: number;
  topHeight: number;
  bottomHeight: number;
  gap: number;
  passed: boolean;
  hasOrb: boolean;
  orbY: number;
  orbCollected: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  distance: number;
  isYou?: boolean;
  avatar?: string;
  badge: string;
}

export const FlightGameScreen: React.FC<{ onOpenLobby?: () => void }> = ({ onOpenLobby }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // High score in local storage
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('flight_high_score') || '18', 10);
    } catch {
      return 18;
    }
  });

  const [gameState, setGameState] = useState<'TITLE_MENU' | 'PLAYING' | 'GAME_OVER'>('TITLE_MENU');
  const [score, setScore] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [multiplier, setMultiplier] = useState<number>(1);
  const [turboEnergy, setTurboEnergy] = useState<number>(100);
  const [windVector, setWindVector] = useState<string>('+3.2 M/S');
  const [isMuted, setIsMuted] = useState<boolean>(sound.isMuted);

  // Leaderboard data
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    { rank: 1, name: 'Sarah', score: 32, distance: 480, badge: 'CHAMPION', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCL5EjUn8Y9088XhXLUteErMroqcuk5bIPAkSEPuz79Iap15RJuDu3aU96RkKi4NilVWqUGOcZqUwkEU9UGUpvL6kA0M_3AhQgPv1bhKbStTj7SyzdZPPFHVfr1QkflEOiCOqha7PJ2vC-FdooVMlCaQHqewdbABmBbGOEfNc-vmPunc2Z33VJr0LHkf66R4CH_yQi-AdUuHTxCcyrOGf3BOXIux40FzGqaYkOpkV5FTEEwqxbDkCi0' },
    { rank: 2, name: 'Alex (Host)', score: 26, distance: 390, badge: 'PRO', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSvuWUGGEwbSyE-AuOyj6cejb9bOmScleVdCNDzvGetZIiy3O7zGDepOlYWNtN_yKhBFtn8RHw2CaLY5pS_dGx7taKJ30yi9zuoK4dFWZ6oa7w-LIAU38npKwxclM0LNi_egxAU8hWCFXZqHAx5T4Tg2WPYcacjeSA-mQV4KSC4bLJBkLuz1cnxEljou26lS8_Rgd7h64ox6Tf7HG3sxKtu8KG2RvZ7TFaLjRZwOaPcT3Tx4tcwUtJ' },
    { rank: 3, name: 'Jax', score: 21, distance: 315, badge: 'VETERAN', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-tWYnLDiPQ6lBcfmi2UidHE-M2bM1kM-Ge8ZvhCT4mXl569vZ39kEuPH2QAibTJMrgeJHrnWgyKZL2WcF1u3x0mN2hwjlOOcMdCJeNyxirVmvdqr5Bix5GgRo15YbDmPn8NJLUFvPFpL6rk2m2T-_26dIQeAKveHQ3KLwL2nHQHJlXC7ILt2AHmlIxYIyG_QItXVFAKKbY50Qa2PMFs3UR3pGmw26oUNqqvV65v2N4AdzgV09bEnF' },
    { rank: 4, name: 'Elena', score: 17, distance: 255, badge: 'SQUAD', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCH69W1BgDHUYBOHWrrw980Aj5ujhWBR1XLeHVz6yiIKAsSKdr3hk7KXrSZHunRO--FNiUiUsfUa9q_IDSyB7FNXZ5vp5uwWCkjYNzdnzz2htegUwZtuyhPSnH0qEgYmynq8ycsBLeX3FPBYoSClb729HabBWQfXxGZAj6RHOE5nBFErc84GvPPO2vCwAuksNq-cin33F-fnKoXQ9IYfeqeMqCU7Rj6MpvwrIsZKcVhGbkY8NCJKRq' },
  ]);

  // References to keep game loop in sync with 60 FPS requestAnimationFrame
  const stateRef = useRef({
    gameState: 'TITLE_MENU' as 'TITLE_MENU' | 'PLAYING' | 'GAME_OVER',
    birdY: 250,
    birdVelocity: 0,
    birdAngle: 0,
    birdX: 85,
    birdRadius: 16,
    score: 0,
    distance: 0,
    multiplier: 1,
    multiplierTimer: 0,
    obstacles: [] as Obstacle[],
    particles: [] as Particle[],
    frame: 0,
    speed: 2.8,
    lastObstacleX: 400,
    energy: 100,
    groundY: 520,
    ceilingY: 10,
    canvasWidth: 420,
    canvasHeight: 560,
  });

  const jump = useCallback(() => {
    const s = stateRef.current;
    if (s.gameState === 'TITLE_MENU') {
      s.gameState = 'PLAYING';
      setGameState('PLAYING');
      s.birdY = 220;
      s.birdVelocity = -6.2;
      s.score = 0;
      s.distance = 0;
      s.multiplier = 1;
      s.obstacles = [];
      s.particles = [];
      s.frame = 0;
      s.lastObstacleX = s.canvasWidth + 60;
      sound.playFlap();
      return;
    }

    if (s.gameState === 'GAME_OVER') {
      return;
    }

    if (s.gameState === 'PLAYING') {
      s.birdVelocity = -6.6;
      sound.playFlap();

      // Spawn jet puff particles
      for (let i = 0; i < 6; i++) {
        s.particles.push({
          x: s.birdX - 12,
          y: s.birdY + (Math.random() * 8 - 4),
          vx: -(Math.random() * 3 + 2),
          vy: (Math.random() * 2 - 1),
          size: Math.random() * 4 + 3,
          color: Math.random() > 0.5 ? '#00ff7f' : '#00d8ff',
          alpha: 0.9,
          life: 0.7,
        });
      }
    }
  }, []);

  const triggerTurboBoost = useCallback(() => {
    const s = stateRef.current;
    if (s.gameState === 'PLAYING' && s.energy >= 40) {
      s.energy -= 40;
      setTurboEnergy(s.energy);
      s.multiplier = Math.min(s.multiplier + 1, 3);
      s.multiplierTimer = 240; // ~4 seconds
      setMultiplier(s.multiplier);
      s.birdVelocity = -5.0;
      sound.playCollect();

      // Big flame particle shockwave
      for (let i = 0; i < 16; i++) {
        s.particles.push({
          x: s.birdX - 8,
          y: s.birdY + (Math.random() * 12 - 6),
          vx: -(Math.random() * 6 + 3),
          vy: (Math.random() * 4 - 2),
          size: Math.random() * 6 + 4,
          color: '#ffc700',
          alpha: 1,
          life: 1.0,
        });
      }
    }
  }, []);

  const restartGame = useCallback(() => {
    const s = stateRef.current;
    s.gameState = 'PLAYING';
    setGameState('PLAYING');
    s.birdY = 220;
    s.birdVelocity = -6.2;
    s.birdAngle = 0;
    s.score = 0;
    s.distance = 0;
    s.multiplier = 1;
    s.multiplierTimer = 0;
    s.obstacles = [];
    s.particles = [];
    s.frame = 0;
    s.energy = 100;
    setScore(0);
    setDistance(0);
    setMultiplier(1);
    setTurboEnergy(100);
    s.lastObstacleX = s.canvasWidth + 80;
    sound.playFlap();
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      } else if (e.code === 'KeyB' || e.code === 'ShiftLeft') {
        triggerTurboBoost();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jump, triggerTurboBoost]);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        const rect = container.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const width = Math.min(rect.width, 540);
        const height = Math.min(rect.height || 620, 680);

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        ctx.resetTransform?.();
        ctx.scale(dpr, dpr);

        stateRef.current.canvasWidth = width;
        stateRef.current.canvasHeight = height;
        stateRef.current.groundY = height - 50;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initial obstacle setup
    stateRef.current.lastObstacleX = stateRef.current.canvasWidth + 100;

    const render = () => {
      const s = stateRef.current;
      const width = s.canvasWidth;
      const height = s.canvasHeight;
      const groundY = s.groundY;

      s.frame++;

      // ================= UPDATE PHYSICS =================
      if (s.gameState === 'PLAYING') {
        // Distance counter increments
        s.distance += 0.3 * s.speed;
        if (s.frame % 10 === 0) {
          setDistance(Math.floor(s.distance));
        }

        // Energy slowly recharges
        if (s.frame % 30 === 0 && s.energy < 100) {
          s.energy = Math.min(100, s.energy + 5);
          setTurboEnergy(s.energy);
        }

        // Multiplier timer
        if (s.multiplierTimer > 0) {
          s.multiplierTimer--;
          if (s.multiplierTimer === 0) {
            s.multiplier = 1;
            setMultiplier(1);
          }
        }

        // Wind vector cosmetic changes
        if (s.frame % 240 === 0) {
          const speeds = ['+2.8 M/S', '+3.4 M/S', '+4.1 M/S', '+1.9 M/S', '+5.0 M/S'];
          setWindVector(speeds[Math.floor(Math.random() * speeds.length)]);
        }

        // Gravity
        s.birdVelocity += 0.32;
        s.birdVelocity = Math.min(s.birdVelocity, 8.5);
        s.birdY += s.birdVelocity;

        // Angle tilt
        if (s.birdVelocity < 0) {
          s.birdAngle = Math.max(-0.4, s.birdVelocity * 0.06);
        } else {
          s.birdAngle = Math.min(1.0, s.birdVelocity * 0.1);
        }

        // Spawn obstacles
        if (s.obstacles.length === 0 || width - s.obstacles[s.obstacles.length - 1].x >= 180) {
          const gap = 135;
          const minHeight = 60;
          const availableHeight = groundY - gap - minHeight * 2;
          const topHeight = minHeight + Math.random() * availableHeight;
          const bottomHeight = groundY - topHeight - gap;
          const hasOrb = Math.random() > 0.45;

          s.obstacles.push({
            x: width + 20,
            width: 58,
            topHeight,
            bottomHeight,
            gap,
            passed: false,
            hasOrb,
            orbY: topHeight + gap / 2,
            orbCollected: false,
          });
        }

        // Move obstacles
        for (let i = s.obstacles.length - 1; i >= 0; i--) {
          const obs = s.obstacles[i];
          obs.x -= s.speed;

          // Check passing for score
          if (!obs.passed && obs.x + obs.width < s.birdX) {
            obs.passed = true;
            const pts = 1 * s.multiplier;
            s.score += pts;
            setScore(s.score);
            sound.playScore();

            if (s.score > highScore) {
              setHighScore(s.score);
              try {
                localStorage.setItem('flight_high_score', s.score.toString());
              } catch {}
            }
          }

          // Check voltage orb collection
          if (obs.hasOrb && !obs.orbCollected) {
            const dx = s.birdX - (obs.x + obs.width / 2);
            const dy = s.birdY - obs.orbY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < s.birdRadius + 14) {
              obs.orbCollected = true;
              s.score += 2 * s.multiplier;
              setScore(s.score);
              s.energy = Math.min(100, s.energy + 25);
              setTurboEnergy(s.energy);
              sound.playCollect();

              // Collectible burst particles
              for (let p = 0; p < 10; p++) {
                s.particles.push({
                  x: obs.x + obs.width / 2,
                  y: obs.orbY,
                  vx: (Math.random() - 0.5) * 5,
                  vy: (Math.random() - 0.5) * 5,
                  size: Math.random() * 4 + 2,
                  color: '#ffc700',
                  alpha: 1,
                  life: 0.8,
                });
              }
            }
          }

          // Collision detection with pillars
          const hitboxPadding = 3;
          const birdLeft = s.birdX - s.birdRadius + hitboxPadding;
          const birdRight = s.birdX + s.birdRadius - hitboxPadding;
          const birdTop = s.birdY - s.birdRadius + hitboxPadding;
          const birdBottom = s.birdY + s.birdRadius - hitboxPadding;

          const collidesTop =
            birdRight > obs.x &&
            birdLeft < obs.x + obs.width &&
            birdTop < obs.topHeight;

          const collidesBottom =
            birdRight > obs.x &&
            birdLeft < obs.x + obs.width &&
            birdBottom > groundY - obs.bottomHeight;

          if (collidesTop || collidesBottom) {
            // CRASH!
            sound.playCrash();
            s.gameState = 'GAME_OVER';
            setGameState('GAME_OVER');

            // Update leaderboard if score qualifies
            setLeaderboard((prev) => {
              const updated = [
                ...prev,
                {
                  rank: 0,
                  name: 'You (Flight Ace)',
                  score: s.score,
                  distance: Math.floor(s.distance),
                  isYou: true,
                  badge: s.score >= 30 ? 'MVP' : s.score >= 20 ? 'PODIUM' : 'FINISHER',
                },
              ]
                .sort((a, b) => b.score - a.score)
                .slice(0, 5)
                .map((entry, idx) => ({ ...entry, rank: idx + 1 }));
              return updated;
            });
            break;
          }

          // Remove offscreen
          if (obs.x + obs.width < -30) {
            s.obstacles.splice(i, 1);
          }
        }

        // Ground / Ceiling collision
        if (s.birdY + s.birdRadius >= groundY || s.birdY - s.birdRadius <= s.ceilingY) {
          sound.playCrash();
          s.gameState = 'GAME_OVER';
          setGameState('GAME_OVER');
        }
      }

      // Update particles
      for (let i = s.particles.length - 1; i >= 0; i--) {
        const p = s.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.025;
        if (p.alpha <= 0) {
          s.particles.splice(i, 1);
        }
      }

      // ================= DRAW STADIUM VIEW =================
      // 1. Deep Arena Night Void
      ctx.fillStyle = '#0b0e14';
      ctx.fillRect(0, 0, width, height);

      // 2. Optical Stadium Floodlight Beams (Angled linear light paths raking across background)
      ctx.save();
      const beamGrad = ctx.createLinearGradient(0, 0, width, height * 0.7);
      beamGrad.addColorStop(0, 'rgba(0, 216, 255, 0.07)');
      beamGrad.addColorStop(0.5, 'rgba(0, 255, 127, 0.04)');
      beamGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = beamGrad;
      ctx.beginPath();
      ctx.moveTo(width * 0.2, 0);
      ctx.lineTo(width * 0.65, 0);
      ctx.lineTo(width * 0.95, height * 0.75);
      ctx.lineTo(width * 0.4, height * 0.75);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 3. Ambient Stadium Horizon / Skyline grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSpacing = 32;
      for (let x = (s.frame * -0.5) % gridSpacing; x < width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, height * 0.4);
        ctx.lineTo(x, groundY);
        ctx.stroke();
      }

      // 4. Draw Obstacles (Futuristic Stadium Floodlight Gantries / High-Voltage Neon Towers)
      s.obstacles.forEach((obs) => {
        // TOP Gantry
        const topGrad = ctx.createLinearGradient(obs.x, 0, obs.x + obs.width, 0);
        topGrad.addColorStop(0, '#131924');
        topGrad.addColorStop(0.5, '#222938');
        topGrad.addColorStop(1, '#0e141d');
        ctx.fillStyle = topGrad;
        ctx.fillRect(obs.x, 0, obs.width, obs.topHeight);

        // Gantry neon warning trim (Pitch Volt Green + Broadcast Cyan edge)
        ctx.fillStyle = '#00ff7f';
        ctx.fillRect(obs.x + 2, obs.topHeight - 8, obs.width - 4, 8);

        // Aperture laser emitter line
        ctx.strokeStyle = '#00d8ff';
        ctx.lineWidth = 2;
        ctx.strokeRect(obs.x, 0, obs.width, obs.topHeight);

        // Hazard chevron stripes on top gantry
        ctx.strokeStyle = 'rgba(255, 199, 0, 0.35)';
        ctx.lineWidth = 3;
        for (let stripeY = 20; stripeY < obs.topHeight - 12; stripeY += 28) {
          ctx.beginPath();
          ctx.moveTo(obs.x + 8, stripeY);
          ctx.lineTo(obs.x + obs.width - 8, stripeY + 14);
          ctx.stroke();
        }

        // BOTTOM Gantry
        const botY = groundY - obs.bottomHeight;
        const botGrad = ctx.createLinearGradient(obs.x, botY, obs.x + obs.width, botY);
        botGrad.addColorStop(0, '#131924');
        botGrad.addColorStop(0.5, '#222938');
        botGrad.addColorStop(1, '#0e141d');
        ctx.fillStyle = botGrad;
        ctx.fillRect(obs.x, botY, obs.width, obs.bottomHeight);

        // Neon warning trim
        ctx.fillStyle = '#00ff7f';
        ctx.fillRect(obs.x + 2, botY, obs.width - 4, 8);

        // Bottom border
        ctx.strokeStyle = '#00d8ff';
        ctx.lineWidth = 2;
        ctx.strokeRect(obs.x, botY, obs.width, obs.bottomHeight);

        // Hazard chevron stripes on bottom gantry
        ctx.strokeStyle = 'rgba(255, 199, 0, 0.35)';
        ctx.lineWidth = 3;
        for (let stripeY = botY + 24; stripeY < groundY - 10; stripeY += 28) {
          ctx.beginPath();
          ctx.moveTo(obs.x + 8, stripeY);
          ctx.lineTo(obs.x + obs.width - 8, stripeY + 14);
          ctx.stroke();
        }

        // High Voltage Spark Aperture / Beam in Gap
        ctx.fillStyle = 'rgba(0, 216, 255, 0.15)';
        ctx.fillRect(obs.x + obs.width / 2 - 1, obs.topHeight, 2, obs.gap);

        // Draw Collectible Voltage Orb
        if (obs.hasOrb && !obs.orbCollected) {
          ctx.save();
          const orbPulse = Math.sin(s.frame * 0.1) * 2;
          const orbRad = 10 + orbPulse;

          // Glow
          ctx.beginPath();
          ctx.arc(obs.x + obs.width / 2, obs.orbY, orbRad + 6, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 199, 0, 0.25)';
          ctx.fill();

          // Core
          ctx.beginPath();
          ctx.arc(obs.x + obs.width / 2, obs.orbY, orbRad, 0, Math.PI * 2);
          const orbGrad = ctx.createRadialGradient(
            obs.x + obs.width / 2 - 2,
            obs.orbY - 2,
            2,
            obs.x + obs.width / 2,
            obs.orbY,
            orbRad
          );
          orbGrad.addColorStop(0, '#ffffff');
          orbGrad.addColorStop(0.4, '#ffda7f');
          orbGrad.addColorStop(1, '#ffc700');
          ctx.fillStyle = orbGrad;
          ctx.fill();

          // Electric bolt icon symbol
          ctx.fillStyle = '#0b0e14';
          ctx.font = 'bold 11px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('⚡', obs.x + obs.width / 2, obs.orbY);
          ctx.restore();
        }
      });

      // 5. Ground Turf / Stadium Baseline Track
      ctx.fillStyle = '#131924';
      ctx.fillRect(0, groundY, width, height - groundY);

      // Pitch Volt Green turf line
      ctx.fillStyle = '#00ff7f';
      ctx.fillRect(0, groundY, width, 4);

      // Animated yard line hashes
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      const hashOffset = (s.frame * -s.speed) % 24;
      for (let hx = hashOffset; hx < width; hx += 24) {
        ctx.beginPath();
        ctx.moveTo(hx, groundY + 4);
        ctx.lineTo(hx, groundY + 16);
        ctx.stroke();
      }

      // 6. Draw Particles (Thruster trails & sparks)
      s.particles.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 7. Draw Player Mascot (Aerodynamic Cyber Drone / Winged Jet Mascot)
      ctx.save();
      ctx.translate(s.birdX, s.birdY);
      ctx.rotate(s.birdAngle);

      // Jet Thruster Glow
      const thrusterGrad = ctx.createRadialGradient(-16, 0, 1, -16, 0, 14);
      thrusterGrad.addColorStop(0, '#00ff7f');
      thrusterGrad.addColorStop(0.5, 'rgba(0, 216, 255, 0.8)');
      thrusterGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = thrusterGrad;
      ctx.beginPath();
      ctx.arc(-16, 0, 14, 0, Math.PI * 2);
      ctx.fill();

      // Cyber Drone Body Capsule
      const bodyGrad = ctx.createLinearGradient(-18, -14, 18, 14);
      bodyGrad.addColorStop(0, '#ffffff');
      bodyGrad.addColorStop(0.3, '#afecff');
      bodyGrad.addColorStop(0.8, '#14d8ff');
      bodyGrad.addColorStop(1, '#005b6c');
      ctx.fillStyle = bodyGrad;

      ctx.beginPath();
      ctx.ellipse(0, 0, 18, 13, 0, 0, Math.PI * 2);
      ctx.fill();

      // Cyber Visor / Eye
      ctx.fillStyle = '#0b0e14';
      ctx.beginPath();
      ctx.ellipse(7, -3, 6, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Neon Eye Glow
      ctx.fillStyle = '#00ff7f';
      ctx.beginPath();
      ctx.arc(8, -3, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Aerodynamic Wing Flap
      const wingYOffset = Math.sin(s.frame * 0.35) * 5;
      ctx.fillStyle = '#00ff7f';
      ctx.beginPath();
      ctx.moveTo(-5, 0);
      ctx.lineTo(-14, 8 + wingYOffset);
      ctx.lineTo(2, 4 + wingYOffset * 0.5);
      ctx.closePath();
      ctx.fill();

      // Forward Beak / Nosecone
      ctx.fillStyle = '#ffc700';
      ctx.beginPath();
      ctx.moveTo(14, -2);
      ctx.lineTo(24, 1);
      ctx.lineTo(14, 5);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [highScore]);

  // Determine current placement badge
  const currentRank = score >= 32 ? '1ST' : score >= 26 ? '2ND' : score >= 21 ? '3RD' : score >= 17 ? '4TH' : '5TH';

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto px-margin pt-2 pb-24 text-[#e1e2eb]">
      {/* ================= BROADCAST SCOREBUG HUD ================= */}
      <section className="sticky top-16 z-30 mb-2 w-full">
        <div className="relative overflow-hidden rounded-xl bg-[#131924]/90 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] p-2.5">
          {/* Neon backwash border highlight */}
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-[#00ff7f] via-[#00d8ff] to-[#ffc700]"></div>

          <div className="grid grid-cols-3 divide-x divide-white/10 items-center text-center">
            {/* Chamber 1: Match Rank / Status */}
            <div className="flex flex-col items-center px-1">
              <span className="font-space text-[10px] uppercase font-bold tracking-widest text-[#a0aec0]">
                POSITION
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[16px] text-[#ffc700]">emoji_events</span>
                <span className="font-anton text-[20px] text-[#ffc700] leading-none tracking-wide">
                  {currentRank}
                </span>
              </div>
              <span className="text-[10px] text-[#00ff7f] font-mono tracking-tighter">
                BEST: {highScore}
              </span>
            </div>

            {/* Chamber 2: Live Flight Score & Distance */}
            <div className="flex flex-col items-center px-2">
              <span className="font-space text-[10px] uppercase font-bold tracking-widest text-[#00d8ff]">
                SCORE
              </span>
              <span className="font-anton text-[36px] text-white leading-none tracking-tight">
                {score}
              </span>
              <span className="text-[10px] text-[#b9cbb8] font-space font-semibold tabular-nums">
                {distance} M FLOWN
              </span>
            </div>

            {/* Chamber 3: Multiplier Gauge & Wind Vector */}
            <div className="flex flex-col items-center px-1">
              <span className="font-space text-[10px] uppercase font-bold tracking-widest text-[#a0aec0]">
                MULTIPLIER
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <span
                  className={`font-anton text-[20px] leading-none ${
                    multiplier > 1 ? 'text-[#00ff7f] animate-pulse' : 'text-white'
                  }`}
                >
                  {multiplier}X VOLT
                </span>
              </div>
              <div className="flex items-center gap-1 text-[9px] text-[#afecff] font-mono">
                <span className="material-symbols-outlined text-[12px]">air</span>
                <span>{windVector}</span>
              </div>
            </div>
          </div>

          {/* Turbo Energy Bar */}
          <div className="mt-2 pt-1.5 border-t border-white/5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 text-[10px] font-space font-bold text-[#ffc700] whitespace-nowrap">
              <span className="material-symbols-outlined text-[14px]">bolt</span>
              <span>TURBO BOOST:</span>
            </div>
            <div className="flex-1 h-2 rounded-full bg-[#1d2026] overflow-hidden p-0.5 border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-[#00ff7f] to-[#ffc700] rounded-full transition-all duration-300"
                style={{ width: `${turboEnergy}%` }}
              ></div>
            </div>
            <span className="text-[10px] font-mono font-bold text-[#a0aec0]">{turboEnergy}%</span>
          </div>
        </div>
      </section>

      {/* ================= INTERACTIVE CANVAS FLIGHT ARENA ================= */}
      <div className="relative w-full aspect-[4/5] max-h-[580px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#0b0e14] select-none">
        <canvas
          ref={canvasRef}
          onClick={jump}
          onTouchStart={(e) => {
            e.preventDefault();
            jump();
          }}
          className="w-full h-full cursor-pointer touch-none block"
        />

        {/* OVERLAY: TITLE MENU */}
        {gameState === 'TITLE_MENU' && (
          <div className="absolute inset-0 bg-[#0b0e14]/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#00ff7f] to-[#00d8ff] flex items-center justify-center text-[#0b0e14] shadow-[0_0_24px_rgba(0,255,127,0.7)] mb-4 animate-bounce">
              <span className="material-symbols-outlined text-[36px] font-bold">rocket_launch</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#131924] border border-white/10 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#00ff7f] animate-ping"></span>
              <span className="font-space text-[11px] text-[#00ff7f] font-bold tracking-widest uppercase">
                Squad Air Derby v2.4
              </span>
            </div>

            <h1 className="font-anton text-[36px] sm:text-[44px] text-white tracking-wide leading-tight uppercase mb-1">
              BROADCAST FLIGHT
            </h1>
            <p className="font-chivo text-[14px] text-[#b9cbb8] max-w-xs mb-6">
              Tap or press <span className="text-[#00ff7f] font-bold">Spacebar</span> to flap through
              high-voltage stadium towers. Collect yellow energy orbs for turbo multipliers!
            </p>

            <button
              onClick={() => {
                sound.playClick();
                jump();
              }}
              className="w-full max-w-xs py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#00ff7f] to-[#00d8ff] text-[#0b0e14] font-anton text-[20px] uppercase tracking-wider shadow-[0_0_24px_rgba(0,255,127,0.5)] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[24px]">play_arrow</span>
              <span>READY FOR FLIGHT</span>
            </button>

            <div className="flex items-center gap-4 mt-6 text-[12px] text-[#a0aec0] font-space font-semibold">
              <span className="flex items-center gap-1">
                <span className="text-[#ffc700] font-bold">🏆 Sarah's High: 32</span>
              </span>
              <span>•</span>
              <span className="text-[#00d8ff]">Your Best: {highScore}</span>
            </div>
          </div>
        )}

        {/* OVERLAY: GAME OVER / BROADCAST PODIUM CEREMONY */}
        {gameState === 'GAME_OVER' && (
          <div className="absolute inset-0 bg-[#0b0e14]/90 backdrop-blur-lg flex flex-col items-center justify-center p-5 text-center z-20 overflow-y-auto">
            <div className="relative mb-2">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#ffc700] to-[#ffda7f] flex items-center justify-center text-[#0b0e14] shadow-[0_0_32px_rgba(255,199,0,0.6)] mx-auto animate-pulse">
                <span className="material-symbols-outlined text-[42px] font-bold">
                  {score >= 25 ? 'workspace_premium' : score >= 15 ? 'military_tech' : 'sports_score'}
                </span>
              </div>
              <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-[#131924] border border-[#ffc700] text-[#ffc700] font-anton text-[10px]">
                {currentRank}
              </span>
            </div>

            <span className="font-space text-[11px] uppercase tracking-widest text-[#ff334b] font-bold">
              FLIGHT COMPLETED
            </span>
            <h2 className="font-anton text-[32px] text-white tracking-wide uppercase leading-tight mb-1">
              MATCH RESULTS
            </h2>

            <div className="grid grid-cols-2 gap-2 w-full max-w-xs my-3 bg-[#131924]/80 p-3 rounded-xl border border-white/10">
              <div className="flex flex-col items-center">
                <span className="font-space text-[10px] text-[#a0aec0] uppercase font-bold">
                  FINAL SCORE
                </span>
                <span className="font-anton text-[32px] text-[#00ff7f] leading-none">{score}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-space text-[10px] text-[#a0aec0] uppercase font-bold">
                  SQUAD RECORD
                </span>
                <span className="font-anton text-[32px] text-[#ffc700] leading-none">
                  {Math.max(highScore, score)}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full max-w-xs">
              <button
                onClick={() => {
                  sound.playClick();
                  restartGame();
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#00ff7f] to-[#00d8ff] text-[#0b0e14] font-anton text-[18px] uppercase tracking-wider shadow-[0_0_20px_rgba(0,255,127,0.5)] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">refresh</span>
                <span>INSTANT REPLAY</span>
              </button>

              {onOpenLobby && (
                <button
                  onClick={() => {
                    sound.playClick();
                    onOpenLobby();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#1d2026] hover:bg-[#272a31] text-[#a1d9ff] font-space text-[13px] font-bold border border-white/10 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">groups</span>
                  <span>Share Score to Party Lobby</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ================= BOTTOM ATHLETIC CONTROL RAIL ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 w-full">
        <button
          onClick={jump}
          disabled={gameState === 'GAME_OVER'}
          className="col-span-1 sm:col-span-2 py-3.5 px-4 rounded-xl bg-[#191c22] border border-[#00ff7f]/40 hover:border-[#00ff7f] text-[#00ff7f] font-anton text-[18px] tracking-wide uppercase flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md group"
        >
          <span className="material-symbols-outlined text-[22px] group-hover:-translate-y-0.5 transition-transform">
            flight_takeoff
          </span>
          <span>TAP TO FLAP</span>
        </button>

        <button
          onClick={triggerTurboBoost}
          disabled={turboEnergy < 40 || gameState !== 'PLAYING'}
          className={`py-3.5 px-3 rounded-xl font-space text-[13px] font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all border ${
            turboEnergy >= 40 && gameState === 'PLAYING'
              ? 'bg-[#ffc700]/15 text-[#ffc700] border-[#ffc700]/60 shadow-[0_0_12px_rgba(255,199,0,0.3)] cursor-pointer'
              : 'bg-[#191c22]/60 text-[#a0aec0]/40 border-white/5 cursor-not-allowed'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">bolt</span>
          <span>TURBO BOOST</span>
        </button>
      </div>

      {/* ================= SQUAD FLIGHT LEADERBOARD ================= */}
      <section className="mt-6 flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffc700] text-[20px]">leaderboard</span>
            <h3 className="font-space text-[16px] font-bold text-white uppercase tracking-wider">
              Squad Leaderboard
            </h3>
          </div>
          <span className="text-[11px] font-mono text-[#00ff7f] bg-[#00ff7f]/10 px-2.5 py-0.5 rounded-full font-bold">
            Live Round #4
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          {leaderboard.map((player) => (
            <div
              key={player.name}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                player.isYou
                  ? 'bg-[#131924] border-[#00ff7f]/50 shadow-[0_0_12px_rgba(0,255,127,0.15)]'
                  : 'bg-[#161c25]/80 border-white/5'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-7 h-7 rounded-lg font-anton text-[14px] flex items-center justify-center font-bold flex-shrink-0 ${
                    player.rank === 1
                      ? 'bg-[#ffc700] text-[#0b0e14]'
                      : player.rank === 2
                      ? 'bg-[#afecff] text-[#0b0e14]'
                      : player.rank === 3
                      ? 'bg-[#d2e4ff] text-[#0b0e14]'
                      : 'bg-[#272a31] text-[#a0aec0]'
                  }`}
                >
                  {player.rank}
                </div>

                {player.avatar ? (
                  <img
                    src={player.avatar}
                    alt={player.name}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-white/10 flex-shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#00ff7f]/20 text-[#00ff7f] font-bold flex items-center justify-center text-[12px] flex-shrink-0">
                    YOU
                  </div>
                )}

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-space text-[13px] font-bold text-white truncate">
                      {player.name}
                    </span>
                    <span
                      className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded font-bold ${
                        player.badge === 'CHAMPION'
                          ? 'bg-[#ffc700]/20 text-[#ffc700]'
                          : 'bg-white/10 text-[#a0aec0]'
                      }`}
                    >
                      {player.badge}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#a0aec0] font-mono">
                    {player.distance} meters airtime
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end flex-shrink-0">
                <span className="font-anton text-[20px] text-[#00ff7f] leading-none tabular-nums">
                  {player.score} PTS
                </span>
                <span className="text-[10px] text-[#b9cbb8]">Confirmed</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
