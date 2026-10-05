/**
 * IndexedDB Video Storage Utility
 * Stores large binary video blobs asynchronously in browser IndexedDB.
 * Prevents localStorage quota exhaustion, memory bloat, and UI freezes.
 */

const DB_NAME = 'NexgenMediaStorage';
const DB_VERSION = 1;
const STORE_NAME = 'videos';

function openVideoDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this browser.'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export interface StoredVideoRecord {
  key: string;
  blob: Blob;
  name: string;
  sizeMb: number;
  mimeType: string;
  updatedAt: number;
}

/**
 * Save video file/blob into IndexedDB
 */
export async function saveVideoBlob(key: string, file: File | Blob, originalName?: string): Promise<string> {
  const db = await openVideoDB();
  const sizeMb = +(file.size / (1024 * 1024)).toFixed(2);
  const name = originalName || (file instanceof File ? file.name : 'uploaded-video.mp4');
  const mimeType = file.type || 'video/mp4';

  const record: StoredVideoRecord = {
    key,
    blob: file,
    name,
    sizeMb,
    mimeType,
    updatedAt: Date.now()
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const putRequest = store.put(record);

    putRequest.onsuccess = () => {
      resolve(`indexeddb:${key}`);
    };
    putRequest.onerror = () => reject(putRequest.error);
  });
}

/**
 * Get video blob URL for playback
 */
export async function getVideoBlobUrl(key: string): Promise<string | null> {
  const cleanKey = key.replace(/^indexeddb:/, '');
  try {
    const db = await openVideoDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const getRequest = store.get(cleanKey);

      getRequest.onsuccess = () => {
        const record = getRequest.result as StoredVideoRecord | undefined;
        if (record && record.blob) {
          const url = URL.createObjectURL(record.blob);
          resolve(url);
        } else {
          resolve(null);
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  } catch (err) {
    console.warn('[VideoStorage] Error reading video from IndexedDB:', err);
    return null;
  }
}

/**
 * Get stored video metadata
 */
export async function getVideoMeta(key: string): Promise<Omit<StoredVideoRecord, 'blob'> | null> {
  const cleanKey = key.replace(/^indexeddb:/, '');
  try {
    const db = await openVideoDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const getRequest = store.get(cleanKey);

      getRequest.onsuccess = () => {
        const record = getRequest.result as StoredVideoRecord | undefined;
        if (record) {
          resolve({
            key: record.key,
            name: record.name,
            sizeMb: record.sizeMb,
            mimeType: record.mimeType,
            updatedAt: record.updatedAt
          });
        } else {
          resolve(null);
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  } catch {
    return null;
  }
}

/**
 * Delete stored video from IndexedDB
 */
export async function deleteVideoBlob(key: string): Promise<void> {
  const cleanKey = key.replace(/^indexeddb:/, '');
  try {
    const db = await openVideoDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const delRequest = store.delete(cleanKey);

      delRequest.onsuccess = () => resolve();
      delRequest.onerror = () => reject(delRequest.error);
    });
  } catch (err) {
    console.warn('[VideoStorage] Error deleting video from IndexedDB:', err);
  }
}
