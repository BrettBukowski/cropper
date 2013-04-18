"use strict";

var Resizer = require('./Resizer'),
    overlay = require('./Overlay'),
    domTool = require('./DOMTools'),
    emitter = require('emitter'),
    bind = require('bind');

module.exports = CropPane;

function CropPane (ratio) {
  this.ratio = this.setRatio(ratio);

  emitter(this);
}

CropPane.prototype = {
  draw: function (reference) {
    this.pane || (this._createPane(reference));
  },

  moveTo: function (x, y) {
    domTool.setStyles(this.el, {
      left: x + 'px',
      top:  y + 'px'
    });

    this.emit('change', overlay.relative(this.el));
  },

  setRatio: function (ratio) {

  },

  destroy: function () {
    domTool.remove(this.parentBounds);
    domTool.remove(this.el);

    this.parentBounds = this.el = null;
  },

  _createPane: function (reference) {
    this.parentBounds = this._createBounds(reference);

    var el = document.createElement('div');
    el.className = 'cropper-crop-pane';

    domTool.setStyles(el, {
      position: 'absolute',
      height:   '100px',
      width:    '100px',
      top:      '100px',
      left:     '100px'
    });

    this._makeDraggable(el);

    this.el = this.parentBounds.appendChild(el);

    this.emit('change', overlay.relative(el));
  },

  _makeDropTarget: function (el) {
    function cancel (e) {
      e.dataTransfer.dropEffect = 'move';
      e.dataTransfer.effectAllowed = 'move';
      e.preventDefault();
    }

    el.addEventListener('dragover', cancel);
    el.addEventListener('dragenter', cancel);
    el.addEventListener('drop', cancel);
  },

  _dragStarted: function (e) {
    e.dataTransfer.effectAllowed = 'move';

    this.el.style.background = 'rgba(255, 255, 255, .5)';

    this._startPosition = {
      rel:    overlay.relative(this.el),
      abs:    overlay.absolute(this.el)
    };
  },

  _dragEnded: function (e) {
    this.el.style.background = 'none';

    var newX = e.clientX - (this._startPosition.abs.x - this._startPosition.rel.x),
        newY = e.clientY - (this._startPosition.abs.y - this._startPosition.rel.y) - this._startPosition.rel.height;

    this.moveTo(newX, newY);
  },

  _makeDraggable: function (el) {
    el.draggable = true;

    el.addEventListener('dragstart', bind(this, this._dragStarted));
    el.addEventListener('dragend', bind(this, this._dragEnded));
  },

  _createBounds: function (reference) {
    var el = document.createElement('div');

    domTool.setStyles(el, {
      position: 'absolute',
      zIndex:   101
    });
    domTool.keepSnapped(el, reference);
    this._makeDropTarget(el);

    domTool.keepSnapped(el, reference);

    return reference.parentNode.insertBefore(el, reference);
  }
};
