import CharacterPreviewPanel from "@/components/CharacterPreviewPanel";
import SortBar from "@/components/SortBar";
import { Button } from "@/components/ui/button";
import type { Character, SortField } from "@/store/characters";
import { getCharacters, sortCharacters } from "@/store/characters";
import {
  BookOpen,
  Dice5,
  GitCompare,
  Plus,
  Search,
  Shield,
  Star,
  Sword,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface CharacterSelectViewProps {
  onViewProfile: (id: string) => void;
  onAddCharacter: () => void;
  onSearch: () => void;
  onCompare: () => void;
  onViewGallery: (id: string) => void;
  onLore: () => void;
  onFactions: () => void;
  onArtifacts: () => void;
  refreshKey: number;
}

export default function CharacterSelectView({
  onViewProfile,
  onAddCharacter,
  onSearch,
  onCompare,
  onViewGallery,
  onLore,
  onFactions,
  onArtifacts,
  refreshKey,
}: CharacterSelectViewProps) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selected, setSelected] = useState<Character | null>(null);
  const [sortBy, setSortBy] = useState<SortField>("updatedAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [d20Open, setD20Open] = useState(false);
  const [d20Phase, setD20Phase] = useState<"rolling" | "reveal" | "done">(
    "rolling",
  );
  const [randomChar, setRandomChar] = useState<Character | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: refreshKey is a prop used as a cache-bust signal
  useEffect(() => {
    const chars = getCharacters();
    const sorted = sortCharacters(chars, sortBy, sortDir);
    setCharacters(sorted);
  }, [refreshKey, sortBy, sortDir]);

  const handlePortraitClick = (char: Character) => {
    if (selected?.id === char.id) {
      setSelected(null);
    } else {
      setSelected(char);
    }
  };

  const handleSort = (field: SortField) => {
    if (field === sortBy) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
  };

  const handleRandom = () => {
    if (characters.length === 0) return;
    const pick = characters[Math.floor(Math.random() * characters.length)];
    setRandomChar(pick);
    setD20Phase("rolling");
    setD20Open(true);
    // After 2s rolling: reveal character name
    setTimeout(() => setD20Phase("reveal"), 2000);
    // After 2.8s: close overlay and select the character
    setTimeout(() => {
      setD20Phase("done");
      setD20Open(false);
      setSelected(pick);
    }, 3200);
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Top header bar */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/50 backdrop-blur-sm shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-gold rounded-full" />
            <h1 className="text-sm font-bold uppercase tracking-[0.25em] text-foreground">
              Character Roster
            </h1>
          </div>
          <span className="text-xs text-muted-foreground">
            {characters.length} {characters.length === 1 ? "entry" : "entries"}
          </span>
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            data-ocid="select.lore.button"
            onClick={onLore}
            className="gap-1.5 text-xs text-muted-foreground hover:text-foreground uppercase tracking-wider"
          >
            <BookOpen size={14} />
            <span className="hidden sm:inline">Lore</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            data-ocid="select.factions.button"
            onClick={onFactions}
            className="gap-1.5 text-xs text-muted-foreground hover:text-foreground uppercase tracking-wider"
          >
            <Shield size={14} />
            <span className="hidden sm:inline">Factions</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            data-ocid="roster.artifacts.button"
            onClick={onArtifacts}
            className="gap-1.5 text-xs text-muted-foreground hover:text-foreground uppercase tracking-wider"
          >
            <Sword size={14} />
            <span className="hidden sm:inline">Artifacts</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            data-ocid="select.random.button"
            onClick={handleRandom}
            disabled={characters.length === 0}
            className="gap-1.5 text-xs text-muted-foreground hover:text-foreground uppercase tracking-wider"
          >
            <Dice5 size={14} />
            <span className="hidden sm:inline">Random</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            data-ocid="select.compare.button"
            onClick={onCompare}
            className="gap-1.5 text-xs text-muted-foreground hover:text-foreground uppercase tracking-wider"
          >
            <GitCompare size={14} />
            <span className="hidden sm:inline">Compare</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            data-ocid="search.open_modal_button"
            onClick={onSearch}
            className="gap-1.5 text-xs text-muted-foreground hover:text-foreground uppercase tracking-wider"
          >
            <Search size={14} />
            <span className="hidden sm:inline">Search</span>
          </Button>
          <Button
            size="sm"
            data-ocid="add_character.open_modal_button"
            onClick={onAddCharacter}
            className="gap-1.5 text-xs bg-gold/20 hover:bg-gold/30 border border-gold/50 text-gold uppercase tracking-wider"
            variant="outline"
          >
            <Plus size={14} />
            Add
          </Button>
        </div>
      </header>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel — portrait grid */}
        <div className="w-[110px] sm:w-[140px] shrink-0 flex flex-col border-r border-border bg-card/30 backdrop-blur-sm">
          {/* Sort bar */}
          <div className="px-3 py-2 border-b border-border">
            <SortBar sortBy={sortBy} direction={sortDir} onSort={handleSort} />
          </div>

          {/* Portrait grid */}
          <div className="flex-1 overflow-y-auto p-2">
            {characters.length === 0 ? (
              <div
                data-ocid="character.empty_state"
                className="flex flex-col items-center justify-center h-full gap-3 p-4 text-center"
              >
                <User size={32} className="text-muted-foreground opacity-50" />
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  No characters yet
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onAddCharacter}
                  className="text-xs border-gold/30 text-gold/70 hover:text-gold hover:border-gold/50"
                >
                  <Plus size={12} className="mr-1" />
                  Create First
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {characters.map((char, idx) => {
                  const isSelected = selected?.id === char.id;
                  return (
                    <motion.button
                      key={char.id}
                      data-ocid={`character.portrait.item.${idx + 1}`}
                      onClick={() => handlePortraitClick(char)}
                      className={[
                        "relative flex flex-col rounded-sm overflow-hidden cursor-pointer portrait-card-hover",
                        "border transition-all duration-200",
                        isSelected
                          ? "border-gold/70 glow-gold ring-1 ring-gold/30"
                          : "border-border/50",
                      ].join(" ")}
                      style={
                        !isSelected && char.portraitBorderColor
                          ? { borderColor: char.portraitBorderColor }
                          : undefined
                      }
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.04, duration: 0.3 }}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {/* Portrait image */}
                      <div
                        className="w-full aspect-square relative overflow-hidden"
                        style={{ background: `${char.bgColor}80` }}
                      >
                        {char.portraitImageUrl ? (
                          <img
                            src={char.portraitImageUrl}
                            alt={char.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User size={28} className="text-muted-foreground" />
                          </div>
                        )}

                        {/* Pin badge */}
                        {char.pinned && (
                          <div className="absolute top-1 left-1 z-10">
                            <Star
                              size={12}
                              className="fill-gold text-gold drop-shadow-sm"
                            />
                          </div>
                        )}

                        {/* Selection glow overlay */}
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              className="absolute inset-0 border-2 border-gold/60"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              style={{
                                boxShadow:
                                  "inset 0 0 15px oklch(0.75 0.14 75 / 0.3)",
                              }}
                            />
                          )}
                        </AnimatePresence>

                        {/* Value badge */}
                        <div
                          className="absolute top-1 right-1 text-xs font-bold px-1.5 py-0.5 rounded-sm"
                          style={{
                            background: `${char.bgColor}cc`,
                            color: char.textColor,
                            fontSize: "10px",
                          }}
                        >
                          {char.value}
                        </div>
                      </div>

                      {/* Name below portrait */}
                      <div
                        className="px-1.5 py-1.5 text-center"
                        style={{
                          background: isSelected
                            ? `${char.bgColor}dd`
                            : `${char.bgColor}99`,
                        }}
                      >
                        <p
                          className="text-xs font-semibold truncate leading-tight"
                          style={{ color: char.textColor }}
                        >
                          {char.name}
                        </p>
                        <p
                          className="text-xs truncate opacity-60 mt-0.5"
                          style={{ color: char.textColor, fontSize: "9px" }}
                        >
                          {char.faction}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right panel — character preview */}
        <div
          className={[
            "relative overflow-hidden transition-colors duration-700",
            selected ? "flex-1" : "w-0 sm:flex-1",
          ].join(" ")}
          style={{
            background: selected
              ? `radial-gradient(ellipse at 70% 100%, ${selected.bgColor}66 0%, transparent 60%), oklch(0.1 0.01 280)`
              : "oklch(0.1 0.01 280)",
          }}
        >
          {/* Atmospheric background pattern */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 40px, oklch(1 0 0 / 0.01) 40px, oklch(1 0 0 / 0.01) 41px)",
            }}
          />

          <CharacterPreviewPanel
            character={selected}
            onViewProfile={() => selected && onViewProfile(selected.id)}
            onViewGallery={() => selected && onViewGallery(selected.id)}
          />
        </div>
      </div>

      {/* D20 Dice Roll Overlay */}
      <AnimatePresence>
        {d20Open && (
          <motion.div
            key="d20-overlay"
            data-ocid="select.random.modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center"
            style={{
              background:
                "radial-gradient(ellipse at center, oklch(0.12 0.04 260) 0%, oklch(0.04 0.02 240) 80%)",
            }}
          >
            {/* Glowing ring */}
            <div
              className="absolute w-80 h-80 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, oklch(0.75 0.18 75 / 0.08) 0%, transparent 70%)",
              }}
            />

            {/* D6 die */}
            <motion.div
              animate={
                d20Phase === "rolling"
                  ? {
                      rotate: [0, 180, 360, 520, 680, 720],
                      scale: [1, 1.1, 0.95, 1.05, 1],
                    }
                  : { rotate: 720, scale: 1 }
              }
              transition={
                d20Phase === "rolling"
                  ? { duration: 2, ease: "easeInOut" }
                  : { duration: 0.3 }
              }
              className="relative"
            >
              <D6Svg />
            </motion.div>

            {/* Phase text */}
            <AnimatePresence mode="wait">
              {d20Phase === "rolling" && (
                <motion.p
                  key="rolling-text"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-6 text-xs uppercase tracking-[0.4em] text-muted-foreground"
                >
                  Rolling…
                </motion.p>
              )}
              {d20Phase === "reveal" && randomChar && (
                <motion.div
                  key="reveal-text"
                  initial={{ opacity: 0, scale: 0.85, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="mt-8 text-center px-8"
                >
                  <p className="text-xs uppercase tracking-[0.4em] text-gold/60 mb-2">
                    Fate Chose
                  </p>
                  <p
                    className="text-3xl font-bold leading-tight"
                    style={{
                      color: randomChar.textColor,
                      textShadow: `0 0 30px ${randomChar.textColor}60`,
                    }}
                  >
                    {randomChar.name}
                  </p>
                  {randomChar.title && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {randomChar.title}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── D6 SVG Die ───────────────────────────────────────────────────────────────

function D6Svg() {
  // Show a 6 face (2×3 grid of pips)
  const pips: Array<[number, number]> = [
    [46, 38],
    [94, 38],
    [46, 70],
    [94, 70],
    [46, 102],
    [94, 102],
  ];
  return (
    <svg
      width="140"
      height="140"
      viewBox="0 0 140 140"
      fill="none"
      role="img"
      aria-label="Six-sided die"
      style={{
        filter:
          "drop-shadow(0 0 20px oklch(0.75 0.18 75 / 0.6)) drop-shadow(0 0 40px oklch(0.75 0.18 75 / 0.3))",
      }}
    >
      {/* Die body */}
      <rect
        x="10"
        y="10"
        width="120"
        height="120"
        rx="20"
        fill="oklch(0.15 0.06 260 / 0.92)"
        stroke="oklch(0.75 0.18 75)"
        strokeWidth="2.5"
      />
      {/* Inner subtle glow rect */}
      <rect
        x="18"
        y="18"
        width="104"
        height="104"
        rx="14"
        fill="oklch(0.75 0.18 75 / 0.04)"
        stroke="oklch(0.75 0.18 75 / 0.2)"
        strokeWidth="1"
      />
      {/* Pips */}
      {pips.map(([cx, cy], i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static list
        <circle key={i} cx={cx} cy={cy} r="9" fill="oklch(0.85 0.18 75)" />
      ))}
    </svg>
  );
}
