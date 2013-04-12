"use strict";

var emit = require('emitter'),
    overlay = require('./Overlay');

module.exports = ImageCanvas;

function ImageCanvas (img, options) {
  this.img = img;
  this.options = options;
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

  draw: function () {
    var overlayInfo = overlay(this.img),
        canvas = this._setStyles(document.createElement('canvas'), {
          position:   'absolute',
          zIndex:     100,
          top:        overlayInfo.y + 'px',
          left:       overlayInfo.x + 'px'
        });

    canvas.height = overlayInfo.height;
    canvas.width = overlayInfo.width;
    canvas.className = 'cropper-canvas';

    this.ctx = canvas.getContext('2d');

    this.ctx.drawImage(this.img, 0, 0);

    this.canvas = this.img.parentNode.insertBefore(canvas, this.img);

    return this;
  },

  mask: function () {
    this.ctx.fillStyle = 'rgba(0, 0, 0, .5)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  },

  clear: function (position) {
    // this.ctx.globalCompositeOperation = 'lighter';
    // this.ctx.fillStyle = 'rgba(255, 255, 255, .1)';
    // this.ctx.fillStyle = 'transparent';
    // this.ctx.fillRect(position.x, position.y, position.width, position.height);
    this.ctx.clearRect(position.x, position.y, position.width, position.height);
    // this.img.parentNode.removeChild(this.img);
  },

  destroy: function () {

  }
};
