import { Button } from "@/components/ui/button";
import type { Artifact } from "@/store/artifacts";
import { getArtifacts, getRarityColor } from "@/store/artifacts";
import { ArrowLeft, Package, Plus, Sword } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface ArtifactSelectViewProps {
  onBack: () => void;
  onViewProfile: (id: string) => void;
  onEdit: (id?: string) => void;
}

export default function ArtifactSelectView({
  onBack,
  onViewProfile,
  onEdit,
}: ArtifactSelectViewProps) {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [selected, setSelected] = useState<Artifact | null>(null);

  const refreshArtifacts = () => {
    setArtifacts(getArtifacts());
  };

  useEffect(() => {
    setArtifacts(getArtifacts());
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/50 backdrop-blur-sm shrink-0 z-20">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            data-ocid="artifacts.back.button"
            className="gap-1.5 text-xs text-muted-foreground hover:text-foreground uppercase tracking-wider"
          >
            <ArrowLeft size={14} />
            Roster
          </Button>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <Sword size={14} className="text-gold opacity-70" />
            <h1 className="text-sm font-bold uppercase tracking-[0.25em]">
              Artifacts
            </h1>
          </div>
          <span className="text-xs text-muted-foreground">
            {artifacts.length}{" "}
            {artifacts.length === 1 ? "artifact" : "artifacts"}
          </span>
        </div>
        <Button
          size="sm"
          variant="outline"
          data-ocid="artifacts.add.button"
          onClick={() => onEdit(undefined)}
          className="gap-1.5 text-xs bg-gold/10 hover:bg-gold/20 border border-gold/40 text-gold uppercase tracking-wider"
        >
          <Plus size={13} />
          Add
        </Button>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar — artifact list */}
        <div className="w-[130px] sm:w-[160px] shrink-0 flex flex-col border-r border-border bg-card/30">
          <div className="flex-1 overflow-y-auto p-2">
            {artifacts.length === 0 ? (
              <div
                data-ocid="artifacts.empty_state"
                className="flex flex-col items-center justify-center h-full gap-3 p-4 text-center"
              >
                <Package
                  size={28}
                  className="text-muted-foreground opacity-40"
                />
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  No artifacts
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {artifacts.map((artifact, idx) => {
                  const isSelected = selected?.id === artifact.id;
                  const rarityColor = getRarityColor(artifact.rarity);
                  return (
                    <motion.button
                      key={artifact.id}
                      data-ocid={`artifacts.item.${idx + 1}`}
                      onClick={() => setSelected(isSelected ? null : artifact)}
                      className={[
                        "relative flex flex-col rounded-sm overflow-hidden cursor-pointer",
                        "border transition-all duration-200",
                        isSelected ? "ring-1" : "",
                      ].join(" ")}
                      style={{
                        borderColor: isSelected
                          ? rarityColor
                          : `${rarityColor}40`,
                        boxShadow: isSelected
                          ? `0 0 12px ${rarityColor}30`
                          : undefined,
                      }}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05, duration: 0.3 }}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {/* Image or placeholder */}
                      <div
                        className="w-full aspect-square relative overflow-hidden flex items-center justify-center"
                        style={{ background: `${rarityColor}10` }}
                      >
                        {artifact.imageUrl ? (
                          <img
                            src={artifact.imageUrl}
                            alt={artifact.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Sword
                            size={28}
                            style={{ color: `${rarityColor}50` }}
                          />
                        )}
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              className="absolute inset-0 border-2"
                              style={{ borderColor: rarityColor }}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            />
                          )}
                        </AnimatePresence>
                      </div>
                      {/* Name */}
                      <div
                        className="px-1.5 py-1.5 text-center"
                        style={{ background: `${rarityColor}12` }}
                      >
                        <p
                          className="text-xs font-semibold truncate leading-tight"
                          style={{ color: rarityColor }}
                        >
                          {artifact.name}
                        </p>
                        <p
                          className="text-xs truncate opacity-60 mt-0.5"
                          style={{ color: rarityColor, fontSize: "9px" }}
                        >
                          {artifact.rarity}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right panel — artifact preview */}
        <div
          className="relative flex-1 overflow-hidden transition-colors duration-700"
          style={{
            background:
              "radial-gradient(ellipse at 70% 30%, oklch(0.2 0.05 45 / 0.2) 0%, oklch(0.1 0.01 280) 60%)",
          }}
        >
          {/* Atmospheric lines */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 40px, oklch(1 0 0 / 0.01) 40px, oklch(1 0 0 / 0.01) 41px)",
            }}
          />

          <AnimatePresence mode="wait">
            {!selected ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full gap-4 text-center select-none"
              >
                <Sword size={48} className="text-gold/20" />
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium">
                  Select an Artifact
                </p>
              </motion.div>
            ) : (
              <ArtifactPreviewPanel
                artifact={selected}
                onViewProfile={() => onViewProfile(selected.id)}
                onEdit={() => {
                  onEdit(selected.id);
                  refreshArtifacts();
                }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ArtifactPreviewPanel({
  artifact,
  onViewProfile,
  onEdit,
}: {
  artifact: Artifact;
  onViewProfile: () => void;
  onEdit: () => void;
}) {
  const rarityColor = getRarityColor(artifact.rarity);

  return (
    <motion.div
      key={artifact.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full h-full flex flex-col"
    >
      {/* Image fills middle */}
      <div className="flex-1 relative overflow-hidden">
        {artifact.imageUrl ? (
          <>
            {/* Blurred ambient background */}
            <img
              src={artifact.imageUrl}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                filter: "blur(50px)",
                transform: "scale(1.15)",
                opacity: 0.3,
              }}
            />
            {/* Foreground image */}
            <motion.img
              src={artifact.imageUrl}
              alt={artifact.name}
              className="absolute inset-0 w-full h-full object-contain p-8"
              initial={{ scale: 1.05, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="rounded-full p-12"
              style={{
                background: `${rarityColor}10`,
                border: `2px solid ${rarityColor}20`,
              }}
            >
              <Sword size={80} style={{ color: `${rarityColor}50` }} />
            </div>
          </div>
        )}
      </div>

      {/* Bottom info zone */}
      <div
        className="shrink-0 px-6 pb-6 pt-4 z-10 relative"
        style={{
          background:
            "linear-gradient(to top, oklch(0.1 0.02 280 / 0.95) 0%, transparent 100%)",
        }}
      >
        {/* Rarity badge */}
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{
              background: `${rarityColor}20`,
              color: rarityColor,
              border: `1px solid ${rarityColor}40`,
            }}
          >
            {artifact.rarity}
          </span>
        </div>

        {/* Artifact name */}
        <h2
          className="text-2xl font-bold mb-2 leading-tight"
          style={{
            color: rarityColor,
            textShadow: `0 0 20px ${rarityColor}50`,
          }}
        >
          {artifact.name}
        </h2>

        {/* Short description */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
          {artifact.shortDescription || "No description."}
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            data-ocid="artifacts.view_profile.button"
            onClick={onViewProfile}
            className="flex-1 gap-2 uppercase tracking-widest text-xs font-bold bg-gold/20 hover:bg-gold/30 border border-gold/50 text-gold"
            variant="outline"
          >
            <Package size={13} />
            View Full Profile
          </Button>
          <Button
            data-ocid="artifacts.edit.button"
            onClick={onEdit}
            variant="ghost"
            className="text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
          >
            Edit
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
