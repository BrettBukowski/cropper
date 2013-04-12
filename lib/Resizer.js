"use strict";

var emit = require('emitter');

module.exports = Resizer;

function Resizer (position) {
  this.position = position;

  this._init();
}

Resizer.prototype = {
  _init: function () {
    this.el = document.createElement('div');
    this.el.className = 'cropper-sizer cropper-sizer-' + this.name;
  }
};
