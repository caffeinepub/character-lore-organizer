import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Artifact, ArtifactRarity } from "@/store/artifacts";
import {
  createArtifact,
  deleteArtifact,
  getArtifacts,
  getRarityColor,
  updateArtifact,
} from "@/store/artifacts";
import { getCharacters } from "@/store/characters";
import type { Character } from "@/store/characters";
import {
  AlertTriangle,
  ArrowLeft,
  Loader2,
  Plus,
  Sword,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface ArtifactEditorViewProps {
  editingId?: string;
  onBack: () => void;
  onSaved: () => void;
  onDeleted: () => void;
}

type ArtifactFormData = Omit<Artifact, "id" | "createdAt" | "updatedAt">;

const DEFAULT_FORM: ArtifactFormData = {
  name: "",
  imageUrl: "",
  shortDescription: "",
  fullDescription: "",
  rarity: "Common",
  wieldedByCharacterId: "",
};

const RARITY_OPTIONS: ArtifactRarity[] = [
  "Common",
  "Rare",
  "Legendary",
  "Mythic",
];

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ArtifactEditorView({
  editingId,
  onBack,
  onSaved,
  onDeleted,
}: ArtifactEditorViewProps) {
  const [form, setForm] = useState<ArtifactFormData>(DEFAULT_FORM);
  const [allCharacters, setAllCharacters] = useState<Character[]>([]);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteNameInput, setDeleteNameInput] = useState("");

  const imageRef = useRef<HTMLInputElement>(null);
  const isEditing = !!editingId;

  useEffect(() => {
    setAllCharacters(getCharacters());
    if (editingId) {
      const found = getArtifacts().find((a) => a.id === editingId);
      if (found) {
        const { id: _id, createdAt: _ca, updatedAt: _ua, ...rest } = found;
        setForm({ ...DEFAULT_FORM, ...rest });
        setImagePreview(found.imageUrl);
      }
    }
  }, [editingId]);

  const set = <K extends keyof ArtifactFormData>(
    key: K,
    val: ArtifactFormData[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const b64 = await fileToBase64(file);
    set("imageUrl", b64);
    setImagePreview(b64);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Artifact name is required");
      return;
    }
    setSaving(true);
    try {
      if (isEditing && editingId) {
        const result = updateArtifact(editingId, form);
        if (!result) throw new Error("Artifact not found");
        toast.success(`${form.name} updated`);
      } else {
        createArtifact(form);
        toast.success(`${form.name} created`);
      }
      onSaved();
    } catch {
      toast.error("Failed to save artifact");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (editingId && deleteNameInput === form.name) {
      deleteArtifact(editingId);
      toast.success("Artifact deleted");
      setDeleteDialogOpen(false);
      onDeleted();
    }
  };

  const rarityColor = getRarityColor(form.rarity);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b border-border bg-background/90 backdrop-blur-sm">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          data-ocid="artifact_editor.cancel.button"
          className="gap-2 text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={14} />
          Cancel
        </Button>

        <div className="flex items-center gap-2">
          <Sword size={14} className="text-gold opacity-70" />
          <h1 className="text-sm font-bold uppercase tracking-widest">
            {isEditing ? "Edit Artifact" : "New Artifact"}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {isEditing && (
            <>
              <Button
                variant="ghost"
                size="sm"
                data-ocid="artifact_editor.delete.delete_button"
                onClick={() => {
                  setDeleteNameInput("");
                  setDeleteDialogOpen(true);
                }}
                className="gap-1.5 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 uppercase tracking-wider"
              >
                <Trash2 size={14} />
                Delete
              </Button>

              <Dialog
                open={deleteDialogOpen}
                onOpenChange={(v) => {
                  setDeleteDialogOpen(v);
                  if (!v) setDeleteNameInput("");
                }}
              >
                <DialogContent data-ocid="artifact_editor.delete.dialog">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <AlertTriangle size={18} className="text-destructive" />
                      Delete {form.name || "Artifact"}?
                    </DialogTitle>
                    <DialogDescription>
                      This cannot be undone. Type the artifact's exact name to
                      confirm deletion.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-2 py-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                      Type "{form.name}" to confirm
                    </Label>
                    <Input
                      data-ocid="artifact_editor.delete.confirm.input"
                      value={deleteNameInput}
                      onChange={(e) => setDeleteNameInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter" &&
                          deleteNameInput === form.name
                        ) {
                          handleDelete();
                        }
                      }}
                      placeholder={form.name}
                      className="border-destructive/30 focus-visible:ring-destructive/30"
                    />
                  </div>

                  <DialogFooter>
                    <Button
                      variant="ghost"
                      size="sm"
                      data-ocid="artifact_editor.delete.cancel_button"
                      onClick={() => {
                        setDeleteDialogOpen(false);
                        setDeleteNameInput("");
                      }}
                      className="text-xs uppercase tracking-wider"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      data-ocid="artifact_editor.delete.confirm_button"
                      onClick={handleDelete}
                      disabled={deleteNameInput !== form.name}
                      className="gap-1.5 text-xs bg-destructive text-destructive-foreground hover:bg-destructive/90 uppercase tracking-wider disabled:opacity-30"
                    >
                      <Trash2 size={13} />
                      Delete Forever
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}

          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving}
            data-ocid="artifact_editor.save.submit_button"
            className="gap-1.5 text-xs bg-gold/20 hover:bg-gold/30 border border-gold/50 text-gold uppercase tracking-wider"
            variant="outline"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : null}
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </header>

      {/* Form body */}
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-10">
        {/* Basic info */}
        <EditorSection title="Basic Information">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <EditorField label="Name *">
              <Input
                data-ocid="artifact_editor.name.input"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Artifact name"
              />
            </EditorField>

            <EditorField label="Rarity">
              <Select
                value={form.rarity}
                onValueChange={(v) => set("rarity", v as ArtifactRarity)}
              >
                <SelectTrigger data-ocid="artifact_editor.rarity.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RARITY_OPTIONS.map((r) => (
                    <SelectItem key={r} value={r}>
                      <span style={{ color: getRarityColor(r) }}>{r}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </EditorField>

            <EditorField label="Wielded By">
              <Select
                value={form.wieldedByCharacterId || "__none__"}
                onValueChange={(v) =>
                  set("wieldedByCharacterId", v === "__none__" ? "" : v)
                }
              >
                <SelectTrigger data-ocid="artifact_editor.wielded_by.select">
                  <SelectValue placeholder="Select character…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">— None —</SelectItem>
                  {allCharacters.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </EditorField>

            <EditorField label="Short Description">
              <Input
                data-ocid="artifact_editor.description.input"
                value={form.shortDescription}
                onChange={(e) => set("shortDescription", e.target.value)}
                placeholder="One sentence summary"
              />
            </EditorField>
          </div>

          {/* Rarity preview */}
          <div
            className="mt-3 h-1 rounded-full"
            style={{ background: `${rarityColor}50` }}
          />
        </EditorSection>

        {/* Image */}
        <EditorSection title="Artifact Image">
          <Button
            type="button"
            variant="outline"
            size="sm"
            data-ocid="artifact_editor.image.upload_button"
            onClick={() => imageRef.current?.click()}
            className="gap-1.5 text-xs uppercase tracking-wider border-dashed"
          >
            <Plus size={13} />
            {imagePreview ? "Replace Image" : "Upload Image"}
          </Button>
          <input
            ref={imageRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          {imagePreview && (
            <div className="relative mt-2 inline-block">
              <img
                src={imagePreview}
                alt="Artifact preview"
                className="h-40 w-auto object-contain rounded-md border border-border"
              />
              <button
                type="button"
                onClick={() => {
                  set("imageUrl", "");
                  setImagePreview("");
                }}
                className="absolute top-1 right-1 bg-background/80 rounded-full p-0.5"
              >
                <X size={12} />
              </button>
            </div>
          )}
          {!imagePreview && (
            <div
              className="mt-3 w-32 h-32 rounded-lg border-2 border-dashed flex items-center justify-center"
              style={{ borderColor: `${rarityColor}30` }}
            >
              <Sword size={40} style={{ color: `${rarityColor}30` }} />
            </div>
          )}
        </EditorSection>

        {/* Full Description */}
        <EditorSection title="Full Description">
          <Textarea
            data-ocid="artifact_editor.full_description.textarea"
            value={form.fullDescription}
            onChange={(e) => set("fullDescription", e.target.value)}
            placeholder="Detailed lore and description of this artifact..."
            rows={6}
            className="resize-y"
          />
        </EditorSection>

        {/* Bottom save/cancel */}
        <div className="flex justify-end gap-3 pt-4 pb-10 border-t border-border">
          <Button
            variant="ghost"
            onClick={onBack}
            data-ocid="artifact_editor.cancel.button"
            className="text-xs uppercase tracking-wider"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            data-ocid="artifact_editor.save.submit_button"
            className="gap-1.5 text-xs bg-gold/20 hover:bg-gold/30 border border-gold/50 text-gold uppercase tracking-wider"
            variant="outline"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : null}
            {saving
              ? "Saving..."
              : isEditing
                ? "Save Changes"
                : "Create Artifact"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function EditorSection({
  title,
  children,
}: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-1 h-4 bg-gold/60 rounded-full" />
        <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">
          {title}
        </h2>
        <div className="flex-1 h-px bg-border" />
      </div>
      {children}
    </div>
  );
}

function EditorField({
  label,
  children,
}: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground uppercase tracking-wider">
        {label}
      </Label>
      {children}
    </div>
  );
}
