"use strict";

var overlay = require('./Overlay');

var setStyles = module.exports.setStyles = function (el, styles) {
  for (var prop in styles) {
    if (styles.hasOwnProperty(prop)) {
      el.style[prop] = styles[prop];
    }
  }

  return el;
};

var snap = module.exports.snap = function (el, source) {
  var bounds = overlay.relative(source);

  setStyles(el, {
    height: bounds.height + 'px',
    width:  bounds.width + 'px',
    top:    bounds.y + 'px',
    left:   bounds.x + 'px'
  });
};

module.exports.keepSnapped = function (el, source) {
  setInterval(function () {
    snap(el, source);
  }, 200);
};

module.exports.remove = function (el) {
  return el.parentNode.removeChild(el);
};

function getComputedStyle (el, style) {
  var computedStyle = window.getComputedStyle(el);

  return computedStyle.getPropertyValue(style);
}

module.exports.width = function (el) {
  return parseFloat(getComputedStyle(el, 'width'));
};

module.exports.height = function (el) {
  return parseFloat(getComputedStyle(el, 'height'));
};
