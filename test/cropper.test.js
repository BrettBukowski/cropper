var Cropper = require('cropper');

describe('Cropper', function () {
  describe('constructor', function () {
    it('Throws an error if not given an image', function () {
      expect(function () { new Cropper; }).to.throw();
    });

    it('Lays a canvas on top of the given image', function () {
        var crop = new Cropper(document.querySelector('img'));
        var canvas = document.querySelector('canvas.cropper-canvas');
        expect(canvas).to.be.ok;
    });
  });
});
