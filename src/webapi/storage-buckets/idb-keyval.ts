import { type UseStore, promisifyRequest } from "idb-keyval";

export function createStore(
  name: string,
  idb: typeof indexedDB = indexedDB,
  options?: IDBTransactionOptions,
): UseStore {
  const request = idb.open(name);
  request.onupgradeneeded = () => request.result.createObjectStore(name);
  const dbp = promisifyRequest(request);

  return (txMode, callback) =>
    dbp.then((db) =>
      callback?.(db.transaction(name, txMode, options).objectStore(name)),
    );
}
