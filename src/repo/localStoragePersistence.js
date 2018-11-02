import _ from 'lodash';
import pureRepo from './';

let storage;
const dbName = name => `db:${name}`;
const dbVersion = name => `${dbName(name)}:version`;

export const initLocalStorage = (nodeStoragePath) => {
  if (nodeStoragePath /*typeof localStorage === 'undefined' || localStorage === null*/) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    storage = new LocalStorage(nodeStoragePath);
  } else {
    storage = localStorage;
  }
};

export const initStore = (name, data, rewrite = false, nodeStoragePath, currentVersion) => {
  initLocalStorage(nodeStoragePath);
  const dbData = storage.getItem(dbName(name));
  const version = storage.getItem(dbVersion(name));

  currentVersion = process.env.LOCAL_STORAGE_VERSION || currentVersion || '2fce8454-992b-4b86-87a0-400622552c83';

  if (dbData == null || rewrite || version !== currentVersion) {
    writeStore(name, data);
    storage.setItem(dbVersion(name), currentVersion);
  }
}

export const writeStore = (name, data) => {
  storage.setItem(dbName(name), JSON.stringify(data));
};

export const readStore = name => {
  const dbData = storage.getItem(dbName(name));
  return JSON.parse(dbData);
};

export default class LocalStoragePersistence {
  constructor({ name, defaultData, restartStore, nodeStoragePath, currentVersion }) {
    this.name = name;
    initStore(name, defaultData, restartStore, nodeStoragePath, currentVersion);
  }

  findAll(where = () => true) {
    return _.values(readStore(this.name)).filter(where);
  }

  findOne(where) {
    return readStore(this.name)[where.id];
  }

  create(item) {
    const currentData = readStore(this.name);
    const dbItem = currentData[item.id];

    if (dbItem) {
      throw new Error(`Item with id=${item.id} exists in ${this.name}.`);
    }

    const newData = {
      ...currentData,
      [item.id]: item,
    };

    writeStore(this.name, newData);
    return item;
  }

  update(item) {
    const currentData = readStore(this.name);
    const dbItem = currentData[item.id];

    if (!dbItem) {
      throw new Error(`Item with id=${item.id} not found on ${this.name}.`);
    }

    const newData = _.merge(currentData, { [item.id]: { ...dbItem, ...item } });

    writeStore(this.name, newData);
    return item;
  }

  remove(where) {
    const dbItem = this.findOne(where);

    if (!dbItem) {
      throw new Error(`Item with id=${where.id} not found on db:${this.name}.`);
    }

    const currentData = readStore(this.name);

    const newData = { ...currentData, [where.id]: null };

    delete newData[where.id];
    writeStore(this.name, newData);
  }
}

export const buildRepo = ({ nodeStoragePath, currentVersion, resetStore, delay }) => ({
  name,
  getData,
}) => {
  const defaultData = getData();
  const options = {
    delay,
    persistence: new LocalStoragePersistence({ name, defaultData, resetStore, nodeStoragePath, currentVersion })
  };
  return pureRepo(options);
};
