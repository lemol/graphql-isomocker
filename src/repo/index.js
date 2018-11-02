const runDelay = ms => act => new Promise((resolve, reject) => setTimeout(() => {
  try {
    const res = act();
    resolve(res);
  } catch(error) {
    reject(error);
  }
}, ms));
const toPromise = runDelay(0);
const randomNumber = (min, max) => Math.floor(Math.random() * max) + min;
const randomDelay = (min = 300, max = 1500) => runDelay(randomNumber(min, max));

const getDelay = (range) => range ? randomDelay(range.min, range.max) : toPromise;

export const findAll = ({ persistence, delay }) => where => getDelay(delay)(() => persistence.findAll(where));

export const findOne = ({ persistence, delay }) => where => getDelay(delay)(() => persistence.findOne(where));

export const create = ({ persistence, delay }) => item => getDelay(delay)(() => persistence.create(item));

export const update = ({ persistence, delay }) => item => getDelay(delay)(() => persistence.update(item));

export const remove = ({ persistence, delay }) => where => getDelay(delay)(() => persistence.remove(where));

export default (options) => ({
  create: create(options),
  update: update(options),
  findAll: findAll(options),
  findOne: findOne(options),
  remove: remove(options),
});
