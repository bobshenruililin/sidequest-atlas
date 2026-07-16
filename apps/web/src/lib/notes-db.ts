export interface NoteRevision {
  id: string;
  body: string;
  createdAt: string;
  tripSlug?: string;
  dayDate?: string;
  tags: string[];
}

const DB_NAME = "sidequest-atlas-notes";
const STORE_NAME = "note-revisions";
const DB_VERSION = 1;

export async function openNotesDb(): Promise<IDBDatabase> {
  if (typeof indexedDB === "undefined") {
    throw new Error("IndexedDB is not available in this environment.");
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("createdAt", "createdAt");
        store.createIndex("tripSlug", "tripSlug", { unique: false });
      }
    };

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

export async function appendNoteRevision(
  revision: Omit<NoteRevision, "id" | "createdAt">,
): Promise<NoteRevision> {
  const db = await openNotesDb();
  const record: NoteRevision = {
    ...revision,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  await runTransaction(db, "readwrite", (store) => {
    store.add(record);
  });

  return record;
}

export async function listNoteRevisions(): Promise<NoteRevision[]> {
  const db = await openNotesDb();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const revisions = request.result as NoteRevision[];
      resolve(
        revisions.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      );
    };
  });
}

function runTransaction(
  db: IDBDatabase,
  mode: IDBTransactionMode,
  action: (store: IDBObjectStore) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, mode);
    const store = transaction.objectStore(STORE_NAME);
    action(store);
    transaction.onerror = () => reject(transaction.error);
    transaction.oncomplete = () => resolve();
  });
}
