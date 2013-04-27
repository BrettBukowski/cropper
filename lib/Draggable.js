"use strict";

module.exports = Draggable;

var bind = require('bind');

function mixin (obj) {
  for (var i in Draggable.prototype) {
    if (i === 'onDrag' && i in obj) continue;

    obj[i] = Draggable.prototype[i];
  }

  return obj;
}

/**
 * Adds `document.scrollLeft` and `document.scrollTop`
 * onto the given coordinates.
 * @param  {Number} x
 * @param  {Number} y
 * @return {Object}  Has x, y properties
 */
function truePosition (x, y) {
  var docEl = document.documentElement;

  return {
    x: x + docEl.scrollLeft,
    y: y + docEl.scrollTop
  };
}

function subscribe (element, eventMap, context) {
  for (var evt in eventMap) {
    if (eventMap.hasOwnProperty(evt)) {
      element.addEventListener(evt, bind(context, eventMap[evt]));
    }
  }
}

/**
 * May be used as a mixin or instantiated
 * by itself.
 * @param {Object} obj Attach prototype props onto
 */
function Draggable (obj) {
  if (obj) {
    return mixin(obj);
  }
}

Draggable.prototype = {
  makeDraggable: function (el, bounds) {
    subscribe(el, {
      mouseup:      this.onMouseUp,
      mousedown:    this.onMouseDown
    }, this);

    subscribe(bounds, {
      mouseup:      this.onMouseUp,
      mouseout:     this.onMouseOut,
      mousemove:    this.onMouseMove
    }, this);
  },

  onMouseOut: function (e) {
    var mouse = truePosition(e.clientX, e.clientY),
        bounds = e.currentTarget.getBoundingClientRect();

    if (mouse.x <= bounds.left || mouse.x >= bounds.right || mouse.y <= bounds.top || mouse.y >= bounds.bottom) {
      this.onMouseUp(e);
    }
    else {
      // The rest of the subscribers don't need to care.
      e.stopPropagation();
    }
  },

  onMouseUp: function (e) {
    this._dragging = false;
    e.preventDefault();
  },

  onMouseDown: function (e) {
    if (e.button !== 0) return this.onMouseUp(e);

    this._dragging = true;

    this.lastMouse = truePosition(e.clientX, e.clientY);

    e.stopPropagation();
    e.preventDefault();
  },

  onMouseMove: function (e) {
    if (!this._dragging) return;

    e.preventDefault();

    var currentPosition = truePosition(e.clientX, e.clientY),
        diffX = currentPosition.x - this.lastMouse.x,
        diffY = currentPosition.y - this.lastMouse.y;

    this.lastMouse = currentPosition;

    this.onDrag(diffX, diffY);
  },

  /**
   * Callers should implement this method.
   */
  onDrag: function (diffX, diffY) {
    console.log("Hook method called onDrag should be implemented");
    console.log(diffX + ', ' + diffY);
  }
};
