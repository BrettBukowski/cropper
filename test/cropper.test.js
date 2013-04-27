var Cropper = require('cropper');

describe('Cropper', function () {
  var img = document.querySelector('img');

  function cropPaneSize () {
    return document.querySelector('.cropper-crop-pane').getBoundingClientRect();
  }

  afterEach(function () {
    if (this.crop) {
      this.crop.destroy();
      this.crop = null;
    }
  });

  describe('constructor', function () {
    it('Throws an error if not given an image', function () {
      expect(function () { new Cropper; }).to.throw();
    });

    it('Lays a canvas on top of the given image', function () {
        var imgStyle = window.getComputedStyle(img);
        this.crop = new Cropper(img);
        var canvas = document.querySelector('canvas.cropper-canvas');

        expect(canvas).to.be.ok;
        expect(document.querySelector('.cropper-crop-pane')).to.be.ok;
        expect(canvas.height).to.equal(parseFloat(imgStyle.getPropertyValue('height')));
        expect(canvas.width).to.equal(parseFloat(imgStyle.getPropertyValue('width')));
        expect(parseFloat(canvas.style.top)).to.equal(img.offsetTop);
        expect(parseFloat(canvas.style.left)).to.equal(img.offsetLeft);
    });
  });

  describe('constructor ratio option', function () {
    it('Defaults to none', function () {

    });

    it('Honors square keyword', function () {
      this.crop = new Cropper(img, { ratio: 'square' });
      var size = cropPaneSize();
      expect(size.width).to.equal(size.height);
    });

    it('Honors any valid ratio', function () {
      this.crop = new Cropper(img, { ratio: '1:2' });
      var size = cropPaneSize();
      expect(size.width / size.height).to.equal(1 / 2);
    });

    it('Throws an error when given invalid input', function () {
      expect(function () {
        new Cropper(img, { ratio: 'bananas' });
      }).to.throw(TypeError, /bananas/);

      expect(function () {
        new Cropper(img, { ratio: 100 });
      }).to.throw(TypeError, /100/);
    });
  });

  describe('constructor min/max bounds options', function () {
    it('Applies to default size', function () {
      this.crop = new Cropper(img, { minWidth: 20, maxWidth: 20, minHeight: 30, maxHeight: 30 });
      var size = cropPaneSize();
      expect(size.width).to.equal(20);
      expect(size.height).to.equal(30);
    });
  });

  describe('constructor default bounds options', function () {
    it('Honors values', function () {
      this.crop = new Cropper(img, { defaultHeight: 100, defaultWidth: 20.2 });
      var size = cropPaneSize();
      expect(size.width).to.be.within(20, 21);
      expect(size.height).to.equal(100);
    });

    it('Honors values, but only within ratio specification', function () {
      this.crop = new Cropper(img, { defaultHeight: 100, defaultWidth: 100, ratio: '16:9' });
      var size = cropPaneSize();
      var expected = 100 / (16 / 9);
      expect(size.width).to.equal(100);
      expect(size.height).to.be.within(Math.floor(expected), Math.ceil(expected));
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

  describe('get', function () {
    it('Returns a data uri of the crop region', function (done) {
      var crop = new Cropper(img);
      var pane = document.querySelector('.cropper-crop-pane');
      pane.style.width = '1px';
      pane.style.height = '1px';

      var output = document.createElement('img');
      crop._cropChange({ x: 100, y: 100, height: 1, width: 1 });
      output.src = crop.get();
      document.body.appendChild(output);

      setTimeout(function () {
        expect(output.height).to.equal(1);
        expect(output.width).to.equal(1);

        document.body.removeChild(output);
        crop.destroy();
        done();
      });
    });
  });

  describe('setRatio', function () {

  });
});
