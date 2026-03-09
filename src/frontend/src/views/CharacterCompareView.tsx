import StatHexChart from "@/components/StatHexChart";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Character } from "@/store/characters";
import { getCharacters, getFontClass } from "@/store/characters";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Crown,
  Layers,
  Shield,
  Star,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface CharacterCompareViewProps {
  onBack: () => void;
  onNavigate: (id: string) => void;
}

const STAT_KEYS = [
  "strength",
  "defense",
  "magic",
  "power",
  "scale",
  "influence",
] as const;

const STAT_LABELS: Record<(typeof STAT_KEYS)[number], string> = {
  strength: "Strength",
  defense: "Defense",
  magic: "Magic",
  power: "Power",
  scale: "Scale",
  influence: "Fame",
};

export default function CharacterCompareView({
  onBack,
  onNavigate,
}: CharacterCompareViewProps) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [char1Id, setChar1Id] = useState<string>("");
  const [char2Id, setChar2Id] = useState<string>("");
  const [panel, setPanel] = useState(0); // 0..4
  const [overlayActive, setOverlayActive] = useState(false);

  // Touch swipe
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    setCharacters(getCharacters());
  }, []);

  const char1 = characters.find((c) => c.id === char1Id) ?? null;
  const char2 = characters.find((c) => c.id === char2Id) ?? null;

  const prevPanel = () => setPanel((p) => Math.max(0, p - 1));
  const nextPanel = () => setPanel((p) => Math.min(4, p + 1));

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) {
      if (dx < 0) nextPanel();
      else prevPanel();
    }
    touchStartX.current = null;
  };

  const panelTitles = [
    "Face-Off",
    "Hex Charts",
    "Stat Bars",
    "Overview",
    "Verdict",
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b border-border bg-background/90 backdrop-blur-sm">
        <Button
          data-ocid="compare.back.button"
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="gap-2 text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={14} />
          Roster
        </Button>

        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-gold rounded-full" />
          <h1 className="text-sm font-bold uppercase tracking-widest">
            Compare Characters
          </h1>
        </div>

        <div className="w-24" />
      </header>

      {/* Selectors */}
      <div className="max-w-4xl mx-auto w-full px-6 pt-6 pb-4">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Character 1
            </p>
            <Select
              value={char1Id || "__none__"}
              onValueChange={(v) => setChar1Id(v === "__none__" ? "" : v)}
            >
              <SelectTrigger data-ocid="compare.char1.select">
                <SelectValue placeholder="Select character…" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">— Select —</SelectItem>
                {characters.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Character 2
            </p>
            <Select
              value={char2Id || "__none__"}
              onValueChange={(v) => setChar2Id(v === "__none__" ? "" : v)}
            >
              <SelectTrigger data-ocid="compare.char2.select">
                <SelectValue placeholder="Select character…" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">— Select —</SelectItem>
                {characters.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Panel navigation */}
      <div className="max-w-4xl mx-auto w-full px-6 pb-2">
        <div className="flex items-center justify-between">
          <Button
            data-ocid="compare.panel.prev.button"
            variant="ghost"
            size="sm"
            onClick={prevPanel}
            disabled={panel === 0}
            className="gap-1 text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground disabled:opacity-30"
          >
            <ChevronLeft size={14} />
            Prev
          </Button>

          {/* Panel dots + title */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-bold uppercase tracking-widest text-gold/70">
              {panelTitles[panel]}
            </span>
            <div className="flex items-center gap-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <button
                  key={i}
                  type="button"
                  data-ocid={`compare.panel.${i + 1}.tab`}
                  onClick={() => setPanel(i)}
                  className="transition-all"
                  style={{
                    width: panel === i ? "20px" : "8px",
                    height: "8px",
                    borderRadius: "4px",
                    background:
                      panel === i
                        ? "oklch(0.75 0.14 75)"
                        : "oklch(0.4 0.02 260)",
                    transition: "all 0.25s ease",
                  }}
                />
              ))}
            </div>
          </div>

          <Button
            data-ocid="compare.panel.next.button"
            variant="ghost"
            size="sm"
            onClick={nextPanel}
            disabled={panel === 4}
            className="gap-1 text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground disabled:opacity-30"
          >
            Next
            <ChevronRight size={14} />
          </Button>
        </div>
      </div>

      {/* Panel content */}
      <div
        className="flex-1 max-w-4xl mx-auto w-full px-6 pb-6"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          {panel === 0 && (
            <motion.div
              key="faceoff-panel"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <FaceOffPanel char1={char1} char2={char2} />
            </motion.div>
          )}

          {panel === 1 && (
            <motion.div
              key="hex-panel"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <HexPanel
                char1={char1}
                char2={char2}
                overlayActive={overlayActive}
                onToggleOverlay={() => setOverlayActive((v) => !v)}
              />
            </motion.div>
          )}

          {panel === 2 && (
            <motion.div
              key="bars-panel"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <StatBarsPanel char1={char1} char2={char2} />
            </motion.div>
          )}

          {panel === 3 && (
            <motion.div
              key="overview-panel"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <OverviewPanel
                char1={char1}
                char2={char2}
                onNavigate={onNavigate}
              />
            </motion.div>
          )}

          {panel === 4 && (
            <motion.div
              key="verdict-panel"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <VerdictPanel char1={char1} char2={char2} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="py-6 border-t border-border text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-80 underline"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}

// ── Panel 0: Face-Off ────────────────────────────────────────────────────────

function FaceOffPanel({
  char1,
  char2,
}: {
  char1: Character | null;
  char2: Character | null;
}) {
  return (
    <div className="pt-4 space-y-4">
      {/* Label */}
      <motion.p
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center text-xs uppercase tracking-widest text-muted-foreground"
      >
        Select two characters above to begin the face-off
      </motion.p>

      {/* Cards row */}
      <div className="relative grid grid-cols-2 gap-4">
        <FaceOffCard char={char1} side="left" index={1} />

        {/* VS badge */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              delay: 0.4,
              type: "spring",
              stiffness: 200,
              damping: 14,
            }}
            className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-black border-2"
            style={{
              background: "oklch(0.12 0.02 260)",
              borderColor: "oklch(0.75 0.14 75)",
              color: "oklch(0.75 0.14 75)",
              boxShadow: "0 0 24px oklch(0.75 0.14 75 / 0.4)",
            }}
          >
            VS
          </motion.div>
        </div>

        <FaceOffCard char={char2} side="right" index={2} />
      </div>

      {/* Prompt to continue */}
      {char1 && char2 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-xs text-muted-foreground"
        >
          Swipe left or tap{" "}
          <span className="text-gold font-semibold">Next</span> to compare their
          stats
        </motion.p>
      )}
    </div>
  );
}

