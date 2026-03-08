import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Faction } from "@/store/factions";
import {
  createFaction,
  deleteFaction,
  getFactions,
  updateFaction,
} from "@/store/factions";
import { AlertTriangle, Loader2, Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface FactionEditorModalProps {
  factionId?: string;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  onDeleted: () => void;
}

type FormData = Omit<Faction, "id" | "createdAt" | "updatedAt">;

const DEFAULT_FORM: FormData = {
  name: "",
  symbolImageUrl: "",
  shortDescription: "",
  lore: "",
  exMembers: [],
  accentColor: "#c9a84c",
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function FactionEditorModal({
  factionId,
  open,
  onClose,
  onSaved,
  onDeleted,
}: FactionEditorModalProps) {
  const [form, setForm] = useState<FormData>(DEFAULT_FORM);
  const [symbolPreview, setSymbolPreview] = useState("");
  const [exMembersInput, setExMembersInput] = useState("");
  const [saving, setSaving] = useState(false);
  const symbolRef = useRef<HTMLInputElement>(null);
  const isEditing = !!factionId;

  useEffect(() => {
    if (!open) return;
    if (factionId) {
      const factions = getFactions();
      const found = factions.find((f) => f.id === factionId);
      if (found) {
        const { id: _id, createdAt: _ca, updatedAt: _ua, ...rest } = found;
        setForm(rest);
        setSymbolPreview(found.symbolImageUrl);
        setExMembersInput(found.exMembers.join(", "));
      }
    } else {
      setForm(DEFAULT_FORM);
      setSymbolPreview("");
      setExMembersInput("");
    }
  }, [factionId, open]);

  const set = <K extends keyof FormData>(key: K, val: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  const handleSymbolUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const b64 = await fileToBase64(file);
    set("symbolImageUrl", b64);
    setSymbolPreview(b64);
  };

  const parseExMembers = () => {
    return exMembersInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Faction name is required");
      return;
    }
    setSaving(true);
    try {
      const data = { ...form, exMembers: parseExMembers() };
      if (isEditing && factionId) {
        const result = updateFaction(factionId, data);
        if (!result) throw new Error("Faction not found");
        toast.success(`${form.name} updated`);
      } else {
        createFaction(data);
        toast.success(`${form.name} created`);
      }
      onSaved();
    } catch (_err) {
      toast.error("Failed to save faction");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (factionId) {
      deleteFaction(factionId);
      toast.success("Faction deleted");
      onDeleted();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-lg max-h-[90vh] overflow-y-auto"
        data-ocid="faction.editor.dialog"
      >
        <DialogHeader>
          <DialogTitle className="text-sm uppercase tracking-widest flex items-center gap-2">
            <div className="w-1 h-4 bg-gold/60 rounded-full" />
            {isEditing ? "Edit Faction" : "New Faction"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Name */}
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              Faction Name *
            </Label>
            <Input
              data-ocid="faction.editor.name.input"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Iron Order"
            />
          </div>

          {/* Short description */}
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              Short Description
            </Label>
            <Input
              data-ocid="faction.editor.description.input"
              value={form.shortDescription}
              onChange={(e) => set("shortDescription", e.target.value)}
              placeholder="One sentence summary..."
            />
          </div>

          {/* Symbol image */}
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              Symbol / Crest Image
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              data-ocid="faction.editor.symbol.upload_button"
              onClick={() => symbolRef.current?.click()}
              className="gap-1.5 text-xs border-dashed w-full"
            >
              <Plus size={13} />
              {symbolPreview ? "Replace Symbol" : "Upload Symbol"}
            </Button>
            <input
              ref={symbolRef}
              type="file"
              accept="image/*"
              onChange={handleSymbolUpload}
              className="hidden"
            />
            {symbolPreview && (
              <div className="relative w-24 h-24">
                <img
                  src={symbolPreview}
                  alt="Symbol preview"
                  className="w-full h-full object-contain rounded border border-border"
                />
                <button
                  type="button"
                  onClick={() => {
                    set("symbolImageUrl", "");
                    setSymbolPreview("");
                  }}
                  className="absolute top-0.5 right-0.5 bg-background/80 rounded-full p-0.5"
                >
                  <X size={11} />
                </button>
              </div>
            )}
          </div>

          {/* Accent Color */}
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              Accent Color
            </Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={form.accentColor ?? "#c9a84c"}
                onChange={(e) => set("accentColor", e.target.value)}
                className="w-10 h-9 rounded cursor-pointer bg-transparent border border-border"
              />
              <Input
                data-ocid="faction.accentcolor.input"
                value={form.accentColor ?? "#c9a84c"}
                onChange={(e) => set("accentColor", e.target.value)}
                placeholder="#c9a84c"
                className="font-mono text-sm"
              />
            </div>
          </div>

          {/* Full lore */}
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              Full Lore
            </Label>
            <Textarea
              data-ocid="faction.editor.lore.textarea"
              value={form.lore}
              onChange={(e) => set("lore", e.target.value)}
              placeholder="The history and mythology of this faction..."
              rows={5}
              className="resize-y"
            />
          </div>

          {/* Ex-members */}
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              Former Members (comma-separated)
            </Label>
            <Input
              data-ocid="faction.editor.exmembers.input"
              value={exMembersInput}
              onChange={(e) => setExMembersInput(e.target.value)}
              placeholder="Name One, Name Two, Name Three"
            />
            <p className="text-xs text-muted-foreground">
              Current members are auto-detected from character faction fields.
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border mt-2">
          {isEditing ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  data-ocid="faction.editor.delete_button"
                  className="gap-1.5 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <AlertTriangle size={13} />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent data-ocid="faction.editor.delete.dialog">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Faction?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete <strong>{form.name}</strong>
                    ? This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel data-ocid="faction.editor.delete.cancel_button">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    data-ocid="faction.editor.delete.confirm_button"
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <div />
          )}

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              data-ocid="faction.editor.cancel_button"
              className="text-xs uppercase tracking-wider"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saving}
              data-ocid="faction.editor.save.submit_button"
              className="gap-1.5 text-xs bg-gold/20 hover:bg-gold/30 border border-gold/50 text-gold uppercase tracking-wider"
              variant="outline"
            >
              {saving ? <Loader2 size={13} className="animate-spin" /> : null}
              {saving ? "Saving..." : isEditing ? "Save Changes" : "Create"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
