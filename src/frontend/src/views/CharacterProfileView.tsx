import AudioPlayer from "@/components/AudioPlayer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Character } from "@/store/characters";
import { getCharacters, getFontClass } from "@/store/characters";
import { linkifyText } from "@/utils/linkifyText";
import {
  ArrowLeft,
  ChevronDown,
  Download,
  Edit,
  Shield,
  Star,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface CharacterProfileViewProps {
  characterId: string;
  onBack: () => void;
  onEdit: (id: string) => void;
  onNavigate: (id: string) => void;
}

export default function CharacterProfileView({
  characterId,
  onBack,
  onEdit,
  onNavigate,
}: CharacterProfileViewProps) {
  const [character, setCharacter] = useState<Character | null>(null);
  const [allCharacters, setAllCharacters] = useState<Character[]>([]);
  const [exportOpen, setExportOpen] = useState(false);

  useEffect(() => {
    const chars = getCharacters();
    const found = chars.find((c) => c.id === characterId);
    setCharacter(found ?? null);
    setAllCharacters(chars);
  }, [characterId]);

  if (!character) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <p className="text-muted-foreground">Character not found.</p>
      </div>
    );
  }

  const bg = character.bgColor || "#0d0d1a";
  const tc = character.textColor || "#ffffff";
  const fontClass = getFontClass(character.nameFont);
  const nameFontSize = character.nameFontSize ?? 56;
  const titleFontSize = character.titleFontSize ?? 32;

  // Derive a subtle accent from text color
  const accentAlpha40 = `${tc}66`;

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{ backgroundColor: bg, color: tc }}
    >
      {/* Atmospheric gradient layers */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 80% 0%, ${tc}08 0%, transparent 60%)`,
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 20% 100%, ${tc}05 0%, transparent 50%)`,
        }}
      />

      {/* Header nav */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 backdrop-blur-md border-b"
        style={{ borderColor: `${tc}20`, background: `${bg}cc` }}
      >
        <Button
          data-ocid="profile.back.button"
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="gap-2 text-sm uppercase tracking-wider hover:bg-white/10"
          style={{ color: `${tc}cc` }}
        >
          <ArrowLeft size={16} />
          Roster
        </Button>

        <div className="flex items-center gap-1">
          <div className="w-1 h-4 rounded-full" style={{ background: tc }} />
          <span className="text-xs uppercase tracking-[0.25em] font-medium opacity-60">
            Character Profile
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            data-ocid="profile.export_card.open_modal_button"
            variant="ghost"
            size="sm"
            onClick={() => setExportOpen(true)}
            className="gap-2 text-sm uppercase tracking-wider hover:bg-white/10"
            style={{ color: `${tc}cc` }}
          >
            <Download size={16} />
            Export
          </Button>
          <Button
            data-ocid="profile.edit.button"
            variant="ghost"
            size="sm"
            onClick={() => onEdit(character.id)}
            className="gap-2 text-sm uppercase tracking-wider hover:bg-white/10"
            style={{ color: `${tc}cc` }}
          >
            <Edit size={16} />
            Edit
          </Button>
        </div>
      </header>

      {/* Hero section */}
      <div className="relative">
        <div className="max-w-6xl mx-auto px-6 pt-10 pb-0">
          <div className="flex flex-col md:flex-row gap-8 items-end">
            {/* Left — text info */}
            <motion.div
              className="flex-1 pb-8 md:pb-16"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Faction + Value + Fame badges */}
              <div className="flex items-center gap-2 flex-wrap mb-4 justify-center">
                <Badge
                  variant="outline"
                  className="gap-1 text-xs uppercase tracking-wider border-current"
                  style={{
                    borderColor: accentAlpha40,
                    color: tc,
                    background: `${tc}15`,
                  }}
                >
                  <Shield size={10} />
                  {character.faction}
                </Badge>
                <span className="flex items-center gap-1 text-xs opacity-60">
                  <Star size={10} />
                  Value: {character.value}
                </span>
                {(character.fame ?? 0) > 0 && (
                  <span className="flex items-center gap-1 text-xs opacity-60">
                    <Star size={10} className="fill-current" />
                    Fame: {character.fame}
                  </span>
                )}
              </div>

              {/* Name — always centered, full width */}
              <h1
                className={`font-black leading-tight mb-2 text-center w-full ${fontClass}`}
                style={{
                  color: tc,
                  fontSize: `clamp(2rem, ${nameFontSize}px, ${nameFontSize}px)`,
                  textShadow: `0 0 40px ${tc}40, 0 4px 8px rgba(0,0,0,0.8)`,
                }}
              >
                {character.name}
              </h1>

              {/* Title line */}
              {character.title && (
                <p
                  className="text-center w-full mb-4 font-medium tracking-wide opacity-80"
                  style={{
                    color: tc,
                    fontSize: `clamp(1rem, ${titleFontSize}px, ${titleFontSize}px)`,
                    textShadow: "0 2px 6px rgba(0,0,0,0.6)",
                  }}
                >
                  {character.title}
                </p>
              )}

              {/* Signature */}
              {character.signature && (
                <div
                  className="mb-5 pl-4 border-l-2 max-w-lg mx-auto"
                  style={{ borderLeftColor: tc }}
                >
                  <p
                    className="italic text-lg leading-relaxed"
                    style={{ color: tc, opacity: 0.85 }}
                  >
                    &ldquo;{character.signature}&rdquo;
                  </p>
                  <p
                    className="text-xs uppercase tracking-wider mt-1"
                    style={{ color: tc, opacity: 0.5 }}
                  >
                    — Signature
                  </p>
                </div>
              )}

              {/* Short description */}
              <p
                className="text-lg leading-relaxed max-w-lg mb-6 text-center mx-auto"
                style={{ color: `${tc}b0` }}
              >
                {character.shortDescription}
              </p>

              {/* Traits */}
              {character.traits.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6 justify-center">
                  {character.traits.map((trait) => (
                    <span
                      key={trait}
                      className="px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider border"
                      style={{
                        borderColor: accentAlpha40,
                        color: tc,
                        background: `${tc}15`,
                      }}
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Right — full portrait image with accent border */}
            <motion.div
              className="shrink-0 flex justify-center md:justify-end"
              style={{ maxHeight: "500px" }}
              initial={{ opacity: 0, x: 30, scale: 1.05 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              {character.fullBodyImageUrl || character.portraitImageUrl ? (
                <div
                  style={{
                    border: `1px solid ${tc}33`,
                    borderRadius: "6px",
                    display: "inline-block",
                  }}
                >
                  <img
                    src={
                      character.fullBodyImageUrl || character.portraitImageUrl
                    }
                    alt={character.name}
                    className="h-full max-h-[480px] w-auto object-contain drop-shadow-2xl"
                    style={{
                      filter: "drop-shadow(0 0 30px rgba(0,0,0,0.8))",
                      borderRadius: "4px",
                      display: "block",
                      boxShadow: `0 0 0 2px ${tc}55, 0 0 24px ${tc}30`,
                    }}
                  />
                </div>
              ) : (
                <div
                  className="w-48 h-64 md:w-64 md:h-80 rounded-lg border flex items-center justify-center"
                  style={{
                    borderColor: accentAlpha40,
                    background: `${tc}0a`,
                  }}
                >
                  <User size={64} style={{ color: `${tc}40` }} />
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Divider gradient */}
        <div
          className="h-px w-full"
          style={{
            background: `linear-gradient(to right, transparent, ${accentAlpha40}, transparent)`,
          }}
        />
      </div>

      {/* Content sections */}
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        {/* Audio player */}
        {character.musicUrl && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AudioPlayer
              src={character.musicUrl}
              characterName={character.name}
              textColor={tc}
              accentColor={tc}
            />
          </motion.section>
        )}

        {/* Lore */}
        {character.lore && (
          <ProfileSection
            title="Lore"
            textColor={tc}
            accentAlpha40={accentAlpha40}
            delay={0.3}
          >
            <p
              className="leading-loose text-lg whitespace-pre-wrap"
              style={{ color: `${tc}cc` }}
            >
              {linkifyText(character.lore, allCharacters, tc, onNavigate)}
            </p>
          </ProfileSection>
        )}

        {/* Backstory */}
        {character.backstory && (
          <ProfileSection
            title="Backstory"
            textColor={tc}
            accentAlpha40={accentAlpha40}
            delay={0.4}
          >
            <p
              className="leading-loose text-lg whitespace-pre-wrap"
              style={{ color: `${tc}cc` }}
            >
              {linkifyText(character.backstory, allCharacters, tc, onNavigate)}
            </p>
          </ProfileSection>
        )}

        {/* Fun Facts */}
        {character.funFacts.length > 0 && (
          <ProfileSection
            title="Known Facts"
            textColor={tc}
            accentAlpha40={accentAlpha40}
            delay={0.5}
          >
            <ul className="space-y-3">
              {character.funFacts.map((fact, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: ordered list
                <li key={i} className="flex gap-3 items-start">
                  <span
                    className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                    style={{ background: `${tc}20`, color: tc }}
                  >
                    {i + 1}
                  </span>
                  <span
                    className="text-base leading-relaxed"
                    style={{ color: `${tc}cc` }}
                  >
                    {fact}
                  </span>
                </li>
              ))}
            </ul>
          </ProfileSection>
        )}

        {/* Tags */}
        {(character.tags ?? []).length > 0 && (
          <ProfileSection
            title="Tags"
            textColor={tc}
            accentAlpha40={accentAlpha40}
            delay={0.55}
          >
            <div className="flex flex-wrap gap-2">
              {(character.tags ?? []).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-medium border"
                  style={{
                    borderColor: `${tc}40`,
                    color: tc,
                    background: `${tc}18`,
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </ProfileSection>
        )}

        {/* Relationships */}
        {(character.relationships ?? []).length > 0 && (
          <ProfileSection
            title="Relationships"
            textColor={tc}
            accentAlpha40={accentAlpha40}
            delay={0.6}
          >
            <div className="space-y-4">
              {(character.relationships ?? []).map((rel, i) => {
                const linked = allCharacters.find(
                  (c) => c.id === rel.linkedCharacterId,
                );
                return (
                  // biome-ignore lint/suspicious/noArrayIndexKey: ordered list
                  <div key={i} className="flex gap-3 items-start">
                    {/* Portrait thumbnail */}
                    <button
                      type="button"
                      onClick={() => linked && onNavigate(linked.id)}
                      className="shrink-0 w-10 h-10 rounded-full overflow-hidden border-2 hover:scale-110 transition-transform"
                      style={{ borderColor: `${tc}40` }}
                      title={linked?.name ?? "Unknown"}
                    >
                      {linked?.portraitImageUrl ? (
                        <img
                          src={linked.portraitImageUrl}
                          alt={linked.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ background: `${tc}20` }}
                        >
                          <User size={16} style={{ color: tc }} />
                        </div>
                      )}
                    </button>

                    <div className="flex-1">
                      {linked && (
                        <button
                          type="button"
                          onClick={() => onNavigate(linked.id)}
                          className="font-bold text-sm hover:underline mb-1 block"
                          style={{ color: tc }}
                        >
                          {linked.name}
                        </button>
                      )}
                      {!linked && (
                        <span
                          className="font-bold text-sm block mb-1 opacity-50"
                          style={{ color: tc }}
                        >
                          Unknown Character
                        </span>
                      )}
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: `${tc}99` }}
                      >
                        {linkifyText(
                          rel.description,
                          allCharacters,
                          tc,
                          onNavigate,
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ProfileSection>
        )}

        {/* Portrait / alternate image */}
        {character.portraitImageUrl && (
          <ProfileSection
            title="Portrait"
            textColor={tc}
            accentAlpha40={accentAlpha40}
            delay={0.65}
          >
            <div className="flex gap-6 items-start">
              <img
                src={character.portraitImageUrl}
                alt={`${character.name} portrait`}
                className="w-32 h-48 rounded-lg object-cover border"
                style={{ borderColor: accentAlpha40 }}
              />
            </div>
          </ProfileSection>
        )}

        {/* Also Appears In */}
        <AlsoAppearsIn
          character={character}
          allCharacters={allCharacters}
          textColor={tc}
          accentAlpha40={accentAlpha40}
          onNavigate={onNavigate}
        />
      </div>

      {/* Footer */}
      <footer
        className="mt-10 py-6 border-t text-center text-xs"
        style={{ borderColor: `${tc}20`, color: `${tc}40` }}
      >
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: `${tc}60` }}
          className="hover:opacity-80 underline"
        >
          caffeine.ai
        </a>
      </footer>

      {/* Export Card Dialog */}
      <ExportCardDialog
        character={character}
        open={exportOpen}
        onClose={() => setExportOpen(false)}
      />
    </div>
  );
}

// ── Export Card Dialog ──────────────────────────────────────────────────────

function ExportCardDialog({
  character,
  open,
  onClose,
}: {
  character: Character;
  open: boolean;
  onClose: () => void;
}) {
  const [downloading, setDownloading] = useState(false);

  const tc = character.textColor || "#ffffff";
  const fontClass = getFontClass(character.nameFont);
  // tc and fontClass are used in the card preview JSX below

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const CARD_W = 560;
      const CARD_H = 840;
      const canvas = document.createElement("canvas");
      canvas.width = CARD_W;
      canvas.height = CARD_H;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Background
      ctx.fillStyle = character.bgColor || "#0d0d1a";
      ctx.fillRect(0, 0, CARD_W, CARD_H);

      // Helper to load an image
      const loadImg = (src: string): Promise<HTMLImageElement> =>
        new Promise((res, rej) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => res(img);
          img.onerror = rej;
          img.src = src;
        });

      // Draw portrait if available
      const imgSrc = character.portraitImageUrl || character.fullBodyImageUrl;
      if (imgSrc) {
        try {
          const img = await loadImg(imgSrc);
          // Cover fill
          const scale = Math.max(CARD_W / img.width, CARD_H / img.height);
          const sw = img.width * scale;
          const sh = img.height * scale;
          ctx.drawImage(img, (CARD_W - sw) / 2, (CARD_H - sh) / 2, sw, sh);
        } catch {
          // skip if image fails
        }
      }

      // Top scrim
      const topGrad = ctx.createLinearGradient(0, 0, 0, CARD_H * 0.4);
      topGrad.addColorStop(0, "rgba(0,0,0,0.85)");
      topGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, CARD_W, CARD_H * 0.4);

      // Bottom scrim
      const botGrad = ctx.createLinearGradient(0, CARD_H * 0.65, 0, CARD_H);
      botGrad.addColorStop(0, "rgba(0,0,0,0)");
      botGrad.addColorStop(1, "rgba(0,0,0,0.92)");
      ctx.fillStyle = botGrad;
      ctx.fillRect(0, CARD_H * 0.65, CARD_W, CARD_H * 0.35);

      // Name at top
      const tc = character.textColor || "#ffffff";
      ctx.fillStyle = tc;
      ctx.textAlign = "center";
      ctx.shadowColor = "rgba(0,0,0,0.9)";
      ctx.shadowBlur = 16;
      ctx.font = `bold ${Math.min(character.nameFontSize ?? 56, 60)}px serif`;
      ctx.fillText(character.name, CARD_W / 2, 80, CARD_W - 60);
      ctx.shadowBlur = 0;

      // Short description at bottom
      if (character.shortDescription) {
        ctx.fillStyle = `${tc}dd`;
        ctx.font = "22px sans-serif";
        ctx.textAlign = "center";
        ctx.shadowColor = "rgba(0,0,0,0.9)";
        ctx.shadowBlur = 10;
        // Word wrap
        const words = character.shortDescription.split(" ");
        const lines: string[] = [];
        let currentLine = "";
        for (const word of words) {
          const test = currentLine ? `${currentLine} ${word}` : word;
          if (ctx.measureText(test).width > CARD_W - 60) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            currentLine = test;
          }
        }
        if (currentLine) lines.push(currentLine);
        const lineH = 32;
        let y = CARD_H - 40 - (lines.length - 1) * lineH;
        for (const line of lines) {
          ctx.fillText(line, CARD_W / 2, y);
          y += lineH;
        }
        ctx.shadowBlur = 0;
      }

      const link = document.createElement("a");
      link.download = `${character.name.replace(/\s+/g, "-").toLowerCase()}-card.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      // fallback silent fail
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        data-ocid="profile.export_card.dialog"
        className="max-w-md"
      >
        <DialogHeader>
          <DialogTitle className="text-sm uppercase tracking-widest">
            Export Character Card
          </DialogTitle>
        </DialogHeader>

        {/* Card preview */}
        <div className="flex justify-center my-4">
          <div
            className="relative overflow-hidden rounded-lg"
            style={{
              width: "280px",
              height: "420px",
              backgroundColor: character.bgColor || "#0d0d1a",
            }}
          >
            {/* Portrait fills the card */}
            {character.portraitImageUrl ? (
              <img
                src={character.portraitImageUrl}
                alt={character.name}
                className="absolute inset-0 w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            ) : (
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ background: `${tc}10` }}
              >
                <User size={80} style={{ color: `${tc}40` }} />
              </div>
            )}

            {/* Name at top */}
            <div
              className="absolute top-0 left-0 right-0 px-4 pt-4 pb-6"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, transparent 100%)",
              }}
            >
              <p
                className={`font-black leading-tight text-center ${fontClass}`}
                style={{
                  color: tc,
                  fontSize: "clamp(1.25rem, 5vw, 1.6rem)",
                  textShadow: "0 2px 8px rgba(0,0,0,0.9)",
                }}
              >
                {character.name}
              </p>
            </div>

            {/* Description at bottom */}
            {character.shortDescription && (
              <div
                className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-8"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)",
                }}
              >
                <p
                  className="text-xs text-center leading-relaxed"
                  style={{
                    color: `${tc}dd`,
                    textShadow: "0 1px 4px rgba(0,0,0,0.9)",
                  }}
                >
                  {character.shortDescription}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button
            data-ocid="profile.export_card.close_button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-xs uppercase tracking-wider"
          >
            Close
          </Button>
          <Button
            data-ocid="profile.export_card.download.button"
            size="sm"
            onClick={handleDownload}
            disabled={downloading}
            className="gap-2 text-xs uppercase tracking-wider"
          >
            <Download size={13} />
            {downloading ? "Saving..." : "Download PNG"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Also Appears In ─────────────────────────────────────────────────────────

function AlsoAppearsIn({
  character,
  allCharacters,
  textColor,
  accentAlpha40,
  onNavigate,
}: {
  character: Character;
  allCharacters: Character[];
  textColor: string;
  accentAlpha40: string;
  onNavigate: (id: string) => void;
}) {
  const tc = textColor;
  const name = character.name.toLowerCase();

  const mentions = allCharacters.filter((c) => {
    if (c.id === character.id) return false;
    const fields = [
      c.lore,
      c.backstory,
      c.shortDescription,
      ...(c.relationships ?? []).map((r) => r.description),
    ];
    return fields.some((f) => f?.toLowerCase().includes(name));
  });

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.75, duration: 0.5 }}
    >
      {/* Section header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-1 h-6 rounded-full shrink-0"
          style={{ background: textColor }}
        />
        <h2
          className="text-xs font-bold uppercase tracking-[0.3em]"
          style={{ color: `${tc}aa` }}
        >
          Also Appears In
        </h2>
        <div className="flex-1 h-px" style={{ background: accentAlpha40 }} />
      </div>

      {mentions.length === 0 ? (
        <p
          data-ocid="profile.also_appears_in.empty_state"
          className="text-sm italic"
          style={{ color: `${tc}55` }}
        >
          No other characters mention {character.name} yet.
        </p>
      ) : (
        <div className="space-y-3">
          {mentions.map((char, i) => (
            <motion.button
              key={char.id}
              type="button"
              data-ocid={`profile.also_appears_in.item.${i + 1}`}
              onClick={() => onNavigate(char.id)}
              className="w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all hover:scale-[1.01]"
              style={{
                borderColor: `${tc}18`,
                background: `${tc}08`,
              }}
              whileHover={{ borderColor: `${tc}35` }}
            >
              {/* Portrait thumbnail */}
              <div
                className="w-10 h-10 rounded-full overflow-hidden border-2 shrink-0"
                style={{ borderColor: `${tc}30` }}
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
                    style={{ background: `${tc}15` }}
                  >
                    <User size={16} style={{ color: `${tc}60` }} />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="font-semibold text-sm truncate"
                  style={{ color: tc }}
                >
                  {char.name}
                </p>
                {char.faction && (
                  <p className="text-xs truncate" style={{ color: `${tc}60` }}>
                    {char.faction}
                  </p>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </motion.section>
  );
}

// ── Collapsible ProfileSection ──────────────────────────────────────────────

function ProfileSection({
  title,
  textColor,
  accentAlpha40,
  delay,
  children,
  defaultOpen = true,
}: {
  title: string;
  textColor: string;
  accentAlpha40: string;
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
      {/* Clickable header */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center gap-3 mb-4 group"
        style={{ cursor: "pointer" }}
        data-ocid={`profile.${title.toLowerCase().replace(/\s+/g, "_")}.toggle`}
      >
        <div
          className="w-1 h-6 rounded-full shrink-0"
          style={{ background: textColor }}
        />
        <h2
          className="text-xs font-bold uppercase tracking-[0.3em]"
          style={{ color: `${textColor}aa` }}
        >
          {title}
        </h2>
        <div className="flex-1 h-px" style={{ background: accentAlpha40 }} />
        <ChevronDown
          size={14}
          style={{
            color: `${textColor}66`,
            transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)",
            transition: "transform 0.25s ease",
            flexShrink: 0,
          }}
        />
      </button>

      {/* Collapsible content */}
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
