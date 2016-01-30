'use strict';

/* global localStorage */

module.exports = {
  read: function read(source) {
    var deserialize = arguments.length <= 1 || arguments[1] === undefined ? JSON.parse : arguments[1];

    var data = localStorage.getItem(source);
    if (data) {
      return deserialize(data);
    } else {
      localStorage.setItem(source, '{}');
      return {};
    }
  },
  write: function write(dest, obj) {
    var serialize = arguments.length <= 2 || arguments[2] === undefined ? JSON.stringify : arguments[2];
    return localStorage.setItem(dest, serialize(obj));
  }
};