function FaceOffCard({
  char,
  side,
  index,
}: {
  char: Character | null;
  side: "left" | "right";
  index: number;
}) {
  if (!char) {
    return (
      <motion.div
        initial={{ opacity: 0, x: side === "left" ? -20 : 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border border-dashed border-border/50 flex items-center justify-center min-h-[380px] bg-card/20"
        data-ocid={`compare.char${index}.card`}
      >
        <div className="text-center space-y-2 px-4">
          <User
            size={36}
            className="text-muted-foreground opacity-30 mx-auto"
          />
          <p className="text-xs uppercase tracking-widest text-muted-foreground opacity-50">
            Select a character
          </p>
        </div>
      </motion.div>
    );
  }

  const tc = char.textColor || "#ffffff";
  const bg = char.bgColor || "#0d0d1a";
  const fontClass = getFontClass(char.nameFont);

  return (
    <motion.div
      initial={{ opacity: 0, x: side === "left" ? -24 : 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.25, duration: 0.5, ease: "easeOut" }}
      className="rounded-xl overflow-hidden border relative flex flex-col"
      style={{
        borderColor: `${tc}30`,
        minHeight: "380px",
        boxShadow: `0 0 24px ${tc}15`,
      }}
      data-ocid={`compare.char${index}.card`}
    >
      {/* Portrait fills top ~60% */}
      <div
        className="relative flex-1"
        style={{ backgroundColor: bg, minHeight: "220px" }}
      >
        {char.portraitImageUrl ? (
          <img
            src={char.portraitImageUrl}
            alt={char.name}
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <User size={56} style={{ color: `${tc}25` }} />
          </div>
        )}
        {/* Gradient overlay for name */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, ${bg}f0 0%, ${bg}60 35%, transparent 65%)`,
          }}
        />
        {/* Name overlaid at bottom of image */}
        <div className="absolute bottom-0 w-full px-3 pb-3 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`font-black leading-tight ${fontClass}`}
            style={{
              color: tc,
              fontSize: `${char.nameFontSize || 22}px`,
              textShadow: "0 2px 12px rgba(0,0,0,0.9)",
            }}
          >
            {char.name}
          </motion.h2>
        </div>
      </div>

      {/* Bottom section: faction + signature */}
      <div className="px-3 py-3 space-y-2" style={{ backgroundColor: bg }}>
        {char.faction && (
          <div className="flex items-center justify-center gap-1.5">
            <Shield size={10} style={{ color: `${tc}70` }} />
            <span
              className="text-xs uppercase tracking-wider font-medium"
              style={{ color: `${tc}90` }}
            >
              {char.faction}
            </span>
          </div>
        )}
        {char.signature && (
          <p
            className="text-xs italic text-center leading-relaxed"
            style={{ color: `${tc}80` }}
          >
            &ldquo;{char.signature}&rdquo;
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ── Panel 1: Hex Charts ─────────────────────────────────────────────────────

function HexPanel({
  char1,
  char2,
  overlayActive,
  onToggleOverlay,
}: {
  char1: Character | null;
  char2: Character | null;
  overlayActive: boolean;
  onToggleOverlay: () => void;
}) {
  const char1Color = char1?.statHexColor || char1?.textColor || "#c9a84c";
  const char2Color = char2?.statHexColor || char2?.textColor || "#3b82f6";

  const getStats = (c: Character) => ({
    strength: c.strength ?? 0,
    defense: c.defense ?? 0,
    magic: c.magic ?? 0,
    power: c.power ?? 0,
    scale: c.scale ?? 0,
    influence: c.influence ?? 0,
  });

  const emptyStats = {
    strength: 0,
    defense: 0,
    magic: 0,
    power: 0,
    scale: 0,
    influence: 0,
  };

  return (
    <div className="space-y-4">
      {/* Overlay toggle */}
      <div className="flex justify-center pt-2">
        <Button
          data-ocid="compare.overlay.toggle"
          variant="outline"
          size="sm"
          onClick={onToggleOverlay}
          className={[
            "gap-2 text-xs uppercase tracking-wider",
            overlayActive
              ? "bg-gold/20 border-gold/50 text-gold"
              : "text-muted-foreground",
          ].join(" ")}
        >
          <Layers size={14} />
          {overlayActive ? "Overlaying Charts" : "Overlay Charts"}
        </Button>
      </div>

      {overlayActive ? (
        /* Overlay mode */
        <div className="flex justify-center items-center py-4">
          {char1 || char2 ? (
            <div className="relative">
              {char1 && (
                <StatHexChart
                  stats={getStats(char1)}
                  color={char1Color}
                  size={280}
                  showLabels={true}
                  label={char1.name}
                />
              )}
              {char2 && (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ opacity: 0.65 }}
                >
                  <StatHexChart
                    stats={getStats(char2)}
                    color={char2Color}
                    size={280}
                    showLabels={false}
                  />
                </div>
              )}
              {/* Legend */}
              <div className="flex gap-4 justify-center mt-2">
                {char1 && (
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ background: char1Color }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {char1.name}
                    </span>
                  </div>
                )}
                {char2 && (
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-3 h-3 rounded-full opacity-65"
                      style={{ background: char2Color }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {char2.name}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              Select characters above to compare
            </p>
          )}
        </div>
      ) : (
        /* Side-by-side mode */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <HexCharSlot
            char={char1}
            color={char1Color}
            stats={char1 ? getStats(char1) : emptyStats}
          />
          <HexCharSlot
            char={char2}
            color={char2Color}
            stats={char2 ? getStats(char2) : emptyStats}
          />
        </div>
      )}
    </div>
  );
}

function HexCharSlot({
  char,
  color,
  stats,
}: {
  char: Character | null;
  color: string;
  stats: {
    strength: number;
    defense: number;
    magic: number;
    power: number;
    scale: number;
    influence: number;
  };
}) {
  if (!char) {
    return (
      <div className="rounded-xl border border-dashed border-border/50 flex items-center justify-center min-h-[320px] bg-card/20">
        <div className="text-center space-y-2">
          <User
            size={32}
            className="text-muted-foreground opacity-30 mx-auto"
          />
          <p className="text-xs uppercase tracking-widest text-muted-foreground opacity-50">
            Select a character
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="rounded-xl border p-4 flex flex-col items-center gap-2"
      style={{ borderColor: `${color}30`, background: `${color}05` }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <p className="text-sm font-bold" style={{ color }}>
        {char.name}
      </p>
      {char.faction && (
        <p className="text-xs text-muted-foreground">{char.faction}</p>
      )}
      <StatHexChart stats={stats} color={color} size={200} showLabels={true} />
    </motion.div>
  );
}

// ── Panel 2: Stat Bars ──────────────────────────────────────────────────────

function StatBarsPanel({
  char1,
  char2,
}: { char1: Character | null; char2: Character | null }) {
  const char1Color = char1?.statHexColor || char1?.textColor || "#c9a84c";
  const char2Color = char2?.statHexColor || char2?.textColor || "#3b82f6";

  return (
    <div className="space-y-6 pt-4">
      {!char1 && !char2 && (
        <p className="text-center text-muted-foreground text-sm py-12">
          Select characters above to compare stats
        </p>
      )}

      {/* Legend */}
      {(char1 || char2) && (
        <div className="flex gap-6 justify-center">
          {char1 && (
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{ background: char1Color }}
              />
              <span
                className="text-sm font-medium"
                style={{ color: char1Color }}
              >
                {char1.name}
              </span>
            </div>
          )}
          {char2 && (
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded"
                style={{ background: char2Color }}
              />
              <span
                className="text-sm font-medium"
                style={{ color: char2Color }}
              >
                {char2.name}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Stat bars */}
      {STAT_KEYS.map((key) => {
        const val1 = char1?.[key] ?? null;
        const val2 = char2?.[key] ?? null;
        const winner =
          val1 !== null && val2 !== null
            ? val1 > val2
              ? 1
              : val2 > val1
                ? 2
                : 0
            : 0;

        // Map -100..100 to 0..100% for bar display
        const toPercent = (v: number) => ((v + 100) / 200) * 100;

        return (
          <div key={key} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {STAT_LABELS[key]}
              </span>
            </div>

            {/* Char 1 bar */}
            {val1 !== null && (
              <div className="flex items-center gap-3">
                <span
                  className="text-xs font-bold w-10 text-right shrink-0"
                  style={{
                    color: char1Color,
                    fontWeight: winner === 1 ? 900 : 400,
                    opacity: winner === 2 ? 0.5 : 1,
                  }}
                >
                  {val1 > 0 ? `+${val1}` : val1}
                </span>
                <div className="flex-1 h-3 rounded-full bg-card/50 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: char1Color,
                      boxShadow:
                        winner === 1 ? `0 0 8px ${char1Color}80` : undefined,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${toPercent(val1)}%` }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                  />
                </div>
                {winner === 1 && (
                  <span className="text-xs" style={{ color: char1Color }}>
                    ★
                  </span>
                )}
              </div>
            )}

            {/* Char 2 bar */}
            {val2 !== null && (
              <div className="flex items-center gap-3">
                <span
                  className="text-xs font-bold w-10 text-right shrink-0"
                  style={{
                    color: char2Color,
                    fontWeight: winner === 2 ? 900 : 400,
                    opacity: winner === 1 ? 0.5 : 1,
                  }}
                >
                  {val2 > 0 ? `+${val2}` : val2}
                </span>
                <div className="flex-1 h-3 rounded-full bg-card/50 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: char2Color,
                      boxShadow:
                        winner === 2 ? `0 0 8px ${char2Color}80` : undefined,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${toPercent(val2)}%` }}
                    transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
                  />
                </div>
                {winner === 2 && (
                  <span className="text-xs" style={{ color: char2Color }}>
                    ★
                  </span>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Panel 3: Overview ───────────────────────────────────────────────────────

function OverviewPanel({
  char1,
  char2,
  onNavigate,
}: {
  char1: Character | null;
  char2: Character | null;
  onNavigate: (id: string) => void;
}) {
  if (!char1 && !char2) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-center text-muted-foreground text-sm">
          Select characters above to compare
        </p>
      </div>
    );
  }

  // Trait overlap
  const sharedTraits =
    char1 && char2
      ? char1.traits.filter((t) =>
          char2.traits.some((t2) => t2.toLowerCase() === t.toLowerCase()),
        )
      : [];

  // Relationship link check
  const char1MentionsChar2 =
    char1 &&
    char2 &&
    [
      char1.lore,
      char1.backstory,
      ...(char1.relationships ?? []).map((r) => r.description),
    ].some((f) => f?.toLowerCase().includes(char2.name.toLowerCase()));

  const char2MentionsChar1 =
    char1 &&
    char2 &&
    [
      char2.lore,
      char2.backstory,
      ...(char2.relationships ?? []).map((r) => r.description),
    ].some((f) => f?.toLowerCase().includes(char1.name.toLowerCase()));

  return (
    <div className="space-y-8 pt-4">
      {/* Portraits side by side */}
      <div className="grid grid-cols-2 gap-4">
        <OverviewCard char={char1} onNavigate={onNavigate} />
        <OverviewCard char={char2} onNavigate={onNavigate} />
      </div>

      {/* Shared traits */}
      {sharedTraits.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-gold/20 bg-gold/5 p-4 space-y-2"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-gold/70">
            Shared Traits
          </p>
          <div className="flex flex-wrap gap-2">
            {sharedTraits.map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 rounded-full text-xs border border-gold/40 text-gold bg-gold/10"
              >
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Connection note */}
      {(char1MentionsChar2 || char2MentionsChar1) && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-border/50 bg-card/30 p-4 space-y-1"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Connection Detected
          </p>
          {char1MentionsChar2 && (
            <p className="text-sm text-foreground/80">
              <span
                className="font-semibold"
                style={{ color: char1?.textColor || "#c9a84c" }}
              >
                {char1?.name}
              </span>{" "}
              mentions{" "}
              <span
                className="font-semibold"
                style={{ color: char2?.textColor || "#3b82f6" }}
              >
                {char2?.name}
              </span>{" "}
              in their lore.
            </p>
          )}
          {char2MentionsChar1 && (
            <p className="text-sm text-foreground/80">
              <span
                className="font-semibold"
                style={{ color: char2?.textColor || "#3b82f6" }}
              >
                {char2?.name}
              </span>{" "}
              mentions{" "}
              <span
                className="font-semibold"
                style={{ color: char1?.textColor || "#c9a84c" }}
              >
                {char1?.name}
              </span>{" "}
              in their lore.
            </p>
          )}
        </motion.div>
      )}

      {/* Signatures */}
      {(char1?.signature || char2?.signature) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {char1?.signature && (
            <div
              className="p-3 rounded-lg border-l-2"
              style={{ borderLeftColor: char1.textColor || "#c9a84c" }}
            >
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                {char1.name}
              </p>
              <p
                className="text-sm italic"
                style={{ color: `${char1.textColor || "#c9a84c"}cc` }}
              >
                &ldquo;{char1.signature}&rdquo;
              </p>
            </div>
          )}
          {char2?.signature && (
            <div
              className="p-3 rounded-lg border-l-2"
              style={{ borderLeftColor: char2.textColor || "#3b82f6" }}
            >
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                {char2.name}
              </p>
              <p
                className="text-sm italic"
                style={{ color: `${char2.textColor || "#3b82f6"}cc` }}
              >
                &ldquo;{char2.signature}&rdquo;
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function OverviewCard({
  char,
  onNavigate,
}: {
  char: Character | null;
  onNavigate: (id: string) => void;
}) {
  if (!char) {
    return (
      <div className="rounded-xl border border-dashed border-border/50 flex items-center justify-center min-h-[200px] bg-card/20">
        <User size={32} className="text-muted-foreground opacity-30" />
      </div>
    );
  }

  const tc = char.textColor || "#fff";
  const bg = char.bgColor || "#0d0d1a";
  const fontClass = getFontClass(char.nameFont);

  return (
    <motion.div
      className="rounded-xl overflow-hidden border"
      style={{ borderColor: `${tc}30` }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Portrait */}
      <div className="relative h-40" style={{ backgroundColor: bg }}>
        {char.portraitImageUrl ? (
          <img
            src={char.portraitImageUrl}
            alt={char.name}
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <User size={48} style={{ color: `${tc}30` }} />
          </div>
        )}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, ${bg}ee 0%, transparent 60%)`,
          }}
        />
        <div className="absolute bottom-0 w-full px-3 pb-2">
          <h3
            className={`font-black leading-tight text-center text-sm ${fontClass}`}
            style={{ color: tc, textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}
          >
            {char.name}
          </h3>
        </div>
      </div>

      {/* Stats */}
      <div className="p-3 space-y-2" style={{ backgroundColor: bg }}>
        <div className="flex items-center gap-1.5">
          <Shield size={10} style={{ color: `${tc}80` }} />
          <span className="text-xs" style={{ color: `${tc}99` }}>
            {char.faction || "—"}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div
            className="rounded p-2 text-center"
            style={{ background: `${tc}10` }}
          >
            <p className="text-xs opacity-60" style={{ color: tc }}>
              Power
            </p>
            <p className="text-base font-black" style={{ color: tc }}>
              {char.value}
            </p>
          </div>
          <div
            className="rounded p-2 text-center"
            style={{ background: `${tc}10` }}
          >
            <p className="text-xs opacity-60" style={{ color: tc }}>
              Fame
            </p>
            <p
              className="text-base font-black flex items-center justify-center gap-0.5"
              style={{ color: tc }}
            >
              <Star size={10} className="fill-current" />
              {char.fame ?? 0}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate(char.id)}
          data-ocid="compare.view_profile.button"
          className="w-full text-xs uppercase tracking-wider"
          style={{ borderColor: `${tc}40`, color: tc, background: `${tc}10` }}
        >
          View Full Profile
        </Button>
      </div>
    </motion.div>
  );
}

