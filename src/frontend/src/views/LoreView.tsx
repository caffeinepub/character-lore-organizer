import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getCharacters } from "@/store/characters";
import type { Character } from "@/store/characters";
import type { LoreEntry } from "@/store/lore";
import {
  createLoreEntry,
  deleteLoreEntry,
  getLoreEntries,
  updateLoreEntry,
} from "@/store/lore";
import { linkifyText } from "@/utils/linkifyText";
import {
  ArrowLeft,
  BookOpen,
  ChevronDown,
  Edit,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

interface LoreViewProps {
  onBack: () => void;
  onNavigateToCharacter: (id: string) => void;
}

interface EditingState {
  id: string | null; // null = new entry
  title: string;
  body: string;
}

export default function LoreView({
  onBack,
  onNavigateToCharacter,
}: LoreViewProps) {
  const [entries, setEntries] = useState<LoreEntry[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [editing, setEditing] = useState<EditingState | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setEntries(getLoreEntries());
    setCharacters(getCharacters());
  }, []);

  const handleSave = () => {
    if (!editing) return;
    if (!editing.title.trim()) return;
    setSaving(true);
    try {
      if (editing.id) {
        updateLoreEntry(editing.id, {
          title: editing.title.trim(),
          body: editing.body.trim(),
        });
      } else {
        createLoreEntry({
          title: editing.title.trim(),
          body: editing.body.trim(),
        });
      }
      setEntries(getLoreEntries());
      setEditing(null);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    deleteLoreEntry(id);
    setEntries(getLoreEntries());
    setDeleteConfirmId(null);
    if (expandedId === id) setExpandedId(null);
  };

  const startNew = () => {
    setEditing({ id: null, title: "", body: "" });
  };

  const startEdit = (entry: LoreEntry) => {
    setEditing({ id: entry.id, title: entry.title, body: entry.body });
  };

  const cancelEdit = () => {
    setEditing(null);
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(ellipse at 60% 10%, oklch(0.18 0.04 260 / 0.8) 0%, oklch(0.08 0.02 240) 60%)",
        color: "oklch(0.92 0.04 80)",
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
          data-ocid="lore.back.button"
          className="gap-2 text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={14} />
          Roster
        </Button>

        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-gold opacity-70" />
          <h1 className="text-sm font-bold uppercase tracking-[0.25em]">
            World Lore
          </h1>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={startNew}
          data-ocid="lore.add.button"
          className="gap-1.5 text-xs bg-gold/10 hover:bg-gold/20 border border-gold/40 text-gold uppercase tracking-wider"
        >
          <Plus size={13} />
          New Entry
        </Button>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Intro text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center pb-4"
        >
          <p
            className="text-sm leading-relaxed"
            style={{ color: "oklch(0.75 0.06 80 / 0.8)" }}
          >
            The collected histories, legends, and lore of Aneirin, the Nation of
            Gold. Character names are automatically linked to their profiles.
          </p>
        </motion.div>

        {/* Editor */}
        <AnimatePresence>
          {editing !== null && (
            <motion.div
              key="editor"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="rounded-lg border p-5 space-y-4"
              style={{
                borderColor: "oklch(0.75 0.12 75 / 0.35)",
                background: "oklch(0.12 0.03 260 / 0.8)",
              }}
              data-ocid="lore.editor.panel"
            >
              <div className="flex items-center justify-between">
                <h2
                  className="text-xs font-bold uppercase tracking-[0.25em]"
                  style={{ color: "oklch(0.75 0.12 75 / 0.8)" }}
                >
                  {editing.id ? "Edit Entry" : "New Entry"}
                </h2>
                <button
                  type="button"
                  onClick={cancelEdit}
                  data-ocid="lore.editor.close_button"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                  Title *
                </Label>
                <Input
                  data-ocid="lore.editor.title.input"
                  value={editing.title}
                  onChange={(e) =>
                    setEditing((prev) =>
                      prev ? { ...prev, title: e.target.value } : prev,
                    )
                  }
                  placeholder="Entry title..."
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                  Body
                </Label>
                <Textarea
                  data-ocid="lore.editor.body.textarea"
                  value={editing.body}
                  onChange={(e) =>
                    setEditing((prev) =>
                      prev ? { ...prev, body: e.target.value } : prev,
                    )
                  }
                  placeholder="Write your lore here. Character names will auto-link to their profiles..."
                  rows={8}
                  className="resize-y bg-background/50"
                />
              </div>

              <div className="flex gap-3 justify-end pt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={cancelEdit}
                  data-ocid="lore.editor.cancel_button"
                  className="text-xs uppercase tracking-wider"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={saving || !editing.title.trim()}
                  data-ocid="lore.editor.save.submit_button"
                  className="gap-1.5 text-xs bg-gold/20 hover:bg-gold/30 border border-gold/50 text-gold uppercase tracking-wider"
                  variant="outline"
                >
                  {saving
                    ? "Saving..."
                    : editing.id
                      ? "Save Changes"
                      : "Create Entry"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Entries list */}
        {entries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            data-ocid="lore.empty_state"
            className="flex flex-col items-center justify-center py-20 gap-4 text-center"
          >
            <BookOpen
              size={40}
              style={{ color: "oklch(0.75 0.12 75 / 0.3)" }}
            />
            <p
              className="text-sm uppercase tracking-wider"
              style={{ color: "oklch(0.6 0.04 80 / 0.7)" }}
            >
              No lore entries yet
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={startNew}
              className="text-xs border-gold/30 text-gold/70 hover:text-gold hover:border-gold/50 gap-1.5"
            >
              <Plus size={12} />
              Add First Entry
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry, idx) => {
              const isExpanded = expandedId === entry.id;
              const isDeleting = deleteConfirmId === entry.id;

              return (
                <motion.div
                  key={entry.id}
                  data-ocid={`lore.item.${idx + 1}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04, duration: 0.3 }}
                  className="rounded-lg border overflow-hidden"
                  style={{
                    borderColor: isExpanded
                      ? "oklch(0.75 0.12 75 / 0.35)"
                      : "oklch(0.75 0.12 75 / 0.12)",
                    background: "oklch(0.1 0.02 250 / 0.7)",
                  }}
                >
                  {/* Entry header */}
                  <div className="flex items-center gap-3 px-4 py-3">
                    <button
                      type="button"
                      onClick={() => toggleExpand(entry.id)}
                      data-ocid={`lore.item.toggle.${idx + 1}`}
                      className="flex-1 flex items-center gap-3 text-left hover:opacity-80 transition-opacity"
                    >
                      <ChevronDown
                        size={14}
                        style={{
                          color: "oklch(0.75 0.12 75 / 0.6)",
                          transform: isExpanded
                            ? "rotate(0deg)"
                            : "rotate(-90deg)",
                          transition: "transform 0.2s ease",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        className="font-semibold text-sm leading-snug"
                        style={{ color: "oklch(0.88 0.08 78)" }}
                      >
                        {entry.title}
                      </span>
                    </button>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => startEdit(entry)}
                        data-ocid={`lore.item.edit_button.${idx + 1}`}
                        className="p-1.5 rounded hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                        title="Edit"
                      >
                        <Edit size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(entry.id)}
                        data-ocid={`lore.item.delete_button.${idx + 1}`}
                        className="p-1.5 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Delete confirmation */}
                  <AnimatePresence>
                    {isDeleting && (
                      <motion.div
                        key="delete-confirm"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div
                          className="px-4 py-3 flex items-center justify-between border-t"
                          style={{
                            borderColor: "oklch(0.6 0.2 25 / 0.3)",
                            background: "oklch(0.1 0.05 25 / 0.5)",
                          }}
                          data-ocid={`lore.item.delete.dialog.${idx + 1}`}
                        >
                          <p className="text-xs text-destructive">
                            Delete this entry? This cannot be undone.
                          </p>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteConfirmId(null)}
                              data-ocid={`lore.item.delete.cancel_button.${idx + 1}`}
                              className="text-xs"
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleDelete(entry.id)}
                              data-ocid={`lore.item.delete.confirm_button.${idx + 1}`}
                              className="text-xs bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Expandable body */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        key="body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        style={{ overflow: "hidden" }}
                      >
                        <div
                          className="px-6 pb-6 pt-2 border-t"
                          style={{
                            borderColor: "oklch(0.75 0.12 75 / 0.12)",
                          }}
                        >
                          <p
                            className="text-sm leading-loose whitespace-pre-wrap"
                            style={{ color: "oklch(0.82 0.04 80 / 0.85)" }}
                          >
                            {linkifyText(
                              entry.body,
                              characters,
                              "oklch(0.82 0.15 75)",
                              onNavigateToCharacter,
                            )}
                          </p>
                          <p
                            className="text-xs mt-4 opacity-40"
                            style={{ color: "oklch(0.6 0.03 80)" }}
                          >
                            Last updated:{" "}
                            {new Date(entry.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
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
    </div>
  );
}
