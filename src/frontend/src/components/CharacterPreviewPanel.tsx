import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Character } from "@/store/characters";
import { getFontClass } from "@/store/characters";
import { Lock, Shield, Star, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import AudioPlayer from "./AudioPlayer";

interface CharacterPreviewPanelProps {
  character: Character | null;
  onViewProfile: () => void;
  onViewGallery: () => void;
}

function getAnimationProps(anim: string) {
  switch (anim) {
    case "sparkle":
      return {
        initial: { opacity: 0, x: 80 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, y: -30 },
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
      };
    case "wave":
      return {
        initial: { opacity: 0, x: -60 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, y: -30 },
        transition: { duration: 0.7, ease: "easeOut" as const },
      };
    case "fire":
      return {
        initial: { opacity: 0, y: 40 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -30 },
        transition: { duration: 0.5, ease: [0.2, 0.8, 0.4, 1] as const },
      };
    case "vines":
      return {
        initial: { opacity: 0, scale: 0.88 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, y: -30 },
        transition: { duration: 0.55, ease: [0.34, 1.56, 0.64, 1] as const },
      };
    case "ice":
      return {
        initial: { opacity: 0, scale: 0.96 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, y: -30 },
        transition: { duration: 0.6, ease: "easeOut" as const },
      };
    case "spooky":
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0, y: -30 },
        transition: { duration: 0.4, ease: "easeOut" as const },
      };
    case "science-green":
    case "science-purple":
    case "science-blue":
      return {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -30 },
        transition: { duration: 0.45, ease: "easeOut" as const },
      };
    case "lightning-blue":
    case "lightning-yellow":
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.2, ease: "easeOut" as const },
      };
    case "golden-shield":
      return {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, y: -30 },
        transition: { duration: 0.5, ease: "easeOut" as const },
      };
    case "door-lock":
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0, y: -30 },
        transition: { duration: 0.4, ease: "easeOut" as const },
      };
    case "holy":
      return {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -30 },
        transition: { duration: 0.5, ease: "easeOut" as const },
      };
    case "glitch":
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.15, ease: "easeOut" as const },
      };
    case "sun-rising":
      return {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -30 },
        transition: { duration: 0.6, ease: "easeOut" as const },
      };
    case "moon-rising":
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0, y: -30 },
        transition: { duration: 0.55, ease: "easeOut" as const },
      };
    case "gambler":
      return {
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0 },
        transition: { duration: 0.5, ease: "easeOut" as const },
      };
    case "gold-coins":
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.35 },
      };
    case "flower":
      return {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] as const },
      };
    default:
      return {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -30 },
        transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
      };
  }
}

// ── Overlay Components ──────────────────────────────────────────────────────

function SparkleOverlay() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 950);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;

  // 14 positions scattered across the full panel
  const positions = [
    { top: "8%", left: "12%" },
    { top: "15%", left: "45%" },
    { top: "12%", left: "78%" },
    { top: "28%", left: "22%" },
    { top: "25%", left: "65%" },
    { top: "30%", left: "88%" },
    { top: "45%", left: "10%" },
    { top: "48%", left: "52%" },
    { top: "50%", left: "80%" },
    { top: "65%", left: "30%" },
    { top: "62%", left: "70%" },
    { top: "78%", left: "18%" },
    { top: "75%", left: "55%" },
    { top: "82%", left: "85%" },
  ];

  return (
    <>
      {positions.map((pos, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: static list
          key={i}
          className="sparkle-particle"
          style={{ ...pos, animationDelay: `${i * 0.06}s` }}
        />
      ))}
    </>
  );
}

function WaveOceanOverlay() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1100);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;
  return (
    <>
      <div className="wave-main" />
      <div className="wave-foam" />
    </>
  );
}

function FireOverlay() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1000);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;
  return (
    <>
      <div className="fire-overlay" />
      <div className="fire-overlay-flicker" />
    </>
  );
}

function VinesOverlay() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1000);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;
  return (
    <>
      <div className="vine-corner-tl-h" />
      <div className="vine-corner-tl-v" />
      <div className="vine-corner-tr-h" />
      <div className="vine-corner-br-h" />
      <div className="vine-corner-bl-v" />
    </>
  );
}

function IceOverlay() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1300);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;
  return <div className="ice-overlay" />;
}

function SpookyOverlay() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1350);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;
  return (
    <>
      <div className="spooky-glow-ring" />
      <div className="spooky-skull">💀</div>
    </>
  );
}

