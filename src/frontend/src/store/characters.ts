export interface CharacterRelationship {
  description: string;
  linkedCharacterId: string;
}

export interface Character {
  id: string;
  name: string;
  faction: string;
  value: number;
  shortDescription: string;
  lore: string;
  backstory: string;
  traits: string[];
  funFacts: string[];
  tags: string[];
  relationships: CharacterRelationship[];
  galleryImages: string[];
  afterDarkImages: string[];
  portraitImageUrl: string;
  fullBodyImageUrl: string;
  musicUrl: string;
  bgColor: string;
  textColor: string;
  nameFont: string;
  title: string;
  titleFontSize: number;
  fame: number;
  nameFontSize: number;
  previewAnimation: string;
  pinned: boolean;
  portraitBorderColor: string;
  signature: string;
  createdAt: number;
  updatedAt: number;
}

export type SortField =
  | "faction"
  | "name"
  | "value"
  | "fame"
  | "createdAt"
  | "updatedAt";

const STORAGE_KEY = "characters";

const SAMPLE_CHARACTERS: Character[] = [
  {
    id: "char-001",
    name: "Aria Shadowbane",
    faction: "Shadowcourt",
    value: 95,
    shortDescription: "A deadly shadow mage from the Shadowcourt",
    lore: "Born in the twilight between worlds, Aria was chosen by the Shadowcourt at age seven when she accidentally extinguished every torch in her village with a single breath. Trained in the ancient arts of shadow weaving, she became the most feared assassin in three kingdoms. Her presence is said to drop the temperature of any room she enters.",
    backstory:
      "Aria grew up in the border city of Vel'Ashara, daughter of a disgraced court mage. When her father was executed for practicing forbidden shadow arts, the Shadowcourt took notice of the daughter who witnessed his death without flinching. She was recruited, trained, and eventually surpassed every master who taught her. She has never returned to Vel'Ashara.",
    traits: [
      "Stealth",
      "Magic",
      "Assassin",
      "Shadow Weaving",
      "Cold Precision",
    ],
    funFacts: [
      "She can hold her breath for twelve minutes underwater",
      "She never sleeps for more than two hours at a time",
      "Her shadow sometimes moves independently of her body",
    ],
    tags: ["Villain", "Magic User", "Shadowcourt Elite"],
    relationships: [
      {
        description: "Bitter rivals since the Purge of Vel'Ashara",
        linkedCharacterId: "char-002",
      },
    ],
    galleryImages: [],
    afterDarkImages: [],
    portraitImageUrl: "/assets/generated/aria-portrait.dim_400x400.jpg",
    fullBodyImageUrl: "/assets/generated/aria-fullbody.dim_600x900.jpg",
    musicUrl: "",
    bgColor: "#0d0d1a",
    textColor: "#c9a84c",
    nameFont: "Cinzel",
    title: "",
    titleFontSize: 32,
    fame: 87,
    nameFontSize: 56,
    previewAnimation: "default",
    pinned: false,
    portraitBorderColor: "",
    signature: "",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
    updatedAt: Date.now() - 1000 * 60 * 60 * 2,
  },
  {
    id: "char-002",
    name: "Roland the Unyielding",
    faction: "Iron Order",
    value: 88,
    shortDescription: "Legendary knight who never falls in battle",
    lore: "In forty years of war, Roland has never once touched the ground in defeat. His Iron Order brothers whisper that he made a bargain with the gods of battle — undying endurance in exchange for the ability to feel joy. Whether true or not, no smile has crossed his face since the Siege of Mordencroft.",
    backstory:
      "Roland was born the seventh son of a blacksmith. At fifteen he enrolled in the Iron Order as a common foot soldier. By twenty he had saved his battalion three times and earned the title of Paladin. The tragedy at Mordencroft — where he was the sole survivor of a 500-man garrison — broke something inside him. He fights on not for glory, but because stopping would mean answering questions he cannot face.",
    traits: ["Tank", "Warrior", "Commander", "Unbreakable", "Tactician"],
    funFacts: [
      "He has been struck by lightning twice and walked away both times",
      "He keeps a single dried flower from Mordencroft in his gauntlet",
      "He is said to have stopped a charging war horse with one hand",
    ],
    tags: ["Hero", "Paladin", "Iron Order Captain"],
    relationships: [
      {
        description:
          "Shares a tense rivalry with Aria Shadowbane across faction lines",
        linkedCharacterId: "char-001",
      },
      {
        description:
          "Once encountered Nyx Voidwalker during the Void Incursion",
        linkedCharacterId: "char-003",
      },
    ],
    galleryImages: [],
    afterDarkImages: [],
    portraitImageUrl: "/assets/generated/roland-portrait.dim_400x400.jpg",
    fullBodyImageUrl: "/assets/generated/roland-fullbody.dim_600x900.jpg",
    musicUrl: "",
    bgColor: "#1a0a0a",
    textColor: "#e8e8e8",
    nameFont: "Playfair Display",
    title: "",
    titleFontSize: 32,
    fame: 74,
    nameFontSize: 56,
    previewAnimation: "default",
    pinned: false,
    portraitBorderColor: "",
    signature: "",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
    updatedAt: Date.now() - 1000 * 60 * 30,
  },
  {
    id: "char-003",
    name: "Nyx Voidwalker",
    faction: "Void Collective",
    value: 72,
    shortDescription: "An entity from beyond the void",
    lore: "Nyx does not remember being born, because Nyx was not. They emerged from the Void approximately three centuries ago with no memory, no origin, and an instinctive understanding of reality's deepest cracks. The Void Collective did not recruit Nyx — they merely acknowledged what was already there.",
    backstory:
      "What little Nyx knows of their past comes from fragments: a city with twin moons, a ritual circle, a voice that sounded like silence. Whether they were human once is unknown. Their current form solidified gradually over decades, choosing features that felt right rather than ones they remembered. They joined the Void Collective because the others who existed between spaces were the first beings who did not fear what they represented.",
    traits: [
      "Void Magic",
      "Teleportation",
      "Chaos",
      "Phase Shift",
      "Reality Tear",
    ],
    funFacts: [
      "Nyx can exist in two places simultaneously for brief moments",
      "They have no heartbeat but somehow bleed starlight when cut",
      "Their footsteps make no sound on any surface",
    ],
    tags: ["Enigma", "Void Entity", "Ancient"],
    relationships: [
      {
        description:
          "Observes Roland the Unyielding from the shadows with quiet curiosity",
        linkedCharacterId: "char-002",
      },
    ],
    galleryImages: [],
    afterDarkImages: [],
    portraitImageUrl: "/assets/generated/nyx-portrait.dim_400x400.jpg",
    fullBodyImageUrl: "/assets/generated/nyx-fullbody.dim_600x900.jpg",
    musicUrl: "",
    bgColor: "#060612",
    textColor: "#9f7aea",
    nameFont: "Orbitron",
    title: "",
    titleFontSize: 32,
    fame: 95,
    nameFontSize: 56,
    previewAnimation: "default",
    pinned: false,
    portraitBorderColor: "",
    signature: "",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    updatedAt: Date.now() - 1000 * 60 * 10,
  },
];

