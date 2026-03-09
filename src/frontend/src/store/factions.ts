import { idbGet, idbSet, migrateFromLocalStorage } from "./idb-store";

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

const IDB_STORE = "factions" as const;
const LS_KEY = "factions";

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

let _cache: Faction[] | null = null;
let _initialized = false;
let _initPromise: Promise<void> | null = null;

export async function initFactionStore(): Promise<void> {
  if (_initialized) return;
  if (_initPromise) return _initPromise;

  _initPromise = (async () => {
    const migrated = await migrateFromLocalStorage(LS_KEY, IDB_STORE);
    if (migrated && Array.isArray(migrated)) {
      _cache = (migrated as Faction[]).map(migrateFaction);
      _initialized = true;
      return;
    }

    const stored = await idbGet<Faction[]>(IDB_STORE);
    if (stored && Array.isArray(stored) && stored.length > 0) {
      _cache = stored.map(migrateFaction);
    } else {
      _cache = SAMPLE_FACTIONS;
      await idbSet(IDB_STORE, _cache);
    }
    _initialized = true;
  })();

  return _initPromise;
}

function migrateFaction(f: Faction): Faction {
  const migrated = { ...f };
  migrated.exMembers = migrated.exMembers ?? [];
  if (!migrated.accentColor) migrated.accentColor = "#c9a84c";
  return migrated as Faction;
}

function getCache(): Faction[] {
  return _cache ?? SAMPLE_FACTIONS;
}

function persistAsync(factions: Faction[]): void {
  idbSet(IDB_STORE, factions).catch(() => {});
}

export function getFactions(): Faction[] {
  return getCache();
}

export function saveFactions(factions: Faction[]): void {
  _cache = factions;
  persistAsync(factions);
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