function ScienceOverlay({ color }: { color: "green" | "purple" | "blue" }) {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1500);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;

  const colorClass = `bubble-${color}`;
  // 12 bubbles at varied horizontal positions along the bottom
  const bubbles = [
    { left: "5%", bottom: "5%", size: 28, delay: 0 },
    { left: "12%", bottom: "2%", size: 18, delay: 0.08 },
    { left: "20%", bottom: "8%", size: 36, delay: 0.15 },
    { left: "30%", bottom: "3%", size: 22, delay: 0.05 },
    { left: "38%", bottom: "6%", size: 30, delay: 0.22 },
    { left: "48%", bottom: "2%", size: 20, delay: 0.12 },
    { left: "55%", bottom: "7%", size: 32, delay: 0.3 },
    { left: "63%", bottom: "3%", size: 16, delay: 0.18 },
    { left: "72%", bottom: "5%", size: 26, delay: 0.25 },
    { left: "80%", bottom: "2%", size: 38, delay: 0.07 },
    { left: "88%", bottom: "6%", size: 22, delay: 0.35 },
    { left: "94%", bottom: "3%", size: 18, delay: 0.2 },
  ];

  return (
    <>
      {bubbles.map((b, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: static list
          key={i}
          className={`bubble ${colorClass}`}
          style={{
            left: b.left,
            bottom: b.bottom,
            width: `${b.size}px`,
            height: `${b.size}px`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}
    </>
  );
}

function LightningOverlay({ color }: { color: "blue" | "yellow" }) {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 750);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;
  const cls =
    color === "blue" ? "lightning-flash-blue" : "lightning-flash-yellow";
  return <div className={cls} />;
}

function GoldenShieldOverlay() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1300);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;
  return (
    <div className="golden-shield-icon">
      <Shield
        size={130}
        style={{
          color: "oklch(0.85 0.22 78)",
          fill: "oklch(0.85 0.22 78 / 0.25)",
          strokeWidth: 1.5,
        }}
      />
    </div>
  );
}

function DoorLockOverlay() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1600);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;
  return (
    <div className="door-container">
      {/* Simple door SVG */}
      <svg
        width="110"
        height="160"
        viewBox="0 0 110 160"
        fill="none"
        role="img"
        aria-label="Door"
      >
        {/* Door frame */}
        <rect
          x="5"
          y="5"
          width="100"
          height="150"
          rx="4"
          fill="oklch(0.25 0.04 50 / 0.9)"
          stroke="oklch(0.65 0.12 55)"
          strokeWidth="3"
        />
        {/* Door arch top */}
        <path
          d="M10 50 Q55 10 100 50"
          stroke="oklch(0.65 0.12 55)"
          strokeWidth="2.5"
          fill="none"
        />
        {/* Door panel lines */}
        <rect
          x="18"
          y="55"
          width="32"
          height="40"
          rx="2"
          fill="none"
          stroke="oklch(0.55 0.1 55 / 0.7)"
          strokeWidth="1.5"
        />
        <rect
          x="60"
          y="55"
          width="32"
          height="40"
          rx="2"
          fill="none"
          stroke="oklch(0.55 0.1 55 / 0.7)"
          strokeWidth="1.5"
        />
        <rect
          x="18"
          y="102"
          width="74"
          height="40"
          rx="2"
          fill="none"
          stroke="oklch(0.55 0.1 55 / 0.7)"
          strokeWidth="1.5"
        />
      </svg>
      {/* Lock icon centered on the door */}
      <div className="lock-icon" style={{ position: "absolute" }}>
        <Lock
          size={36}
          style={{
            color: "oklch(0.82 0.18 78)",
            filter: "drop-shadow(0 0 10px oklch(0.82 0.18 78 / 0.7))",
          }}
        />
      </div>
    </div>
  );
}

