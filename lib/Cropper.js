"use strict";

var CropPane = require('./CropPane.js');
var ImageCanvas = require('./ImageCanvas.js');
var emitter = require('emitter');
var bind = require('bind');

module.exports = Cropper;

/**
 * # Cropper
 * @param {Object} img     Image element to crop
 * @param {Object=}
 *
 * - options:
 *
 * - ratio: {String} none, square, 4:3, 5:2, 5:4, 3:2, 6:4, 7:5, 10:8, 16:9 (defaults to none)
 * - minWidth: {Number} Minimum width (px) of the cropped area (defaults to 20)
 * - minHeight: {Number} Minimum height (px) of the cropped area (defaults to 20)
 * - maxWidth: {Number} Maximum width (px) of the cropped area
 * - minHeight: {Number} Maximum height (px) of the cropped area
 * - defaultHeight: {Number} Default crop area height (px) (defaults to 100)
 * - defaultWidth: {Number} Default crop area width (px) (defaults to 100)
 *
 */
function Cropper (img, options) {
  options = this._defaultOptions(options || {});

  this.img = img;
  this.cropPane = new CropPane(options);
  this.canvas = new ImageCanvas(img);

  emitter(this);

  this._init();
}

Cropper.prototype = {
  _defaultOptions: function (supplied) {
    var defaults = {
      ratio:          'none',
      minWidth:       20,
      minHeight:      20,
      defaultWidth:   100,
      defaultHeight:  100
    },
    options = supplied;

    for (var i in defaults) {
      if (defaults.hasOwnProperty(i) && !(i in options)) {
        options[i] = defaults[i];
      }
    }

    return options;
  },

  _init: function () {

    this.canvas.draw();

    this.cropPane.on('change', bind(this, this._cropChange));
    this.cropPane.draw(this.img);
  },

  _cropChange: function (position) {
    this._croppedPosition = position;

    // **Change Event**
    this.emit('change', position);

    this.canvas.drawMask(position);
  },

  get: function (imageType) {
    return this.canvas.toDataUrl(this._croppedPosition, imageType);
  },

  setRatio: function (ratio) {
    this.cropPane.setRatio(ratio);
    this.cropPane.refresh();
  },

  destroy: function () {
    this.canvas.destroy();
    this.cropPane.destroy();

    this.canvas = this.cropPane = null;
  }
};

// Options
// - container: place inside this element instead of overlaying original image
//
// TK
// - Better touch support (ideally multi-touch radness)
