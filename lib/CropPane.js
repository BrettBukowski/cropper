"use strict";

var Resizer = require('./Resizer'),
    overlay = require('./Overlay'),
    domTool = require('./DOMTools'),
    draggable = require('./Draggable'),
    emitter = require('emitter'),
    bind = require('bind');

module.exports = CropPane;

function CropPane (ratio) {
  this.ratio = this.setRatio(ratio);

  emitter(this);
  draggable(this);
}

CropPane.prototype = {
  draw: function (reference) {
    this.pane || (this._createPane(reference));
  },

  _keepInBounds: function (coordinate, max) {
    coordinate = Math.max(coordinate, 0);
    coordinate = Math.min(coordinate, max);

    return coordinate;
  },

  moveTo: function (x, y) {
    var movement = {},
        currentSize = overlay.relative(this.el);

    if (typeof x === 'number') {
      movement.left = this._keepInBounds(x, domTool.width(this.parentBounds) - currentSize.width)  + 'px';
    }
    if (typeof y === 'number') {
      movement.top = this._keepInBounds(y, domTool.height(this.parentBounds) - currentSize.height) + 'px';
    }

    this._performTransform(movement);
  },

  setRatio: function (ratio) {

  },

  destroy: function () {
    domTool.remove(this.parentBounds);
    domTool.remove(this.el);

    this.parentBounds = this.el = null;
  },

  _performTransform: function (changes) {
    domTool.setStyles(this.el, changes);
    this.emit('change', overlay.relative(this.el));
  },

  _createPane: function (reference) {
    this.parentBounds = this._createBounds(reference);

    var el = document.createElement('div');
    el.className = 'cropper-crop-pane';

    domTool.setStyles(el, {
      position: 'absolute',
      height:   '100px',
      width:    '100px',
      top:      '100px',
      left:     '100px'
    });

    this.makeDraggable(el);
    this._addResizers(el);

    this.el = this.parentBounds.appendChild(el);
    this.emit('change', overlay.relative(el));
  },


  /**
   * Hook method for Draggable interface.
   * @param  {Number} diffX Difference in x coordinates
   * @param  {Number} diffY Difference in y coordinates
   */
  onDrag: function (diffX, diffY) {
    var newX, newY;

    if (diffX) {
      newX = parseFloat(this.el.style.left) + diffX;
    }
    if (diffY) {
      newY = parseFloat(this.el.style.top) + diffY;
    }

    this.moveTo(newX, newY);
  },

  _addResizers: function (el) {
    for (var i = 0, regions = ['ne', 'se', 'nw', 'sw'], len = regions.length, sizer; i < len; i++) {
      sizer = new Resizer(regions[i]);
      sizer.on('move', bind(this, this._onResize));
      el.appendChild(sizer.el);
    }
  },

  _onResize: function (region, x, y) {
    var currentPosition = overlay.relative(this.el),
        operations = this._bounds[region],
        transform = {};

    for (var bound in operations) {
      if (operations.hasOwnProperty(bound)) {
        transform[bound] = this._bounds[bound](currentPosition, x, y, operations[bound]);
      }
    }

    this._performTransform(transform);
  },

  _bounds: {
    ne: {
      width:  1,
      top:    1,
      height: -1
    },
    se: {
      height: 1,
      width:  1
    },
    nw: {
      top:    1,
      height: -1,
      left:   1,
      width:  -1
    },
    sw: {
      height: 1,
      left:   1,
      width:  -1
    },

    width: function (currentPosition, x, y, direction) {
      return currentPosition.width + (x * direction) + 'px';
    },
    height: function (currentPosition, x, y, direction) {
      return currentPosition.height + (y * direction) + 'px';
    },
    top: function (currentPosition, x, y, direction) {
      return currentPosition.y + (y * direction) + 'px';
    },
    left: function (currentPosition, x, y, direction) {
      return currentPosition.x + (x * direction) + 'px';
    }
  },

  _createBounds: function (reference) {
    var el = document.createElement('div');

    domTool.setStyles(el, {
      position: 'absolute',
      zIndex:   101
    });
    domTool.keepSnapped(el, reference);

    return reference.parentNode.insertBefore(el, reference);
  }
};
