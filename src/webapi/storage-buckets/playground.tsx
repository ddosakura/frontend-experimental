import { useEffect, useMemo, useState } from "react";

import { createStore } from "./idb-keyval";
import { clear, del, get, set, type UseStore } from "idb-keyval";

import { storageBuckets } from "./ponyfill";

const StoreActions: React.FC<{
  store: UseStore;
}> = ({ store }) => {
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  return (
    <div className="border border-solid border-red">
      <button onClick={() => clear(store)}>clear</button>
      <div>
        <input
          value={name}
          onChange={(ev) => setName((ev.target as HTMLInputElement).value)}
        />
        <button onClick={() => get(name, store).then((v) => setValue(v ?? ""))}>
          get
        </button>
        <button onClick={() => del(name, store)}>
          del
        </button>
      </div>
      <div>
        <input
          value={value}
          onChange={(ev) => setValue((ev.target as HTMLInputElement).value)}
        />
        <button onClick={() => set(name, value, store)}>
          set
        </button>
      </div>
    </div>
  );
};

const StoreContainer: React.FC<{
  indexedDB: IDBFactory;
}> = ({ indexedDB }) => {
  const [name, setName] = useState("");
  const [storeName, open] = useState("");
  const store = useMemo(
    () => storeName ? createStore(storeName, indexedDB) : null,
    [storeName],
  );

  return (
    <div className="flex-1 border border-solid border-green">
      <h3>StoreContainer [{storeName}]</h3>
      <input
        value={name}
        onChange={(ev) => setName((ev.target as HTMLInputElement).value)}
      />
      <button onClick={() => open(name)}>
        open
      </button>
      {store && <StoreActions store={store} />}
    </div>
  );
};

const StorageBucket: React.FC = () => {
  const [name, setName] = useState("");
  const [bucketName, open] = useState("");
  const [indexedDB, setIndexedDB] = useState<IDBFactory>();
  useEffect(() => {
    storageBuckets.open(bucketName).then((b) => setIndexedDB(b.indexedDB));
    return () => setIndexedDB(undefined);
  }, [bucketName]);

  return (
    <div className="flex-1 border border-solid border-blue">
      <h2>StorageBucket [{bucketName}]</h2>
      <input
        value={name}
        onChange={(ev) => setName((ev.target as HTMLInputElement).value)}
      />
      <button onClick={() => open(name)}>open</button>
      {indexedDB && (
        <div className="flex">
          <StoreContainer indexedDB={indexedDB} />
          <StoreContainer indexedDB={indexedDB} />
        </div>
      )}
    </div>
  );
};

const PlaygroundExample: React.FC = () => {
  return (
    <div>
      <h1>Storage Buckets API</h1>
      <StoreContainer indexedDB={indexedDB} />
      <div className="flex">
        <StorageBucket />
        <StorageBucket />
      </div>
    </div>
  );
};

export default PlaygroundExample;
