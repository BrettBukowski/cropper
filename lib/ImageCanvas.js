"use strict";

var emit = require('emitter');

module.exports = ImageCanvas;

function ImageCanvas (img, options) {
  this.drawOnTopOf(img);
}

ImageCanvas.prototype = {
  _setStyles: function (el, styles) {
    for (var prop in styles) {
      if (styles.hasOwnProperty(prop)) {
        el.style[prop] = styles[prop];
      }
    }

    return el;
  },

  drawOnTopOf: function (img) {
    var canvas = this._setStyles(document.createElement('canvas'), {
      position: 'absolute',
      zIndex: 100,
      top: img.offsetTop + 'px',
      left: img.offsetLeft + 'px'
    });

    var imgStyle = window.getComputedStyle(img);
    canvas.height = parseFloat(imgStyle.getPropertyValue('height'));
    canvas.width = parseFloat(imgStyle.getPropertyValue('width'));
    canvas.className = 'cropper-canvas';

    canvas.getContext('2d').drawImage(img, 0, 0);

    return img.parentNode.insertBefore(canvas, img);
  },

  destroy: function () {

  }
};
