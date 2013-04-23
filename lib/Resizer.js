"use strict";

var bind = require('bind'),
    emitter = require('emitter'),
    overlay = require('./Overlay'),
    draggable = require('./Draggable');

module.exports = Resizer;

function Resizer (name, bounds) {
  this.name = name;

  emitter(this);
  draggable(this);

  this._init(bounds);
}

Resizer.prototype = {
  _init: function (bounds) {
    this.el = document.createElement('div');
    this.el.className = 'cropper-sizer cropper-sizer-' + this.name;

    this.makeDraggable(this.el, bounds);
  },

  /**
   * Hook method for Draggable interface.
   * @param  {Number} diffX Difference in x coordinates
   * @param  {Number} diffY Difference in y coordinates
   */
  onDrag: function (diffX, diffY) {
    // *Event move*
    this.emit('move', this.name, diffX, diffY);
  }
};
