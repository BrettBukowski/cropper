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
  makeDraggable: function (el) {
    subscribe(el, {
      mousedown:    this.onMouseDown,
      mousemove:    this.onMouseMove,
      mouseup:      this.onMouseUpAndOut,
      mouseout:     this.onMouseUpAndOut
    }, this);
  },

  onMouseUpAndOut: function (e) {
    this._dragging = false;

    e.stopPropagation();
    e.preventDefault();
  },

  onMouseDown: function (e) {
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
