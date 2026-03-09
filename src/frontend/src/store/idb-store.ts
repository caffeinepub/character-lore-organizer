/**
 * IndexedDB storage adapter — replaces localStorage for all app data.
 * Provides a synchronous-compatible in-memory cache with async persistence.
 * Supports large data (images, music as base64) without size limits.
 */

const DB_NAME = "CharacterLoreOrganizer";
const DB_VERSION = 1;

const STORES = ["characters", "factions", "artifacts", "lore-entries"] as const;
type StoreName = (typeof STORES)[number];

let _db: IDBDatabase | null = null;

function openDB(): Promise<IDBDatabase> {
  if (_db) return Promise.resolve(_db);
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      for (const name of STORES) {
        if (!db.objectStoreNames.contains(name)) {
          db.createObjectStore(name);
        }
      }
    };
    req.onsuccess = () => {
      _db = req.result;
      resolve(_db);
    };
    req.onerror = () => reject(req.error);
  });
}

/** Read entire collection from IndexedDB. Returns null if key not found. */
export async function idbGet<T>(store: StoreName): Promise<T | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, "readonly");
      const req = tx.objectStore(store).get("data");
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

/** Write entire collection to IndexedDB. */
export async function idbSet<T>(store: StoreName, value: T): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, "readwrite");
      tx.objectStore(store).put(value, "data");
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Silently fail — in-memory cache still holds data
  }
}

/**
 * Migrate data from localStorage to IndexedDB on first run.
 * After migration, the localStorage key is cleared to free up space.
 */
export async function migrateFromLocalStorage(
  localStorageKey: string,
  idbStoreName: StoreName,
): Promise<unknown | null> {
  const existing = await idbGet(idbStoreName);
  if (existing !== null) return existing; // Already migrated

  const raw = localStorage.getItem(localStorageKey);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    await idbSet(idbStoreName, parsed);
    // Remove from localStorage to free space
    localStorage.removeItem(localStorageKey);
    return parsed;
  } catch {
    return null;
  }
}
