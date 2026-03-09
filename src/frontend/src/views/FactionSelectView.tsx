import FactionEditorModal from "@/components/FactionEditorModal";
import { Button } from "@/components/ui/button";
import type { Faction } from "@/store/factions";
import { getFactions } from "@/store/factions";
import { ArrowLeft, Plus, Shield, Users } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface FactionSelectViewProps {
  onBack: () => void;
  onViewProfile: (id: string) => void;
}

export default function FactionSelectView({
  onBack,
  onViewProfile,
}: FactionSelectViewProps) {
  const [factions, setFactions] = useState<Faction[]>([]);
  const [selected, setSelected] = useState<Faction | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);

  const refreshFactions = () => {
    setFactions(getFactions());
  };

  useEffect(() => {
    setFactions(getFactions());
  }, []);

  const handleEditorSaved = () => {
    setEditorOpen(false);
    const currentEditId = editingId;
    setEditingId(undefined);
    const latest = getFactions();
    setFactions(latest);
    if (currentEditId) {
      const updated = latest.find((f) => f.id === currentEditId);
      if (updated) setSelected(updated);
    }
  };

  const handleEditorDeleted = () => {
    setEditorOpen(false);
    setEditingId(undefined);
    setSelected(null);
    refreshFactions();
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/50 backdrop-blur-sm shrink-0 z-20">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            data-ocid="factions.back.button"
            className="gap-1.5 text-xs text-muted-foreground hover:text-foreground uppercase tracking-wider"
          >
            <ArrowLeft size={14} />
            Roster
          </Button>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-gold opacity-70" />
            <h1 className="text-sm font-bold uppercase tracking-[0.25em]">
              Factions
            </h1>
          </div>
          <span className="text-xs text-muted-foreground">
            {factions.length} {factions.length === 1 ? "faction" : "factions"}
          </span>
        </div>
        <Button
          size="sm"
          variant="outline"
          data-ocid="factions.add.button"
          onClick={() => {
            setEditingId(undefined);
            setEditorOpen(true);
          }}
          className="gap-1.5 text-xs bg-gold/10 hover:bg-gold/20 border border-gold/40 text-gold uppercase tracking-wider"
        >
          <Plus size={13} />
          Add
        </Button>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar — faction list */}
        <div className="w-[130px] sm:w-[160px] shrink-0 flex flex-col border-r border-border bg-card/30">
          <div className="flex-1 overflow-y-auto p-2">
            {factions.length === 0 ? (
              <div
                data-ocid="factions.empty_state"
                className="flex flex-col items-center justify-center h-full gap-3 p-4 text-center"
              >
                <Shield
                  size={28}
                  className="text-muted-foreground opacity-40"
                />
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  No factions
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {factions.map((faction, idx) => {
                  const isSelected = selected?.id === faction.id;
                  return (
                    <motion.button
                      key={faction.id}
                      data-ocid={`factions.item.${idx + 1}`}
                      onClick={() => setSelected(isSelected ? null : faction)}
                      className={[
                        "relative flex flex-col rounded-sm overflow-hidden cursor-pointer",
                        "border transition-all duration-200",
                        isSelected ? "ring-1" : "",
                      ].join(" ")}
                      style={{
                        borderColor: isSelected
                          ? (faction.accentColor ?? "#c9a84c")
                          : `${faction.accentColor ?? "#c9a84c"}40`,
                        boxShadow: isSelected
                          ? `0 0 12px ${faction.accentColor ?? "#c9a84c"}30`
                          : undefined,
                      }}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05, duration: 0.3 }}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {/* Symbol image or placeholder */}
                      <div
                        className="w-full aspect-square relative overflow-hidden flex items-center justify-center"
                        style={{
                          background: `${faction.accentColor ?? "#c9a84c"}10`,
                        }}
                      >
                        {faction.symbolImageUrl ? (
                          <img
                            src={faction.symbolImageUrl}
                            alt={faction.name}
                            className="w-full h-full object-contain p-2"
                          />
                        ) : (
                          <Shield size={32} className="text-gold/30" />
                        )}
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              className="absolute inset-0 border-2 border-gold/60"
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
                        style={{
                          background: `${faction.accentColor ?? "#c9a84c"}12`,
                        }}
                      >
                        <p
                          className="text-xs font-semibold truncate leading-tight"
                          style={{ color: faction.accentColor ?? "#c9a84c" }}
                        >
                          {faction.name}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right panel — faction preview */}
        <div
          className="relative flex-1 overflow-hidden transition-colors duration-700"
          style={{
            background:
              "radial-gradient(ellipse at 70% 30%, oklch(0.2 0.06 50 / 0.2) 0%, oklch(0.1 0.01 280) 60%)",
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
                <Shield size={48} className="text-gold/20" />
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium">
                  Select a Faction
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full flex flex-col"
              >
                {/* Symbol fills middle */}
                <div className="flex-1 relative overflow-hidden">
                  {selected.symbolImageUrl ? (
                    <>
                      {/* Blurred ambient background */}
                      <img
                        src={selected.symbolImageUrl}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{
                          filter: "blur(50px)",
                          transform: "scale(1.15)",
                          opacity: 0.3,
                        }}
                      />
                      {/* Foreground symbol */}
                      <motion.img
                        src={selected.symbolImageUrl}
                        alt={selected.name}
                        className="absolute inset-0 w-full h-full object-contain p-8"
                        initial={{ scale: 1.05, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Shield size={120} className="text-gold/10" />
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
                  {/* Faction name */}
                  <h2
                    className="text-2xl font-bold mb-1 leading-tight"
                    style={{
                      color: selected.accentColor ?? "#c9a84c",
                      textShadow: `0 0 20px ${selected.accentColor ?? "#c9a84c"}50`,
                    }}
                  >
                    {selected.name}
                  </h2>

                  {/* Short description */}
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                    {selected.shortDescription || "No description."}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      data-ocid="factions.view_profile.button"
                      onClick={() => onViewProfile(selected.id)}
                      className="flex-1 gap-2 uppercase tracking-widest text-xs font-bold bg-gold/20 hover:bg-gold/30 border border-gold/50 text-gold"
                      variant="outline"
                    >
                      <Users size={13} />
                      View Full Profile
                    </Button>
                    <Button
                      data-ocid="factions.edit.button"
                      onClick={() => {
                        setEditingId(selected.id);
                        setEditorOpen(true);
                      }}
                      variant="ghost"
                      className="text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Faction Editor Modal */}
      <FactionEditorModal
        factionId={editingId}
        open={editorOpen}
        onClose={() => {
          setEditorOpen(false);
          setEditingId(undefined);
        }}
        onSaved={handleEditorSaved}
        onDeleted={handleEditorDeleted}
      />
    </div>
  );
}
