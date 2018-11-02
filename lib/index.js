"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "buildFakeCollection", {
  enumerable: true,
  get: function () {
    return _fake.buildFakeCollection;
  }
});
Object.defineProperty(exports, "buildCrudResolvers", {
  enumerable: true,
  get: function () {
    return _fake.buildCrudResolvers;
  }
});
Object.defineProperty(exports, "buildRepo", {
  enumerable: true,
  get: function () {
    return _localStoragePersistence.buildRepo;
  }
});

var _fake = require("./fake");

var _localStoragePersistence = require("./repo/localStoragePersistence");