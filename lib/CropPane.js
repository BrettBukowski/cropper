"use strict";

var Resizer = require('./Resizer'),
    overlay = require('./Overlay'),
    emitter = require('emitter');

module.exports = CropPane;

function CropPane (ratio) {
  this.ratio = this.setRatio(ratio);

  emitter(this);
}

CropPane.prototype = {
  draw: function (reference) {
    this.pane || (this._createPane(reference));
  },

  _createPane: function (reference) {
    var bounds = overlay(reference),
        el = document.createElement('div');

    el.style.position = 'absolute';
    el.style.zIndex = 101;
    el.style.height = bounds.height + 'px';
    el.style.width = bounds.width + 'px';
    el.style.top = bounds.y + 'px';
    el.style.left = bounds.x + 'px';

    this.parentBounds = reference.parentNode.insertBefore(el, reference);

    el = document.createElement('div');
    el.className = 'cropper-crop-pane';
    el.style.position = 'absolute';
    el.style.height = '100px';
    el.style.width = '100px';
    el.style.top = '30%';
    el.style.left = '30%';

    this.el = this.parentBounds.appendChild(el);

    this.emit('change', overlay(el));
  },

  setRatio: function (ratio) {

  },

  destroy: function () {

  }
};