// ── Panel 4: Verdict ────────────────────────────────────────────────────────

function VerdictPanel({
  char1,
  char2,
}: {
  char1: Character | null;
  char2: Character | null;
}) {
  if (!char1 && !char2) {
    return (
      <div
        className="flex items-center justify-center py-20"
        data-ocid="verdict.empty_state"
      >
        <p className="text-center text-muted-foreground text-sm">
          Select two characters above to see the verdict
        </p>
      </div>
    );
  }

  if (!char1 || !char2) {
    return (
      <div
        className="flex items-center justify-center py-20"
        data-ocid="verdict.empty_state"
      >
        <p className="text-center text-muted-foreground text-sm">
          Select both characters above to see the verdict
        </p>
      </div>
    );
  }

  const char1Color = char1.statHexColor || char1.textColor || "#c9a84c";
  const char2Color = char2.statHexColor || char2.textColor || "#3b82f6";

  // Tally wins
  let wins1 = 0;
  let wins2 = 0;
  let ties = 0;

  const statResults = STAT_KEYS.map((key) => {
    const val1 = char1[key] ?? 0;
    const val2 = char2[key] ?? 0;
    let winner: "char1" | "char2" | "tie";
    if (val1 > val2) {
      winner = "char1";
      wins1++;
    } else if (val2 > val1) {
      winner = "char2";
      wins2++;
    } else {
      winner = "tie";
      ties++;
    }
    return { key, label: STAT_LABELS[key], val1, val2, winner };
  });

  const overallWinner: "char1" | "char2" | "tie" =
    wins1 > wins2 ? "char1" : wins2 > wins1 ? "char2" : "tie";

  const winnerChar =
    overallWinner === "char1"
      ? char1
      : overallWinner === "char2"
        ? char2
        : null;
  const winnerColor =
    overallWinner === "char1"
      ? char1Color
      : overallWinner === "char2"
        ? char2Color
        : "#888";
  const winnerFontClass = winnerChar ? getFontClass(winnerChar.nameFont) : "";
  const winnerWins =
    overallWinner === "char1"
      ? wins1
      : overallWinner === "char2"
        ? wins2
        : ties;

  return (
    <div className="space-y-6 pt-4" data-ocid="verdict.panel">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <h2
          className="text-2xl font-black uppercase tracking-widest"
          style={{
            color: "oklch(0.75 0.14 75)",
            textShadow: "0 0 30px oklch(0.75 0.14 75 / 0.5)",
          }}
        >
          The Verdict
        </h2>
        <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
          Stat-by-stat breakdown
        </p>
      </motion.div>

      {/* Stat results table */}
      <div className="rounded-xl border border-border/50 overflow-hidden">
        {/* Header */}
        <div
          className="grid gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground border-b border-border/50"
          style={{ gridTemplateColumns: "1fr 2fr 2fr 2fr" }}
        >
          <span>Stat</span>
          <span className="text-center" style={{ color: char1Color }}>
            {char1.name.split(" ")[0]}
          </span>
          <span className="text-center" style={{ color: char2Color }}>
            {char2.name.split(" ")[0]}
          </span>
          <span className="text-center">Winner</span>
        </div>

        {/* Rows */}
        {statResults.map(({ key, label, val1, val2, winner }, idx) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + idx * 0.08, duration: 0.35 }}
            className="grid gap-2 px-4 py-3 border-b border-border/30 last:border-0 items-center"
            style={{
              gridTemplateColumns: "1fr 2fr 2fr 2fr",
              background:
                winner === "char1"
                  ? `${char1Color}08`
                  : winner === "char2"
                    ? `${char2Color}08`
                    : "transparent",
            }}
            data-ocid={`verdict.${key}.row`}
          >
            {/* Stat name */}
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {label}
            </span>

            {/* Val 1 */}
            <div className="text-center">
              <span
                className="text-sm font-black"
                style={{
                  color: char1Color,
                  opacity: winner === "char2" ? 0.4 : 1,
                  fontWeight: winner === "char1" ? 900 : 500,
                }}
              >
                {val1 > 0 ? `+${val1}` : val1}
              </span>
            </div>

            {/* Val 2 */}
            <div className="text-center">
              <span
                className="text-sm font-black"
                style={{
                  color: char2Color,
                  opacity: winner === "char1" ? 0.4 : 1,
                  fontWeight: winner === "char2" ? 900 : 500,
                }}
              >
                {val2 > 0 ? `+${val2}` : val2}
              </span>
            </div>

            {/* Winner badge */}
            <div className="text-center">
              {winner === "tie" ? (
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">
                  Tie
                </span>
              ) : (
                <span
                  className="text-xs font-black"
                  style={{
                    color: winner === "char1" ? char1Color : char2Color,
                  }}
                >
                  {winner === "char1"
                    ? char1.name.split(" ")[0]
                    : char2.name.split(" ")[0]}{" "}
                  ★
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Overall Winner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          delay: 0.75,
          duration: 0.5,
          type: "spring",
          stiffness: 120,
        }}
        className="rounded-2xl border-2 overflow-hidden"
        style={{
          borderColor: `${winnerColor}60`,
          boxShadow: `0 0 40px ${winnerColor}25`,
        }}
        data-ocid="verdict.overall_winner.card"
      >
        {/* Banner */}
        <div
          className="px-4 py-2 text-center"
          style={{
            background: `linear-gradient(135deg, ${winnerColor}25, ${winnerColor}10)`,
            borderBottom: `1px solid ${winnerColor}30`,
          }}
        >
          <p
            className="text-xs font-black uppercase tracking-widest"
            style={{ color: winnerColor }}
          >
            Overall Winner
          </p>
        </div>

        {/* Winner content */}
        <div
          className="flex flex-col items-center gap-3 py-6 px-4"
          style={{ background: `${winnerColor}06` }}
        >
          {overallWinner === "tie" ? (
            <>
              <div className="text-4xl">🤝</div>
              <p className="text-xl font-black uppercase tracking-widest text-muted-foreground">
                It's a Tie!
              </p>
              <p className="text-xs text-muted-foreground">
                Both characters are evenly matched — {ties} stat
                {ties !== 1 ? "s" : ""} tied
              </p>
            </>
          ) : (
            <>
              {/* Portrait */}
              <div
                className="relative w-24 h-24 rounded-full overflow-hidden border-4"
                style={{
                  borderColor: winnerColor,
                  boxShadow: `0 0 20px ${winnerColor}60`,
                }}
              >
                {winnerChar?.portraitImageUrl ? (
                  <img
                    src={winnerChar.portraitImageUrl}
                    alt={winnerChar.name}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ background: winnerChar?.bgColor || "#0d0d1a" }}
                  >
                    <User size={36} style={{ color: `${winnerColor}60` }} />
                  </div>
                )}
              </div>

              {/* Crown icon */}
              <motion.div
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.1, type: "spring", stiffness: 200 }}
              >
                <Crown
                  size={28}
                  style={{
                    color: "oklch(0.75 0.14 75)",
                    filter: "drop-shadow(0 0 8px oklch(0.75 0.14 75 / 0.7))",
                  }}
                />
              </motion.div>

              {/* Winner name */}
              <h3
                className={`text-2xl font-black text-center ${winnerFontClass}`}
                style={{
                  color: winnerColor,
                  textShadow: `0 0 20px ${winnerColor}60`,
                  fontSize: `${winnerChar?.nameFontSize || 28}px`,
                }}
              >
                {winnerChar?.name}
              </h3>

              {winnerChar?.title && (
                <p
                  className="text-xs italic text-center"
                  style={{ color: `${winnerColor}90` }}
                >
                  {winnerChar.title}
                </p>
              )}

              {/* Wins count */}
              <div
                className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border"
                style={{
                  color: winnerColor,
                  borderColor: `${winnerColor}50`,
                  background: `${winnerColor}15`,
                }}
              >
                Wins {winnerWins} of 6 stats
              </div>

              {/* Sub-tally */}
              <div className="flex gap-6 text-xs text-muted-foreground">
                <span>
                  <span className="font-bold" style={{ color: char1Color }}>
                    {char1.name.split(" ")[0]}
                  </span>
                  : {wins1}W
                </span>
                <span className="opacity-50">{ties}T</span>
                <span>
                  <span className="font-bold" style={{ color: char2Color }}>
                    {char2.name.split(" ")[0]}
                  </span>
                  : {wins2}W
                </span>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
