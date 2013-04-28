
/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module.exports) {
    module.exports = {};
    module.client = module.component = true;
    module.call(this, module.exports, require.relative(resolved), module);
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);
  var index = path + '/index.js';

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
  }

  if (require.aliases.hasOwnProperty(index)) {
    return require.aliases[index];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("component-indexof/index.js", function(exports, require, module){

var indexOf = [].indexOf;

module.exports = function(arr, obj){
  if (indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
});
require.register("component-emitter/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var index = require('indexof');

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  fn._off = on;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var i = index(callbacks, fn._off || fn);
  if (~i) callbacks.splice(i, 1);
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

});
require.register("component-bind/index.js", function(exports, require, module){

/**
 * Slice reference.
 */

var slice = [].slice;

/**
 * Bind `obj` to `fn`.
 *
 * @param {Object} obj
 * @param {Function|String} fn or string
 * @return {Function}
 * @api public
 */

module.exports = function(obj, fn){
  if ('string' == typeof fn) fn = obj[fn];
  if ('function' != typeof fn) throw new Error('bind() requires a function');
  var args = [].slice.call(arguments, 2);
  return function(){
    return fn.apply(obj, args.concat(slice.call(arguments)));
  }
};

});
require.register("cropper/index.js", function(exports, require, module){
"use strict";
module.exports = require("./lib/Cropper");

});
require.register("cropper/lib/Cropper.js", function(exports, require, module){
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
// - Compare performance of #getBoundingClientRect and #getComputedStyle
// - Better touch support (ideally multi-touch radness)

});
require.register("cropper/lib/CropPane.js", function(exports, require, module){
"use strict";

var Resizer = require('./Resizer'),
    Position = require('./Position'),
    domTool = require('./DOMTools'),
    draggable = require('./Draggable'),
    emitter = require('emitter'),
    bind = require('bind');

module.exports = CropPane;

/**
 * # CropPane
 * @param {Object} options Options hash
 */
function CropPane (options) {
  this.options = options;

  this.setRatio(this.options.ratio);

  emitter(this);
  draggable(this);
}

CropPane.prototype = {
  /**
   * Draws the pane for the first time.
   * @param  {Object} reference Parent element
   */
  draw: function (reference) {
    this.el || (this._createPane(reference));
  },

  /**
   * Moves to the given coordinates.
   * @param  {Number=} x X
   * @param  {Number=} y Y
   */
  moveTo: function (x, y) {
    var movement = {};

    if (typeof x === 'number') {
      movement.left = x + 'px';
    }
    if (typeof y === 'number') {
      movement.top = y + 'px';
    }

    this.refresh(movement);
  },

  /**
   * Sets the ratio.
   * @param {String} ratio none|square|number:number
   */
  setRatio: function (ratio) {
    ratio = ratio.toString().toLowerCase();

    if (ratio === 'none' || ratio === 'square') {
      this.ratio = ratio;
    }
    else if (/^\d{1,2}:\d{1,2}$/.test(ratio)) {
      var split = ratio.split(':');
      this.ratio = parseInt(split[0], 10) / parseInt(split[1], 10);
    }
    else {
      throw new TypeError("Don't know what to do with " + ratio);
    }
  },

  /**
   * Hook method for Draggable interface.
   * @param  {Number} diffX Difference in x coordinates
   * @param  {Number} diffY Difference in y coordinates
   */
  onDrag: function (diffX, diffY) {
    var newX, newY;

    if (diffX) {
      newX = parseFloat(this.el.style.left) + diffX;
    }
    if (diffY) {
      newY = parseFloat(this.el.style.top) + diffY;
    }

    this.moveTo(newX, newY);
  },

  /**
   * Redraws with the given transforms.
   * @param  {Object=} changes CSS styles to change (if any)
   */
  refresh: function (changes) {
    this._performTransform(changes);
    // **Change Event**
    this.emit('change', Position.relative(this.el));
  },

  destroy: function () {
    domTool.remove(this.parentBounds);
    domTool.remove(this.el);

    this.parentBounds = this.el = null;
  },

  _keepInBounds: function (coordinate, max, min) {
    coordinate = parseFloat(coordinate);
    coordinate = Math.max(coordinate, min || 0);
    coordinate = Math.min(coordinate, max || Number.MAX_VALUE);

    return coordinate;
  },

  /**
   * Modifies the height attribute to properly conform to
   * the current crop ratio.
   * @param  {Object=} pendingTransforms Transforms to be applied (if any)
   * @return {Object=} Object with modified height property or pendingTransforms
   */
  _enforceRatio: function (pendingTransforms) {
    var currentWidth = (pendingTransforms) ?
            parseFloat(pendingTransforms.width) :
            Position.relative(this.el).width,
        newHeight,
        ratio = this.ratio;

    if (ratio === 'square') {
      newHeight = currentWidth;
    }
    else if (typeof ratio === 'number') {
      newHeight = currentWidth / ratio;
    }
    if (newHeight) {
      pendingTransforms || (pendingTransforms = {});
      pendingTransforms.height = newHeight + 'px';
    }

    return pendingTransforms;
  },

  _enforceBounds: function (pendingTransforms) {
    var currentSize = Position.relative(this.el),
        bounds = {
          left:   { parent: 'width', self: 'width' },
          width:  { parent: 'width', self: 'x' },
          top:    { parent: 'height', self: 'height' },
          height: { parent: 'height', self: 'y' }
        },
        bound,
        boundCalculation;

    for (bound in bounds) {
      if (bounds.hasOwnProperty(bound) && bound in pendingTransforms) {
        boundCalculation = bounds[bound];
        pendingTransforms[bound] = this._keepInBounds(pendingTransforms[bound], domTool[boundCalculation.parent](this.parentBounds) - currentSize[boundCalculation.self]) + 'px';
      }
    }

    return pendingTransforms;
  },

  _enforceSize: function (pendingTransforms) {
    if ('width' in pendingTransforms) {
      pendingTransforms.width = this._keepInBounds(pendingTransforms.width, this.options.maxWidth, this.options.minWidth) + 'px';
    }
    if ('height' in pendingTransforms) {
      pendingTransforms.height = this._keepInBounds(pendingTransforms.height, this.options.maxHeight, this.options.minHeight) + 'px';
    }

    return pendingTransforms;
  },

  _performTransform: function (changes) {
    changes = this._enforceRatio(changes);

    if (changes) {
      changes = this._enforceBounds(changes);
      changes = this._enforceSize(changes);

      domTool.setStyles(this.el, changes);
    }
  },

  _createPane: function (reference) {
    this.parentBounds = this._createBounds(reference);
    var parentSize = Position.relative(this.parentBounds);

    var el = document.createElement('div');
    el.className = 'cropper-crop-pane';

    this.el = this.parentBounds.appendChild(el);
    this._performTransform({
      position: 'absolute',
      height:   this.options.defaultHeight + 'px',
      width:    this.options.defaultWidth + 'px',
      top:      (parentSize.height * 0.4) + 'px',
      left:     (parentSize.width * 0.4) + 'px'
    });

    this.makeDraggable(el, this.parentBounds);
    this._addResizers(el);

    this.refresh();
  },

  _addResizers: function (el) {
    for (var i = 0, regions = ['ne', 'se', 'nw', 'sw'], len = regions.length, sizer; i < len; i++) {
      sizer = new Resizer(regions[i], this.parentBounds);
      sizer.on('move', bind(this, this._onResize));
      el.appendChild(sizer.el);
    }
  },

  /**
   * Handler for resizer's 'move' event.
   * @param  {String} region ne, se, nw, sw
   * @param  {Number} x      Delta x
   * @param  {Number} y      Delta y
   */
  _onResize: function (region, x, y) {
    var currentPosition = Position.relative(this.el),
        operations = this._bounds[region],
        transform = {};

    for (var bound in operations) {
      if (operations.hasOwnProperty(bound)) {
        transform[bound] = this._bounds[bound](currentPosition, x, y, operations[bound]);
      }
    }

    this.refresh(transform);
  },

  _bounds: {
    ne: {
      width:  1,
      top:    1,
      height: -1
    },
    se: {
      height: 1,
      width:  1
    },
    nw: {
      top:    1,
      height: -1,
      left:   1,
      width:  -1
    },
    sw: {
      height: 1,
      left:   1,
      width:  -1
    },

    width: function (currentPosition, x, y, direction) {
      return currentPosition.width + (x * direction) + 'px';
    },
    height: function (currentPosition, x, y, direction) {
      return currentPosition.height + (y * direction) + 'px';
    },
    top: function (currentPosition, x, y, direction) {
      return currentPosition.y + (y * direction) + 'px';
    },
    left: function (currentPosition, x, y, direction) {
      return currentPosition.x + (x * direction) + 'px';
    }
  },

  _createBounds: function (reference) {
    var el = document.createElement('div');

    domTool.setStyles(el, {
      position: 'absolute',
      zIndex:   101
    });
    domTool.keepSnapped(el, reference);

    return reference.parentNode.insertBefore(el, reference);
  }
};

});
require.register("cropper/lib/Position.js", function(exports, require, module){
"use strict";

module.exports = {
  relative: function (reference) {
    var computedStyle = window.getComputedStyle(reference);

    return {
      x: reference.offsetLeft,
      y: reference.offsetTop,
      width: parseFloat(computedStyle.getPropertyValue('width')),
      height: parseFloat(computedStyle.getPropertyValue('height'))
    };
  },

  absolute: function (reference) {
    var x = reference.offsetLeft,
        y = reference.offsetTop,
        parent = reference.offsetParent;

    while (parent) {
      x += parent.offsetLeft;
      y += parent.offsetTop;
      parent = parent.offsetParent;
    }

    return { x: x, y: y };
  }
};

});
require.register("cropper/lib/Resizer.js", function(exports, require, module){
"use strict";

var bind = require('bind'),
    emitter = require('emitter'),
    draggable = require('./Draggable');

module.exports = Resizer;

function Resizer (name, bounds) {
  this.name = name;

  emitter(this);
  draggable(this);

  this._init(bounds);
}

Resizer.prototype = {
  _init: function (bounds) {
    this.el = document.createElement('div');
    this.el.className = 'cropper-sizer cropper-sizer-' + this.name;

    this.makeDraggable(this.el, bounds);
  },

  /**
   * Hook method for Draggable interface.
   * @param  {Number} diffX Difference in x coordinates
   * @param  {Number} diffY Difference in y coordinates
   */
  onDrag: function (diffX, diffY) {
    // *Event move*
    this.emit('move', this.name, diffX, diffY);
  }
};

});
require.register("cropper/lib/DOMTools.js", function(exports, require, module){
"use strict";

var Position = require('./Position');

var setStyles = module.exports.setStyles = function (el, styles) {
  for (var prop in styles) {
    if (styles.hasOwnProperty(prop)) {
      el.style[prop] = styles[prop];
    }
  }

  return el;
};

var snap = module.exports.snap = function (el, source) {
  var bounds = Position.relative(source);

  setStyles(el, {
    height: bounds.height + 'px',
    width:  bounds.width + 'px',
    top:    bounds.y + 'px',
    left:   bounds.x + 'px'
  });
};

module.exports.keepSnapped = function (el, source) {
  snap(el, source);

  setInterval(function () {
    snap(el, source);
  }, 200);
};

module.exports.remove = function (el) {
  return el.parentNode.removeChild(el);
};

function getComputedStyle (el, style) {
  var computedStyle = window.getComputedStyle(el);

  return computedStyle.getPropertyValue(style);
}

module.exports.width = function (el) {
  return parseFloat(getComputedStyle(el, 'width'));
};

module.exports.height = function (el) {
  return parseFloat(getComputedStyle(el, 'height'));
};

});
require.register("cropper/lib/ImageCanvas.js", function(exports, require, module){
"use strict";

var emit = require('emitter'),
    domTool = require('./DOMTools'),
    Position = require('./Position');

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
    var overlayInfo = Position.relative(img),
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

});
require.register("cropper/lib/Draggable.js", function(exports, require, module){
"use strict";

module.exports = Draggable;

var bind = require('bind');

function mixin (obj) {
  for (var i in Draggable.prototype) {
    if (i === 'onDrag' && i in obj) continue;

    obj[i] = Draggable.prototype[i];
  }

  return obj;
}

/**
 * Adds `document.scrollLeft` and `document.scrollTop`
 * onto the given coordinates.
 * @param  {Number} x
 * @param  {Number} y
 * @return {Object}  Has x, y properties
 */
function truePosition (x, y) {
  var docEl = document.documentElement;

  return {
    x: x + docEl.scrollLeft,
    y: y + docEl.scrollTop
  };
}

function subscribe (element, eventMap, context) {
  for (var evt in eventMap) {
    if (eventMap.hasOwnProperty(evt)) {
      element.addEventListener(evt, bind(context, eventMap[evt]));
    }
  }
}

/**
 * May be used as a mixin or instantiated
 * by itself.
 * @param {Object} obj Attach prototype props onto
 */
function Draggable (obj) {
  if (obj) {
    return mixin(obj);
  }
}

Draggable.prototype = {
  makeDraggable: function (el, bounds) {
    subscribe(el, {
      mouseup:      this.onMouseUp,
      mousedown:    this.onMouseDown
    }, this);

    subscribe(bounds, {
      mouseup:      this.onMouseUp,
      mouseout:     this.onMouseOut,
      mousemove:    this.onMouseMove
    }, this);
  },

  onMouseOut: function (e) {
    var mouse = truePosition(e.clientX, e.clientY),
        bounds = e.currentTarget.getBoundingClientRect();

    if (mouse.x <= bounds.left || mouse.x >= bounds.right || mouse.y <= bounds.top || mouse.y >= bounds.bottom) {
      this.onMouseUp(e);
    }
    else {
      // The rest of the subscribers don't need to care.
      e.stopPropagation();
    }
  },

  onMouseUp: function (e) {
    this._dragging = false;
    e.preventDefault();
  },

  onMouseDown: function (e) {
    if (e.button !== 0) return this.onMouseUp(e);

    this._dragging = true;

    this.lastMouse = truePosition(e.clientX, e.clientY);

    e.stopPropagation();
    e.preventDefault();
  },

  onMouseMove: function (e) {
    if (!this._dragging) return;

    e.preventDefault();

    var currentPosition = truePosition(e.clientX, e.clientY),
        diffX = currentPosition.x - this.lastMouse.x,
        diffY = currentPosition.y - this.lastMouse.y;

    this.lastMouse = currentPosition;

    this.onDrag(diffX, diffY);
  },

  /**
   * Callers should implement this method.
   */
  onDrag: function (diffX, diffY) {
    console.log("Hook method called onDrag should be implemented");
    console.log(diffX + ', ' + diffY);
  }
};

});
require.alias("component-emitter/index.js", "cropper/deps/emitter/index.js");
require.alias("component-indexof/index.js", "component-emitter/deps/indexof/index.js");

require.alias("component-bind/index.js", "cropper/deps/bind/index.js");

