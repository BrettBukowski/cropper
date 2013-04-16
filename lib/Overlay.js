"use strict";

module.exports = {
  relative: function (reference) {
    var computedStyle = window.getComputedStyle(reference);

    return {
      x: reference.offsetLeft,
      y: reference.offsetTop,
      width: parseFloat(computedStyle.getPropertyValue('width')),
      height: parseFloat(computedStyle.getPropertyValue('height'))
    };
  },

  absolute: function (reference) {
    var x = reference.offsetLeft,
        y = reference.offsetTop,
        parent = reference.offsetParent;

    while (parent) {
      x += parent.offsetLeft;
      y += parent.offsetTop;
      parent = parent.offsetParent;
    }

    return { x: x, y: y };
  }
};