function HolyOverlay() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1500);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;
  return (
    <div className="holy-wings">
      <svg
        width="280"
        height="160"
        viewBox="0 0 280 160"
        fill="none"
        role="img"
        aria-label="Angel wings"
      >
        {/* Left wing */}
        <path
          d="M140 80 C120 60 80 30 30 20 C50 45 60 60 55 80 C70 65 100 60 140 80Z"
          fill="oklch(0.95 0.06 85 / 0.85)"
          stroke="oklch(0.92 0.1 80 / 0.9)"
          strokeWidth="1.5"
        />
        <path
          d="M140 80 C115 70 70 50 15 50 C35 65 50 72 55 80 C80 72 110 70 140 80Z"
          fill="oklch(0.92 0.08 80 / 0.7)"
          stroke="oklch(0.9 0.1 78 / 0.8)"
          strokeWidth="1"
        />
        <path
          d="M140 80 C110 80 65 72 20 90 C42 90 60 85 65 82 C90 82 115 80 140 80Z"
          fill="oklch(0.88 0.07 78 / 0.6)"
          stroke="oklch(0.88 0.09 76 / 0.7)"
          strokeWidth="1"
        />
        {/* Right wing (mirrored) */}
        <path
          d="M140 80 C160 60 200 30 250 20 C230 45 220 60 225 80 C210 65 180 60 140 80Z"
          fill="oklch(0.95 0.06 85 / 0.85)"
          stroke="oklch(0.92 0.1 80 / 0.9)"
          strokeWidth="1.5"
        />
        <path
          d="M140 80 C165 70 210 50 265 50 C245 65 230 72 225 80 C200 72 170 70 140 80Z"
          fill="oklch(0.92 0.08 80 / 0.7)"
          stroke="oklch(0.9 0.1 78 / 0.8)"
          strokeWidth="1"
        />
        <path
          d="M140 80 C170 80 215 72 260 90 C238 90 220 85 215 82 C190 82 165 80 140 80Z"
          fill="oklch(0.88 0.07 78 / 0.6)"
          stroke="oklch(0.88 0.09 76 / 0.7)"
          strokeWidth="1"
        />
        {/* Halo */}
        <ellipse
          cx="140"
          cy="25"
          rx="22"
          ry="8"
          fill="none"
          stroke="oklch(0.92 0.18 85 / 0.9)"
          strokeWidth="3"
        />
      </svg>
    </div>
  );
}

function GlitchOverlay() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 800);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;
  return (
    <>
      <div className="glitch-layer" />
      <div className="glitch-overlay" />
    </>
  );
}

function SunRisingOverlay() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1400);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;
  return (
    <>
      <div className="sun-rays-layer" />
      <div className="sun-horizon-glow" />
      <div className="sun-glow-orb" />
    </>
  );
}

function MoonRisingOverlay() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1500);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;

  const stars = [
    { top: "8%", left: "15%" },
    { top: "12%", left: "60%" },
    { top: "6%", left: "80%" },
    { top: "20%", left: "35%" },
    { top: "18%", left: "88%" },
    { top: "30%", left: "10%" },
    { top: "28%", left: "72%" },
    { top: "38%", left: "50%" },
    { top: "15%", left: "45%" },
    { top: "25%", left: "22%" },
  ];

  return (
    <>
      <div className="moon-glow-ring" />
      <div className="moon-stars-layer">
        {stars.map((pos, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: static list
            key={i}
            className="moon-star"
            style={{ ...pos, animationDelay: `${i * 0.08}s` }}
          />
        ))}
      </div>
      <div className="moon-orb" />
    </>
  );
}

// ── D6 SVG die face ─────────────────────────────────────────────────────────

function D6Svg({
  size = 50,
  faceValue = 6,
}: { size?: number; faceValue?: number }) {
  const pipPositions: Record<number, Array<[number, number]>> = {
    1: [[25, 25]],
    2: [
      [14, 14],
      [36, 36],
    ],
    3: [
      [14, 14],
      [25, 25],
      [36, 36],
    ],
    4: [
      [14, 14],
      [36, 14],
      [14, 36],
      [36, 36],
    ],
    5: [
      [14, 14],
      [36, 14],
      [25, 25],
      [14, 36],
      [36, 36],
    ],
    6: [
      [14, 12],
      [36, 12],
      [14, 25],
      [36, 25],
      [14, 38],
      [36, 38],
    ],
  };
  const pips = pipPositions[faceValue] ?? pipPositions[6];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      fill="none"
      role="img"
      aria-label={`D6 die showing ${faceValue}`}
      style={{
        filter: "drop-shadow(0 0 8px oklch(0.75 0.18 75 / 0.7))",
      }}
    >
      <rect
        x="3"
        y="3"
        width="44"
        height="44"
        rx="8"
        fill="oklch(0.15 0.06 260 / 0.92)"
        stroke="oklch(0.75 0.18 75)"
        strokeWidth="2"
      />
      {pips.map(([cx, cy], i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static pip layout
        <circle key={i} cx={cx} cy={cy} r="4" fill="oklch(0.85 0.18 75)" />
      ))}
    </svg>
  );
}

function GamblerOverlay() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1400);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;
  const face1 = Math.floor(Math.random() * 6) + 1;
  const face2 = Math.floor(Math.random() * 6) + 1;
  return (
    <>
      <div className="gambler-die-1">
        <D6Svg size={56} faceValue={face1} />
      </div>
      <div className="gambler-die-2">
        <D6Svg size={56} faceValue={face2} />
      </div>
    </>
  );
}

