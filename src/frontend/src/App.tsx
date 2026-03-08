import { Toaster } from "@/components/ui/sonner";
import AfterDarkGalleryView from "@/views/AfterDarkGalleryView";
import CharacterCompareView from "@/views/CharacterCompareView";
import CharacterEditorView from "@/views/CharacterEditorView";
import CharacterGalleryView from "@/views/CharacterGalleryView";
import CharacterProfileView from "@/views/CharacterProfileView";
import CharacterSelectView from "@/views/CharacterSelectView";
import FactionProfileView from "@/views/FactionProfileView";
import FactionSelectView from "@/views/FactionSelectView";
import LoreView from "@/views/LoreView";
import SearchView from "@/views/SearchView";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";

type View =
  | { name: "select" }
  | { name: "profile"; characterId: string }
  | { name: "editor"; editingId?: string }
  | { name: "search" }
  | { name: "gallery"; characterId: string }
  | { name: "compare" }
  | { name: "after-dark"; characterId: string }
  | { name: "lore" }
  | { name: "factions" }
  | { name: "faction-profile"; factionId: string };

export default function App() {
  const [view, setView] = useState<View>({ name: "select" });
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const goSelect = useCallback(() => {
    setView({ name: "select" });
    refresh();
  }, [refresh]);

  const goProfile = useCallback((id: string) => {
    setView({ name: "profile", characterId: id });
  }, []);

  const goEditor = useCallback((id?: string) => {
    setView({ name: "editor", editingId: id });
  }, []);

  const goSearch = useCallback(() => {
    setView({ name: "search" });
  }, []);

  const goGallery = useCallback((id: string) => {
    setView({ name: "gallery", characterId: id });
  }, []);

  const goCompare = useCallback(() => {
    setView({ name: "compare" });
  }, []);

  const goAfterDark = useCallback((id: string) => {
    setView({ name: "after-dark", characterId: id });
  }, []);

  const goLore = useCallback(() => {
    setView({ name: "lore" });
  }, []);

  const goFactions = useCallback(() => {
    setView({ name: "factions" });
  }, []);

  const goFactionProfile = useCallback((id: string) => {
    setView({ name: "faction-profile", factionId: id });
  }, []);

  const handleSaved = useCallback(() => {
    goSelect();
  }, [goSelect]);

  const handleDeleted = useCallback(() => {
    goSelect();
  }, [goSelect]);

  const handleSearchSelect = useCallback(
    (id: string) => {
      goProfile(id);
    },
    [goProfile],
  );

  return (
    <div className="w-full min-h-screen bg-background text-foreground overflow-hidden">
      <AnimatePresence mode="wait">
        {view.name === "select" && (
          <PageTransition key="select">
            <CharacterSelectView
              refreshKey={refreshKey}
              onViewProfile={goProfile}
              onAddCharacter={() => goEditor()}
              onSearch={goSearch}
              onCompare={goCompare}
              onViewGallery={goGallery}
              onLore={goLore}
              onFactions={goFactions}
            />
          </PageTransition>
        )}

        {view.name === "profile" && (
          <PageTransition key={`profile-${view.characterId}`}>
            <CharacterProfileView
              characterId={view.characterId}
              onBack={goSelect}
              onEdit={goEditor}
              onNavigate={goProfile}
            />
          </PageTransition>
        )}

        {view.name === "editor" && (
          <PageTransition key={`editor-${view.editingId ?? "new"}`}>
            <CharacterEditorView
              editingId={view.editingId}
              onBack={goSelect}
              onSaved={handleSaved}
              onDeleted={handleDeleted}
            />
          </PageTransition>
        )}

        {view.name === "search" && (
          <PageTransition key="search">
            <SearchView
              onBack={goSelect}
              onSelectCharacter={handleSearchSelect}
            />
          </PageTransition>
        )}

        {view.name === "gallery" && (
          <PageTransition key={`gallery-${view.characterId}`}>
            <CharacterGalleryView
              characterId={view.characterId}
              onBack={goSelect}
              onAfterDark={() => goAfterDark(view.characterId)}
            />
          </PageTransition>
        )}

        {view.name === "after-dark" && (
          <PageTransition key={`after-dark-${view.characterId}`}>
            <AfterDarkGalleryView
              characterId={view.characterId}
              onBack={() => {
                if (view.name === "after-dark") goGallery(view.characterId);
              }}
            />
          </PageTransition>
        )}

        {view.name === "compare" && (
          <PageTransition key="compare">
            <CharacterCompareView onBack={goSelect} onNavigate={goProfile} />
          </PageTransition>
        )}

        {view.name === "lore" && (
          <PageTransition key="lore">
            <LoreView onBack={goSelect} onNavigateToCharacter={goProfile} />
          </PageTransition>
        )}

        {view.name === "factions" && (
          <PageTransition key="factions">
            <FactionSelectView
              onBack={goSelect}
              onViewProfile={goFactionProfile}
            />
          </PageTransition>
        )}

        {view.name === "faction-profile" && (
          <PageTransition key={`faction-profile-${view.factionId}`}>
            <FactionProfileView
              factionId={view.factionId}
              onBack={goFactions}
              onNavigateToCharacter={goProfile}
              onEdit={goFactionProfile}
            />
          </PageTransition>
        )}
      </AnimatePresence>

      <Toaster richColors position="bottom-right" />
    </div>
  );
}

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      style={{ position: "absolute", inset: 0, overflow: "auto" }}
    >
      {children}
    </motion.div>
  );
}
