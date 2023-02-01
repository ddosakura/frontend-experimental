import { promisifyRequest } from "idb-keyval";

// rome-ignore lint/suspicious/noExplicitAny: <explanation>
type Class<P extends any[] = any[], R extends object = object> = {
  new (...args: P): R;
};
type Parameters<C extends Class> =
  // rome-ignore lint/suspicious/noExplicitAny: <explanation>
  C extends Class<infer P, any> ? P : never;

/** @link https://github.com/w3c/FileAPI/issues/157 */
type CreateFile = (
  fileBits: BlobPart[],
  fileName: string,
  options?: FilePropertyBag,
) => Promise<File>;

/**
 * @link https://developer.chrome.com/en/blog/storage-buckets/
 * @link https://wicg.github.io/storage-buckets/explainer#accessing-storage-apis-from-buckets
 **/
export interface Bucket {
  estimate: StorageManager["estimate"];

  /** IndexedDB */
  indexedDB: typeof indexedDB;

  /** Cache API */
  caches: typeof caches;

  /** File API - Blob.create */
  createBlob(...args: Parameters<Blob>): Promise<Blob>;
  /** File API - File.create */
  createFile: CreateFile;

  /**
   * File System Access API
   * @link https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/getDirectory
   **/
  getDirectory: StorageManager["getDirectory"];

  /** Web Locks API */
  locks: typeof navigator.locks;
}

const getDatabases = async (prefix: string) => {
  const list = await indexedDB.databases();
  return list.filter(({ name }) => name?.startsWith(prefix));
};

export const open = async (
  name: string,
  options?: Partial<{
    persisted: Awaited<ReturnType<StorageManager["persisted"]>>;
    durability: IDBTransaction["durability"];
    quota: Awaited<ReturnType<StorageManager["estimate"]>>["quota"];
    expires: number;
  }>,
): Promise<Bucket> => {
  const prefix = `bucket_${name}#`;
  if (options?.persisted) navigator.storage.persist();

  const bucketIndexedDB = new Proxy(indexedDB, {
    get(target, p, receiver) {
      switch (p) {
        case "open": {
          const fn: typeof indexedDB.open = (name, version) => {
            return indexedDB.open(`${prefix}${name}`, version);
          };
          return fn;
        }
        case "deleteDatabase": {
          const fn: typeof indexedDB.deleteDatabase = (name) => {
            return indexedDB.deleteDatabase(`${prefix}${name}`);
          };
          return fn;
        }
        case "deleteDatabase": {
          const fn: typeof indexedDB.databases = () => {
            return getDatabases(prefix);
          };
          return fn;
        }
      }
      return Reflect.get(target, p, receiver);
    },
  });

  const createBlob: Bucket["createBlob"] = async (...args) => new Blob(...args);
  const createFile: Bucket["createFile"] = async (...args) => new File(...args);

  return {
    estimate: navigator.storage.estimate,

    indexedDB: bucketIndexedDB,
    caches,
    createBlob,
    createFile,
    getDirectory: navigator.storage.getDirectory,
    locks: navigator.locks,
  };
};

const del = async (name: string) => {
  const prefix = `bucket_${name}#`;
  const list = await getDatabases(prefix);
  const promises = list.map(({ name }) =>
    promisifyRequest(indexedDB.deleteDatabase(name!)),
  );
  return Promise.all(promises);
};

export { del as delete };

export interface StorageBuckets {
  open: typeof open;
  delete: typeof del;
  keys: () => Promise<string[]>;
}

export const storageBuckets: StorageBuckets =
  "storageBuckets" in navigator
    ? (navigator.storageBuckets as StorageBuckets)
    : {
        open,
        delete: del,
        async keys() {
          return [];
        },
      };
