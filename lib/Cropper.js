"use strict";

var CropPane = require('./CropPane.js');
var ImageCanvas = require('./ImageCanvas.js');
var emitter = require('emitter');
var bind = require('bind');

module.exports = Cropper;

function Cropper (img, options) {
  options || (options = {});

  this.img = img;
  this.canvas = new ImageCanvas(img);
  this.cropPane = new CropPane(options.constrain);

  emitter(this);

  this._init();
}

Cropper.prototype = {
  _init: function () {

    this.canvas.draw();

    this.cropPane.on('change', bind(this, this._cropChange));
    this.cropPane.draw(this.img);
  },

  _cropChange: function (position) {
    this._croppedPosition = position;

    this.emit('change', position);

    this.canvas.drawMask(position);
  },

  get: function (imageType) {
    return this.canvas.toDataUrl(this._croppedPosition, imageType);
  }
};

// Tasks
// - Draw canvas on top of original image @done
// - Draw crop bounds @done
// - Darken area outside of crop bounds @done
// - Drage the crop area around @done
// - Produce cropped portion @done
// - Draggable edges
// - Constraints

// Options
// - constrain ratio: [none, square, 4:3, 5:2, 5:4, 3:2, 6:4, 7:5, 10:8, 16:9]
// - container: place inside this element instead of overlaying original image
// - desired default size for crop
