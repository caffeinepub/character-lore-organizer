import { Button } from "@/components/ui/button";
import type { Artifact } from "@/store/artifacts";
import { getArtifacts, getRarityColor } from "@/store/artifacts";
import { getCharacters } from "@/store/characters";
import type { Character } from "@/store/characters";
import { ArrowLeft, Edit, Package, Sword, User } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface ArtifactProfileViewProps {
  artifactId: string;
  onBack: () => void;
  onEdit: (id: string) => void;
  onNavigateToCharacter: (id: string) => void;
}

export default function ArtifactProfileView({
  artifactId,
  onBack,
  onEdit,
  onNavigateToCharacter,
}: ArtifactProfileViewProps) {
  const [artifact, setArtifact] = useState<Artifact | null>(null);
  const [wielder, setWielder] = useState<Character | null>(null);

  useEffect(() => {
    const artifacts = getArtifacts();
    const found = artifacts.find((a) => a.id === artifactId);
    setArtifact(found ?? null);

    if (found?.wieldedByCharacterId) {
      const chars = getCharacters();
      const char = chars.find((c) => c.id === found.wieldedByCharacterId);
      setWielder(char ?? null);
    } else {
      setWielder(null);
    }
  }, [artifactId]);

  if (!artifact) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <p className="text-muted-foreground">Artifact not found.</p>
      </div>
    );
  }

  const rarityColor = getRarityColor(artifact.rarity);

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(ellipse at 80% 10%, oklch(0.22 0.06 45 / 0.2) 0%, oklch(0.08 0.02 240) 60%)",
        color: "oklch(0.9 0.04 80)",
      }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b backdrop-blur-md"
        style={{
          borderColor: `${rarityColor}25`,
          background: "oklch(0.08 0.02 240 / 0.85)",
        }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          data-ocid="artifact_profile.back.button"
          className="gap-2 text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={14} />
          Artifacts
        </Button>

        <div className="flex items-center gap-2">
          <Sword size={14} className="text-gold opacity-70" />
          <span className="text-xs uppercase tracking-[0.25em] font-medium opacity-60">
            Artifact Profile
          </span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(artifact.id)}
          data-ocid="artifact_profile.edit.button"
          className="gap-2 text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
        >
          <Edit size={14} />
          Edit
        </Button>
      </header>

      {/* Hero section */}
      <div className="max-w-5xl mx-auto px-6 pt-10 pb-8">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* Artifact image */}
          <motion.div
            className="shrink-0"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {artifact.imageUrl ? (
              <div
                className="w-48 h-48 rounded-lg border overflow-hidden"
                style={{
                  borderColor: `${rarityColor}40`,
                  boxShadow: `0 0 40px ${rarityColor}20`,
                }}
              >
                <img
                  src={artifact.imageUrl}
                  alt={artifact.name}
                  className="w-full h-full object-contain p-4"
                />
              </div>
            ) : (
              <div
                className="w-48 h-48 rounded-lg border flex items-center justify-center"
                style={{
                  borderColor: `${rarityColor}30`,
                  background: `${rarityColor}08`,
                  boxShadow: `0 0 40px ${rarityColor}15`,
                }}
              >
                <Sword size={72} style={{ color: `${rarityColor}40` }} />
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
            {/* Rarity badge */}
            <div className="mb-3">
              <span
                className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                style={{
                  background: `${rarityColor}20`,
                  color: rarityColor,
                  border: `1px solid ${rarityColor}40`,
                }}
              >
                {artifact.rarity}
              </span>
            </div>

            <h1
              className="text-4xl font-black mb-3 leading-tight"
              style={{
                color: rarityColor,
                textShadow: `0 0 30px ${rarityColor}30`,
              }}
            >
              {artifact.name}
            </h1>
            <p
              className="text-lg leading-relaxed"
              style={{ color: "oklch(0.78 0.04 80 / 0.85)" }}
            >
              {artifact.shortDescription}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Divider */}
      <div
        className="h-px w-full"
        style={{
          background: `linear-gradient(to right, transparent, ${rarityColor}30, transparent)`,
        }}
      />

      {/* Content sections */}
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        {/* Full description */}
        {artifact.fullDescription && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-1 h-6 rounded-full shrink-0"
                style={{ background: rarityColor }}
              />
              <h2
                className="text-xs font-bold uppercase tracking-[0.3em]"
                style={{ color: `${rarityColor}aa` }}
              >
                Description
              </h2>
              <div
                className="flex-1 h-px"
                style={{ background: `${rarityColor}30` }}
              />
            </div>
            <p
              className="leading-loose text-base whitespace-pre-wrap"
              style={{ color: "oklch(0.82 0.04 80 / 0.85)" }}
            >
              {artifact.fullDescription}
            </p>
          </motion.section>
        )}

        {/* Wielded by */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-1 h-6 rounded-full shrink-0"
              style={{ background: rarityColor }}
            />
            <h2
              className="text-xs font-bold uppercase tracking-[0.3em]"
              style={{ color: `${rarityColor}aa` }}
            >
              Wielded By
            </h2>
            <div
              className="flex-1 h-px"
              style={{ background: `${rarityColor}30` }}
            />
          </div>

          {wielder ? (
            <button
              type="button"
              data-ocid="artifact_profile.wielded_by.link"
              onClick={() => onNavigateToCharacter(wielder.id)}
              className="flex items-center gap-4 p-4 rounded-lg border w-full text-left transition-all hover:scale-[1.01]"
              style={{
                borderColor: `${rarityColor}20`,
                background: `${rarityColor}08`,
              }}
            >
              <div
                className="w-14 h-14 rounded-full overflow-hidden border-2 shrink-0"
                style={{ borderColor: `${rarityColor}30` }}
              >
                {wielder.portraitImageUrl ? (
                  <img
                    src={wielder.portraitImageUrl}
                    alt={wielder.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ background: `${wielder.bgColor}60` }}
                  >
                    <User size={24} className="text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="font-bold text-lg truncate"
                  style={{ color: "oklch(0.9 0.06 78)" }}
                >
                  {wielder.name}
                </p>
                {wielder.title && (
                  <p className="text-sm text-muted-foreground truncate">
                    {wielder.title}
                  </p>
                )}
                {wielder.faction && (
                  <p
                    className="text-xs mt-1"
                    style={{ color: `${rarityColor}80` }}
                  >
                    {wielder.faction}
                  </p>
                )}
              </div>
              <Package
                size={16}
                className="shrink-0"
                style={{ color: `${rarityColor}60` }}
              />
            </button>
          ) : (
            <p
              className="text-sm italic"
              style={{ color: "oklch(0.6 0.03 80 / 0.7)" }}
            >
              No known wielder at this time.
            </p>
          )}
        </motion.section>
      </div>

      {/* Footer */}
      <footer
        className="mt-10 py-6 border-t text-center text-xs"
        style={{
          borderColor: `${rarityColor}15`,
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
    </div>
  );
}
