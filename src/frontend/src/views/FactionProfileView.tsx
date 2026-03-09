import FactionEditorModal from "@/components/FactionEditorModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCharacters } from "@/store/characters";
import type { Character } from "@/store/characters";
import type { Faction } from "@/store/factions";
import { getFactions } from "@/store/factions";
import {
  ArrowLeft,
  ChevronDown,
  Edit,
  Shield,
  User,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface FactionProfileViewProps {
  factionId: string;
  onBack: () => void;
  onNavigateToCharacter: (id: string) => void;
  onEdit: (id: string) => void;
}

export default function FactionProfileView({
  factionId,
  onBack,
  onNavigateToCharacter,
}: FactionProfileViewProps) {
  const [faction, setFaction] = useState<Faction | null>(null);
  const [members, setMembers] = useState<Character[]>([]);
  const [editorOpen, setEditorOpen] = useState(false);

  useEffect(() => {
    const factions = getFactions();
    const found = factions.find((f) => f.id === factionId);
    setFaction(found ?? null);

    if (found) {
      const chars = getCharacters();
      const matched = chars.filter(
        (c) => c.faction.toLowerCase() === found.name.toLowerCase(),
      );
      setMembers(matched);
    }
  }, [factionId]);

  if (!faction) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <p className="text-muted-foreground">Faction not found.</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(ellipse at 80% 10%, oklch(0.2 0.06 50 / 0.2) 0%, oklch(0.08 0.02 240) 60%)",
        color: "oklch(0.9 0.04 80)",
      }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b backdrop-blur-md"
        style={{
          borderColor: "oklch(0.75 0.12 75 / 0.2)",
          background: "oklch(0.08 0.02 240 / 0.85)",
        }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          data-ocid="faction_profile.back.button"
          className="gap-2 text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={14} />
          Factions
        </Button>

        <div className="flex items-center gap-2">
          <Shield size={14} className="text-gold opacity-70" />
          <span className="text-xs uppercase tracking-[0.25em] font-medium opacity-60">
            Faction Profile
          </span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setEditorOpen(true)}
          data-ocid="faction_profile.edit.button"
          className="gap-2 text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
        >
          <Edit size={14} />
          Edit
        </Button>
      </header>

      {/* Hero section */}
      <div className="max-w-5xl mx-auto px-6 pt-10 pb-8">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* Symbol */}
          <motion.div
            className="shrink-0"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {faction.symbolImageUrl ? (
              <div
                className="w-40 h-40 rounded-lg border flex items-center justify-center overflow-hidden"
                style={{
                  borderColor: "oklch(0.75 0.12 75 / 0.3)",
                  background: "oklch(0.12 0.03 260 / 0.5)",
                  boxShadow: "0 0 40px oklch(0.75 0.12 75 / 0.15)",
                }}
              >
                <img
                  src={faction.symbolImageUrl}
                  alt={faction.name}
                  className="w-full h-full object-contain p-4"
                />
              </div>
            ) : (
              <div
                className="w-40 h-40 rounded-lg border flex items-center justify-center"
                style={{
                  borderColor: "oklch(0.75 0.12 75 / 0.2)",
                  background: "oklch(0.12 0.03 260 / 0.4)",
                }}
              >
                <Shield size={64} className="text-gold/30" />
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <h1
              className="text-4xl font-black mb-2 leading-tight"
              style={{
                color: "oklch(0.85 0.14 75)",
                textShadow: "0 0 30px oklch(0.75 0.12 75 / 0.3)",
              }}
            >
              {faction.name}
            </h1>
            <p
              className="text-lg leading-relaxed"
              style={{ color: "oklch(0.78 0.04 80 / 0.85)" }}
            >
              {faction.shortDescription}
            </p>
            <div className="flex items-center gap-3 mt-4">
              <Badge
                variant="outline"
                className="gap-1 text-xs border-gold/30 text-gold/80 bg-gold/10"
              >
                <Users size={10} />
                {members.length} Known Member
                {members.length !== 1 ? "s" : ""}
              </Badge>
              {faction.exMembers.length > 0 && (
                <Badge
                  variant="outline"
                  className="text-xs border-border text-muted-foreground"
                >
                  {faction.exMembers.length} Former
                </Badge>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Divider */}
      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(to right, transparent, oklch(0.75 0.12 75 / 0.3), transparent)",
        }}
      />

      {/* Content sections */}
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        {/* Full Lore */}
        {faction.lore && (
          <FactionSection title="Full Lore" delay={0.2}>
            <p
              className="leading-loose text-base whitespace-pre-wrap"
              style={{ color: "oklch(0.82 0.04 80 / 0.85)" }}
            >
              {faction.lore}
            </p>
          </FactionSection>
        )}

        {/* Known Members */}
        <FactionSection title="Known Members" delay={0.3}>
          {members.length === 0 ? (
            <p
              data-ocid="faction_profile.members.empty_state"
              className="text-sm italic"
              style={{ color: "oklch(0.6 0.03 80 / 0.7)" }}
            >
              No known members found. Add characters with faction set to "
              {faction.name}" to see them here.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {members.map((char, idx) => (
                <motion.button
                  key={char.id}
                  type="button"
                  data-ocid={`faction_profile.member.item.${idx + 1}`}
                  onClick={() => onNavigateToCharacter(char.id)}
                  className="flex items-center gap-3 p-3 rounded-lg border text-left transition-all hover:scale-[1.02]"
                  style={{
                    borderColor: "oklch(0.75 0.12 75 / 0.15)",
                    background: "oklch(0.12 0.02 250 / 0.5)",
                  }}
                  whileHover={{
                    borderColor: "oklch(0.75 0.12 75 / 0.4)",
                  }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.06 }}
                >
                  {/* Portrait */}
                  <div
                    className="w-10 h-10 rounded-full overflow-hidden border-2 shrink-0"
                    style={{ borderColor: "oklch(0.75 0.12 75 / 0.3)" }}
                  >
                    {char.portraitImageUrl ? (
                      <img
                        src={char.portraitImageUrl}
                        alt={char.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ background: `${char.bgColor}60` }}
                      >
                        <User size={16} className="text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-semibold text-sm truncate"
                      style={{ color: "oklch(0.88 0.08 78)" }}
                    >
                      {char.name}
                    </p>
                    {char.title && (
                      <p className="text-xs truncate text-muted-foreground">
                        {char.title}
                      </p>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </FactionSection>

        {/* Former Members */}
        {faction.exMembers.length > 0 && (
          <FactionSection title="Former Members" delay={0.4}>
            <ul className="space-y-2">
              {faction.exMembers.map((name, idx) => (
                <li
                  // biome-ignore lint/suspicious/noArrayIndexKey: ordered list
                  key={idx}
                  className="flex items-center gap-2 text-sm"
                  style={{ color: "oklch(0.72 0.04 80 / 0.7)" }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: "oklch(0.6 0.04 80 / 0.5)" }}
                  />
                  {name}
                </li>
              ))}
            </ul>
          </FactionSection>
        )}
      </div>

      {/* Footer */}
      <footer
        className="mt-10 py-6 border-t text-center text-xs"
        style={{
          borderColor: "oklch(0.75 0.12 75 / 0.15)",
          color: "oklch(0.5 0.03 80 / 0.6)",
        }}
      >
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

      {/* Editor modal */}
      <FactionEditorModal
        factionId={factionId}
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        onSaved={() => {
          setEditorOpen(false);
          // Re-load faction data
          const factions = getFactions();
          const found = factions.find((f) => f.id === factionId);
          setFaction(found ?? null);
          if (found) {
            const chars = getCharacters();
            setMembers(
              chars.filter(
                (c) => c.faction.toLowerCase() === found.name.toLowerCase(),
              ),
            );
          }
        }}
        onDeleted={() => {
          setEditorOpen(false);
          onBack();
        }}
      />
    </div>
  );
}

// ── Collapsible section ──────────────────────────────────────────────────────

function FactionSection({
  title,
  delay,
  children,
  defaultOpen = true,
}: {
  title: string;
  delay: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <button
        type="button"
        onClick={() => setIsOpen((p) => !p)}
        className="w-full flex items-center gap-3 mb-4 group"
        data-ocid={`faction_profile.${title.toLowerCase().replace(/\s+/g, "_")}.toggle`}
      >
        <div
          className="w-1 h-6 rounded-full shrink-0"
          style={{ background: "oklch(0.75 0.12 75)" }}
        />
        <h2
          className="text-xs font-bold uppercase tracking-[0.3em]"
          style={{ color: "oklch(0.75 0.08 78 / 0.8)" }}
        >
          {title}
        </h2>
        <div
          className="flex-1 h-px"
          style={{ background: "oklch(0.75 0.12 75 / 0.2)" }}
        />
        <ChevronDown
          size={14}
          style={{
            color: "oklch(0.6 0.04 78)",
            transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)",
            transition: "transform 0.25s ease",
            flexShrink: 0,
          }}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
