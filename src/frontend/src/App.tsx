import { Toaster } from "@/components/ui/sonner";
import CharacterCompareView from "@/views/CharacterCompareView";
import CharacterEditorView from "@/views/CharacterEditorView";
import CharacterGalleryView from "@/views/CharacterGalleryView";
import CharacterProfileView from "@/views/CharacterProfileView";
import CharacterSelectView from "@/views/CharacterSelectView";
import SearchView from "@/views/SearchView";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";

type View =
  | { name: "select" }
  | { name: "profile"; characterId: string }
  | { name: "editor"; editingId?: string }
  | { name: "search" }
  | { name: "gallery"; characterId: string }
  | { name: "compare" };

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
            />
          </PageTransition>
        )}

        {view.name === "compare" && (
          <PageTransition key="compare">
            <CharacterCompareView onBack={goSelect} onNavigate={goProfile} />
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
