"use strict";

var emit = require('emitter'),
    domTool = require('./DOMTools'),
    overlay = require('./Overlay');

module.exports = ImageCanvas;

function ImageCanvas (img, options) {
  this.img = img;
  this.options = options;
}

ImageCanvas.prototype = {
  draw: function () {
    var overlayInfo = overlay.relative(this.img),
        canvas = domTool.setStyles(document.createElement('canvas'), {
          position:   'absolute',
          zIndex:     100,
          top:        overlayInfo.y + 'px',
          left:       overlayInfo.x + 'px'
        });

    canvas.height = overlayInfo.height;
    canvas.width = overlayInfo.width;
    canvas.className = 'cropper-canvas';

    domTool.keepSnapped(canvas, this.img);

    this.ctx = canvas.getContext('2d');

    this.ctx.drawImage(this.img, 0, 0);

    this.canvas = this.img.parentNode.insertBefore(canvas, this.img);

    return this;
  },

  mask: function () {
    // this.ctx.fillStyle = 'rgba(0, 0, 0, .5)';
    // this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  },

  clear: function (position) {
    // this.ctx.globalCompositeOperation = 'source-atop';
    // this.ctx.globalCompositeOperation = 'lighter';
    // this.ctx.fillStyle = 'rgba(255, 255, 255, .5)';
    // this.ctx.fillStyle = 'transparent';
    // this.ctx.fillRect(position.x, position.y, position.width, position.height);
    // this.ctx.clearRect(position.x, position.y, position.width, position.height);
    this.ctx.fillStyle = 'rgba(0, 0, 0, .5)';
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillRect(0, 0, position.x, this.canvas.height);
    this.ctx.fillRect(position.x, 0, position.width, position.y);
    this.ctx.fillRect(position.x, position.height + position.y, position.width, this.canvas.height);
    this.ctx.fillRect(position.width + position.x, 0, this.canvas.width, this.canvas.height);
  },

  destroy: function () {

  }
};
