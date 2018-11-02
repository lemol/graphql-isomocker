"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildRepo = exports.default = exports.readStore = exports.writeStore = exports.initStore = exports.initLocalStorage = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _2 = _interopRequireDefault(require("./"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

let storage;

const dbName = name => `db:${name}`;

const dbVersion = name => `${dbName(name)}:version`;

const initLocalStorage = nodeStoragePath => {
  if (nodeStoragePath
  /*typeof localStorage === 'undefined' || localStorage === null*/
  ) {
      var LocalStorage = require('node-localstorage').LocalStorage;

      storage = new LocalStorage(nodeStoragePath);
    } else {
    storage = localStorage;
  }
};

exports.initLocalStorage = initLocalStorage;

const initStore = (name, data, rewrite = false, nodeStoragePath, currentVersion) => {
  initLocalStorage(nodeStoragePath);
  const dbData = storage.getItem(dbName(name));
  const version = storage.getItem(dbVersion(name));
  currentVersion = process.env.LOCAL_STORAGE_VERSION || currentVersion || '2fce8454-992b-4b86-87a0-400622552c83';

  if (dbData == null || rewrite || version !== currentVersion) {
    writeStore(name, data);
    storage.setItem(dbVersion(name), currentVersion);
  }
};

exports.initStore = initStore;

const writeStore = (name, data) => {
  storage.setItem(dbName(name), JSON.stringify(data));
};

exports.writeStore = writeStore;

const readStore = name => {
  const dbData = storage.getItem(dbName(name));
  return JSON.parse(dbData);
};

exports.readStore = readStore;

class LocalStoragePersistence {
  constructor({
    name,
    defaultData,
    restartStore,
    nodeStoragePath,
    currentVersion
  }) {
    this.name = name;
    initStore(name, defaultData, restartStore, nodeStoragePath, currentVersion);
  }

  findAll(where = () => true) {
    return _lodash.default.values(readStore(this.name)).filter(where);
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

    const newData = _objectSpread({}, currentData, {
      [item.id]: item
    });

    writeStore(this.name, newData);
    return item;
  }

  update(item) {
    const currentData = readStore(this.name);
    const dbItem = currentData[item.id];

    if (!dbItem) {
      throw new Error(`Item with id=${item.id} not found on ${this.name}.`);
    }

    const newData = _lodash.default.merge(currentData, {
      [item.id]: _objectSpread({}, dbItem, item)
    });

    writeStore(this.name, newData);
    return item;
  }

  remove(where) {
    const dbItem = this.findOne(where);

    if (!dbItem) {
      throw new Error(`Item with id=${where.id} not found on db:${this.name}.`);
    }

    const currentData = readStore(this.name);

    const newData = _objectSpread({}, currentData, {
      [where.id]: null
    });

    delete newData[where.id];
    writeStore(this.name, newData);
  }

}

exports.default = LocalStoragePersistence;

const buildRepo = ({
  nodeStoragePath,
  currentVersion,
  resetStore,
  delay
}) => ({
  name,
  getData
}) => {
  const defaultData = getData();
  const options = {
    delay,
    persistence: new LocalStoragePersistence({
      name,
      defaultData,
      resetStore,
      nodeStoragePath,
      currentVersion
    })
  };
  return (0, _2.default)(options);
};

exports.buildRepo = buildRepo;