export function getCharacters(): Character[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveCharacters(SAMPLE_CHARACTERS);
      return SAMPLE_CHARACTERS;
    }
    const parsed = JSON.parse(raw) as Character[];
    if (!Array.isArray(parsed)) return SAMPLE_CHARACTERS;
    // Migrate old characters that may be missing new fields
    return parsed.map((c) => {
      const migrated = { ...c } as Character;
      if (migrated.fame === undefined) migrated.fame = 0;
      if (migrated.nameFontSize === undefined) migrated.nameFontSize = 56;
      if (migrated.title === undefined) migrated.title = "";
      if (migrated.titleFontSize === undefined) migrated.titleFontSize = 32;
      if (migrated.previewAnimation === undefined)
        migrated.previewAnimation = "default";
      if (migrated.tags === undefined) migrated.tags = [];
      if (migrated.relationships === undefined) migrated.relationships = [];
      if (migrated.galleryImages === undefined) migrated.galleryImages = [];
      if (migrated.afterDarkImages === undefined) migrated.afterDarkImages = [];
      if (migrated.pinned === undefined) migrated.pinned = false;
      if (migrated.portraitBorderColor === undefined)
        migrated.portraitBorderColor = "";
      if (migrated.signature === undefined) migrated.signature = "";
      return migrated;
    });
  } catch {
    return SAMPLE_CHARACTERS;
  }
}

export function saveCharacters(chars: Character[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(chars));
}

