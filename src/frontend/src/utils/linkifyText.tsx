import type { Character } from "@/store/characters";

interface LinkTarget {
  id: string;
  name: string;
}

export function linkifyText(
  text: string,
  characters: Character[],
  textColor: string,
  onNavigateChar: (id: string) => void,
  factions?: LinkTarget[],
  onNavigateFaction?: (id: string) => void,
  artifacts?: LinkTarget[],
  onNavigateArtifact?: (id: string) => void,
): React.ReactNode {
  if (!text) return null;

  const targets: Array<LinkTarget & { type: "char" | "faction" | "artifact" }> =
    [
      ...characters.map((c) => ({
        id: c.id,
        name: c.name,
        type: "char" as const,
      })),
      ...(factions ?? []).map((f) => ({
        id: f.id,
        name: f.name,
        type: "faction" as const,
      })),
      ...(artifacts ?? []).map((a) => ({
        id: a.id,
        name: a.name,
        type: "artifact" as const,
      })),
    ].sort((a, b) => b.name.length - a.name.length);

  if (targets.length === 0) return text;

  const escaped = targets.map((t) =>
    t.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  );
  const regex = new RegExp(`(${escaped.join("|")})`, "g");
  const parts = text.split(regex);

  return parts.map((part, i) => {
    const target = targets.find((t) => t.name === part);
    if (target) {
      const onClick = () => {
        if (target.type === "char") onNavigateChar(target.id);
        else if (target.type === "faction" && onNavigateFaction)
          onNavigateFaction(target.id);
        else if (target.type === "artifact" && onNavigateArtifact)
          onNavigateArtifact(target.id);
      };
      return (
        <button
          // biome-ignore lint/suspicious/noArrayIndexKey: position-based split parts
          key={i}
          type="button"
          onClick={onClick}
          style={{
            color: textColor,
            fontWeight: 700,
            textDecoration: "underline",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            display: "inline",
          }}
        >
          {part}
        </button>
      );
    }
    // biome-ignore lint/suspicious/noArrayIndexKey: position-based split parts
    return <span key={i}>{part}</span>;
  });
}
