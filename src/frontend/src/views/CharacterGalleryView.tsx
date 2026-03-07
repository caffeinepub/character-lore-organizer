import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { getCharacters } from "@/store/characters";
import { ArrowLeft, Image as ImageIcon, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface CharacterGalleryViewProps {
  characterId: string;
  onBack: () => void;
}

export default function CharacterGalleryView({
  characterId,
  onBack,
}: CharacterGalleryViewProps) {
  const [character, setCharacter] = useState<{
    name: string;
    bgColor: string;
    textColor: string;
    galleryImages: string[];
    nameFont: string;
  } | null>(null);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  useEffect(() => {
    const chars = getCharacters();
    const found = chars.find((c) => c.id === characterId);
    if (found) {
      setCharacter({
        name: found.name,
        bgColor: found.bgColor,
        textColor: found.textColor,
        galleryImages: found.galleryImages ?? [],
        nameFont: found.nameFont,
      });
    }
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

  return (
    <div
      className="min-h-screen relative"
      style={{ backgroundColor: bg, color: tc }}
    >
      {/* Atmospheric gradient */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 60% 0%, ${tc}08 0%, transparent 55%)`,
        }}
      />

      {/* Header */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 backdrop-blur-md border-b"
        style={{ borderColor: `${tc}20`, background: `${bg}cc` }}
      >
        <Button
          data-ocid="gallery.back.button"
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="gap-2 text-sm uppercase tracking-wider hover:bg-white/10"
          style={{ color: `${tc}cc` }}
        >
          <ArrowLeft size={16} />
          Back
        </Button>

        <div className="flex items-center gap-2">
          <div className="w-1 h-4 rounded-full" style={{ background: tc }} />
          <span className="text-xs uppercase tracking-[0.25em] font-medium opacity-60">
            {character.name} — Gallery
          </span>
        </div>

        <div className="w-16" />
      </header>

      {/* Gallery grid */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        {character.galleryImages.length === 0 ? (
          <motion.div
            data-ocid="gallery.empty_state"
            className="flex flex-col items-center justify-center py-24 gap-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: `${tc}10` }}
            >
              <ImageIcon size={36} style={{ color: `${tc}40` }} />
            </div>
            <p
              className="text-sm uppercase tracking-widest font-medium"
              style={{ color: `${tc}60` }}
            >
              No gallery images yet
            </p>
            <p className="text-xs max-w-xs" style={{ color: `${tc}40` }}>
              Open the character editor and add images in the Gallery Images
              section.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {character.galleryImages.map((src, i) => (
              <motion.button
                // biome-ignore lint/suspicious/noArrayIndexKey: ordered gallery
                key={i}
                data-ocid={`gallery.image.item.${i + 1}`}
                type="button"
                onClick={() => setLightboxSrc(src)}
                className="relative aspect-square overflow-hidden rounded-lg border group"
                style={{ borderColor: `${tc}30` }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06, duration: 0.3 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <img
                  src={src}
                  alt={`${character.name} gallery ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  style={{ background: "rgba(0,0,0,0.4)" }}
                >
                  <ImageIcon size={24} style={{ color: "#fff" }} />
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </main>

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

      {/* Lightbox */}
      <Dialog
        open={!!lightboxSrc}
        onOpenChange={(open) => !open && setLightboxSrc(null)}
      >
        <DialogContent className="max-w-4xl p-2 bg-black/95 border-white/10">
          <div className="relative">
            {lightboxSrc && (
              <img
                src={lightboxSrc}
                alt="Gallery full size"
                className="w-full h-auto max-h-[80vh] object-contain rounded"
              />
            )}
            <button
              type="button"
              onClick={() => setLightboxSrc(null)}
              className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 hover:bg-black/80 transition-colors"
              aria-label="Close lightbox"
            >
              <X size={16} />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
