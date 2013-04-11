"use strict";

var CropPane = require('./CropPane.js');
var ImageCanvas = require('./ImageCanvas.js');
var emit = require('emitter');

module.exports = Cropper;

function Cropper (img, options) {
  this.canvas = new ImageCanvas(img);
}
Cropper.prototype = {

};

// Tasks
// - Draw canvas on top of original image
// - Draw crop bounds
// - Produce cropped portion
// - Darken area outside of crop bounds
// - Draggable edges
// - Constraints

// Options
// - constrain ratio: [none, square, 4:3, 5:2, 5:4, 3:2, 6:4, 7:5, 10:8, 16:9]
// - container: place inside this element instead of overlaying original image