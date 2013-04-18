var Cropper = require('cropper');

describe('Cropper', function () {
  var img = document.querySelector('img');

  describe('constructor', function () {
    it('Throws an error if not given an image', function () {
      expect(function () { new Cropper; }).to.throw();
    });

    it('Lays a canvas on top of the given image', function () {
        var imgStyle = window.getComputedStyle(img);
        var crop = new Cropper(img);
        var canvas = document.querySelector('canvas.cropper-canvas');

        expect(canvas).to.be.ok;
        expect(document.querySelector('.cropper-crop-pane')).to.be.ok;
        expect(canvas.height).to.equal(parseFloat(imgStyle.getPropertyValue('height')));
        expect(canvas.width).to.equal(parseFloat(imgStyle.getPropertyValue('width')));
        expect(parseFloat(canvas.style.top)).to.equal(img.offsetTop);
        expect(parseFloat(canvas.style.left)).to.equal(img.offsetLeft);

        crop.destroy();
    });
  });

  describe('destroy', function () {
    it('Removes all trace', function () {
        var crop = new Cropper(img);

        expect(document.querySelector('canvas.cropper-canvas')).to.be.ok;
        expect(document.querySelector('.cropper-crop-pane')).to.be.ok;

        crop.destroy();

        expect(document.querySelector('canvas.cropper-canvas')).to.not.be.ok;
        expect(document.querySelector('.cropper-crop-pane')).to.not.be.ok;
    });
  });
});
