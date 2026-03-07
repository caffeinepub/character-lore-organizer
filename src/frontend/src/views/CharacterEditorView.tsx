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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import type { Character, CharacterRelationship } from "@/store/characters";
import {
  FONT_OPTIONS,
  createCharacter,
  deleteCharacter,
  getCharacters,
  getFontClass,
  updateCharacter,
} from "@/store/characters";
import { AlertTriangle, ArrowLeft, Loader2, Plus, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface CharacterEditorViewProps {
  editingId?: string;
  onBack: () => void;
  onSaved: () => void;
  onDeleted: () => void;
}

type FormData = Omit<Character, "id" | "createdAt" | "updatedAt">;

const DEFAULT_FORM: FormData = {
  name: "",
  faction: "",
  value: 50,
  fame: 50,
  nameFontSize: 56,
  title: "",
  titleFontSize: 32,
  previewAnimation: "default",
  shortDescription: "",
  lore: "",
  backstory: "",
  traits: [],
  funFacts: [],
  tags: [],
  relationships: [],
  galleryImages: [],
  portraitImageUrl: "",
  fullBodyImageUrl: "",
  musicUrl: "",
  bgColor: "#0d0d1a",
  textColor: "#c9a84c",
  nameFont: "Cinzel",
};

const ANIMATION_OPTIONS = [
  { value: "default", label: "Default (Slide Up)" },
  { value: "sparkle", label: "✨ Sparkle" },
  { value: "wave", label: "🌊 Wave" },
  { value: "fire", label: "🔥 Fire" },
  { value: "vines", label: "🌿 Vines" },
  { value: "ice", label: "❄️ Ice Shatter" },
  { value: "spooky", label: "💀 Spooky Skull" },
  { value: "science-green", label: "🧪 Science – Green Bubbles" },
  { value: "science-purple", label: "🔬 Science – Purple Bubbles" },
  { value: "science-blue", label: "⚗️ Science – Blue Bubbles" },
  { value: "lightning-blue", label: "⚡ Lightning – Blue" },
  { value: "lightning-yellow", label: "⚡ Lightning – Yellow" },
  { value: "golden-shield", label: "🛡️ Golden Shield" },
  { value: "door-lock", label: "🚪 Door & Lock" },
  { value: "holy", label: "🕊️ Holy Wings" },
  { value: "glitch", label: "💾 Glitch" },
];

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function CharacterEditorView({
  editingId,
  onBack,
  onSaved,
  onDeleted,
}: CharacterEditorViewProps) {
  const [form, setForm] = useState<FormData>(DEFAULT_FORM);
  const [allCharacters, setAllCharacters] = useState<Character[]>([]);
  const [traitInput, setTraitInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [funFactInput, setFunFactInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [portraitPreview, setPortraitPreview] = useState("");
  const [fullBodyPreview, setFullBodyPreview] = useState("");
  const [musicName, setMusicName] = useState("");

  const portraitRef = useRef<HTMLInputElement>(null);
  const fullBodyRef = useRef<HTMLInputElement>(null);
  const musicRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const isEditing = !!editingId;

  useEffect(() => {
    const chars = getCharacters();
    setAllCharacters(chars);
    if (editingId) {
      const found = chars.find((c) => c.id === editingId);
      if (found) {
        const { id: _id, createdAt: _ca, updatedAt: _ua, ...rest } = found;
        setForm({
          ...DEFAULT_FORM,
          ...rest,
        });
        setPortraitPreview(found.portraitImageUrl);
        setFullBodyPreview(found.fullBodyImageUrl);
        if (found.musicUrl) setMusicName("Uploaded audio");
      }
    }
  }, [editingId]);

  const set = <K extends keyof FormData>(key: K, val: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  const handlePortraitUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const b64 = await fileToBase64(file);
    set("portraitImageUrl", b64);
    setPortraitPreview(b64);
  };

  const handleFullBodyUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const b64 = await fileToBase64(file);
    set("fullBodyImageUrl", b64);
    setFullBodyPreview(b64);
  };

  const handleMusicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const b64 = await fileToBase64(file);
    set("musicUrl", b64);
    setMusicName(file.name);
  };

  const addTrait = () => {
    const val = traitInput.trim();
    if (val && !form.traits.includes(val)) {
      set("traits", [...form.traits, val]);
    }
    setTraitInput("");
  };

  const removeTrait = (t: string) => {
    set(
      "traits",
      form.traits.filter((x) => x !== t),
    );
  };

  const addFunFact = () => {
    const val = funFactInput.trim();
    if (val) {
      set("funFacts", [...form.funFacts, val]);
    }
    setFunFactInput("");
  };

  const removeFunFact = (i: number) => {
    set(
      "funFacts",
      form.funFacts.filter((_, idx) => idx !== i),
    );
  };

  const addTag = () => {
    const val = tagInput.trim();
    if (val && !(form.tags ?? []).includes(val)) {
      set("tags", [...(form.tags ?? []), val]);
    }
    setTagInput("");
  };

  const removeTag = (t: string) => {
    set(
      "tags",
      (form.tags ?? []).filter((x) => x !== t),
    );
  };

  const addRelationship = () => {
    set("relationships", [
      ...(form.relationships ?? []),
      { description: "", linkedCharacterId: "" },
    ]);
  };

  const updateRelationship = (
    idx: number,
    patch: Partial<CharacterRelationship>,
  ) => {
    const updated = (form.relationships ?? []).map((r, i) =>
      i === idx ? { ...r, ...patch } : r,
    );
    set("relationships", updated);
  };

  const removeRelationship = (idx: number) => {
    set(
      "relationships",
      (form.relationships ?? []).filter((_, i) => i !== idx),
    );
  };

  const handleGalleryUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const results = await Promise.all(files.map(fileToBase64));
    set("galleryImages", [...(form.galleryImages ?? []), ...results]);
    // reset input so same files can be re-selected
    e.target.value = "";
  };

  const removeGalleryImage = (idx: number) => {
    set(
      "galleryImages",
      (form.galleryImages ?? []).filter((_, i) => i !== idx),
    );
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Character name is required");
      return;
    }
    setSaving(true);
    try {
      if (isEditing && editingId) {
        const result = updateCharacter(editingId, form);
        if (!result) throw new Error("Character not found");
        toast.success(`${form.name} updated`);
      } else {
        createCharacter(form);
        toast.success(`${form.name} created`);
      }
      onSaved();
    } catch (_err) {
      toast.error("Failed to save character");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (editingId) {
      deleteCharacter(editingId);
      toast.success("Character deleted");
      onDeleted();
    }
  };

  const fontClass = getFontClass(form.nameFont);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b border-border bg-background/90 backdrop-blur-sm">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          data-ocid="editor.cancel.button"
          className="gap-2 text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={14} />
          Cancel
        </Button>

        <div className="flex items-center gap-2">
          <div className="w-1 h-4 bg-gold rounded-full" />
          <h1 className="text-sm font-bold uppercase tracking-widest">
            {isEditing ? "Edit Character" : "New Character"}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {isEditing && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  data-ocid="editor.delete.delete_button"
                  className="gap-1.5 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 uppercase tracking-wider"
                >
                  <X size={14} />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle size={18} className="text-destructive" />
                    Delete Character
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete{" "}
                    <strong className="text-foreground">
                      {form.name || "this character"}
                    </strong>
                    ? This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel data-ocid="editor.delete.cancel_button">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    data-ocid="editor.delete.confirm_button"
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving}
            data-ocid="editor.save.submit_button"
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
        {/* Live preview of name */}
        {form.name && (
          <motion.div
            className="rounded-lg p-6 border border-border/50 text-center"
            style={{ background: form.bgColor, color: form.textColor }}
            animate={{ backgroundColor: form.bgColor, color: form.textColor }}
            transition={{ duration: 0.3 }}
          >
            <p
              className={`font-bold ${fontClass}`}
              style={{
                color: form.textColor,
                fontSize: `${form.nameFontSize}px`,
                lineHeight: 1.1,
              }}
            >
              {form.name}
            </p>
            {form.title && (
              <p
                className="opacity-70 mt-1"
                style={{
                  color: form.textColor,
                  fontSize: `${form.titleFontSize ?? 32}px`,
                  lineHeight: 1.2,
                }}
              >
                {form.title}
              </p>
            )}
            {form.faction && (
              <p className="text-sm mt-1 opacity-60">{form.faction}</p>
            )}
          </motion.div>
        )}

        {/* Basic info */}
        <Section title="Basic Information">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Name *">
              <Input
                data-ocid="editor.name.input"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Character name"
              />
            </FormField>
            <FormField label="Faction">
              <Input
                data-ocid="editor.faction.input"
                value={form.faction}
                onChange={(e) => set("faction", e.target.value)}
                placeholder="e.g. Iron Order"
              />
            </FormField>
            <FormField label="Power Value">
              <Input
                data-ocid="editor.value.input"
                type="number"
                min={0}
                max={999}
                value={form.value}
                onChange={(e) => set("value", Number(e.target.value))}
              />
            </FormField>
            <FormField label={`Fame (0–100): ${form.fame ?? 50}`}>
              <Slider
                data-ocid="editor.fame.input"
                min={0}
                max={100}
                step={1}
                value={[form.fame ?? 50]}
                onValueChange={([v]) => set("fame", v)}
                className="mt-2"
              />
            </FormField>
            <FormField label="Short Description">
              <Input
                data-ocid="editor.description.input"
                value={form.shortDescription}
                onChange={(e) => set("shortDescription", e.target.value)}
                placeholder="One sentence summary"
              />
            </FormField>
          </div>
        </Section>

        {/* Profile styling */}
        <Section title="Profile Appearance">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Background Color">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.bgColor}
                  onChange={(e) => set("bgColor", e.target.value)}
                  className="w-10 h-9 rounded cursor-pointer bg-transparent border border-border"
                />
                <Input
                  data-ocid="editor.bgcolor.input"
                  value={form.bgColor}
                  onChange={(e) => set("bgColor", e.target.value)}
                  placeholder="#0d0d1a"
                  className="font-mono text-sm"
                />
              </div>
            </FormField>
            <FormField label="Text Color">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.textColor}
                  onChange={(e) => set("textColor", e.target.value)}
                  className="w-10 h-9 rounded cursor-pointer bg-transparent border border-border"
                />
                <Input
                  data-ocid="editor.textcolor.input"
                  value={form.textColor}
                  onChange={(e) => set("textColor", e.target.value)}
                  placeholder="#c9a84c"
                  className="font-mono text-sm"
                />
              </div>
            </FormField>
            <FormField label="Name Font">
              <Select
                value={form.nameFont}
                onValueChange={(v) => set("nameFont", v)}
              >
                <SelectTrigger data-ocid="editor.font.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONT_OPTIONS.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      <span
                        className={f.className}
                        style={{ fontSize: "1.05em" }}
                      >
                        {f.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Preview Animation">
              <Select
                value={form.previewAnimation ?? "default"}
                onValueChange={(v) => set("previewAnimation", v)}
              >
                <SelectTrigger data-ocid="editor.animation.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ANIMATION_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label={`Name Font Size: ${form.nameFontSize ?? 56}px`}>
              <Slider
                data-ocid="editor.fontsize.input"
                min={32}
                max={120}
                step={2}
                value={[form.nameFontSize ?? 56]}
                onValueChange={([v]) => set("nameFontSize", v)}
                className="mt-2"
              />
            </FormField>
            <FormField label="Title">
              <Input
                data-ocid="editor.title.input"
                value={form.title ?? ""}
                onChange={(e) => set("title", e.target.value)}
                placeholder="e.g. The Cursed Blade"
              />
            </FormField>
            <FormField label={`Title Font Size: ${form.titleFontSize ?? 32}px`}>
              <Slider
                data-ocid="editor.titlesize.input"
                min={16}
                max={80}
                step={2}
                value={[form.titleFontSize ?? 32]}
                onValueChange={([v]) => set("titleFontSize", v)}
                className="mt-2"
              />
            </FormField>
          </div>
        </Section>

        {/* Images */}
        <Section title="Images">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Portrait */}
            <FormField label="Portrait (square thumbnail)">
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  data-ocid="editor.portrait.upload_button"
                  onClick={() => portraitRef.current?.click()}
                  className="w-full text-xs uppercase tracking-wider gap-1.5 border-dashed"
                >
                  <Plus size={13} />
                  Upload Portrait
                </Button>
                <input
                  ref={portraitRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePortraitUpload}
                  className="hidden"
                />
                {portraitPreview && (
                  <div className="relative">
                    <img
                      src={portraitPreview}
                      alt="Portrait preview"
                      className="w-full aspect-square object-cover rounded-md border border-border"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        set("portraitImageUrl", "");
                        setPortraitPreview("");
                      }}
                      className="absolute top-1 right-1 bg-background/80 rounded-full p-0.5"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>
            </FormField>

            {/* Full body */}
            <FormField label="Full Body (preview/profile)">
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  data-ocid="editor.fullbody.upload_button"
                  onClick={() => fullBodyRef.current?.click()}
                  className="w-full text-xs uppercase tracking-wider gap-1.5 border-dashed"
                >
                  <Plus size={13} />
                  Upload Full Body
                </Button>
                <input
                  ref={fullBodyRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFullBodyUpload}
                  className="hidden"
                />
                {fullBodyPreview && (
                  <div className="relative">
                    <img
                      src={fullBodyPreview}
                      alt="Full body preview"
                      className="w-full object-contain rounded-md border border-border max-h-48"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        set("fullBodyImageUrl", "");
                        setFullBodyPreview("");
                      }}
                      className="absolute top-1 right-1 bg-background/80 rounded-full p-0.5"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>
            </FormField>
          </div>
        </Section>

        {/* Music */}
        <Section title="Theme Music">
          <Button
            type="button"
            variant="outline"
            size="sm"
            data-ocid="editor.music.upload_button"
            onClick={() => musicRef.current?.click()}
            className="gap-1.5 text-xs uppercase tracking-wider border-dashed"
          >
            <Plus size={13} />
            {musicName ? "Replace Audio" : "Upload Audio (.mp3, .wav, .ogg)"}
          </Button>
          <input
            ref={musicRef}
            type="file"
            accept=".mp3,.wav,.ogg,audio/*"
            onChange={handleMusicUpload}
            className="hidden"
          />
          {musicName && (
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <span className="text-xs">{musicName}</span>
              <button
                type="button"
                onClick={() => {
                  set("musicUrl", "");
                  setMusicName("");
                }}
                className="hover:text-foreground"
              >
                <X size={12} />
              </button>
            </div>
          )}
        </Section>

        {/* Lore */}
        <Section title="Lore">
          <Textarea
            data-ocid="editor.lore.textarea"
            value={form.lore}
            onChange={(e) => set("lore", e.target.value)}
            placeholder="The lore, legend, and mythology surrounding this character..."
            rows={5}
            className="resize-y"
          />
        </Section>

        {/* Backstory */}
        <Section title="Backstory">
          <Textarea
            data-ocid="editor.backstory.textarea"
            value={form.backstory}
            onChange={(e) => set("backstory", e.target.value)}
            placeholder="Personal history, origin story, and background..."
            rows={5}
            className="resize-y"
          />
        </Section>

        {/* Traits */}
        <Section title="Traits">
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                data-ocid="editor.traits.input"
                value={traitInput}
                onChange={(e) => setTraitInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTrait();
                  }
                }}
                placeholder="Type a trait and press Enter..."
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTrait}
                className="shrink-0"
              >
                <Plus size={14} />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.traits.map((trait) => (
                <span
                  key={trait}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border border-gold/30 bg-gold/10 text-gold"
                >
                  {trait}
                  <button
                    type="button"
                    onClick={() => removeTrait(trait)}
                    className="hover:text-foreground"
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </Section>

        {/* Fun Facts */}
        <Section title="Fun Facts">
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                data-ocid="editor.funfacts.input"
                value={funFactInput}
                onChange={(e) => setFunFactInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addFunFact();
                  }
                }}
                placeholder="Type a fun fact and press Enter..."
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addFunFact}
                className="shrink-0"
              >
                <Plus size={14} />
              </Button>
            </div>
            <ul className="space-y-1.5">
              {form.funFacts.map((fact, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: ordered list, index is the correct key
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-muted-foreground shrink-0 mt-0.5 font-mono text-xs">
                    {i + 1}.
                  </span>
                  <span className="flex-1 text-foreground">{fact}</span>
                  <button
                    type="button"
                    onClick={() => removeFunFact(i)}
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <X size={12} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        {/* Tags */}
        <Section title="Tags">
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                data-ocid="editor.tags.input"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Type a tag and press Enter..."
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTag}
                className="shrink-0"
              >
                <Plus size={14} />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(form.tags ?? []).map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border border-border bg-card/50 text-foreground"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-destructive"
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </Section>

        {/* Relationships */}
        <Section title="Relationships">
          <div className="space-y-3">
            {(form.relationships ?? []).map((rel, idx) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: ordered list
                key={idx}
                className="flex gap-2 items-start p-3 rounded-md border border-border/50 bg-card/30"
              >
                <div className="flex-1 space-y-2">
                  <Select
                    value={rel.linkedCharacterId || "__none__"}
                    onValueChange={(v) =>
                      updateRelationship(idx, {
                        linkedCharacterId: v === "__none__" ? "" : v,
                      })
                    }
                  >
                    <SelectTrigger
                      data-ocid={`editor.relationships.select.${idx + 1}`}
                      className="text-xs"
                    >
                      <SelectValue placeholder="Link to a character…" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">
                        — Select character —
                      </SelectItem>
                      {allCharacters
                        .filter((c) => c.id !== editingId)
                        .map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Input
                    data-ocid={`editor.relationships.input.${idx + 1}`}
                    value={rel.description}
                    onChange={(e) =>
                      updateRelationship(idx, { description: e.target.value })
                    }
                    placeholder="Describe the relationship (freeform)…"
                    className="text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeRelationship(idx)}
                  className="shrink-0 mt-1.5 text-muted-foreground hover:text-destructive"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              data-ocid="editor.relationships.add.button"
              onClick={addRelationship}
              className="gap-1.5 text-xs uppercase tracking-wider border-dashed"
            >
              <Plus size={13} />
              Add Relationship
            </Button>
          </div>
        </Section>

        {/* Gallery Images */}
        <Section title="Gallery Images">
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              data-ocid="editor.gallery.upload_button"
              onClick={() => galleryRef.current?.click()}
              className="gap-1.5 text-xs uppercase tracking-wider border-dashed"
            >
              <Plus size={13} />
              Add Gallery Images
            </Button>
            <input
              ref={galleryRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleGalleryUpload}
              className="hidden"
            />
            {(form.galleryImages ?? []).length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {(form.galleryImages ?? []).map((img, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: ordered list
                  <div key={i} className="relative aspect-square group">
                    <img
                      src={img}
                      alt={`Gallery ${i + 1}`}
                      className="w-full h-full object-cover rounded-md border border-border"
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(i)}
                      className="absolute top-1 right-1 bg-background/80 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Section>

        {/* Bottom save/cancel */}
        <div className="flex justify-end gap-3 pt-4 pb-10 border-t border-border">
          <Button
            variant="ghost"
            onClick={onBack}
            data-ocid="editor.cancel.button"
            className="text-xs uppercase tracking-wider"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            data-ocid="editor.save.submit_button"
            className="gap-1.5 text-xs bg-gold/20 hover:bg-gold/30 border border-gold/50 text-gold uppercase tracking-wider"
            variant="outline"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : null}
            {saving
              ? "Saving..."
              : isEditing
                ? "Save Changes"
                : "Create Character"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Helper sub-components
function Section({
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

function FormField({
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
