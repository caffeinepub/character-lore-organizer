import type { Character } from "@/store/characters";

export function linkifyText(
  text: string,
  characters: Character[],
  textColor: string,
  onNavigate: (id: string) => void,
): React.ReactNode {
  if (!text) return null;

  // Sort characters by name length descending to match longest names first
  const sorted = [...characters].sort((a, b) => b.name.length - a.name.length);

  // Build a regex from all character names
  const names = sorted.map((c) =>
    c.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  );
  if (names.length === 0) return text;

  const regex = new RegExp(`(${names.join("|")})`, "g");
  const parts = text.split(regex);

  return parts.map((part, i) => {
    const char = characters.find((c) => c.name === part);
    if (char) {
      return (
        <button
          // biome-ignore lint/suspicious/noArrayIndexKey: position-based split parts
          key={i}
          type="button"
          onClick={() => onNavigate(char.id)}
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