function GoldCoinsOverlay() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 2200);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;

  const coins = Array.from({ length: 16 }, (_, i) => ({
    left: `${5 + (i * 90) / 15}%`,
    delay: `${(i * 1.0) / 15}s`,
    dur: `${0.9 + (i * 0.5) / 15}s`,
  }));

  return (
    <>
      {coins.map((c, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: static list
          key={i}
          className="gold-coin"
          style={{
            left: c.left,
            // @ts-expect-error CSS custom properties
            "--coin-delay": c.delay,
            "--coin-dur": c.dur,
          }}
        />
      ))}
    </>
  );
}

function FlowerOverlay() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1350);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;
  return (
    <div className="flower-overlay">
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        role="img"
        aria-label="Flower"
        style={{
          filter:
            "drop-shadow(0 0 14px oklch(0.78 0.22 340 / 0.8)) drop-shadow(0 0 30px oklch(0.88 0.2 350 / 0.4))",
        }}
      >
        {/* 6 petals arranged radially */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <ellipse
            // biome-ignore lint/suspicious/noArrayIndexKey: static list
            key={i}
            cx={60 + Math.cos((angle * Math.PI) / 180) * 26}
            cy={60 + Math.sin((angle * Math.PI) / 180) * 26}
            rx="14"
            ry="22"
            fill="oklch(0.78 0.22 340 / 0.85)"
            stroke="oklch(0.88 0.18 345 / 0.6)"
            strokeWidth="1"
            transform={`rotate(${angle}, ${60 + Math.cos((angle * Math.PI) / 180) * 26}, ${60 + Math.sin((angle * Math.PI) / 180) * 26})`}
          />
        ))}
        {/* Center */}
        <circle
          cx="60"
          cy="60"
          r="13"
          fill="oklch(0.92 0.2 85)"
          stroke="oklch(0.82 0.18 80)"
          strokeWidth="1.5"
        />
        <circle cx="60" cy="60" r="6" fill="oklch(0.75 0.14 75)" />
      </svg>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function CharacterPreviewPanel({
  character,
  onViewProfile,
  onViewGallery,
}: CharacterPreviewPanelProps) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        {!character ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center gap-4 text-center select-none"
          >
            <div className="relative w-24 h-24 mb-2">
              <div
                className="absolute inset-0 rounded-full opacity-10"
                style={{
                  background:
                    "radial-gradient(circle, oklch(0.75 0.14 75) 0%, transparent 70%)",
                }}
              />
              <User
                size={40}
                className="absolute inset-0 m-auto text-muted-foreground"
              />
            </div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium">
              Select a Character
            </p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-1 h-1 rounded-full bg-gold/30"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          (() => {
            const anim = character.previewAnimation ?? "default";
            const animProps = getAnimationProps(anim);
            const overlayKey = `${character.id}_overlay`;
            const nameSize = Math.min(character.nameFontSize ?? 56, 40);

            const wrapClass =
              anim === "lightning-blue" || anim === "lightning-yellow"
                ? "lightning-shake-wrap"
                : "";

            return (
              <motion.div
                key={character.id}
                {...animProps}
                className={`w-full h-full flex flex-col relative ${wrapClass}`}
              >
                {/* Overlay effects */}
                {anim === "sparkle" && <SparkleOverlay key={overlayKey} />}
                {anim === "wave" && <WaveOceanOverlay key={overlayKey} />}
                {anim === "fire" && <FireOverlay key={overlayKey} />}
                {anim === "vines" && <VinesOverlay key={overlayKey} />}
                {anim === "ice" && <IceOverlay key={overlayKey} />}
                {anim === "spooky" && <SpookyOverlay key={overlayKey} />}
                {anim === "science-green" && (
                  <ScienceOverlay key={overlayKey} color="green" />
                )}
                {anim === "science-purple" && (
                  <ScienceOverlay key={overlayKey} color="purple" />
                )}
                {anim === "science-blue" && (
                  <ScienceOverlay key={overlayKey} color="blue" />
                )}
                {anim === "lightning-blue" && (
                  <LightningOverlay key={overlayKey} color="blue" />
                )}
                {anim === "lightning-yellow" && (
                  <LightningOverlay key={overlayKey} color="yellow" />
                )}
                {anim === "golden-shield" && (
                  <GoldenShieldOverlay key={overlayKey} />
                )}
                {anim === "door-lock" && <DoorLockOverlay key={overlayKey} />}
                {anim === "holy" && <HolyOverlay key={overlayKey} />}
                {anim === "glitch" && <GlitchOverlay key={overlayKey} />}
                {anim === "sun-rising" && <SunRisingOverlay key={overlayKey} />}
                {anim === "moon-rising" && (
                  <MoonRisingOverlay key={overlayKey} />
                )}
                {anim === "gambler" && <GamblerOverlay key={overlayKey} />}
                {anim === "gold-coins" && <GoldCoinsOverlay key={overlayKey} />}
                {anim === "flower" && <FlowerOverlay key={overlayKey} />}

                {/* ── TOP ZONE: Character name + badges ── */}
                <div
                  className="shrink-0 px-4 pt-4 pb-3 z-10 relative"
                  style={{ background: `${character.bgColor}cc` }}
                >
                  <motion.h2
                    className={`font-bold leading-tight ${character.title ? "mb-1" : "mb-2"} ${getFontClass(character.nameFont)}`}
                    style={{
                      color: character.textColor,
                      fontSize: `${nameSize}px`,
                    }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.35 }}
                  >
                    {character.name}
                  </motion.h2>
                  {character.title && (
                    <motion.p
                      className="leading-snug mb-2"
                      style={{
                        color: character.textColor,
                        fontSize: `${Math.min(Math.max(character.titleFontSize ?? 20, 12), 28)}px`,
                        opacity: 0.85,
                        wordBreak: "break-word",
                      }}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 0.85, y: 0 }}
                      transition={{ delay: 0.22, duration: 0.3 }}
                    >
                      {character.title}
                    </motion.p>
                  )}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant="outline"
                      className="text-xs border-gold/40 text-gold bg-gold/10 gap-1"
                    >
                      <Shield size={10} />
                      {character.faction}
                    </Badge>
                    <span className="flex items-center gap-1 text-xs text-gold/70">
                      <Star size={10} className="fill-gold/70 text-gold/70" />
                      {character.value}
                    </span>
                    {(character.fame ?? 0) > 0 && (
                      <span
                        className="flex items-center gap-1 text-xs opacity-70"
                        style={{ color: character.textColor }}
                      >
                        <Star size={10} className="fill-current" />
                        Fame {character.fame}
                      </span>
                    )}
                  </div>
                </div>

                {/* ── MIDDLE ZONE: Character image (max space) ── */}
                <div className="flex-1 relative overflow-hidden">
                  {character.fullBodyImageUrl || character.portraitImageUrl ? (
                    <>
                      {/* Blurred background layer — ambient color fill */}
                      <img
                        src={
                          character.fullBodyImageUrl ||
                          character.portraitImageUrl
                        }
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{
                          filter: "blur(40px)",
                          transform: "scale(1.1)",
                          opacity: 0.6,
                        }}
                      />
                      {/* Foreground character image — full body preferred */}
                      <motion.img
                        src={
                          character.fullBodyImageUrl ||
                          character.portraitImageUrl
                        }
                        alt={character.name}
                        className="absolute inset-0 w-full h-full object-contain object-center"
                        initial={{ scale: 1.02, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </>
                  ) : (
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ background: `${character.bgColor}40` }}
                    >
                      <User
                        size={64}
                        className="text-muted-foreground opacity-40"
                      />
                    </div>
                  )}
                </div>

                {/* ── BOTTOM ZONE: View Profile ABOVE music controls ── */}
                <div
                  className="shrink-0 px-4 pb-4 pt-3 z-10 relative flex flex-col gap-2"
                  style={{ background: `${character.bgColor}cc` }}
                >
                  {/* View Full Profile button is FIRST */}
                  <Button
                    data-ocid="preview.view_profile.button"
                    onClick={onViewProfile}
                    className="w-full gap-2 uppercase tracking-widest text-xs font-bold bg-gold/20 hover:bg-gold/30 border border-gold/50 text-gold transition-all duration-200"
                    variant="outline"
                  >
                    View Full Profile
                  </Button>

                  {/* Gallery button is SECOND */}
                  <Button
                    data-ocid="preview.gallery.button"
                    onClick={onViewGallery}
                    variant="ghost"
                    className="w-full gap-2 uppercase tracking-widest text-xs font-bold hover:bg-white/10 transition-all duration-200"
                    style={{
                      color: `${character.textColor}99`,
                      borderColor: `${character.textColor}30`,
                    }}
                  >
                    Gallery
                  </Button>

                  {/* AudioPlayer is THIRD (below buttons) */}
                  {character.musicUrl && (
                    <AudioPlayer
                      src={character.musicUrl}
                      characterName={character.name}
                      textColor={character.textColor}
                      accentColor={
                        character.bgColor === "#0d0d1a"
                          ? "#c9a84c"
                          : character.textColor
                      }
                      autoPlay
                      compact
                    />
                  )}
                </div>
              </motion.div>
            );
          })()
        )}
      </AnimatePresence>
    </div>
  );
}
