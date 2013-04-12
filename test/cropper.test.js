var Cropper = require('cropper');

describe('Cropper', function () {
  describe('constructor', function () {
    it('Throws an error if not given an image', function () {
      expect(function () { new Cropper; }).to.throw();
    });

    it('Lays a canvas on top of the given image', function () {
        var img = document.querySelector('img');
        var imgStyle = window.getComputedStyle(img);
        var crop = new Cropper(img);
        var canvas = document.querySelector('canvas.cropper-canvas');

        expect(canvas).to.be.ok;
        expect(canvas.height).to.equal(parseFloat(imgStyle.getPropertyValue('height')));
        expect(canvas.width).to.equal(parseFloat(imgStyle.getPropertyValue('width')));
        expect(parseFloat(canvas.style.top)).to.equal(img.offsetTop);
        expect(parseFloat(canvas.style.left)).to.equal(img.offsetLeft);
    });
  });
});
