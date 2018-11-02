"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.remove = exports.update = exports.create = exports.findOne = exports.findAll = void 0;

const runDelay = ms => act => new Promise((resolve, reject) => setTimeout(() => {
  try {
    const res = act();
    resolve(res);
  } catch (error) {
    reject(error);
  }
}, ms));

const toPromise = runDelay(0);

const randomNumber = (min, max) => Math.floor(Math.random() * max) + min;

const randomDelay = (min = 300, max = 1500) => runDelay(randomNumber(min, max));

const getDelay = range => range ? randomDelay(range.min, range.max) : toPromise;

const findAll = ({
  persistence,
  delay
}) => where => getDelay(delay)(() => persistence.findAll(where));

exports.findAll = findAll;

const findOne = ({
  persistence,
  delay
}) => where => getDelay(delay)(() => persistence.findOne(where));

exports.findOne = findOne;

const create = ({
  persistence,
  delay
}) => item => getDelay(delay)(() => persistence.create(item));

exports.create = create;

const update = ({
  persistence,
  delay
}) => item => getDelay(delay)(() => persistence.update(item));

exports.update = update;

const remove = ({
  persistence,
  delay
}) => where => getDelay(delay)(() => persistence.remove(where));

exports.remove = remove;

var _default = options => ({
  create: create(options),
  update: update(options),
  findAll: findAll(options),
  findOne: findOne(options),
  remove: remove(options)
});

exports.default = _default;