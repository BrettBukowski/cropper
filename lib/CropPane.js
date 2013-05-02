"use strict";

var Resizer = require('./Resizer'),
    Position = require('./Position'),
    domTool = require('./DOMTools'),
    draggable = require('./Draggable'),
    emitter = require('emitter'),
    bind = require('bind');

module.exports = CropPane;

/**
 * # CropPane
 * @param {Object} options Options hash
 */
function CropPane (options) {
  this.options = options;

  this.setRatio(this.options.ratio);

  emitter(this);
  draggable(this);
}

CropPane.prototype = {
  /**
   * Draws the pane for the first time.
   * @param  {Object} reference Parent element
   */
  draw: function (reference) {
    this.el || (this._createPane(reference));
  },

  /**
   * Moves to the given coordinates.
   * @param  {Number=} x
   * @param  {Number=} y
   */
  moveTo: function (x, y) {
    var movement = {};

    if (typeof x === 'number') {
      movement.left = x + 'px';
    }
    if (typeof y === 'number') {
      movement.top = y + 'px';
    }

    this.refresh(movement);
  },

  /**
   * Sets the ratio.
   * @param {String} ratio none|square|number:number
   */
  setRatio: function (ratio) {
    ratio = ratio.toString().toLowerCase();

    if (ratio === 'none' || ratio === 'square') {
      this.ratio = ratio;
    }
    else if (/^\d{1,2}:\d{1,2}$/.test(ratio)) {
      var split = ratio.split(':');
      this.ratio = parseInt(split[0], 10) / parseInt(split[1], 10);
    }
    else {
      throw new TypeError("Don't know what to do with " + ratio);
    }
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

  /**
   * Redraws with the given transforms.
   * @param  {Object=} changes CSS styles to change (if any)
   */
  refresh: function (changes) {
    this._performTransform(changes);
    // **Change Event**
    this.emit('change', Position.relative(this.el));
  },

  destroy: function () {
    domTool.remove(this.parentBounds);
    domTool.remove(this.el);

    this.parentBounds = this.el = null;
  },

  _keepInBounds: function (coordinate, max, min) {
    coordinate = parseFloat(coordinate);
    coordinate = Math.max(coordinate, min || 0);
    coordinate = Math.min(coordinate, max || Number.MAX_VALUE);

    return coordinate;
  },

  /**
   * Modifies the height attribute to properly conform to
   * the current crop ratio.
   * @param  {Object=} pendingTransforms Transforms to be applied (if any)
   * @return {Object=} Object with modified height property or pendingTransforms
   */
  _enforceRatio: function (pendingTransforms) {
    var currentWidth = (pendingTransforms) ?
            parseFloat(pendingTransforms.width) :
            Position.relative(this.el).width,
        newHeight,
        ratio = this.ratio;

    if (ratio === 'square') {
      newHeight = currentWidth;
    }
    else if (typeof ratio === 'number') {
      newHeight = currentWidth / ratio;
    }
    if (newHeight) {
      pendingTransforms || (pendingTransforms = {});
      pendingTransforms.height = newHeight + 'px';
    }

    return pendingTransforms;
  },

  _enforceBounds: function (pendingTransforms) {
    var currentSize = Position.relative(this.el),
        bounds = {
          left:   { parent: 'width', self: 'width' },
          width:  { parent: 'width', self: 'x' },
          top:    { parent: 'height', self: 'height' },
          height: { parent: 'height', self: 'y' }
        },
        bound,
        boundCalculation;

    for (bound in bounds) {
      if (bounds.hasOwnProperty(bound) && bound in pendingTransforms) {
        boundCalculation = bounds[bound];
        pendingTransforms[bound] = this._keepInBounds(pendingTransforms[bound], domTool[boundCalculation.parent](this.parentBounds) - currentSize[boundCalculation.self]) + 'px';
      }
    }

    return pendingTransforms;
  },

  _enforceSize: function (pendingTransforms) {
    if ('width' in pendingTransforms) {
      pendingTransforms.width = this._keepInBounds(pendingTransforms.width, this.options.maxWidth, this.options.minWidth) + 'px';
    }
    if ('height' in pendingTransforms) {
      pendingTransforms.height = this._keepInBounds(pendingTransforms.height, this.options.maxHeight, this.options.minHeight) + 'px';
    }

    return pendingTransforms;
  },

  _performTransform: function (changes) {
    changes = this._enforceRatio(changes);

    if (changes) {
      changes = this._enforceBounds(changes);
      changes = this._enforceSize(changes);

      domTool.setStyles(this.el, changes);
    }
  },

  _createPane: function (reference) {
    this.parentBounds = this._createBounds(reference);
    var parentSize = Position.relative(this.parentBounds);

    var el = document.createElement('div');
    el.className = 'cropper-crop-pane';

    this.el = this.parentBounds.appendChild(el);
    this._performTransform({
      position: 'absolute',
      height:   this.options.defaultHeight + 'px',
      width:    this.options.defaultWidth + 'px',
      top:      (parentSize.height / 2) - (this.options.defaultHeight / 2) + 'px',
      left:     (parentSize.width / 2) - (this.options.defaultWidth / 2) + 'px'
    });

    this.makeDraggable(el, this.parentBounds);
    this._addResizers(el);

    this.refresh();
  },

  _addResizers: function (el) {
    for (var i = 0, regions = ['ne', 'se', 'nw', 'sw'], len = regions.length, sizer; i < len; i++) {
      sizer = new Resizer(regions[i], this.parentBounds);
      sizer.on('move', bind(this, this._onResize));
      el.appendChild(sizer.el);
    }
  },

  /**
   * Handler for resizer's 'move' event.
   * @param  {String} region ne, se, nw, sw
   * @param  {Number} x      Delta x
   * @param  {Number} y      Delta y
   */
  _onResize: function (region, x, y) {
    var currentPosition = Position.relative(this.el),
        operations = this._bounds[region],
        transform = {};

    for (var bound in operations) {
      if (operations.hasOwnProperty(bound)) {
        transform[bound] = this._bounds[bound](currentPosition, x, y, operations[bound]);
      }
    }

    this.refresh(transform);
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
