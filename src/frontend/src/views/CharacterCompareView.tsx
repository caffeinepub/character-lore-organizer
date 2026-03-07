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
import { ArrowLeft, Shield, Star, User } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface CharacterCompareViewProps {
  onBack: () => void;
  onNavigate: (id: string) => void;
}

export default function CharacterCompareView({
  onBack,
  onNavigate,
}: CharacterCompareViewProps) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [char1Id, setChar1Id] = useState<string>("");
  const [char2Id, setChar2Id] = useState<string>("");

  useEffect(() => {
    setCharacters(getCharacters());
  }, []);

  const char1 = characters.find((c) => c.id === char1Id) ?? null;
  const char2 = characters.find((c) => c.id === char2Id) ?? null;

  return (
    <div className="min-h-screen bg-background">
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
      <div className="max-w-4xl mx-auto px-6 pt-8 pb-4">
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

      {/* Comparison cards */}
      <div className="max-w-4xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-2 gap-6">
          <CompareCard char={char1} onNavigate={onNavigate} slot={1} />
          <CompareCard char={char2} onNavigate={onNavigate} slot={2} />
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-border text-center text-xs text-muted-foreground">
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

function CompareCard({
  char,
  onNavigate,
  slot,
}: {
  char: Character | null;
  onNavigate: (id: string) => void;
  slot: 1 | 2;
}) {
  if (!char) {
    return (
      <div className="rounded-xl border border-border/50 border-dashed bg-card/20 flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3 p-8">
          <User
            size={40}
            className="text-muted-foreground opacity-30 mx-auto"
          />
          <p className="text-xs uppercase tracking-widest text-muted-foreground opacity-50">
            Select a character
          </p>
        </div>
      </div>
    );
  }

  const fontClass = getFontClass(char.nameFont);
  const tc = char.textColor || "#fff";
  const bg = char.bgColor || "#0d0d1a";

  return (
    <motion.div
      className="rounded-xl overflow-hidden border"
      style={{ borderColor: `${tc}30` }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Portrait section */}
      <div
        className="relative h-56 flex items-end"
        style={{ backgroundColor: bg }}
      >
        {char.portraitImageUrl ? (
          <img
            src={char.portraitImageUrl}
            alt={char.name}
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: `${tc}10` }}
          >
            <User size={60} style={{ color: `${tc}30` }} />
          </div>
        )}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, ${bg}ee 0%, transparent 60%)`,
          }}
        />
        {/* Name overlay */}
        <div className="relative z-10 w-full px-4 pb-3">
          <h2
            className={`font-black leading-tight text-center ${fontClass}`}
            style={{
              color: tc,
              fontSize: "clamp(1.1rem, 3vw, 1.5rem)",
              textShadow: "0 2px 8px rgba(0,0,0,0.8)",
            }}
          >
            {char.name}
          </h2>
        </div>
      </div>

      {/* Stats section */}
      <div className="p-4 space-y-4" style={{ backgroundColor: bg }}>
        {/* Faction */}
        <div className="flex items-center gap-2">
          <Shield size={12} style={{ color: `${tc}80` }} />
          <span className="text-xs font-medium" style={{ color: `${tc}99` }}>
            {char.faction || "—"}
          </span>
        </div>

        {/* Value & Fame */}
        <div className="grid grid-cols-2 gap-3">
          <div
            className="rounded-md p-3 text-center"
            style={{ background: `${tc}10` }}
          >
            <p
              className="text-xs uppercase tracking-wider mb-1"
              style={{ color: `${tc}60` }}
            >
              Value
            </p>
            <p className="text-xl font-black" style={{ color: tc }}>
              {char.value}
            </p>
          </div>
          <div
            className="rounded-md p-3 text-center"
            style={{ background: `${tc}10` }}
          >
            <p
              className="text-xs uppercase tracking-wider mb-1"
              style={{ color: `${tc}60` }}
            >
              Fame
            </p>
            <p
              className="text-xl font-black flex items-center justify-center gap-1"
              style={{ color: tc }}
            >
              <Star size={14} className="fill-current" />
              {char.fame ?? 0}
            </p>
          </div>
        </div>

        {/* Traits */}
        {char.traits.length > 0 && (
          <div>
            <p
              className="text-xs uppercase tracking-widest mb-2"
              style={{ color: `${tc}55` }}
            >
              Traits
            </p>
            <div className="flex flex-wrap gap-1.5">
              {char.traits.slice(0, 6).map((trait) => (
                <span
                  key={trait}
                  className="px-2 py-0.5 rounded-full text-xs border"
                  style={{
                    borderColor: `${tc}35`,
                    color: `${tc}cc`,
                    background: `${tc}10`,
                  }}
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {(char.tags ?? []).length > 0 && (
          <div>
            <p
              className="text-xs uppercase tracking-widest mb-2"
              style={{ color: `${tc}55` }}
            >
              Tags
            </p>
            <div className="flex flex-wrap gap-1.5">
              {(char.tags ?? []).slice(0, 5).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full text-xs border"
                  style={{
                    borderColor: `${tc}25`,
                    color: `${tc}99`,
                    background: `${tc}08`,
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* View Profile */}
        <Button
          data-ocid={`compare.char${slot}.view_profile.button`}
          variant="outline"
          size="sm"
          onClick={() => onNavigate(char.id)}
          className="w-full text-xs uppercase tracking-wider gap-1.5"
          style={{
            borderColor: `${tc}40`,
            color: tc,
            background: `${tc}10`,
          }}
        >
          View Full Profile
        </Button>
      </div>
    </motion.div>
  );
}
