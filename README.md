cropper
=======

[![Build Status](https://travis-ci.org/BrettBukowski/cropper.png?branch=master)](https://travis-ci.org/BrettBukowski/cropper) [![Code Climate](https://codeclimate.com/github/BrettBukowski/cropper.png)](https://codeclimate.com/github/BrettBukowski/cropper)

Crop images in your browser.

![][pic]

## Installation

First, [Component] must be installed as a prereq.

Then,

    $ component install brettbukowski/cropper

## Usage

Check the example.html file for a demo.

If you don't want to use component, include the [.min.js file][js] on the page:

    <script src="build/cropper.min.js"></script>

And the [CSS][css]:

    <link rel="stylesheet" type="text/css" href="build/cropper.css">

## API

### Initialization

Require and create a new instance.

    var Cropper = require('cropper'),
        crop = new Cropper(document.querySelector('img#my-image'));

  The first parameter is the image to crop. The image should already be loaded before being passed in.

### Options

The second param is a hash of options:

- **ratio**: Limit the crop area to a specific ratio. By default, the crop area can be resized to any size. The size ratio of the crop area can be limited to a specific aspect ratio like 'square', '3:2', or '5:4'.
- **min and max sizes**: The crop area can be limited to specific sizes
  - minWidth
  - minHeight
  - maxWidth
  - maxHeight
- **default size**: By default, the crop area that initially appears on the image is 100x100
  - defaultWidth
  - defaultHeight

### Setting the ratio

    crop.setRatio('16:9');
    crop.setRatio('square');
    crop.setRatio('none');

### Getting the cropped piece of the image

Calling the `get` method returns a dataURI of the cropped piece of the larger image.

    var img = document.createElement('img');
    img.src = crop.get();


## License

Copyright (c) 2013 Brett Bukowski

MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.



[pic]: https://dl.dropboxusercontent.com/u/302368/github/cropper.gif
[component]: https://github.com/component/component/
[js]: https://github.com/BrettBukowski/cropper/blob/gh-pages/build/cropper.min.js
[css]: https://github.com/BrettBukowski/cropper/blob/gh-pages/build/cropper.css
