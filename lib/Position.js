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
    var box = reference.getBoundingClientRect();

    return { x: box.left, y: box.top };
  }
};
