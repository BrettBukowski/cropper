"use strict";

var overlay = require('./Overlay');

function setStyles (el, styles) {
  for (var prop in styles) {
    if (styles.hasOwnProperty(prop)) {
      el.style[prop] = styles[prop];
    }
  }

  return el;
}

function snap (el, source) {
  var bounds = overlay.relative(source);

  setStyles(el, {
    height: bounds.height + 'px',
    width:  bounds.width + 'px',
    top:    bounds.y + 'px',
    left:   bounds.x + 'px'
  });
}

module.exports = {
  setStyles:   setStyles,
  keepSnapped: function (el, source) {
    setInterval(function () {
      snap(el, source);
    }, 200);
  }
};
