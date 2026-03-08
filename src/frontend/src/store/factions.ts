export interface Faction {
  id: string;
  name: string;
  symbolImageUrl: string;
  shortDescription: string;
  lore: string;
  exMembers: string[];
  accentColor: string;
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = "factions";

const SAMPLE_FACTIONS: Faction[] = [
  {
    id: "faction-001",
    name: "Shadowcourt",
    symbolImageUrl: "",
    shortDescription:
      "A clandestine network of shadow mages, exiled nobles, and those who deal in secrets.",
    lore: `The Shadowcourt has no throne room, no official charter, and no public face. It exists as a web of whispered allegiances and carefully tended debts, stretching from the undercity of Vel'Ashara to the masked salons of the capital.\n\nIts membership is never announced — one simply discovers, at some crucial moment, that they are already part of it. The Shadowcourt specializes in information, silence, and the particular kind of power that cannot be acknowledged in daylight.\n\nAria Shadowbane serves as its most visible operative, which is paradoxical since visibility is what the Shadowcourt typically punishes. Her reputation is, perhaps, a deliberate misdirection.`,
    exMembers: ["Maren the Unveiled", "Lord Cassian Vael"],
    accentColor: "#c9a84c",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 20,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
  },
  {
    id: "faction-002",
    name: "Iron Order",
    symbolImageUrl: "",
    shortDescription:
      "An ancient brotherhood of warriors bound by the Oath of Unyielding — guardians of the realm.",
    lore: `The Iron Order predates Aneirin itself. Its founding is credited to the Seven Wardens who survived the Godswar and swore that no force — mortal or divine — would break the world again while they stood.\n\nThe Order has evolved over five centuries from a wandering warband into a structured institution with chapters across the known world. Its members are bound by the Oath of Unyielding, which grants them extraordinary endurance but is said to slowly remove the capacity for ordinary joy.\n\nRoland the Unyielding is the Order's most decorated living member. His survival at Mordencroft — where he was the sole survivor of a five-hundred-man garrison — is studied in every chapter hall as both strategy and cautionary tale.`,
    exMembers: ["Commander Elsa Dorn (deceased)", "Ser Aldric of the East"],
    accentColor: "#c9a84c",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 18,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
  },
  {
    id: "faction-003",
    name: "Void Collective",
    symbolImageUrl: "",
    shortDescription:
      "An acknowledgment of those who exist between the cracks of reality — not a group, but a recognition.",
    lore: `The Void Collective is not an organization in any conventional sense. There are no meetings, no hierarchy, no dues. It is, as those who study such things describe it, a mutual acknowledgment among beings who have touched the Void and returned changed.\n\nMembers find one another through inexplicable means — a resonance, a pull, a shared understanding of what lies behind the fabric of the world. They do not recruit. They do not train. They simply recognize.\n\nNyx Voidwalker is the Collective's most publicly known member, though the Collective itself would note that Nyx does not represent them — Nyx represents Nyx. The distinction matters to them.`,
    exMembers: [],
    accentColor: "#c9a84c",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 15,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 1,
  },
];

export function getFactions(): Faction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveFactions(SAMPLE_FACTIONS);
      return SAMPLE_FACTIONS;
    }
    const parsed = JSON.parse(raw) as Faction[];
    if (!Array.isArray(parsed)) return SAMPLE_FACTIONS;
    return parsed.map((f) => {
      const migrated = { ...f };
      migrated.exMembers = migrated.exMembers ?? [];
      if (!migrated.accentColor) migrated.accentColor = "#c9a84c";
      return migrated as Faction;
    });
  } catch {
    return SAMPLE_FACTIONS;
  }
}

export function saveFactions(factions: Faction[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(factions));
}

export function createFaction(
  input: Omit<Faction, "id" | "createdAt" | "updatedAt">,
): Faction {
  const now = Date.now();
  const faction: Faction = {
    ...input,
    id: `faction-${now}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: now,
    updatedAt: now,
  };
  const factions = getFactions();
  saveFactions([...factions, faction]);
  return faction;
}

export function updateFaction(
  id: string,
  input: Partial<Faction>,
): Faction | null {
  const factions = getFactions();
  const idx = factions.findIndex((f) => f.id === id);
  if (idx === -1) return null;
  const updated: Faction = {
    ...factions[idx],
    ...input,
    updatedAt: Date.now(),
  };
  factions[idx] = updated;
  saveFactions(factions);
  return updated;
}

export function deleteFaction(id: string): void {
  const factions = getFactions();
  saveFactions(factions.filter((f) => f.id !== id));
}
