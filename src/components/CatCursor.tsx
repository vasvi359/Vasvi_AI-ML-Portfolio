import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useMouseInput } from "./motion-kit";
import { assetPath } from "../paths";

/** The cat picture lives here: `public/images/cursor-cat.jpg`. */
const CAT_SRC = assetPath("/images/cursor-cat.jpg");

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  tone: "petal" | "rose" | "deep";
};

const TONES: Record<Particle["tone"], string> = {
  petal: "239, 169, 192",
  rose: "217, 111, 150",
  deep: "179, 78, 115",
};

const MAX_PARTICLES = 54;
const SPAWN_DISTANCE = 13;

/**
 * Desktop-only custom cursor: the cat picture in a soft round frame follows the
 * pointer with a light spring, grows over links and squishes on click, while the
 * pink sparkle trail floats up behind it. The native cursor is hidden whenever
 * this runs, and comes back only if the cat image fails to load.
 */
export default function CatCursor() {
  // A real mouse event enables the cat even when the OS reports a coarse/hybrid
  // primary pointer; touch-only visitors never match, so their experience is
  // untouched.
  const mouseInput = useMouseInput();
  const reduceMotion = Boolean(useReducedMotion());
  const enabled = mouseInput;
  // Reduced motion keeps the cat (it is the pointer) but drops the decorative
  // trail and the springy movement.
  const trailEnabled = enabled && !reduceMotion;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const spawnRef = useRef<((x: number, y: number, amount: number) => void) | null>(null);
  const [failed, setFailed] = useState(false);
  const [imageReady, setImageReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const [pressed, setPressed] = useState(false);

  const pointerX = useMotionValue(-200);
  const pointerY = useMotionValue(-200);
  const x = useSpring(pointerX, { stiffness: 900, damping: 42, mass: 0.35 });
  const y = useSpring(pointerY, { stiffness: 900, damping: 42, mass: 0.35 });
  const scale = useMotionValue(1);

  // Hide the normal cursor only once the cat is actually drawn and following the
  // pointer. Hiding it earlier (image loaded, but no pointer event yet) has left
  // some visitors with no visible pointer at all, so the native arrow stays until
  // the cat is genuinely on screen; a slow or blocked image never removes it.
  useEffect(() => {
    if (!enabled || failed || !imageReady || !visible) return;

    const root = document.documentElement;
    root.classList.add("cat-cursor");

    return () => root.classList.remove("cat-cursor");
  }, [enabled, failed, imageReady, visible]);

  // Cached images may already be complete before `onLoad` can be attached.
  useEffect(() => {
    const node = imgRef.current;
    if (node?.complete && node.naturalWidth > 0) setImageReady(true);
  }, [enabled]);

  // Pointer tracking. Kept separate from the particle loop so the cat still
  // follows the pointer when the trail is off (reduced motion).
  useEffect(() => {
    if (!enabled) return;

    let visibleNow = false;
    let interactiveNow = false;
    let pressedNow = false;
    let lastX = -100;
    let lastY = -100;

    const handleMove = (event: PointerEvent) => {
      pointerX.set(event.clientX);
      pointerY.set(event.clientY);

      if (!visibleNow) {
        visibleNow = true;
        setVisible(true);
      }

      const target = event.target as Element | null;
      const nextInteractive = Boolean(
        target?.closest("a, button, [role='button'], [data-cursor='interactive']"),
      );
      if (nextInteractive !== interactiveNow) {
        interactiveNow = nextInteractive;
        setInteractive(nextInteractive);
      }

      const distance = Math.hypot(event.clientX - lastX, event.clientY - lastY);
      if (distance < SPAWN_DISTANCE) return;

      lastX = event.clientX;
      lastY = event.clientY;
      spawnRef.current?.(event.clientX, event.clientY, 1 + Math.floor(Math.random() * 2));
    };

    const handleDown = (event: PointerEvent) => {
      if (!pressedNow) {
        pressedNow = true;
        setPressed(true);
      }
      spawnRef.current?.(event.clientX, event.clientY, 10);
    };

    const handleUp = () => {
      if (!pressedNow) return;
      pressedNow = false;
      setPressed(false);
    };

    const hide = () => {
      visibleNow = false;
      pressedNow = false;
      setVisible(false);
      setPressed(false);
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerdown", handleDown, { passive: true });
    window.addEventListener("pointerup", handleUp, { passive: true });
    window.addEventListener("blur", hide);
    document.addEventListener("pointerleave", hide);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("blur", hide);
      document.removeEventListener("pointerleave", hide);
    };
  }, [enabled, pointerX, pointerY]);

  // Sparkle trail.
  useEffect(() => {
    if (!trailEnabled) return;

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const particles: Particle[] = [];
    let frame = 0;

    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = (spawnX: number, spawnY: number, amount: number) => {
      for (let index = 0; index < amount; index += 1) {
        if (particles.length >= MAX_PARTICLES) break;

        const tone = (["petal", "rose", "petal", "deep"] as const)[
          Math.floor(Math.random() * 4)
        ];

        particles.push({
          x: spawnX + (Math.random() - 0.5) * 10,
          y: spawnY + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -0.05 - Math.random() * 0.35,
          size: 1 + Math.random() * 2.4,
          life: 0,
          maxLife: 700 + Math.random() * 650,
          tone,
        });
      }

      if (!frame) frame = window.requestAnimationFrame(tick);
    };

    const tick = () => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let index = particles.length - 1; index >= 0; index -= 1) {
        const particle = particles[index];
        particle.life += 16;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy -= 0.0025;

        const progress = particle.life / particle.maxLife;
        if (progress >= 1) {
          particles.splice(index, 1);
          continue;
        }

        context.beginPath();
        context.arc(particle.x, particle.y, particle.size * (1 - progress * 0.45), 0, Math.PI * 2);
        context.fillStyle = `rgba(${TONES[particle.tone]}, ${0.5 * (1 - progress)})`;
        context.fill();
      }

      if (particles.length > 0) {
        frame = window.requestAnimationFrame(tick);
      } else {
        frame = 0;
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    };

    spawnRef.current = spawn;
    resize();
    window.addEventListener("resize", resize);

    return () => {
      spawnRef.current = null;
      window.removeEventListener("resize", resize);
      if (frame) window.cancelAnimationFrame(frame);
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    };
  }, [trailEnabled]);

  useEffect(() => {
    if (!enabled || reduceMotion) return;

    const target = pressed ? 0.86 : interactive ? 1.2 : 1;
    const controls = animate(scale, target, {
      duration: 0.22,
      ease: [0.22, 1, 0.36, 1],
    });

    return () => controls.stop();
  }, [interactive, pressed, scale, enabled, reduceMotion]);

  // If the picture never loads (blocked asset, offline, wrong deploy path), keep
  // the native pointer instead of showing an empty pink disc in its place.
  if (!enabled || failed) return null;

  return (
    <>
      {trailEnabled ? (
        <canvas
          ref={canvasRef}
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[65]"
        />
      ) : null}
      <motion.div
        aria-hidden
        style={{
          x: reduceMotion ? pointerX : x,
          y: reduceMotion ? pointerY : y,
          scale: reduceMotion ? 1 : scale,
        }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.16 }}
        className={`pointer-events-none fixed left-0 top-0 z-[70] -ml-[22px] -mt-[22px] h-11 w-11 overflow-hidden rounded-full border-2 bg-blush shadow-[0_3px_12px_rgba(179,78,115,0.35)] ${
          interactive ? "border-petal" : "border-white"
        }`}
      >
        <img
          ref={imgRef}
          src={CAT_SRC}
          alt=""
          draggable={false}
          onLoad={() => setImageReady(true)}
          onError={() => setFailed(true)}
          className="h-full w-full select-none object-cover"
        />
      </motion.div>
    </>
  );
}
