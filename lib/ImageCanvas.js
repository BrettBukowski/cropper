"use strict";

var emit = require('emitter'),
    domTool = require('./DOMTools'),
    overlay = require('./Overlay');

module.exports = ImageCanvas;

function ImageCanvas (img, options) {
  this.img = img;
  this.options = options;
  this._create(img);
}

ImageCanvas.prototype = {
  draw: function () {
    this.ctx.drawImage(this.img, 0, 0);

    return this;
  },

  unmask: function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    return this;
  },

  drawMask: function (area) {
    // None of the global composite effects do what I need.
    // So: draw four rectangles around the crop area.
    this.unmask().draw();

    this.ctx.fillStyle = 'rgba(0, 0, 0, .5)';
    this.ctx.fillRect(0, 0, area.x, this.canvas.height);
    this.ctx.fillRect(area.x, 0, area.width, area.y);
    this.ctx.fillRect(area.x, area.height + area.y, area.width, this.canvas.height);
    this.ctx.fillRect(area.width + area.x, 0, this.canvas.width, this.canvas.height);

    return this;
  },

  /**
   *
   * @return {String} DataUri
   * @throws {SecurityError} DOM Exception 18 if the image is
   * from a different, non CORS proxy
   */
  toDataUrl: function (area, imageType) {
    var canvas = document.createElement('canvas');
    canvas.width = area.width;
    canvas.height = area.height;
    canvas.getContext('2d').drawImage(this.canvas, area.x, area.y, area.width, area.height, 0, 0, area.width, area.height);

    return canvas.toDataURL(imageType || 'image/png');
  },

  destroy: function () {
    domTool.remove(this.canvas);

    this.ctx = this.canvas = null;

    return this;
  },

  _create: function (img) {
    var overlayInfo = overlay.relative(img),
        canvas = domTool.setStyles(document.createElement('canvas'), {
          position:   'absolute',
          zIndex:     100,
          top:        overlayInfo.y + 'px',
          left:       overlayInfo.x + 'px'
        });

    canvas.height = overlayInfo.height;
    canvas.width = overlayInfo.width;
    canvas.className = 'cropper-canvas';

    domTool.keepSnapped(canvas, img);

    this.ctx = canvas.getContext('2d');
    this.canvas = img.parentNode.insertBefore(canvas, img);
  }
};