export function createCharacter(
  input: Omit<Character, "id" | "createdAt" | "updatedAt">,
): Character {
  const now = Date.now();
  const newChar: Character = {
    ...input,
    id: `char-${now}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: now,
    updatedAt: now,
  };
  const chars = getCharacters();
  saveCharacters([...chars, newChar]);
  return newChar;
}

export function updateCharacter(
  id: string,
  input: Partial<Character>,
): Character | null {
  const chars = getCharacters();
  const idx = chars.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  const updated: Character = { ...chars[idx], ...input, updatedAt: Date.now() };
  chars[idx] = updated;
  saveCharacters(chars);
  return updated;
}

export function deleteCharacter(id: string): void {
  const chars = getCharacters();
  saveCharacters(chars.filter((c) => c.id !== id));
}

export function searchCharacters(
  query: string,
): Array<{ character: Character; matchedFields: string[] }> {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  const chars = getCharacters();
  const results: Array<{ character: Character; matchedFields: string[] }> = [];

  for (const c of chars) {
    const matchedFields: string[] = [];

    if (c.name.toLowerCase().includes(q)) matchedFields.push("name");
    if (c.faction.toLowerCase().includes(q)) matchedFields.push("faction");
    if (c.shortDescription.toLowerCase().includes(q))
      matchedFields.push("description");
    if (c.lore.toLowerCase().includes(q)) matchedFields.push("lore");
    if (c.backstory.toLowerCase().includes(q)) matchedFields.push("backstory");
    if (c.traits.some((t) => t.toLowerCase().includes(q)))
      matchedFields.push("traits");
    if (c.funFacts.some((f) => f.toLowerCase().includes(q)))
      matchedFields.push("fun facts");

    if (matchedFields.length > 0) {
      results.push({ character: c, matchedFields });
    }
  }

  return results;
}

function sortGroup(
  chars: Character[],
  by: SortField,
  direction: "asc" | "desc",
): Character[] {
  return [...chars].sort((a, b) => {
    let cmp = 0;
    switch (by) {
      case "name":
        cmp = a.name.localeCompare(b.name);
        break;
      case "faction":
        cmp = a.faction.localeCompare(b.faction);
        break;
      case "value":
        cmp = a.value - b.value;
        break;
      case "fame":
        cmp = (a.fame ?? 0) - (b.fame ?? 0);
        break;
      case "createdAt":
        cmp = a.createdAt - b.createdAt;
        break;
      case "updatedAt":
        cmp = a.updatedAt - b.updatedAt;
        break;
    }
    return direction === "asc" ? cmp : -cmp;
  });
}

export function sortCharacters(
  chars: Character[],
  by: SortField,
  direction: "asc" | "desc",
): Character[] {
  const pinned = chars.filter((c) => c.pinned);
  const unpinned = chars.filter((c) => !c.pinned);
  return [
    ...sortGroup(pinned, by, direction),
    ...sortGroup(unpinned, by, direction),
  ];
}

export const FONT_OPTIONS = [
  { label: "Cinzel", value: "Cinzel", className: "font-cinzel" },
  {
    label: "Playfair Display",
    value: "Playfair Display",
    className: "font-playfair",
  },
  { label: "Bebas Neue", value: "Bebas Neue", className: "font-bebas" },
  { label: "Orbitron", value: "Orbitron", className: "font-orbitron" },
  {
    label: "MedievalSharp",
    value: "MedievalSharp",
    className: "font-medieval",
  },
  {
    label: "Metamorphous",
    value: "Metamorphous",
    className: "font-metamorphous",
  },
  {
    label: "Press Start 2P",
    value: "Press Start 2P",
    className: "font-pressstart",
  },
  { label: "Bangers", value: "Bangers", className: "font-bangers" },
  { label: "Righteous", value: "Righteous", className: "font-righteous" },
  { label: "Russo One", value: "Russo One", className: "font-russo" },
  { label: "Teko", value: "Teko", className: "font-teko" },
  {
    label: "Alfa Slab One",
    value: "Alfa Slab One",
    className: "font-alfaslab",
  },
  {
    label: "Dancing Script",
    value: "Dancing Script",
    className: "font-dancing",
  },
  { label: "Great Vibes", value: "Great Vibes", className: "font-greatvibes" },
  {
    label: "Permanent Marker",
    value: "Permanent Marker",
    className: "font-permanent",
  },
  { label: "Creepster", value: "Creepster", className: "font-creepster" },
  { label: "Georgia", value: "Georgia", className: "font-georgia" },
  {
    label: "Times New Roman",
    value: "Times New Roman",
    className: "font-times",
  },
  { label: "Impact", value: "Impact", className: "font-impact" },
  { label: "Courier New", value: "Courier New", className: "font-courier" },
  { label: "Arial", value: "Arial", className: "font-arial" },
];

export function getFontClass(fontValue: string): string {
  const found = FONT_OPTIONS.find((f) => f.value === fontValue);
  return found ? found.className : "font-georgia";
}
