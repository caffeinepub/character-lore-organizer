export type ArtifactRarity = "Common" | "Rare" | "Legendary" | "Mythic";

export interface Artifact {
  id: string;
  name: string;
  imageUrl: string;
  shortDescription: string;
  fullDescription: string;
  rarity: ArtifactRarity;
  wieldedByCharacterId: string;
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = "artifacts";

const SAMPLE_ARTIFACTS: Artifact[] = [
  {
    id: "artifact-001",
    name: "The Null Blade",
    imageUrl: "",
    shortDescription: "A sword forged from crystallized shadow",
    fullDescription:
      "A sword forged from crystallized shadow, capable of cutting through magic itself. The Null Blade was said to have been created in the deepest vaults of the Shadowcourt, where shadow becomes solid and time grows uncertain. Every strike from this blade leaves a small pocket of void — a moment where magic simply ceases to exist. Aria Shadowbane is one of the few known wielders who can touch it without losing their sense of self.",
    rarity: "Legendary",
    wieldedByCharacterId: "char-001",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 12,
    updatedAt: Date.now() - 1000 * 60 * 60 * 5,
  },
  {
    id: "artifact-002",
    name: "The Unbreaking Shield",
    imageUrl: "",
    shortDescription: "A kite shield bearing the crest of Mordencroft",
    fullDescription:
      "A kite shield bearing the crest of Mordencroft — the only thing to survive the siege intact. While five hundred soldiers fell around it, this shield did not crack, did not dent, and did not yield. Roland the Unyielding carries it not as a trophy but as a memorial. The Mordencroft crest etched into its surface has never faded despite decades of battle.",
    rarity: "Rare",
    wieldedByCharacterId: "char-002",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 8,
    updatedAt: Date.now() - 1000 * 60 * 60 * 2,
  },
  {
    id: "artifact-003",
    name: "The Void Lens",
    imageUrl: "",
    shortDescription: "A monocle-shaped artifact that reveals reality's cracks",
    fullDescription:
      "A monocle-shaped artifact that lets the wearer see the cracks between realities. The Void Collective discovered it beneath the ruins of a city that technically never existed. When worn, it reveals thin silver lines running through all solid matter — the seams between what is real and what could be. Extended use is said to make the wearer unsure which side of the seams they belong on. No current wielder has been confirmed.",
    rarity: "Mythic",
    wieldedByCharacterId: "",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
    updatedAt: Date.now() - 1000 * 60 * 30,
  },
];

export function getArtifacts(): Artifact[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveArtifacts(SAMPLE_ARTIFACTS);
      return SAMPLE_ARTIFACTS;
    }
    const parsed = JSON.parse(raw) as Artifact[];
    if (!Array.isArray(parsed)) return SAMPLE_ARTIFACTS;
    return parsed;
  } catch {
    return SAMPLE_ARTIFACTS;
  }
}

export function saveArtifacts(artifacts: Artifact[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(artifacts));
}

export function createArtifact(
  input: Omit<Artifact, "id" | "createdAt" | "updatedAt">,
): Artifact {
  const now = Date.now();
  const newArtifact: Artifact = {
    ...input,
    id: `artifact-${now}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: now,
    updatedAt: now,
  };
  const artifacts = getArtifacts();
  saveArtifacts([...artifacts, newArtifact]);
  return newArtifact;
}

export function updateArtifact(
  id: string,
  input: Partial<Artifact>,
): Artifact | null {
  const artifacts = getArtifacts();
  const idx = artifacts.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  const updated: Artifact = {
    ...artifacts[idx],
    ...input,
    updatedAt: Date.now(),
  };
  artifacts[idx] = updated;
  saveArtifacts(artifacts);
  return updated;
}

export function deleteArtifact(id: string): void {
  const artifacts = getArtifacts();
  saveArtifacts(artifacts.filter((a) => a.id !== id));
}

export function getRarityColor(rarity: ArtifactRarity): string {
  switch (rarity) {
    case "Common":
      return "#9ca3af";
    case "Rare":
      return "#3b82f6";
    case "Legendary":
      return "#f59e0b";
    case "Mythic":
      return "#a855f7";
  }
}
