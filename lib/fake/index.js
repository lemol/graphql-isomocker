"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildCrudResolvers = exports.buildFakeCollection = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _faker = _interopRequireDefault(require("faker"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const buildFakeCollection = (known, getFake, count, idField = 'id', orderBy = null, orderKnow = false) => {
  const generated = _lodash.default.range(count).map(() => getFake(_faker.default.random.uuid()));

  const list = !orderBy ? [...known, ...generated] : [...(orderKnow ? [] : known), ..._lodash.default.sortBy([...(orderKnow ? known : []), ...generated], orderBy)];
  return _lodash.default.keyBy(list, idField);
};

exports.buildFakeCollection = buildFakeCollection;

const buildCrudResolvers = ({
  name,
  pluralName,
  repo
}) => ({
  Query: {
    [pluralName]: () => repo.findAll(),
    [name]: (_, {
      id
    }) => repo.findOne({
      id
    })
  },
  Mutation: {
    [`create${_lodash.default.upperFirst(name)}`]: (_, {
      item
    }) => repo.create(_objectSpread({
      id: _faker.default.random.uuid()
    }, item)),
    [`update${_lodash.default.upperFirst(name)}`]: (_, {
      id,
      item
    }) => repo.update(_objectSpread({
      id
    }, item)),
    [`remove${_lodash.default.upperFirst(name)}`]: (_, {
      id
    }) => repo.remove({
      id
    })
  }
});

exports.buildCrudResolvers = buildCrudResolvers;