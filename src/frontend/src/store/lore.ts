export interface LoreEntry {
  id: string;
  title: string;
  body: string;
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = "lore-entries";

const SAMPLE_LORE: LoreEntry[] = [
  {
    id: "lore-001",
    title: "The Nation of Aneirin — History",
    body: `Aneirin, the Nation of Gold, rises from the confluence of three great rivers at the heart of the known world. Founded by the first Auric Council some five hundred years ago, it has endured wars, plagues, and the Void Incursion of the third age.\n\nThe nation takes its golden name not merely from wealth — though its mines are legendary — but from the golden light that bathes its central plateau at dawn and dusk, a phenomenon locals call the Aneirin Blessing. Travelers from distant lands often weep upon first seeing it.\n\nArria Shadowbane is said to have been born under one such dawn, her shadow already darker than it should be. Roland the Unyielding swore his first oath to Aneirin on its soil before the Iron Order took him north. Even Nyx Voidwalker, whose origins remain unknown, has been sighted within Aneirin's borders more than once.`,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 14,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 14,
  },
  {
    id: "lore-002",
    title: "The Three Factions — A Brief Overview",
    body: `Three great powers operate within and around Aneirin's sphere of influence, each shaped by ancient oaths and older rivalries.\n\nThe Shadowcourt was never sanctioned by the Auric Council — it grew from the underground networks of disgraced mages, exiled nobles, and those who found power in the spaces between law and darkness. Aria Shadowbane is its most infamous face.\n\nThe Iron Order predates Aneirin itself. Forged in the era of the Godswar, it is a fraternity of warriors bound by the Oath of Unyielding — the same oath that defines Roland the Unyielding. They serve as peacekeepers, but their definition of peace has always been contested.\n\nThe Void Collective does not seek members. It acknowledges those who already exist between the cracks of reality. Nyx Voidwalker is perhaps its most visible member, though visibility is not something the Collective usually permits.`,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
  },
];

export function getLoreEntries(): LoreEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveLoreEntries(SAMPLE_LORE);
      return SAMPLE_LORE;
    }
    const parsed = JSON.parse(raw) as LoreEntry[];
    if (!Array.isArray(parsed)) return SAMPLE_LORE;
    return parsed;
  } catch {
    return SAMPLE_LORE;
  }
}

export function saveLoreEntries(entries: LoreEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function createLoreEntry(
  input: Omit<LoreEntry, "id" | "createdAt" | "updatedAt">,
): LoreEntry {
  const now = Date.now();
  const entry: LoreEntry = {
    ...input,
    id: `lore-${now}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: now,
    updatedAt: now,
  };
  const entries = getLoreEntries();
  saveLoreEntries([...entries, entry]);
  return entry;
}

export function updateLoreEntry(
  id: string,
  input: Partial<Pick<LoreEntry, "title" | "body">>,
): LoreEntry | null {
  const entries = getLoreEntries();
  const idx = entries.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  const updated: LoreEntry = {
    ...entries[idx],
    ...input,
    updatedAt: Date.now(),
  };
  entries[idx] = updated;
  saveLoreEntries(entries);
  return updated;
}

export function deleteLoreEntry(id: string): void {
  const entries = getLoreEntries();
  saveLoreEntries(entries.filter((e) => e.id !== id));
}
