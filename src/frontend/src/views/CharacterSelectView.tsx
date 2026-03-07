import CharacterPreviewPanel from "@/components/CharacterPreviewPanel";
import SortBar from "@/components/SortBar";
import { Button } from "@/components/ui/button";
import type { Character, SortField } from "@/store/characters";
import { getCharacters, sortCharacters } from "@/store/characters";
import { GitCompare, Plus, Search, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface CharacterSelectViewProps {
  onViewProfile: (id: string) => void;
  onAddCharacter: () => void;
  onSearch: () => void;
  onCompare: () => void;
  onViewGallery: (id: string) => void;
  refreshKey: number;
}

export default function CharacterSelectView({
  onViewProfile,
  onAddCharacter,
  onSearch,
  onCompare,
  onViewGallery,
  refreshKey,
}: CharacterSelectViewProps) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selected, setSelected] = useState<Character | null>(null);
  const [sortBy, setSortBy] = useState<SortField>("updatedAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

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
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            data-ocid="select.compare.button"
            onClick={onCompare}
            className="gap-1.5 text-xs text-muted-foreground hover:text-foreground uppercase tracking-wider"
          >
            <GitCompare size={14} />
            Compare
          </Button>
          <Button
            variant="ghost"
            size="sm"
            data-ocid="search.open_modal_button"
            onClick={onSearch}
            className="gap-1.5 text-xs text-muted-foreground hover:text-foreground uppercase tracking-wider"
          >
            <Search size={14} />
            Search
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
    </div>
  );
}
