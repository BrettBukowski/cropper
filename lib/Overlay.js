"use strict";

module.exports = function (reference) {
  var computedStyle = window.getComputedStyle(reference);

  return {
    x: reference.offsetLeft,
    y: reference.offsetTop,
    width: parseFloat(computedStyle.getPropertyValue('width')),
    height: parseFloat(computedStyle.getPropertyValue('height'))
  };
};
