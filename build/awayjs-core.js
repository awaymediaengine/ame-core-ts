require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Rectangle = require("awayjs-core/lib/geom/Rectangle");
var ColorUtils = require("awayjs-core/lib/utils/ColorUtils");
/**
 *
 */
var BitmapData = (function () {
    /**
     *
     * @param width
     * @param height
     * @param transparent
     * @param fillColor
     */
    function BitmapData(width, height, transparent, fillColor) {
        if (transparent === void 0) { transparent = true; }
        if (fillColor === void 0) { fillColor = null; }
        this._locked = false;
        this._transparent = transparent;
        this._imageCanvas = document.createElement("canvas");
        this._imageCanvas.width = width;
        this._imageCanvas.height = height;
        this._context = this._imageCanvas.getContext("2d");
        this._rect = new Rectangle(0, 0, width, height);
        if (fillColor != null)
            this.fillRect(this._rect, fillColor);
    }
    Object.defineProperty(BitmapData.prototype, "transparent", {
        get: function () {
            return this._transparent;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     */
    BitmapData.prototype.dispose = function () {
        this._context = null;
        this._imageCanvas = null;
        this._imageData = null;
        this._rect = null;
        this._transparent = null;
        this._locked = null;
    };
    /**
     *
     */
    BitmapData.prototype.lock = function () {
        this._locked = true;
        this._imageData = this._context.getImageData(0, 0, this._rect.width, this._rect.height);
    };
    /**
     *
     */
    BitmapData.prototype.unlock = function () {
        this._locked = false;
        if (this._imageData) {
            this._context.putImageData(this._imageData, 0, 0); // at coords 0,0
            this._imageData = null;
        }
    };
    /**
     *
     * @param x
     * @param y
     * @param color
     */
    BitmapData.prototype.getPixel = function (x, y) {
        var r;
        var g;
        var b;
        var a;
        if (!this._locked) {
            var pixelData = this._context.getImageData(x, y, 1, 1);
            r = pixelData.data[0];
            g = pixelData.data[1];
            b = pixelData.data[2];
            a = pixelData.data[3];
        }
        else {
            var index = (x + y * this._imageCanvas.width) * 4;
            if (!this._imageData)
                this._imageData = this._context.getImageData(0, 0, this._rect.width, this._rect.height);
            r = this._imageData.data[index + 0];
            g = this._imageData.data[index + 1];
            b = this._imageData.data[index + 2];
            a = this._imageData.data[index + 3];
        }
        if (!this._locked) {
            this._imageData = null;
        }
        return (a << 24) | (r << 16) | (g << 8) | b;
    };
    /**
     *
     * @param x
     * @param y
     * @param color
     */
    BitmapData.prototype.setPixel = function (x, y, color) {
        var argb = ColorUtils.float32ColorToARGB(color);
        if (!this._locked)
            this._imageData = this._context.getImageData(0, 0, this._rect.width, this._rect.height);
        if (this._imageData) {
            var index = (x + y * this._imageCanvas.width) * 4;
            this._imageData.data[index + 0] = argb[1];
            this._imageData.data[index + 1] = argb[2];
            this._imageData.data[index + 2] = argb[3];
            this._imageData.data[index + 3] = 255;
        }
        if (!this._locked) {
            this._context.putImageData(this._imageData, 0, 0);
            this._imageData = null;
        }
    };
    /**
     *
     * @param rect
     * @param inputByteArray
     */
    BitmapData.prototype.setPixels = function (rect, inputByteArray) {
        if (!this._locked)
            this._imageData = this._context.getImageData(0, 0, this._rect.width, this._rect.height);
        if (this._imageData) {
            inputByteArray.position = 0;
            var i /*uint*/, j /*uint*/, index /*uint*/;
            for (i = 0; i < rect.width; ++i) {
                for (j = 0; j < rect.height; ++j) {
                    index = (i + rect.x + (j + rect.y) * this._imageCanvas.width) * 4;
                    this._imageData.data[index + 0] = inputByteArray.readUnsignedInt();
                    this._imageData.data[index + 1] = inputByteArray.readUnsignedInt();
                    this._imageData.data[index + 2] = inputByteArray.readUnsignedInt();
                    this._imageData.data[index + 3] = inputByteArray.readUnsignedInt();
                }
            }
        }
        if (!this._locked) {
            this._context.putImageData(this._imageData, 0, 0);
            this._imageData = null;
        }
    };
    /**
     *
     * @param x
     * @param y
     * @param color
     */
    BitmapData.prototype.setPixel32 = function (x, y, color) {
        var argb = ColorUtils.float32ColorToARGB(color);
        if (!this._locked)
            this._imageData = this._context.getImageData(0, 0, this._rect.width, this._rect.height);
        if (this._imageData) {
            var index = (x + y * this._imageCanvas.width) * 4;
            this._imageData.data[index + 0] = argb[1];
            this._imageData.data[index + 1] = argb[2];
            this._imageData.data[index + 2] = argb[3];
            this._imageData.data[index + 3] = argb[0];
        }
        if (!this._locked) {
            this._context.putImageData(this._imageData, 0, 0);
            this._imageData = null;
        }
    };
    BitmapData.prototype.setVector = function (rect, inputVector) {
        if (!this._locked)
            this._imageData = this._context.getImageData(0, 0, this._rect.width, this._rect.height);
        if (this._imageData) {
            var i /*uint*/, j /*uint*/, index /*uint*/, argb /*uint*/;
            for (i = 0; i < rect.width; ++i) {
                for (j = 0; j < rect.height; ++j) {
                    argb = ColorUtils.float32ColorToARGB(inputVector[i + j * rect.width]);
                    index = (i + rect.x + (j + rect.y) * this._imageCanvas.width) * 4;
                    this._imageData.data[index + 0] = argb[1];
                    this._imageData.data[index + 1] = argb[2];
                    this._imageData.data[index + 2] = argb[3];
                    this._imageData.data[index + 3] = argb[0];
                }
            }
        }
        if (!this._locked) {
            this._context.putImageData(this._imageData, 0, 0);
            this._imageData = null;
        }
    };
    BitmapData.prototype.drawImage = function (img, sourceRect, destRect) {
        if (this._locked) {
            // If canvas is locked:
            //
            //      1) copy image data back to canvas
            //      2) draw object
            //      3) read _imageData back out
            if (this._imageData)
                this._context.putImageData(this._imageData, 0, 0); // at coords 0,0
            this._drawImage(img, sourceRect, destRect);
            if (this._imageData)
                this._imageData = this._context.getImageData(0, 0, this._rect.width, this._rect.height);
        }
        else {
            this._drawImage(img, sourceRect, destRect);
        }
    };
    BitmapData.prototype._drawImage = function (img, sourceRect, destRect) {
        if (img instanceof BitmapData)
            this._context.drawImage(img.canvas, sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height, destRect.x, destRect.y, destRect.width, destRect.height);
        else if (img instanceof HTMLImageElement)
            this._context.drawImage(img, sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height, destRect.x, destRect.y, destRect.width, destRect.height);
    };
    BitmapData.prototype.copyPixels = function (bmpd, sourceRect, destRect) {
        if (this._locked) {
            // If canvas is locked:
            //
            //      1) copy image data back to canvas
            //      2) draw object
            //      3) read _imageData back out
            if (this._imageData)
                this._context.putImageData(this._imageData, 0, 0); // at coords 0,0
            this._copyPixels(bmpd, sourceRect, destRect);
            if (this._imageData)
                this._imageData = this._context.getImageData(0, 0, this._rect.width, this._rect.height);
        }
        else {
            this._copyPixels(bmpd, sourceRect, destRect);
        }
    };
    BitmapData.prototype._copyPixels = function (bmpd, sourceRect, destRect) {
        if (bmpd instanceof BitmapData) {
            this._context.drawImage(bmpd.canvas, sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height, destRect.x, destRect.y, destRect.width, destRect.height);
        }
        else if (bmpd instanceof HTMLImageElement) {
            this._context.drawImage(bmpd, sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height, destRect.x, destRect.y, destRect.width, destRect.height);
        }
    };
    /**
     *
     * @param rect
     * @param color
     */
    BitmapData.prototype.fillRect = function (rect, color) {
        if (this._locked) {
            // If canvas is locked:
            //
            //      1) copy image data back to canvas
            //      2) apply fill
            //      3) read _imageData back out
            if (this._imageData)
                this._context.putImageData(this._imageData, 0, 0); // at coords 0,0
            this._fillRect(rect, color);
            if (this._imageData)
                this._imageData = this._context.getImageData(0, 0, this._rect.width, this._rect.height);
        }
        else {
            this._fillRect(rect, color);
        }
    };
    /**
     *
     * @param rect
     * @param color
     */
    BitmapData.prototype._fillRect = function (rect, color) {
        if (color == 0x0 && this._transparent) {
            this._context.clearRect(rect.x, rect.y, rect.width, rect.height);
        }
        else {
            var argb = ColorUtils.float32ColorToARGB(color);
            if (this._transparent)
                this._context.fillStyle = 'rgba(' + argb[1] + ',' + argb[2] + ',' + argb[3] + ',' + argb[0] / 255 + ')';
            else
                this._context.fillStyle = 'rgba(' + argb[1] + ',' + argb[2] + ',' + argb[3] + ',1)';
            this._context.fillRect(rect.x, rect.y, rect.width, rect.height);
        }
    };
    BitmapData.prototype.draw = function (source, matrix) {
        if (this._locked) {
            // If canvas is locked:
            //
            //      1) copy image data back to canvas
            //      2) draw object
            //      3) read _imageData back out
            if (this._imageData)
                this._context.putImageData(this._imageData, 0, 0); // at coords 0,0
            this._draw(source, matrix);
            if (this._imageData)
                this._imageData = this._context.getImageData(0, 0, this._rect.width, this._rect.height);
        }
        else {
            this._draw(source, matrix);
        }
    };
    BitmapData.prototype._draw = function (source, matrix) {
        if (source instanceof BitmapData) {
            this._context.save();
            if (matrix != null)
                this._context.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
            this._context.drawImage(source.canvas, 0, 0);
            this._context.restore();
        }
        else if (source instanceof HTMLImageElement) {
            this._context.save();
            if (matrix != null)
                this._context.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
            this._context.drawImage(source, 0, 0);
            this._context.restore();
        }
    };
    BitmapData.prototype.copyChannel = function (sourceBitmap, sourceRect, destPoint, sourceChannel, destChannel) {
        var imageData = sourceBitmap.imageData;
        if (!this._locked)
            this._imageData = this._context.getImageData(0, 0, this._rect.width, this._rect.height);
        if (this._imageData) {
            var sourceData = sourceBitmap.imageData.data;
            var destData = this._imageData.data;
            var sourceOffset = Math.round(Math.log(sourceChannel) / Math.log(2));
            var destOffset = Math.round(Math.log(destChannel) / Math.log(2));
            var i /*uint*/, j /*uint*/, sourceIndex /*uint*/, destIndex /*uint*/;
            for (i = 0; i < sourceRect.width; ++i) {
                for (j = 0; j < sourceRect.height; ++j) {
                    sourceIndex = (i + sourceRect.x + (j + sourceRect.y) * sourceBitmap.width) * 4;
                    destIndex = (i + destPoint.x + (j + destPoint.y) * this.width) * 4;
                    destData[destIndex + destOffset] = sourceData[sourceIndex + sourceOffset];
                }
            }
        }
        if (!this._locked) {
            this._context.putImageData(this._imageData, 0, 0);
            this._imageData = null;
        }
    };
    BitmapData.prototype.colorTransform = function (rect, colorTransform) {
        if (!this._locked)
            this._imageData = this._context.getImageData(0, 0, this._rect.width, this._rect.height);
        if (this._imageData) {
            var data = this._imageData.data;
            var i /*uint*/, j /*uint*/, index /*uint*/;
            for (i = 0; i < rect.width; ++i) {
                for (j = 0; j < rect.height; ++j) {
                    index = (i + rect.x + (j + rect.y) * this.width) * 4;
                    data[index] = data[index] * colorTransform.redMultiplier + colorTransform.redOffset;
                    data[index + 1] = data[index + 1] * colorTransform.greenMultiplier + colorTransform.greenOffset;
                    data[index + 2] = data[index + 2] * colorTransform.blueMultiplier + colorTransform.blueOffset;
                    data[index + 3] = data[index + 3] * colorTransform.alphaMultiplier + colorTransform.alphaOffset;
                }
            }
        }
        if (!this._locked) {
            this._context.putImageData(this._imageData, 0, 0);
            this._imageData = null;
        }
    };
    Object.defineProperty(BitmapData.prototype, "imageData", {
        /**
         *
         * @returns {ImageData}
         */
        get: function () {
            return this._context.getImageData(0, 0, this._rect.width, this._rect.height);
        },
        /**
         *
         * @param {ImageData}
         */
        set: function (value) {
            this._context.putImageData(value, 0, 0);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BitmapData.prototype, "width", {
        /**
         *
         * @returns {number}
         */
        get: function () {
            return this._imageCanvas.width;
        },
        /**
         *
         * @param {number}
         */
        set: function (value) {
            this._rect.width = value;
            this._imageCanvas.width = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BitmapData.prototype, "height", {
        /**
         *
         * @returns {number}
         */
        get: function () {
            return this._imageCanvas.height;
        },
        /**
         *
         * @param {number}
         */
        set: function (value) {
            this._rect.height = value;
            this._imageCanvas.height = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BitmapData.prototype, "rect", {
        /**
         *
         * @param {Rectangle}
         */
        get: function () {
            return this._rect;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BitmapData.prototype, "canvas", {
        /**
         *
         * @returns {HTMLCanvasElement}
         */
        get: function () {
            return this._imageCanvas;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BitmapData.prototype, "context", {
        /**
         *
         * @returns {HTMLCanvasElement}
         */
        get: function () {
            return this._context;
        },
        enumerable: true,
        configurable: true
    });
    BitmapData.prototype.clone = function () {
        var t = new BitmapData(this.width, this.height, this.transparent);
        t.draw(this);
        return t;
    };
    return BitmapData;
})();
module.exports = BitmapData;


},{"awayjs-core/lib/geom/Rectangle":25,"awayjs-core/lib/utils/ColorUtils":61}],2:[function(require,module,exports){
var BitmapDataChannel = (function () {
    function BitmapDataChannel() {
    }
    BitmapDataChannel.ALPHA = 8;
    BitmapDataChannel.BLUE = 4;
    BitmapDataChannel.GREEN = 2;
    BitmapDataChannel.RED = 1;
    return BitmapDataChannel;
})();
module.exports = BitmapDataChannel;


},{}],3:[function(require,module,exports){
var Box = require("awayjs-core/lib/geom/Box");
var AbstractMethodError = require("awayjs-core/lib/errors/AbstractMethodError");
var BoundingVolumeBase = (function () {
    function BoundingVolumeBase() {
        this._pAabbPoints = new Array();
        this._pAabbPointsDirty = true;
        this._aabb = new Box();
    }
    Object.defineProperty(BoundingVolumeBase.prototype, "aabb", {
        get: function () {
            return this._aabb;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BoundingVolumeBase.prototype, "aabbPoints", {
        get: function () {
            if (this._pAabbPointsDirty)
                this.pUpdateAABBPoints();
            return this._pAabbPoints;
        },
        enumerable: true,
        configurable: true
    });
    BoundingVolumeBase.prototype.nullify = function () {
        this._aabb.x = this._aabb.y = this._aabb.z = 0;
        this._aabb.width = this._aabb.height = this._aabb.depth = 0;
        this._pAabbPointsDirty = true;
    };
    BoundingVolumeBase.prototype.fromVertices = function (vertices) {
        var i;
        var len = vertices.length;
        if (len == 0) {
            this.nullify();
            return;
        }
        var v;
        this.minX = this.maxX = vertices[i++];
        this.minY = this.maxY = vertices[i++];
        this.minZ = this.maxZ = vertices[i++];
        while (i < len) {
            v = vertices[i++];
            if (v < this.minX)
                this.minX = v;
            else if (v > this.maxX)
                this.maxX = v;
            v = vertices[i++];
            if (v < this.minY)
                this.minY = v;
            else if (v > this.maxY)
                this.maxY = v;
            v = vertices[i++];
            if (v < this.minZ)
                this.minZ = v;
            else if (v > this.maxZ)
                this.maxZ = v;
        }
        this.fromExtremes(this.minX, this.minY, this.minZ, this.maxX, this.maxY, this.maxZ);
    };
    BoundingVolumeBase.prototype.fromSphere = function (center, radius) {
        this.fromExtremes(center.x - radius, center.y - radius, center.z - radius, center.x + radius, center.y + radius, center.z + radius);
    };
    BoundingVolumeBase.prototype.fromExtremes = function (minX, minY, minZ, maxX, maxY, maxZ) {
        this._aabb.x = minX;
        this._aabb.y = maxY;
        this._aabb.z = minZ;
        this._aabb.width = maxX - minX;
        this._aabb.height = maxY - minY;
        this._aabb.depth = maxZ - minZ;
        this._pAabbPointsDirty = true;
    };
    BoundingVolumeBase.prototype.isInFrustum = function (planes, numPlanes) {
        throw new AbstractMethodError();
    };
    BoundingVolumeBase.prototype.overlaps = function (bounds) {
        return this._aabb.intersects(bounds.aabb);
    };
    BoundingVolumeBase.prototype.clone = function () {
        throw new AbstractMethodError();
    };
    BoundingVolumeBase.prototype.rayIntersection = function (position, direction, targetNormal) {
        return -1;
    };
    BoundingVolumeBase.prototype.containsPoint = function (position) {
        return false;
    };
    BoundingVolumeBase.prototype.pUpdateAABBPoints = function () {
        this.minX = this._aabb.x;
        this.minY = this._aabb.y - this._aabb.height;
        this.minZ = this._aabb.z;
        this.maxX = this._aabb.x + this._aabb.width;
        this.maxY = this._aabb.y;
        this.maxZ = this._aabb.z + this._aabb.depth;
        this._pAabbPoints[0] = this.minX;
        this._pAabbPoints[1] = this.minY;
        this._pAabbPoints[2] = this.minZ;
        this._pAabbPoints[3] = this.maxX;
        this._pAabbPoints[4] = this.minY;
        this._pAabbPoints[5] = this.minZ;
        this._pAabbPoints[6] = this.minX;
        this._pAabbPoints[7] = this.maxY;
        this._pAabbPoints[8] = this.minZ;
        this._pAabbPoints[9] = this.maxX;
        this._pAabbPoints[10] = this.maxY;
        this._pAabbPoints[11] = this.minZ;
        this._pAabbPoints[12] = this.minX;
        this._pAabbPoints[13] = this.minY;
        this._pAabbPoints[14] = this.maxZ;
        this._pAabbPoints[15] = this.maxX;
        this._pAabbPoints[16] = this.minY;
        this._pAabbPoints[17] = this.maxZ;
        this._pAabbPoints[18] = this.minX;
        this._pAabbPoints[19] = this.maxY;
        this._pAabbPoints[20] = this.maxZ;
        this._pAabbPoints[21] = this.maxX;
        this._pAabbPoints[22] = this.maxY;
        this._pAabbPoints[23] = this.maxZ;
        this._pAabbPointsDirty = false;
    };
    BoundingVolumeBase.prototype.classifyToPlane = function (plane) {
        throw new AbstractMethodError();
    };
    BoundingVolumeBase.prototype.transformFrom = function (bounds, matrix) {
        throw new AbstractMethodError();
    };
    return BoundingVolumeBase;
})();
module.exports = BoundingVolumeBase;


},{"awayjs-core/lib/errors/AbstractMethodError":4,"awayjs-core/lib/geom/Box":18}],4:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Error = require("awayjs-core/lib/errors/Error");
/**
 * AbstractMethodError is thrown when an abstract method is called. The method in question should be overridden
 * by a concrete subclass.
 */
var AbstractMethodError = (function (_super) {
    __extends(AbstractMethodError, _super);
    /**
     * Create a new AbstractMethodError.
     * @param message An optional message to override the default error message.
     * @param id The id of the error.
     */
    function AbstractMethodError(message, id) {
        if (message === void 0) { message = null; }
        if (id === void 0) { id = 0; }
        _super.call(this, message || "An abstract method was called! Either an instance of an abstract class was created, or an abstract method was not overridden by the subclass.", id);
    }
    return AbstractMethodError;
})(Error);
module.exports = AbstractMethodError;


},{"awayjs-core/lib/errors/Error":6}],5:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Error = require("awayjs-core/lib/errors/Error");
/**
 * AbstractMethodError is thrown when an abstract method is called. The method in question should be overridden
 * by a concrete subclass.
 */
var ArgumentError = (function (_super) {
    __extends(ArgumentError, _super);
    /**
     * Create a new ArgumentError.
     *
     * @param message An optional message to override the default error message.
     * @param id The id of the error.
     */
    function ArgumentError(message, id) {
        if (message === void 0) { message = null; }
        if (id === void 0) { id = 0; }
        _super.call(this, message || "ArgumentError", id);
    }
    return ArgumentError;
})(Error);
module.exports = ArgumentError;


},{"awayjs-core/lib/errors/Error":6}],6:[function(require,module,exports){
var Error = (function () {
    function Error(message, id, _name) {
        if (message === void 0) { message = ''; }
        if (id === void 0) { id = 0; }
        if (_name === void 0) { _name = ''; }
        this._errorID = 0; //Contains the reference number associated with the specific error message.
        this._messsage = ''; //Contains the message associated with the Error object.
        this._name = ''; // Contains the name of the Error object.
        this._messsage = message;
        this._name = name;
        this._errorID = id;
    }
    Object.defineProperty(Error.prototype, "message", {
        /**
         *
         * @returns {string}
         */
        get: function () {
            return this._messsage;
        },
        /**
         *
         * @param value
         */
        set: function (value) {
            this._messsage = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Error.prototype, "name", {
        /**
         *
         * @returns {string}
         */
        get: function () {
            return this._name;
        },
        /**
         *
         * @param value
         */
        set: function (value) {
            this._name = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Error.prototype, "errorID", {
        /**
         *
         * @returns {number}
         */
        get: function () {
            return this._errorID;
        },
        enumerable: true,
        configurable: true
    });
    return Error;
})();
module.exports = Error;


},{}],7:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Error = require("awayjs-core/lib/errors/Error");
/**
 * AbstractMethodError is thrown when an abstract method is called. The method in question should be overridden
 * by a concrete subclass.
 */
var PartialImplementationError = (function (_super) {
    __extends(PartialImplementationError, _super);
    /**
     * Create a new AbstractMethodError.
     * @param message An optional message to override the default error message.
     * @param id The id of the error.
     */
    function PartialImplementationError(dependency, id) {
        if (dependency === void 0) { dependency = ''; }
        if (id === void 0) { id = 0; }
        _super.call(this, "PartialImplementationError - this function is in development. Required Dependency: " + dependency, id);
    }
    return PartialImplementationError;
})(Error);
module.exports = PartialImplementationError;


},{"awayjs-core/lib/errors/Error":6}],8:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Event = require("awayjs-core/lib/events/Event");
/**
 * @class away.events.AssetEvent
 */
var AssetEvent = (function (_super) {
    __extends(AssetEvent, _super);
    /**
     *
     */
    function AssetEvent(type, asset, prevName) {
        if (asset === void 0) { asset = null; }
        if (prevName === void 0) { prevName = null; }
        _super.call(this, type);
        this._asset = asset;
        this._prevName = prevName || (this._asset ? this._asset.name : null);
    }
    Object.defineProperty(AssetEvent.prototype, "asset", {
        /**
         *
         */
        get: function () {
            return this._asset;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AssetEvent.prototype, "assetPrevName", {
        /**
         *
         */
        get: function () {
            return this._prevName;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     */
    AssetEvent.prototype.clone = function () {
        return new AssetEvent(this.type, this.asset, this.assetPrevName);
    };
    /**
     *
     */
    AssetEvent.ASSET_COMPLETE = "assetComplete";
    /**
     *
     */
    AssetEvent.ASSET_RENAME = 'assetRename';
    /**
     *
     */
    AssetEvent.ASSET_CONFLICT_RESOLVED = 'assetConflictResolved';
    /**
     *
     */
    AssetEvent.TEXTURE_SIZE_ERROR = 'textureSizeError';
    return AssetEvent;
})(Event);
module.exports = AssetEvent;


},{"awayjs-core/lib/events/Event":9}],9:[function(require,module,exports){
var Event = (function () {
    function Event(type) {
        /**
         * Type of event
         * @property type
         * @type String
         */
        this.type = undefined;
        /**
         * Reference to target object
         * @property target
         * @type Object
         */
        this.target = undefined;
        this.type = type;
    }
    /**
     * Clones the current event.
     * @return An exact duplicate of the current event.
     */
    Event.prototype.clone = function () {
        return new Event(this.type);
    };
<<<<<<< HEAD
    Event.COMPLETE = 'complete';
    Event.OPEN = 'open';
    Event.ENTER_FRAME = 'enterFrame';
    Event.EXIT_FRAME = 'exitFrame';
    Event.RESIZE = "resize";
    Event.ERROR = "error";
    Event.CHANGE = "change";
    return Event;
})();
module.exports = Event;


},{}],10:[function(require,module,exports){
/**
 * Base class for dispatching events
*
* @class away.events.EventDispatcher
*
*/
var EventDispatcher = (function () {
    function EventDispatcher(target) {
        if (target === void 0) { target = null; }
        this.listeners = new Array();
        this.target = target || this;
    }
    /**
     * Add an event listener
     * @method addEventListener
     * @param {String} Name of event to add a listener for
     * @param {Function} Callback function
     */
    EventDispatcher.prototype.addEventListener = function (type, listener) {
        if (this.listeners[type] === undefined)
            this.listeners[type] = new Array();
        if (this.getEventListenerIndex(type, listener) === -1)
            this.listeners[type].push(listener);
=======
    AxisAlignedBoundingBox.prototype.transformFrom = function (bounds, matrix) {
        var aabb = bounds;
        var cx = aabb._centerX;
        var cy = aabb._centerY;
        var cz = aabb._centerZ;
        var raw = Matrix3DUtils.RAW_DATA_CONTAINER;
        matrix.copyRawDataTo(raw);
        var m11 = raw[0], m12 = raw[4], m13 = raw[8], m14 = raw[12];
        var m21 = raw[1], m22 = raw[5], m23 = raw[9], m24 = raw[13];
        var m31 = raw[2], m32 = raw[6], m33 = raw[10], m34 = raw[14];
        this._centerX = cx * m11 + cy * m12 + cz * m13 + m14;
        this._centerY = cx * m21 + cy * m22 + cz * m23 + m24;
        this._centerZ = cx * m31 + cy * m32 + cz * m33 + m34;
        if (m11 < 0)
            m11 = -m11;
        if (m12 < 0)
            m12 = -m12;
        if (m13 < 0)
            m13 = -m13;
        if (m21 < 0)
            m21 = -m21;
        if (m22 < 0)
            m22 = -m22;
        if (m23 < 0)
            m23 = -m23;
        if (m31 < 0)
            m31 = -m31;
        if (m32 < 0)
            m32 = -m32;
        if (m33 < 0)
            m33 = -m33;
        var hx = aabb._halfExtentsX;
        var hy = aabb._halfExtentsY;
        var hz = aabb._halfExtentsZ;
        this._halfExtentsX = hx * m11 + hy * m12 + hz * m13;
        this._halfExtentsY = hx * m21 + hy * m22 + hz * m23;
        this._halfExtentsZ = hx * m31 + hy * m32 + hz * m33;
        this._aabb.width = this._halfExtentsX * 2;
        this._aabb.height = this._halfExtentsY * 2;
        this._aabb.depth = this._halfExtentsZ * 2;
        this._aabb.x = this._centerX - this._halfExtentsX;
        this._aabb.y = this._centerY + this._halfExtentsY;
        this._aabb.z = this._centerZ - this._halfExtentsZ;
>>>>>>> 14b6a08e136bb1c69e7a24c4e450367bc01eba5a
    };
    /**
     * Remove an event listener
     * @method removeEventListener
     * @param {String} Name of event to remove a listener for
     * @param {Function} Callback function
     */
    EventDispatcher.prototype.removeEventListener = function (type, listener) {
        var index = this.getEventListenerIndex(type, listener);
        if (index !== -1)
            this.listeners[type].splice(index, 1);
    };
    /**
     * Dispatch an event
     * @method dispatchEvent
     * @param {Event} Event to dispatch
     */
    EventDispatcher.prototype.dispatchEvent = function (event) {
        var listenerArray = this.listeners[event.type];
        if (listenerArray !== undefined) {
            var l = listenerArray.length;
            event.target = this.target;
            for (var i = 0; i < l; i++)
                listenerArray[i](event);
        }
    };
    /**
     * get Event Listener Index in array. Returns -1 if no listener is added
     * @method getEventListenerIndex
     * @param {String} Name of event to remove a listener for
     * @param {Function} Callback function
     */
    EventDispatcher.prototype.getEventListenerIndex = function (type, listener) {
        if (this.listeners[type] !== undefined) {
            var a = this.listeners[type];
            var l = a.length;
            for (var i = 0; i < l; i++)
                if (listener == a[i])
                    return i;
        }
        return -1;
    };
    /**
     * check if an object has an event listener assigned to it
     * @method hasListener
     * @param {String} Name of event to remove a listener for
     * @param {Function} Callback function
     */
    EventDispatcher.prototype.hasEventListener = function (type, listener) {
        if (listener != null) {
            return (this.getEventListenerIndex(type, listener) !== -1);
        }
        else {
            if (this.listeners[type] !== undefined)
                return (this.listeners[type].length > 0);
            return false;
        }
        return false;
    };
    return EventDispatcher;
})();
module.exports = EventDispatcher;


},{}],11:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Event = require("awayjs-core/lib/events/Event");
/**
 * @class away.events.HTTPStatusEvent
 */
var HTTPStatusEvent = (function (_super) {
    __extends(HTTPStatusEvent, _super);
    function HTTPStatusEvent(type, status) {
        if (status === void 0) { status = null; }
        _super.call(this, type);
        this.status = status;
    }
    HTTPStatusEvent.HTTP_STATUS = "httpStatus";
    return HTTPStatusEvent;
})(Event);
module.exports = HTTPStatusEvent;


},{"awayjs-core/lib/events/Event":9}],12:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Event = require("awayjs-core/lib/events/Event");
var IOErrorEvent = (function (_super) {
    __extends(IOErrorEvent, _super);
    function IOErrorEvent(type) {
        _super.call(this, type);
    }
    IOErrorEvent.IO_ERROR = "ioError";
    return IOErrorEvent;
})(Event);
module.exports = IOErrorEvent;


},{"awayjs-core/lib/events/Event":9}],13:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Event = require("awayjs-core/lib/events/Event");
var LoaderEvent = (function (_super) {
    __extends(LoaderEvent, _super);
    /**
     * Create a new LoaderEvent object.
     *
     * @param type The event type.
     * @param url The url of the loaded resource.
     * @param assets The assets of the loaded resource.
     */
    function LoaderEvent(type, url, content, assets) {
        if (url === void 0) { url = null; }
        if (content === void 0) { content = null; }
        if (assets === void 0) { assets = null; }
        _super.call(this, type);
        this._url = url;
        this._content = content;
        this._assets = assets;
    }
    Object.defineProperty(LoaderEvent.prototype, "content", {
        /**
         * The content returned if the resource has been loaded inside a <code>Loader</code> object.
         */
        get: function () {
            return this._content;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoaderEvent.prototype, "url", {
        /**
         * The url of the loaded resource.
         */
        get: function () {
            return this._url;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LoaderEvent.prototype, "assets", {
        /**
         * The error string on loadError.
         */
        get: function () {
            return this._assets;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Clones the current event.
     * @return An exact duplicate of the current event.
     */
    LoaderEvent.prototype.clone = function () {
        return new LoaderEvent(this.type, this._url, this._content, this._assets);
    };
    /**
     * Dispatched when a resource and all of its dependencies is retrieved.
     */
    LoaderEvent.RESOURCE_COMPLETE = "resourceComplete";
    return LoaderEvent;
})(Event);
module.exports = LoaderEvent;


},{"awayjs-core/lib/events/Event":9}],14:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Event = require("awayjs-core/lib/events/Event");
var ParserEvent = (function (_super) {
    __extends(ParserEvent, _super);
    function ParserEvent(type, message) {
        if (message === void 0) { message = ''; }
        _super.call(this, type);
        this._message = message;
    }
    Object.defineProperty(ParserEvent.prototype, "message", {
        /**
         * Additional human-readable message. Usually supplied for ParserEvent.PARSE_ERROR events.
         */
        get: function () {
            return this._message;
        },
        enumerable: true,
        configurable: true
    });
    ParserEvent.prototype.clone = function () {
        return new ParserEvent(this.type, this.message);
    };
    /**
     * Dispatched when parsing of an asset completed.
     */
    ParserEvent.PARSE_COMPLETE = 'parseComplete';
    /**
     * Dispatched when an error occurs while parsing the data (e.g. because it's
     * incorrectly formatted.)
     */
    ParserEvent.PARSE_ERROR = 'parseError';
    /**
     * Dispatched when a parser is ready to have dependencies retrieved and resolved.
     * This is an internal event that should rarely (if ever) be listened for by
     * external classes.
     */
    ParserEvent.READY_FOR_DEPENDENCIES = 'readyForDependencies';
    return ParserEvent;
})(Event);
module.exports = ParserEvent;


},{"awayjs-core/lib/events/Event":9}],15:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Event = require("awayjs-core/lib/events/Event");
var ProgressEvent = (function (_super) {
    __extends(ProgressEvent, _super);
    function ProgressEvent(type) {
        _super.call(this, type);
    }
    ProgressEvent.PROGRESS = "progress";
    return ProgressEvent;
})(Event);
module.exports = ProgressEvent;


},{"awayjs-core/lib/events/Event":9}],16:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Event = require("awayjs-core/lib/events/Event");
var ProjectionEvent = (function (_super) {
    __extends(ProjectionEvent, _super);
    function ProjectionEvent(type, projection) {
        _super.call(this, type);
        this._projection = projection;
    }
    Object.defineProperty(ProjectionEvent.prototype, "projection", {
        get: function () {
            return this._projection;
        },
        enumerable: true,
        configurable: true
    });
    ProjectionEvent.MATRIX_CHANGED = "matrixChanged";
    return ProjectionEvent;
})(Event);
module.exports = ProjectionEvent;


},{"awayjs-core/lib/events/Event":9}],17:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Event = require("awayjs-core/lib/events/Event");
var TimerEvent = (function (_super) {
    __extends(TimerEvent, _super);
    function TimerEvent(type) {
        _super.call(this, type);
    }
    TimerEvent.TIMER = "timer";
    TimerEvent.TIMER_COMPLETE = "timerComplete";
    return TimerEvent;
})(Event);
module.exports = TimerEvent;


},{"awayjs-core/lib/events/Event":9}],18:[function(require,module,exports){
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
/**
 * A Box object is an area defined by its position, as indicated by its
 * top-left-front corner point(<i>x</i>, <i>y</i>, <i>z</i>) and by its width,
 * height and depth.
 *
 *
 * <p>The <code>x</code>, <code>y</code>, <code>z</code>, <code>width</code>,
 * <code>height</code> <code>depth</code> properties of the Box class are
 * independent of each other; changing the value of one property has no effect
 * on the others. However, the <code>right</code>, <code>bottom</code> and
 * <code>back</code> properties are integrally related to those six
 * properties. For example, if you change the value of the <code>right</code>
 * property, the value of the <code>width</code> property changes; if you
 * change the <code>bottom</code> property, the value of the
 * <code>height</code> property changes. </p>
 *
 * <p>The following methods and properties use Box objects:</p>
 *
 * <ul>
 *   <li>The <code>bounds</code> property of the DisplayObject class</li>
 * </ul>
 *
 * <p>You can use the <code>new Box()</code> constructor to create a
 * Box object.</p>
 *
 * <p><b>Note:</b> The Box class does not define a cubic Shape
 * display object.
 */
var Box = (function () {
    /**
     * Creates a new Box object with the top-left-front corner specified by the
     * <code>x</code>, <code>y</code> and <code>z</code> parameters and with the
     * specified <code>width</code>, <code>height</code> and <code>depth</code>
     * parameters. If you call this public without parameters, a box with
     * <code>x</code>, <code>y</code>, <code>z</code>, <code>width</code>,
     * <code>height</code> and <code>depth</code> properties set to 0 is created.
     *
     * @param x      The <i>x</i> coordinate of the top-left-front corner of the
     *               box.
     * @param y      The <i>y</i> coordinate of the top-left-front corner of the
     *               box.
     * @param z      The <i>z</i> coordinate of the top-left-front corner of the
     *               box.
     * @param width  The width of the box, in pixels.
     * @param height The height of the box, in pixels.
     * @param depth The depth of the box, in pixels.
     */
    function Box(x, y, z, width, height, depth) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (z === void 0) { z = 0; }
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        if (depth === void 0) { depth = 0; }
        this.x = x;
        this.y = y;
        this.z = z;
        this.width = width;
        this.height = height;
        this.depth = depth;
    }
    Object.defineProperty(Box.prototype, "back", {
        /**
         * The sum of the <code>z</code> and <code>height</code> properties.
         */
        get: function () {
            return this.z + this.depth;
        },
        set: function (val) {
            this.depth = val - this.z;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Box.prototype, "bottom", {
        /**
         * The sum of the <code>y</code> and <code>height</code> properties.
         */
        get: function () {
            return this.y + this.height;
        },
        set: function (val) {
            this.height = val - this.y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Box.prototype, "bottomRightBack", {
        /**
         * The location of the Box object's bottom-right corner, determined by the
         * values of the <code>right</code> and <code>bottom</code> properties.
         */
        get: function () {
            if (this._bottomRightBack == null)
                this._bottomRightBack = new Vector3D();
            this._bottomRightBack.x = this.x + this.width;
            this._bottomRightBack.y = this.y + this.height;
            this._bottomRightBack.z = this.z + this.depth;
            return this._bottomRightBack;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Box.prototype, "front", {
        /**
         * The <i>z</i> coordinate of the top-left-front corner of the box. Changing
         * the <code>front</code> property of a Box object has no effect on the
         * <code>x</code>, <code>y</code>, <code>width</code> and <code>height</code>
         * properties. However it does affect the <code>depth</code> property,
         * whereas changing the <code>z</code> value does <i>not</i> affect the
         * <code>depth</code> property.
         *
         * <p>The value of the <code>left</code> property is equal to the value of
         * the <code>x</code> property.</p>
         */
        get: function () {
            return this.z;
        },
        set: function (val) {
            this.depth += this.z - val;
            this.z = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Box.prototype, "left", {
        /**
         * The <i>x</i> coordinate of the top-left corner of the box. Changing the
         * <code>left</code> property of a Box object has no effect on the
         * <code>y</code> and <code>height</code> properties. However it does affect
         * the <code>width</code> property, whereas changing the <code>x</code> value
         * does <i>not</i> affect the <code>width</code> property.
         *
         * <p>The value of the <code>left</code> property is equal to the value of
         * the <code>x</code> property.</p>
         */
        get: function () {
            return this.x;
        },
        set: function (val) {
            this.width += this.x - val;
            this.x = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Box.prototype, "right", {
        /**
         * The sum of the <code>x</code> and <code>width</code> properties.
         */
        get: function () {
            return this.x + this.width;
        },
        set: function (val) {
            this.width = val - this.x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Box.prototype, "size", {
        /**
         * The size of the Box object, expressed as a Vector3D object with the
         * values of the <code>width</code>, <code>height</code> and
         * <code>depth</code> properties.
         */
        get: function () {
            if (this._size == null)
                this._size = new Vector3D();
            this._size.x = this.width;
            this._size.y = this.height;
            this._size.z = this.depth;
            return this._size;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Box.prototype, "top", {
        /**
         * The <i>y</i> coordinate of the top-left-front corner of the box. Changing
         * the <code>top</code> property of a Box object has no effect on the
         * <code>x</code> and <code>width</code> properties. However it does affect
         * the <code>height</code> property, whereas changing the <code>y</code>
         * value does <i>not</i> affect the <code>height</code> property.
         *
         * <p>The value of the <code>top</code> property is equal to the value of the
         * <code>y</code> property.</p>
         */
        get: function () {
            return this.y;
        },
        set: function (val) {
            this.height += (this.y - val);
            this.y = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Box.prototype, "topLeftFront", {
        /**
         * The location of the Box object's top-left-front corner, determined by the
         * <i>x</i>, <i>y</i> and <i>z</i> coordinates of the point.
         */
        get: function () {
            if (this._topLeftFront == null)
                this._topLeftFront = new Vector3D();
            this._topLeftFront.x = this.x;
            this._topLeftFront.y = this.y;
            this._topLeftFront.z = this.z;
            return this._topLeftFront;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns a new Box object with the same values for the <code>x</code>,
     * <code>y</code>, <code>z</code>, <code>width</code>, <code>height</code>
     * and <code>depth</code> properties as the original Box object.
     *
     * @return A new Box object with the same values for the <code>x</code>,
     *         <code>y</code>, <code>z</code>, <code>width</code>,
     *         <code>height</code> and <code>depth</code> properties as the
     *         original Box object.
     */
    Box.prototype.clone = function () {
        return new Box(this.x, this.y, this.z, this.width, this.height, this.depth);
    };
    /**
     * Determines whether the specified position is contained within the cubic
     * region defined by this Box object.
     *
     * @param x The <i>x</i> coordinate(horizontal component) of the position.
     * @param y The <i>y</i> coordinate(vertical component) of the position.
     * @param z The <i>z</i> coordinate(longitudinal component) of the position.
     * @return A value of <code>true</code> if the Box object contains the
     *         specified position; otherwise <code>false</code>.
     */
    Box.prototype.contains = function (x, y, z) {
        return (this.x <= x && this.x + this.width >= x && this.y <= y && this.y + this.height >= y && this.z <= z && this.z + this.depth >= z);
    };
    /**
     * Determines whether the specified position is contained within the cubic
     * region defined by this Box object. This method is similar to the
     * <code>Box.contains()</code> method, except that it takes a Vector3D
     * object as a parameter.
     *
     * @param position The position, as represented by its <i>x</i>, <i>y</i> and
     *                 <i>z</i> coordinates.
     * @return A value of <code>true</code> if the Box object contains the
     *         specified position; otherwise <code>false</code>.
     */
    Box.prototype.containsPoint = function (position) {
        return (this.x <= position.x && this.x + this.width >= position.x && this.y <= position.y && this.y + this.height >= position.y && this.z <= position.z && this.z + this.depth >= position.z);
    };
    /**
     * Determines whether the Box object specified by the <code>box</code>
     * parameter is contained within this Box object. A Box object is said to
     * contain another if the second Box object falls entirely within the
     * boundaries of the first.
     *
     * @param box The Box object being checked.
     * @return A value of <code>true</code> if the Box object that you specify
     *         is contained by this Box object; otherwise <code>false</code>.
     */
    Box.prototype.containsRect = function (box) {
        return (this.x <= box.x && this.x + this.width >= box.x + box.width && this.y <= box.y && this.y + this.height >= box.y + box.height && this.z <= box.z && this.z + this.depth >= box.z + box.depth);
    };
    /**
     * Copies all of box data from the source Box object into the calling
     * Box object.
     *
     * @param sourceBox The Box object from which to copy the data.
     */
    Box.prototype.copyFrom = function (sourceBox) {
        //TODO
    };
    /**
     * Determines whether the object specified in the <code>toCompare</code>
     * parameter is equal to this Box object. This method compares the
     * <code>x</code>, <code>y</code>, <code>z</code>, <code>width</code>,
     * <code>height</code> and <code>depth</code> properties of an object against
     * the same properties of this Box object.
     *
     * @param toCompare The box to compare to this Box object.
     * @return A value of <code>true</code> if the object has exactly the same
     *         values for the <code>x</code>, <code>y</code>, <code>z</code>,
     *         <code>width</code>, <code>height</code> and <code>depth</code>
     *         properties as this Box object; otherwise <code>false</code>.
     */
    Box.prototype.equals = function (toCompare) {
        return (this.x == toCompare.x && this.y == toCompare.y && this.z == toCompare.z && this.width == toCompare.width && this.height == toCompare.height && this.depth == toCompare.depth);
    };
    /**
     * Increases the size of the Box object by the specified amounts, in
     * pixels. The center point of the Box object stays the same, and its
     * size increases to the left and right by the <code>dx</code> value, to
     * the top and the bottom by the <code>dy</code> value, and to
     * the front and the back by the <code>dz</code> value.
     *
     * @param dx The value to be added to the left and the right of the Box
     *           object. The following equation is used to calculate the new
     *           width and position of the box:
     * @param dy The value to be added to the top and the bottom of the Box
     *           object. The following equation is used to calculate the new
     *           height and position of the box:
     * @param dz The value to be added to the front and the back of the Box
     *           object. The following equation is used to calculate the new
     *           depth and position of the box:
     */
    Box.prototype.inflate = function (dx, dy, dz) {
        this.x -= dx / 2;
        this.y -= dy / 2;
        this.z -= dz / 2;
        this.width += dx / 2;
        this.height += dy / 2;
        this.depth += dz / 2;
    };
    /**
     * Increases the size of the Box object. This method is similar to the
     * <code>Box.inflate()</code> method except it takes a Vector3D object as
     * a parameter.
     *
     * <p>The following two code examples give the same result:</p>
     *
     * @param delta The <code>x</code> property of this Vector3D object is used to
     *              increase the horizontal dimension of the Box object.
     *              The <code>y</code> property is used to increase the vertical
     *              dimension of the Box object.
     *              The <code>z</code> property is used to increase the
     *              longitudinal dimension of the Box object.
     */
    Box.prototype.inflatePoint = function (delta) {
        this.x -= delta.x / 2;
        this.y -= delta.y / 2;
        this.z -= delta.z / 2;
        this.width += delta.x / 2;
        this.height += delta.y / 2;
        this.depth += delta.z / 2;
    };
    /**
     * If the Box object specified in the <code>toIntersect</code> parameter
     * intersects with this Box object, returns the area of intersection
     * as a Box object. If the boxes do not intersect, this method returns an
     * empty Box object with its properties set to 0.
     *
     * @param toIntersect The Box object to compare against to see if it
     *                    intersects with this Box object.
     * @return A Box object that equals the area of intersection. If the
     *         boxes do not intersect, this method returns an empty Box
     *         object; that is, a box with its <code>x</code>, <code>y</code>,
     *         <code>z</code>, <code>width</code>,  <code>height</code>, and
     *         <code>depth</code> properties set to 0.
     */
    Box.prototype.intersection = function (toIntersect) {
        if (this.intersects(toIntersect)) {
            var i = new Box();
            if (this.x > toIntersect.x) {
                i.x = this.x;
                i.width = toIntersect.x - this.x + toIntersect.width;
                if (i.width > this.width)
                    i.width = this.width;
            }
            else {
                i.x = toIntersect.x;
                i.width = this.x - toIntersect.x + this.width;
                if (i.width > toIntersect.width)
                    i.width = toIntersect.width;
            }
            if (this.y > toIntersect.y) {
                i.y = this.y;
                i.height = toIntersect.y - this.y + toIntersect.height;
                if (i.height > this.height)
                    i.height = this.height;
            }
            else {
                i.y = toIntersect.y;
                i.height = this.y - toIntersect.y + this.height;
                if (i.height > toIntersect.height)
                    i.height = toIntersect.height;
            }
            if (this.z > toIntersect.z) {
                i.z = this.z;
                i.depth = toIntersect.z - this.z + toIntersect.depth;
                if (i.depth > this.depth)
                    i.depth = this.depth;
            }
            else {
                i.z = toIntersect.z;
                i.depth = this.z - toIntersect.z + this.depth;
                if (i.depth > toIntersect.depth)
                    i.depth = toIntersect.depth;
            }
            return i;
        }
        return new Box();
    };
    /**
     * Determines whether the object specified in the <code>toIntersect</code>
     * parameter intersects with this Box object. This method checks the
     * <code>x</code>, <code>y</code>, <code>z</code>, <code>width</code>,
     * <code>height</code>, and <code>depth</code> properties of the specified
     * Box object to see if it intersects with this Box object.
     *
     * @param toIntersect The Box object to compare against this Box object.
     * @return A value of <code>true</code> if the specified object intersects
     *         with this Box object; otherwise <code>false</code>.
     */
    Box.prototype.intersects = function (toIntersect) {
        return (this.x + this.width > toIntersect.x && this.x < toIntersect.x + toIntersect.width && this.y + this.height > toIntersect.y && this.y < toIntersect.y + toIntersect.height && this.z + this.depth > toIntersect.z && this.z < toIntersect.z + toIntersect.depth);
    };
    /**
     * Determines whether or not this Box object is empty.
     *
     * @return A value of <code>true</code> if the Box object's width, height or
     *         depth is less than or equal to 0; otherwise <code>false</code>.
     */
    Box.prototype.isEmpty = function () {
        return (this.x == 0 && this.y == 0 && this.z == 0 && this.width == 0 && this.height == 0 && this.depth == 0);
    };
    /**
     * Adjusts the location of the Box object, as determined by its
     * top-left-front corner, by the specified amounts.
     *
     * @param dx Moves the <i>x</i> value of the Box object by this amount.
     * @param dy Moves the <i>y</i> value of the Box object by this amount.
     * @param dz Moves the <i>z</i> value of the Box object by this amount.
     */
    Box.prototype.offset = function (dx, dy, dz) {
        this.x += dx;
        this.y += dy;
        this.z += dz;
    };
    /**
     * Adjusts the location of the Box object using a Vector3D object as a
     * parameter. This method is similar to the <code>Box.offset()</code>
     * method, except that it takes a Vector3D object as a parameter.
     *
     * @param position A Vector3D object to use to offset this Box object.
     */
    Box.prototype.offsetPosition = function (position) {
        this.x += position.x;
        this.y += position.y;
        this.z += position.z;
    };
    /**
     * Sets all of the Box object's properties to 0. A Box object is empty if its
     * width, height or depth is less than or equal to 0.
     *
     * <p> This method sets the values of the <code>x</code>, <code>y</code>,
     * <code>z</code>, <code>width</code>, <code>height</code>, and
     * <code>depth</code> properties to 0.</p>
     *
     */
    Box.prototype.setEmpty = function () {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.width = 0;
        this.height = 0;
        this.depth = 0;
    };
    /**
     * Sets the members of Box to the specified values
     *
     * @param xa      The <i>x</i> coordinate of the top-left-front corner of the
     *                box.
     * @param ya      The <i>y</i> coordinate of the top-left-front corner of the
     *                box.
     * @param yz      The <i>z</i> coordinate of the top-left-front corner of the
     *                box.
     * @param widtha  The width of the box, in pixels.
     * @param heighta The height of the box, in pixels.
     * @param deptha  The depth of the box, in pixels.
     */
    Box.prototype.setTo = function (xa, ya, za, widtha, heighta, deptha) {
        this.x = xa;
        this.y = ya;
        this.z = za;
        this.width = widtha;
        this.height = heighta;
        this.depth = deptha;
    };
    /**
     * Builds and returns a string that lists the horizontal, vertical and
     * longitudinal positions and the width, height and depth of the Box object.
     *
     * @return A string listing the value of each of the following properties of
     *         the Box object: <code>x</code>, <code>y</code>, <code>z</code>,
     *         <code>width</code>, <code>height</code>, and <code>depth</code>.
     */
    Box.prototype.toString = function () {
        return "[Box] (x=" + this.x + ", y=" + this.y + ", z=" + this.z + ", width=" + this.width + ", height=" + this.height + ", depth=" + this.depth + ")";
    };
    /**
     * Adds two boxes together to create a new Box object, by filling
     * in the horizontal, vertical and longitudinal space between the two boxes.
     *
     * <p><b>Note:</b> The <code>union()</code> method ignores boxes with
     * <code>0</code> as the height, width or depth value, such as: <code>var
     * box2:Box = new Box(300,300,300,50,50,0);</code></p>
     *
     * @param toUnion A Box object to add to this Box object.
     * @return A new Box object that is the union of the two boxes.
     */
    Box.prototype.union = function (toUnion) {
        var u = new Box();
        if (this.x < toUnion.x) {
            u.x = this.x;
            u.width = toUnion.x - this.x + toUnion.width;
            if (u.width < this.width)
                u.width = this.width;
        }
        else {
            u.x = toUnion.x;
            u.width = this.x - toUnion.x + this.width;
            if (u.width < toUnion.width)
                u.width = toUnion.width;
        }
        if (this.y < toUnion.y) {
            u.y = this.y;
            u.height = toUnion.y - this.y + toUnion.height;
            if (u.height < this.height)
                u.height = this.height;
        }
        else {
            u.y = toUnion.y;
            u.height = this.y - toUnion.y + this.height;
            if (u.height < toUnion.height)
                u.height = toUnion.height;
        }
        if (this.z < toUnion.z) {
            u.z = this.z;
            u.depth = toUnion.z - this.z + toUnion.depth;
            if (u.depth < this.depth)
                u.depth = this.depth;
        }
        else {
            u.z = toUnion.z;
            u.depth = this.z - toUnion.z + this.depth;
            if (u.depth < toUnion.depth)
                u.depth = toUnion.depth;
        }
        return u;
    };
    return Box;
})();
module.exports = Box;


},{"awayjs-core/lib/geom/Vector3D":26}],19:[function(require,module,exports){
var Point = require("awayjs-core/lib/geom/Point");
var ArgumentError = require("awayjs-core/lib/errors/ArgumentError");
/**
 * The Matrix class represents a transformation matrix that determines how to
 * map points from one coordinate space to another. You can perform various
 * graphical transformations on a display object by setting the properties of
 * a Matrix object, applying that Matrix object to the <code>matrix</code>
 * property of a Transform object, and then applying that Transform object as
 * the <code>transform</code> property of the display object. These
 * transformation functions include translation(<i>x</i> and <i>y</i>
 * repositioning), rotation, scaling, and skewing.
 *
 * <p>Together these types of transformations are known as <i>affine
 * transformations</i>. Affine transformations preserve the straightness of
 * lines while transforming, so that parallel lines stay parallel.</p>
 *
 * <p>To apply a transformation matrix to a display object, you create a
 * Transform object, set its <code>matrix</code> property to the
 * transformation matrix, and then set the <code>transform</code> property of
 * the display object to the Transform object. Matrix objects are also used as
 * parameters of some methods, such as the following:</p>
 *
 * <ul>
 *   <li>The <code>draw()</code> method of a BitmapData object</li>
 *   <li>The <code>beginBitmapFill()</code> method,
 * <code>beginGradientFill()</code> method, or
 * <code>lineGradientStyle()</code> method of a Graphics object</li>
 * </ul>
 *
 * <p>A transformation matrix object is a 3 x 3 matrix with the following
 * contents:</p>
 *
 * <p>In traditional transformation matrixes, the <code>u</code>,
 * <code>v</code>, and <code>w</code> properties provide extra capabilities.
 * The Matrix class can only operate in two-dimensional space, so it always
 * assumes that the property values <code>u</code> and <code>v</code> are 0.0,
 * and that the property value <code>w</code> is 1.0. The effective values of
 * the matrix are as follows:</p>
 *
 * <p>You can get and set the values of all six of the other properties in a
 * Matrix object: <code>a</code>, <code>b</code>, <code>c</code>,
 * <code>d</code>, <code>tx</code>, and <code>ty</code>.</p>
 *
 * <p>The Matrix class supports the four major types of transformations:
 * translation, scaling, rotation, and skewing. You can set three of these
 * transformations by using specialized methods, as described in the following
 * table: </p>
 *
 * <p>Each transformation function alters the current matrix properties so
 * that you can effectively combine multiple transformations. To do this, you
 * call more than one transformation function before applying the matrix to
 * its display object target(by using the <code>transform</code> property of
 * that display object).</p>
 *
 * <p>Use the <code>new Matrix()</code> constructor to create a Matrix object
 * before you can call the methods of the Matrix object.</p>
 */
var Matrix = (function () {
    /**
     * Creates a new Matrix object with the specified parameters. In matrix
     * notation, the properties are organized like this:
     *
     * <p>If you do not provide any parameters to the <code>new Matrix()</code>
     * constructor, it creates an <i>identity matrix</i> with the following
     * values:</p>
     *
     * <p>In matrix notation, the identity matrix looks like this:</p>
     *
     * @param a  The value that affects the positioning of pixels along the
     *           <i>x</i> axis when scaling or rotating an image.
     * @param b  The value that affects the positioning of pixels along the
     *           <i>y</i> axis when rotating or skewing an image.
     * @param c  The value that affects the positioning of pixels along the
     *           <i>x</i> axis when rotating or skewing an image.
     * @param d  The value that affects the positioning of pixels along the
     *           <i>y</i> axis when scaling or rotating an image..
     * @param tx The distance by which to translate each point along the <i>x</i>
     *           axis.
     * @param ty The distance by which to translate each point along the <i>y</i>
     *           axis.
     */
    function Matrix(a, b, c, d, tx, ty) {
        if (a === void 0) { a = 1; }
        if (b === void 0) { b = 0; }
        if (c === void 0) { c = 0; }
        if (d === void 0) { d = 1; }
        if (tx === void 0) { tx = 0; }
        if (ty === void 0) { ty = 0; }
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;
    }
    /**
     * Returns a new Matrix object that is a clone of this matrix, with an exact
     * copy of the contained object.
     *
     * @return A Matrix object.
     */
    Matrix.prototype.clone = function () {
        return new Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
    };
    /**
     * Concatenates a matrix with the current matrix, effectively combining the
     * geometric effects of the two. In mathematical terms, concatenating two
     * matrixes is the same as combining them using matrix multiplication.
     *
     * <p>For example, if matrix <code>m1</code> scales an object by a factor of
     * four, and matrix <code>m2</code> rotates an object by 1.5707963267949
     * radians(<code>Math.PI/2</code>), then <code>m1.concat(m2)</code>
     * transforms <code>m1</code> into a matrix that scales an object by a factor
     * of four and rotates the object by <code>Math.PI/2</code> radians. </p>
     *
     * <p>This method replaces the source matrix with the concatenated matrix. If
     * you want to concatenate two matrixes without altering either of the two
     * source matrixes, first copy the source matrix by using the
     * <code>clone()</code> method, as shown in the Class Examples section.</p>
     *
     * @param matrix The matrix to be concatenated to the source matrix.
     */
    Matrix.prototype.concat = function (matrix) {
        var a1 = this.a * matrix.a + this.b * matrix.c;
        this.b = this.a * matrix.b + this.b * matrix.d;
        this.a = a1;
        var c1 = this.c * matrix.a + this.d * matrix.c;
        this.d = this.c * matrix.b + this.d * matrix.d;
        this.c = c1;
        var tx1 = this.tx * matrix.a + this.ty * matrix.c + matrix.tx;
        this.ty = this.tx * matrix.b + this.ty * matrix.d + matrix.ty;
        this.tx = tx1;
    };
    /**
     * Copies a Vector3D object into specific column of the calling Matrix3D
     * object.
     *
     * @param column   The column from which to copy the data from.
     * @param vector3D The Vector3D object from which to copy the data.
     */
    Matrix.prototype.copyColumnFrom = function (column, vector3D) {
        if (column > 2) {
            throw "Column " + column + " out of bounds (2)";
        }
        else if (column == 0) {
            this.a = vector3D.x;
            this.c = vector3D.y;
        }
        else if (column == 1) {
            this.b = vector3D.x;
            this.d = vector3D.y;
        }
        else {
            this.tx = vector3D.x;
            this.ty = vector3D.y;
        }
    };
    /**
     * Copies specific column of the calling Matrix object into the Vector3D
     * object. The w element of the Vector3D object will not be changed.
     *
     * @param column   The column from which to copy the data from.
     * @param vector3D The Vector3D object from which to copy the data.
     */
    Matrix.prototype.copyColumnTo = function (column, vector3D) {
        if (column > 2) {
            throw new ArgumentError("ArgumentError, Column " + column + " out of bounds [0, ..., 2]");
        }
        else if (column == 0) {
            vector3D.x = this.a;
            vector3D.y = this.c;
            vector3D.z = 0;
        }
        else if (column == 1) {
            vector3D.x = this.b;
            vector3D.y = this.d;
            vector3D.z = 0;
        }
        else {
            vector3D.x = this.tx;
            vector3D.y = this.ty;
            vector3D.z = 1;
        }
    };
    /**
     * Copies all of the matrix data from the source Point object into the
     * calling Matrix object.
     *
     * @param sourceMatrix The Matrix object from which to copy the data.
     */
    Matrix.prototype.copyFrom = function (sourceMatrix) {
        this.a = sourceMatrix.a;
        this.b = sourceMatrix.b;
        this.c = sourceMatrix.c;
        this.d = sourceMatrix.d;
        this.tx = sourceMatrix.tx;
        this.ty = sourceMatrix.ty;
    };
    /**
     * Copies a Vector3D object into specific row of the calling Matrix object.
     *
     * @param row      The row from which to copy the data from.
     * @param vector3D The Vector3D object from which to copy the data.
     */
    Matrix.prototype.copyRowFrom = function (row, vector3D) {
        if (row > 2) {
            throw new ArgumentError("ArgumentError, Row " + row + " out of bounds [0, ..., 2]");
        }
        else if (row == 0) {
            this.a = vector3D.x;
            this.c = vector3D.y;
        }
        else if (row == 1) {
            this.b = vector3D.x;
            this.d = vector3D.y;
        }
        else {
            this.tx = vector3D.x;
            this.ty = vector3D.y;
        }
    };
    /**
     * Copies specific row of the calling Matrix object into the Vector3D object.
     * The w element of the Vector3D object will not be changed.
     *
     * @param row      The row from which to copy the data from.
     * @param vector3D The Vector3D object from which to copy the data.
     */
    Matrix.prototype.copyRowTo = function (row, vector3D) {
        if (row > 2) {
            throw new ArgumentError("ArgumentError, Row " + row + " out of bounds [0, ..., 2]");
        }
        else if (row == 0) {
            vector3D.x = this.a;
            vector3D.y = this.b;
            vector3D.z = this.tx;
        }
        else if (row == 1) {
            vector3D.x = this.c;
            vector3D.y = this.d;
            vector3D.z = this.ty;
        }
        else {
            vector3D.setTo(0, 0, 1);
        }
    };
    /**
     * Includes parameters for scaling, rotation, and translation. When applied
     * to a matrix it sets the matrix's values based on those parameters.
     *
     * <p>Using the <code>createBox()</code> method lets you obtain the same
     * matrix as you would if you applied the <code>identity()</code>,
     * <code>rotate()</code>, <code>scale()</code>, and <code>translate()</code>
     * methods in succession. For example, <code>mat1.createBox(2,2,Math.PI/4,
     * 100, 100)</code> has the same effect as the following:</p>
     *
     * @param scaleX   The factor by which to scale horizontally.
     * @param scaleY   The factor by which scale vertically.
     * @param rotation The amount to rotate, in radians.
     * @param tx       The number of pixels to translate(move) to the right
     *                 along the <i>x</i> axis.
     * @param ty       The number of pixels to translate(move) down along the
     *                 <i>y</i> axis.
     */
    Matrix.prototype.createBox = function (scaleX, scaleY, rotation, tx, ty) {
        if (rotation === void 0) { rotation = 0; }
        if (tx === void 0) { tx = 0; }
        if (ty === void 0) { ty = 0; }
        this.a = scaleX;
        this.d = scaleY;
        this.b = rotation;
        this.tx = tx;
        this.ty = ty;
    };
    /**
     * Creates the specific style of matrix expected by the
     * <code>beginGradientFill()</code> and <code>lineGradientStyle()</code>
     * methods of the Graphics class. Width and height are scaled to a
     * <code>scaleX</code>/<code>scaleY</code> pair and the
     * <code>tx</code>/<code>ty</code> values are offset by half the width and
     * height.
     *
     * <p>For example, consider a gradient with the following
     * characteristics:</p>
     *
     * <ul>
     *   <li><code>GradientType.LINEAR</code></li>
     *   <li>Two colors, green and blue, with the ratios array set to <code>[0,
     * 255]</code></li>
     *   <li><code>SpreadMethod.PAD</code></li>
     *   <li><code>InterpolationMethod.LINEAR_RGB</code></li>
     * </ul>
     *
     * <p>The following illustrations show gradients in which the matrix was
     * defined using the <code>createGradientBox()</code> method with different
     * parameter settings:</p>
     *
     * @param width    The width of the gradient box.
     * @param height   The height of the gradient box.
     * @param rotation The amount to rotate, in radians.
     * @param tx       The distance, in pixels, to translate to the right along
     *                 the <i>x</i> axis. This value is offset by half of the
     *                 <code>width</code> parameter.
     * @param ty       The distance, in pixels, to translate down along the
     *                 <i>y</i> axis. This value is offset by half of the
     *                 <code>height</code> parameter.
     */
    Matrix.prototype.createGradientBox = function (width, height, rotation, tx, ty) {
        if (rotation === void 0) { rotation = 0; }
        if (tx === void 0) { tx = 0; }
        if (ty === void 0) { ty = 0; }
        this.a = width / 1638.4;
        this.d = height / 1638.4;
        if (rotation != 0.0) {
            var cos = Math.cos(rotation);
            var sin = Math.sin(rotation);
            this.b = sin * this.d;
            this.c = -sin * this.a;
            this.a *= cos;
            this.d *= cos;
        }
        else {
            this.b = this.c = 0;
        }
        this.tx = tx + width / 2;
        this.ty = ty + height / 2;
    };
    /**
     * Given a point in the pretransform coordinate space, returns the
     * coordinates of that point after the transformation occurs. Unlike the
     * standard transformation applied using the <code>transformPoint()</code>
     * method, the <code>deltaTransformPoint()</code> method's transformation
     * does not consider the translation parameters <code>tx</code> and
     * <code>ty</code>.
     *
     * @param point The point for which you want to get the result of the matrix
     *              transformation.
     * @return The point resulting from applying the matrix transformation.
     */
    Matrix.prototype.deltaTransformPoint = function (point) {
        return new Point(point.x * this.a + point.y * this.c, point.x * this.b + point.y * this.d);
    };
    /**
     * Sets each matrix property to a value that causes a null transformation. An
     * object transformed by applying an identity matrix will be identical to the
     * original.
     *
     * <p>After calling the <code>identity()</code> method, the resulting matrix
     * has the following properties: <code>a</code>=1, <code>b</code>=0,
     * <code>c</code>=0, <code>d</code>=1, <code>tx</code>=0,
     * <code>ty</code>=0.</p>
     *
     * <p>In matrix notation, the identity matrix looks like this:</p>
     *
     */
    Matrix.prototype.identity = function () {
        this.a = 1;
        this.b = 0;
        this.c = 0;
        this.d = 1;
        this.tx = 0;
        this.ty = 0;
    };
    /**
     * Performs the opposite transformation of the original matrix. You can apply
     * an inverted matrix to an object to undo the transformation performed when
     * applying the original matrix.
     */
    Matrix.prototype.invert = function () {
        var norm = this.a * this.d - this.b * this.c;
        if (norm == 0) {
            this.a = this.b = this.c = this.d = 0;
            this.tx = -this.tx;
            this.ty = -this.ty;
        }
        else {
            norm = 1.0 / norm;
            var a1 = this.d * norm;
            this.d = this.a * norm;
            this.a = a1;
            this.b *= -norm;
            this.c *= -norm;
            var tx1 = -this.a * this.tx - this.c * this.ty;
            this.ty = -this.b * this.tx - this.d * this.ty;
            this.tx = tx1;
        }
    };
    /**
     * Returns a new Matrix object that is a clone of this matrix, with an exact
     * copy of the contained object.
     *
     * @param matrix The matrix for which you want to get the result of the matrix
     *               transformation.
     * @return A Matrix object.
     */
    Matrix.prototype.multiply = function (matrix) {
        var result = new Matrix();
        result.a = this.a * matrix.a + this.b * matrix.c;
        result.b = this.a * matrix.b + this.b * matrix.d;
        result.c = this.c * matrix.a + this.d * matrix.c;
        result.d = this.c * matrix.b + this.d * matrix.d;
        result.tx = this.tx * matrix.a + this.ty * matrix.c + matrix.tx;
        result.ty = this.tx * matrix.b + this.ty * matrix.d + matrix.ty;
        return result;
    };
    /**
     * Applies a rotation transformation to the Matrix object.
     *
     * <p>The <code>rotate()</code> method alters the <code>a</code>,
     * <code>b</code>, <code>c</code>, and <code>d</code> properties of the
     * Matrix object. In matrix notation, this is the same as concatenating the
     * current matrix with the following:</p>
     *
     * @param angle The rotation angle in radians.
     */
    Matrix.prototype.rotate = function (angle) {
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        var a1 = this.a * cos - this.b * sin;
        this.b = this.a * sin + this.b * cos;
        this.a = a1;
        var c1 = this.c * cos - this.d * sin;
        this.d = this.c * sin + this.d * cos;
        this.c = c1;
        var tx1 = this.tx * cos - this.ty * sin;
        this.ty = this.tx * sin + this.ty * cos;
        this.tx = tx1;
    };
    /**
     * Applies a scaling transformation to the matrix. The <i>x</i> axis is
     * multiplied by <code>sx</code>, and the <i>y</i> axis it is multiplied by
     * <code>sy</code>.
     *
     * <p>The <code>scale()</code> method alters the <code>a</code> and
     * <code>d</code> properties of the Matrix object. In matrix notation, this
     * is the same as concatenating the current matrix with the following
     * matrix:</p>
     *
     * @param sx A multiplier used to scale the object along the <i>x</i> axis.
     * @param sy A multiplier used to scale the object along the <i>y</i> axis.
     */
    Matrix.prototype.scale = function (sx, sy) {
        this.a *= sx;
        this.b *= sy;
        this.c *= sx;
        this.d *= sy;
        this.tx *= sx;
        this.ty *= sy;
    };
    /**
     * Sets the members of Matrix to the specified values.
     *
     * @param a  The value that affects the positioning of pixels along the
     *           <i>x</i> axis when scaling or rotating an image.
     * @param b  The value that affects the positioning of pixels along the
     *           <i>y</i> axis when rotating or skewing an image.
     * @param c  The value that affects the positioning of pixels along the
     *           <i>x</i> axis when rotating or skewing an image.
     * @param d  The value that affects the positioning of pixels along the
     *           <i>y</i> axis when scaling or rotating an image..
     * @param tx The distance by which to translate each point along the <i>x</i>
     *           axis.
     * @param ty The distance by which to translate each point along the <i>y</i>
     *           axis.
     */
    Matrix.prototype.setTo = function (a, b, c, d, tx, ty) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;
    };
    /**
     * Returns a text value listing the properties of the Matrix object.
     *
     * @return A string containing the values of the properties of the Matrix
     *         object: <code>a</code>, <code>b</code>, <code>c</code>,
     *         <code>d</code>, <code>tx</code>, and <code>ty</code>.
     */
    Matrix.prototype.toString = function () {
        return "[Matrix] (a=" + this.a + ", b=" + this.b + ", c=" + this.c + ", d=" + this.d + ", tx=" + this.tx + ", ty=" + this.ty + ")";
    };
    /**
     * Returns the result of applying the geometric transformation represented by
     * the Matrix object to the specified point.
     *
     * @param point The point for which you want to get the result of the Matrix
     *              transformation.
     * @return The point resulting from applying the Matrix transformation.
     */
    Matrix.prototype.transformPoint = function (point) {
        return new Point(point.x * this.a + point.y * this.c + this.tx, point.x * this.b + point.y * this.d + this.ty);
    };
    /**
     * Translates the matrix along the <i>x</i> and <i>y</i> axes, as specified
     * by the <code>dx</code> and <code>dy</code> parameters.
     *
     * @param dx The amount of movement along the <i>x</i> axis to the right, in
     *           pixels.
     * @param dy The amount of movement down along the <i>y</i> axis, in pixels.
     */
    Matrix.prototype.translate = function (dx, dy) {
        this.tx += dx;
        this.ty += dy;
    };
    return Matrix;
})();
module.exports = Matrix;


},{"awayjs-core/lib/errors/ArgumentError":5,"awayjs-core/lib/geom/Point":24}],20:[function(require,module,exports){
var Orientation3D = require("awayjs-core/lib/geom/Orientation3D");
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var ArgumentError = require("awayjs-core/lib/errors/ArgumentError");
var Matrix3D = (function () {
    /**
     * Creates a Matrix3D object.
     */
    function Matrix3D(v) {
        if (v === void 0) { v = null; }
        if (v != null && v.length == 16)
            this.rawData = v.concat();
        else
            this.rawData = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    }
    /**
     * Appends the matrix by multiplying another Matrix3D object by the current Matrix3D object.
     */
    Matrix3D.prototype.append = function (lhs) {
        var m111 = this.rawData[0], m121 = this.rawData[4], m131 = this.rawData[8], m141 = this.rawData[12], m112 = this.rawData[1], m122 = this.rawData[5], m132 = this.rawData[9], m142 = this.rawData[13], m113 = this.rawData[2], m123 = this.rawData[6], m133 = this.rawData[10], m143 = this.rawData[14], m114 = this.rawData[3], m124 = this.rawData[7], m134 = this.rawData[11], m144 = this.rawData[15], m211 = lhs.rawData[0], m221 = lhs.rawData[4], m231 = lhs.rawData[8], m241 = lhs.rawData[12], m212 = lhs.rawData[1], m222 = lhs.rawData[5], m232 = lhs.rawData[9], m242 = lhs.rawData[13], m213 = lhs.rawData[2], m223 = lhs.rawData[6], m233 = lhs.rawData[10], m243 = lhs.rawData[14], m214 = lhs.rawData[3], m224 = lhs.rawData[7], m234 = lhs.rawData[11], m244 = lhs.rawData[15];
        this.rawData[0] = m111 * m211 + m112 * m221 + m113 * m231 + m114 * m241;
        this.rawData[1] = m111 * m212 + m112 * m222 + m113 * m232 + m114 * m242;
        this.rawData[2] = m111 * m213 + m112 * m223 + m113 * m233 + m114 * m243;
        this.rawData[3] = m111 * m214 + m112 * m224 + m113 * m234 + m114 * m244;
        this.rawData[4] = m121 * m211 + m122 * m221 + m123 * m231 + m124 * m241;
        this.rawData[5] = m121 * m212 + m122 * m222 + m123 * m232 + m124 * m242;
        this.rawData[6] = m121 * m213 + m122 * m223 + m123 * m233 + m124 * m243;
        this.rawData[7] = m121 * m214 + m122 * m224 + m123 * m234 + m124 * m244;
        this.rawData[8] = m131 * m211 + m132 * m221 + m133 * m231 + m134 * m241;
        this.rawData[9] = m131 * m212 + m132 * m222 + m133 * m232 + m134 * m242;
        this.rawData[10] = m131 * m213 + m132 * m223 + m133 * m233 + m134 * m243;
        this.rawData[11] = m131 * m214 + m132 * m224 + m133 * m234 + m134 * m244;
        this.rawData[12] = m141 * m211 + m142 * m221 + m143 * m231 + m144 * m241;
        this.rawData[13] = m141 * m212 + m142 * m222 + m143 * m232 + m144 * m242;
        this.rawData[14] = m141 * m213 + m142 * m223 + m143 * m233 + m144 * m243;
        this.rawData[15] = m141 * m214 + m142 * m224 + m143 * m234 + m144 * m244;
    };
    /**
     * Appends an incremental rotation to a Matrix3D object.
     */
    Matrix3D.prototype.appendRotation = function (degrees, axis) {
        var m = Matrix3D.getAxisRotation(axis.x, axis.y, axis.z, degrees);
        this.append(m);
    };
    /**
     * Appends an incremental scale change along the x, y, and z axes to a Matrix3D object.
     */
    Matrix3D.prototype.appendScale = function (xScale, yScale, zScale) {
        this.append(new Matrix3D([xScale, 0.0, 0.0, 0.0, 0.0, yScale, 0.0, 0.0, 0.0, 0.0, zScale, 0.0, 0.0, 0.0, 0.0, 1.0]));
    };
    /**
     * Appends an incremental translation, a repositioning along the x, y, and z axes, to a Matrix3D object.
     */
    Matrix3D.prototype.appendTranslation = function (x, y, z) {
        this.rawData[12] += x;
        this.rawData[13] += y;
        this.rawData[14] += z;
    };
    /**
     * Returns a new Matrix3D object that is an exact copy of the current Matrix3D object.
     */
    Matrix3D.prototype.clone = function () {
        return new Matrix3D(this.rawData.slice(0));
    };
    /**
     * Copies a Vector3D object into specific column of the calling Matrix3D object.
     */
    Matrix3D.prototype.copyColumnFrom = function (column, vector3D) {
        switch (column) {
            case 0:
                this.rawData[0] = vector3D.x;
                this.rawData[1] = vector3D.y;
                this.rawData[2] = vector3D.z;
                this.rawData[3] = vector3D.w;
                break;
            case 1:
                this.rawData[4] = vector3D.x;
                this.rawData[5] = vector3D.y;
                this.rawData[6] = vector3D.z;
                this.rawData[7] = vector3D.w;
                break;
            case 2:
                this.rawData[8] = vector3D.x;
                this.rawData[9] = vector3D.y;
                this.rawData[10] = vector3D.z;
                this.rawData[11] = vector3D.w;
                break;
            case 3:
                this.rawData[12] = vector3D.x;
                this.rawData[13] = vector3D.y;
                this.rawData[14] = vector3D.z;
                this.rawData[15] = vector3D.w;
                break;
            default:
                throw new ArgumentError("ArgumentError, Column " + column + " out of bounds [0, ..., 3]");
        }
    };
    /**
     * Copies specific column of the calling Matrix3D object into the Vector3D object.
     */
    Matrix3D.prototype.copyColumnTo = function (column, vector3D) {
        switch (column) {
            case 0:
                vector3D.x = this.rawData[0];
                vector3D.y = this.rawData[1];
                vector3D.z = this.rawData[2];
                vector3D.w = this.rawData[3];
                break;
            case 1:
                vector3D.x = this.rawData[4];
                vector3D.y = this.rawData[5];
                vector3D.z = this.rawData[6];
                vector3D.w = this.rawData[7];
                break;
            case 2:
                vector3D.x = this.rawData[8];
                vector3D.y = this.rawData[9];
                vector3D.z = this.rawData[10];
                vector3D.w = this.rawData[11];
                break;
            case 3:
                vector3D.x = this.rawData[12];
                vector3D.y = this.rawData[13];
                vector3D.z = this.rawData[14];
                vector3D.w = this.rawData[15];
                break;
            default:
                throw new ArgumentError("ArgumentError, Column " + column + " out of bounds [0, ..., 3]");
        }
    };
    /**
     * Copies all of the matrix data from the source Matrix3D object into the calling Matrix3D object.
     */
    Matrix3D.prototype.copyFrom = function (sourceMatrix3D) {
        var len = sourceMatrix3D.rawData.length;
        for (var c = 0; c < len; c++)
            this.rawData[c] = sourceMatrix3D.rawData[c];
    };
    Matrix3D.prototype.copyRawDataFrom = function (vector, index, transpose) {
        if (index === void 0) { index = 0; }
        if (transpose === void 0) { transpose = false; }
        if (transpose)
            this.transpose();
        var len = vector.length - index;
        for (var c = 0; c < len; c++)
            this.rawData[c] = vector[c + index];
        if (transpose)
            this.transpose();
    };
    Matrix3D.prototype.copyRawDataTo = function (vector, index, transpose) {
        if (index === void 0) { index = 0; }
        if (transpose === void 0) { transpose = false; }
        if (transpose)
            this.transpose();
        var len = this.rawData.length;
        for (var c = 0; c < len; c++)
            vector[c + index] = this.rawData[c];
        if (transpose)
            this.transpose();
    };
    /**
     * Copies a Vector3D object into specific row of the calling Matrix3D object.
     */
    Matrix3D.prototype.copyRowFrom = function (row, vector3D) {
        switch (row) {
            case 0:
                this.rawData[0] = vector3D.x;
                this.rawData[4] = vector3D.y;
                this.rawData[8] = vector3D.z;
                this.rawData[12] = vector3D.w;
                break;
            case 1:
                this.rawData[1] = vector3D.x;
                this.rawData[5] = vector3D.y;
                this.rawData[9] = vector3D.z;
                this.rawData[13] = vector3D.w;
                break;
            case 2:
                this.rawData[2] = vector3D.x;
                this.rawData[6] = vector3D.y;
                this.rawData[10] = vector3D.z;
                this.rawData[14] = vector3D.w;
                break;
            case 3:
                this.rawData[3] = vector3D.x;
                this.rawData[7] = vector3D.y;
                this.rawData[11] = vector3D.z;
                this.rawData[15] = vector3D.w;
                break;
            default:
                throw new ArgumentError("ArgumentError, Row " + row + " out of bounds [0, ..., 3]");
        }
    };
    /**
     * Copies specific row of the calling Matrix3D object into the Vector3D object.
     */
    Matrix3D.prototype.copyRowTo = function (row, vector3D) {
        switch (row) {
            case 0:
                vector3D.x = this.rawData[0];
                vector3D.y = this.rawData[4];
                vector3D.z = this.rawData[8];
                vector3D.w = this.rawData[12];
                break;
            case 1:
                vector3D.x = this.rawData[1];
                vector3D.y = this.rawData[5];
                vector3D.z = this.rawData[9];
                vector3D.w = this.rawData[13];
                break;
            case 2:
                vector3D.x = this.rawData[2];
                vector3D.y = this.rawData[6];
                vector3D.z = this.rawData[10];
                vector3D.w = this.rawData[14];
                break;
            case 3:
                vector3D.x = this.rawData[3];
                vector3D.y = this.rawData[7];
                vector3D.z = this.rawData[11];
                vector3D.w = this.rawData[15];
                break;
            default:
                throw new ArgumentError("ArgumentError, Row " + row + " out of bounds [0, ..., 3]");
        }
    };
    /**
     * Copies this Matrix3D object into a destination Matrix3D object.
     */
    Matrix3D.prototype.copyToMatrix3D = function (dest) {
        dest.rawData = this.rawData.slice(0);
    };
    /**
     * Returns the transformation matrix's translation, rotation, and scale settings as a Vector of three Vector3D objects.
     */
    Matrix3D.prototype.decompose = function (orientationStyle) {
        if (orientationStyle === void 0) { orientationStyle = "eulerAngles"; }
        var q;
        // Initial Tests - Not OK
        var vec = [];
        var m = this.clone();
        var mr = m.rawData;
        var pos = new Vector3D(mr[12], mr[13], mr[14]);
        mr[12] = 0;
        mr[13] = 0;
        mr[14] = 0;
        var scale = new Vector3D();
        scale.x = Math.sqrt(mr[0] * mr[0] + mr[1] * mr[1] + mr[2] * mr[2]);
        scale.y = Math.sqrt(mr[4] * mr[4] + mr[5] * mr[5] + mr[6] * mr[6]);
        scale.z = Math.sqrt(mr[8] * mr[8] + mr[9] * mr[9] + mr[10] * mr[10]);
        if (mr[0] * (mr[5] * mr[10] - mr[6] * mr[9]) - mr[1] * (mr[4] * mr[10] - mr[6] * mr[8]) + mr[2] * (mr[4] * mr[9] - mr[5] * mr[8]) < 0)
            scale.z = -scale.z;
        mr[0] /= scale.x;
        mr[1] /= scale.x;
        mr[2] /= scale.x;
        mr[4] /= scale.y;
        mr[5] /= scale.y;
        mr[6] /= scale.y;
        mr[8] /= scale.z;
        mr[9] /= scale.z;
        mr[10] /= scale.z;
        var rot = new Vector3D();
        switch (orientationStyle) {
            case Orientation3D.AXIS_ANGLE:
                rot.w = Math.acos((mr[0] + mr[5] + mr[10] - 1) / 2);
                var len = Math.sqrt((mr[6] - mr[9]) * (mr[6] - mr[9]) + (mr[8] - mr[2]) * (mr[8] - mr[2]) + (mr[1] - mr[4]) * (mr[1] - mr[4]));
                rot.x = (mr[6] - mr[9]) / len;
                rot.y = (mr[8] - mr[2]) / len;
                rot.z = (mr[1] - mr[4]) / len;
                break;
            case Orientation3D.QUATERNION:
                var tr = mr[0] + mr[5] + mr[10];
                if (tr > 0) {
                    rot.w = Math.sqrt(1 + tr) / 2;
                    rot.x = (mr[6] - mr[9]) / (4 * rot.w);
                    rot.y = (mr[8] - mr[2]) / (4 * rot.w);
                    rot.z = (mr[1] - mr[4]) / (4 * rot.w);
                }
                else if ((mr[0] > mr[5]) && (mr[0] > mr[10])) {
                    rot.x = Math.sqrt(1 + mr[0] - mr[5] - mr[10]) / 2;
                    rot.w = (mr[6] - mr[9]) / (4 * rot.x);
                    rot.y = (mr[1] + mr[4]) / (4 * rot.x);
                    rot.z = (mr[8] + mr[2]) / (4 * rot.x);
                }
                else if (mr[5] > mr[10]) {
                    rot.y = Math.sqrt(1 + mr[5] - mr[0] - mr[10]) / 2;
                    rot.x = (mr[1] + mr[4]) / (4 * rot.y);
                    rot.w = (mr[8] - mr[2]) / (4 * rot.y);
                    rot.z = (mr[6] + mr[9]) / (4 * rot.y);
                }
                else {
                    rot.z = Math.sqrt(1 + mr[10] - mr[0] - mr[5]) / 2;
                    rot.x = (mr[8] + mr[2]) / (4 * rot.z);
                    rot.y = (mr[6] + mr[9]) / (4 * rot.z);
                    rot.w = (mr[1] - mr[4]) / (4 * rot.z);
                }
                break;
            case Orientation3D.EULER_ANGLES:
                rot.y = Math.asin(-mr[2]);
                //var cos:number = Math.cos(rot.y);
                if (mr[2] != 1 && mr[2] != -1) {
                    rot.x = Math.atan2(mr[6], mr[10]);
                    rot.z = Math.atan2(mr[1], mr[0]);
                }
                else {
                    rot.z = 0;
                    rot.x = Math.atan2(mr[4], mr[5]);
                }
                break;
        }
        vec.push(pos);
        vec.push(rot);
        vec.push(scale);
        return vec;
    };
    /**
     * Uses the transformation matrix without its translation elements to transform a Vector3D object from one space
     * coordinate to another.
     */
    Matrix3D.prototype.deltaTransformVector = function (v) {
        var x = v.x;
        var y = v.y;
        var z = v.z;
        return new Vector3D((x * this.rawData[0] + y * this.rawData[4] + z * this.rawData[8]), (x * this.rawData[1] + y * this.rawData[5] + z * this.rawData[9]), (x * this.rawData[2] + y * this.rawData[6] + z * this.rawData[10]), (x * this.rawData[3] + y * this.rawData[7] + z * this.rawData[11]));
    };
    /**
     * Converts the current matrix to an identity or unit matrix.
     */
    Matrix3D.prototype.identity = function () {
        this.rawData = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    };
    /**
     * [static] Interpolates the translation, rotation, and scale transformation of one matrix toward those of the target matrix.
     */
    Matrix3D.interpolate = function (thisMat, toMat, percent) {
        var m = new Matrix3D();
        for (var i = 0; i < 16; ++i)
            m.rawData[i] = thisMat.rawData[i] + (toMat.rawData[i] - thisMat.rawData[i]) * percent;
        return m;
    };
    /**
     * Interpolates this matrix towards the translation, rotation, and scale transformations of the target matrix.
     */
    Matrix3D.prototype.interpolateTo = function (toMat, percent) {
        for (var i = 0; i < 16; ++i)
            this.rawData[i] = this.rawData[i] + (toMat.rawData[i] - this.rawData[i]) * percent;
    };
    /**
     * Inverts the current matrix.
     */
    Matrix3D.prototype.invert = function () {
        var d = this.determinant;
        var invertable = Math.abs(d) > 0.00000000001;
        if (invertable) {
            d = 1 / d;
            var m11 = this.rawData[0];
            var m21 = this.rawData[4];
            var m31 = this.rawData[8];
            var m41 = this.rawData[12];
            var m12 = this.rawData[1];
            var m22 = this.rawData[5];
            var m32 = this.rawData[9];
            var m42 = this.rawData[13];
            var m13 = this.rawData[2];
            var m23 = this.rawData[6];
            var m33 = this.rawData[10];
            var m43 = this.rawData[14];
            var m14 = this.rawData[3];
            var m24 = this.rawData[7];
            var m34 = this.rawData[11];
            var m44 = this.rawData[15];
            this.rawData[0] = d * (m22 * (m33 * m44 - m43 * m34) - m32 * (m23 * m44 - m43 * m24) + m42 * (m23 * m34 - m33 * m24));
            this.rawData[1] = -d * (m12 * (m33 * m44 - m43 * m34) - m32 * (m13 * m44 - m43 * m14) + m42 * (m13 * m34 - m33 * m14));
            this.rawData[2] = d * (m12 * (m23 * m44 - m43 * m24) - m22 * (m13 * m44 - m43 * m14) + m42 * (m13 * m24 - m23 * m14));
            this.rawData[3] = -d * (m12 * (m23 * m34 - m33 * m24) - m22 * (m13 * m34 - m33 * m14) + m32 * (m13 * m24 - m23 * m14));
            this.rawData[4] = -d * (m21 * (m33 * m44 - m43 * m34) - m31 * (m23 * m44 - m43 * m24) + m41 * (m23 * m34 - m33 * m24));
            this.rawData[5] = d * (m11 * (m33 * m44 - m43 * m34) - m31 * (m13 * m44 - m43 * m14) + m41 * (m13 * m34 - m33 * m14));
            this.rawData[6] = -d * (m11 * (m23 * m44 - m43 * m24) - m21 * (m13 * m44 - m43 * m14) + m41 * (m13 * m24 - m23 * m14));
            this.rawData[7] = d * (m11 * (m23 * m34 - m33 * m24) - m21 * (m13 * m34 - m33 * m14) + m31 * (m13 * m24 - m23 * m14));
            this.rawData[8] = d * (m21 * (m32 * m44 - m42 * m34) - m31 * (m22 * m44 - m42 * m24) + m41 * (m22 * m34 - m32 * m24));
            this.rawData[9] = -d * (m11 * (m32 * m44 - m42 * m34) - m31 * (m12 * m44 - m42 * m14) + m41 * (m12 * m34 - m32 * m14));
            this.rawData[10] = d * (m11 * (m22 * m44 - m42 * m24) - m21 * (m12 * m44 - m42 * m14) + m41 * (m12 * m24 - m22 * m14));
            this.rawData[11] = -d * (m11 * (m22 * m34 - m32 * m24) - m21 * (m12 * m34 - m32 * m14) + m31 * (m12 * m24 - m22 * m14));
            this.rawData[12] = -d * (m21 * (m32 * m43 - m42 * m33) - m31 * (m22 * m43 - m42 * m23) + m41 * (m22 * m33 - m32 * m23));
            this.rawData[13] = d * (m11 * (m32 * m43 - m42 * m33) - m31 * (m12 * m43 - m42 * m13) + m41 * (m12 * m33 - m32 * m13));
            this.rawData[14] = -d * (m11 * (m22 * m43 - m42 * m23) - m21 * (m12 * m43 - m42 * m13) + m41 * (m12 * m23 - m22 * m13));
            this.rawData[15] = d * (m11 * (m22 * m33 - m32 * m23) - m21 * (m12 * m33 - m32 * m13) + m31 * (m12 * m23 - m22 * m13));
        }
        return invertable;
    };
    /* TODO implement pointAt
     public pointAt( pos:Vector3D, at:Vector3D = null, up:Vector3D = null )
     {
     }
     */
    /**
     * Prepends a matrix by multiplying the current Matrix3D object by another Matrix3D object.
     */
    Matrix3D.prototype.prepend = function (rhs) {
        var m111 = rhs.rawData[0], m121 = rhs.rawData[4], m131 = rhs.rawData[8], m141 = rhs.rawData[12], m112 = rhs.rawData[1], m122 = rhs.rawData[5], m132 = rhs.rawData[9], m142 = rhs.rawData[13], m113 = rhs.rawData[2], m123 = rhs.rawData[6], m133 = rhs.rawData[10], m143 = rhs.rawData[14], m114 = rhs.rawData[3], m124 = rhs.rawData[7], m134 = rhs.rawData[11], m144 = rhs.rawData[15], m211 = this.rawData[0], m221 = this.rawData[4], m231 = this.rawData[8], m241 = this.rawData[12], m212 = this.rawData[1], m222 = this.rawData[5], m232 = this.rawData[9], m242 = this.rawData[13], m213 = this.rawData[2], m223 = this.rawData[6], m233 = this.rawData[10], m243 = this.rawData[14], m214 = this.rawData[3], m224 = this.rawData[7], m234 = this.rawData[11], m244 = this.rawData[15];
        this.rawData[0] = m111 * m211 + m112 * m221 + m113 * m231 + m114 * m241;
        this.rawData[1] = m111 * m212 + m112 * m222 + m113 * m232 + m114 * m242;
        this.rawData[2] = m111 * m213 + m112 * m223 + m113 * m233 + m114 * m243;
        this.rawData[3] = m111 * m214 + m112 * m224 + m113 * m234 + m114 * m244;
        this.rawData[4] = m121 * m211 + m122 * m221 + m123 * m231 + m124 * m241;
        this.rawData[5] = m121 * m212 + m122 * m222 + m123 * m232 + m124 * m242;
        this.rawData[6] = m121 * m213 + m122 * m223 + m123 * m233 + m124 * m243;
        this.rawData[7] = m121 * m214 + m122 * m224 + m123 * m234 + m124 * m244;
        this.rawData[8] = m131 * m211 + m132 * m221 + m133 * m231 + m134 * m241;
        this.rawData[9] = m131 * m212 + m132 * m222 + m133 * m232 + m134 * m242;
        this.rawData[10] = m131 * m213 + m132 * m223 + m133 * m233 + m134 * m243;
        this.rawData[11] = m131 * m214 + m132 * m224 + m133 * m234 + m134 * m244;
        this.rawData[12] = m141 * m211 + m142 * m221 + m143 * m231 + m144 * m241;
        this.rawData[13] = m141 * m212 + m142 * m222 + m143 * m232 + m144 * m242;
        this.rawData[14] = m141 * m213 + m142 * m223 + m143 * m233 + m144 * m243;
        this.rawData[15] = m141 * m214 + m142 * m224 + m143 * m234 + m144 * m244;
    };
    /**
     * Prepends an incremental rotation to a Matrix3D object.
     */
    Matrix3D.prototype.prependRotation = function (degrees, axis) {
        var m = Matrix3D.getAxisRotation(axis.x, axis.y, axis.z, degrees);
        /*
         if ( pivot != null )
         {
         var p:Vector3D = pivot;
         m.appendTranslation( p.x, p.y, p.z );
         }
         */
        this.prepend(m);
    };
    /**
     * Prepends an incremental scale change along the x, y, and z axes to a Matrix3D object.
     */
    Matrix3D.prototype.prependScale = function (xScale, yScale, zScale) {
        // Initial Tests - OK
        this.prepend(new Matrix3D([xScale, 0, 0, 0, 0, yScale, 0, 0, 0, 0, zScale, 0, 0, 0, 0, 1]));
    };
    /**
     * Prepends an incremental translation, a repositioning along the x, y, and z axes, to a Matrix3D object.
     */
    Matrix3D.prototype.prependTranslation = function (x, y, z) {
        // Initial Tests - OK
        var m = new Matrix3D();
        m.position = new Vector3D(x, y, z);
        this.prepend(m);
    };
    // TODO orientationStyle
    /**
     * Sets the transformation matrix's translation, rotation, and scale settings.
     */
    Matrix3D.prototype.recompose = function (components) {
        // Initial Tests - OK
        if (components.length < 3)
            return false;
        //components[2].x == 0 || components[2].y == 0 || components[2].z == 0) return false;
        this.identity();
        this.appendScale(components[2].x, components[2].y, components[2].z);
        var angle;
        angle = -components[1].x;
        this.append(new Matrix3D([1, 0, 0, 0, 0, Math.cos(angle), -Math.sin(angle), 0, 0, Math.sin(angle), Math.cos(angle), 0, 0, 0, 0, 0]));
        angle = -components[1].y;
        this.append(new Matrix3D([Math.cos(angle), 0, Math.sin(angle), 0, 0, 1, 0, 0, -Math.sin(angle), 0, Math.cos(angle), 0, 0, 0, 0, 0]));
        angle = -components[1].z;
        this.append(new Matrix3D([Math.cos(angle), -Math.sin(angle), 0, 0, Math.sin(angle), Math.cos(angle), 0, 0, 0, 0, 1, 0, 0, 0, 0, 0]));
        this.position = components[0];
        this.rawData[15] = 1;
        return true;
    };
    Matrix3D.prototype.transformVector = function (v) {
        if (v == null)
            return new Vector3D();
        var x = v.x;
        var y = v.y;
        var z = v.z;
        return new Vector3D((x * this.rawData[0] + y * this.rawData[4] + z * this.rawData[8] + this.rawData[12]), (x * this.rawData[1] + y * this.rawData[5] + z * this.rawData[9] + this.rawData[13]), (x * this.rawData[2] + y * this.rawData[6] + z * this.rawData[10] + this.rawData[14]), (x * this.rawData[3] + y * this.rawData[7] + z * this.rawData[11] + this.rawData[15]));
    };
    /**
     * Uses the transformation matrix to transform a Vector of Numbers from one coordinate space to another.
     */
    Matrix3D.prototype.transformVectors = function (vin, vout) {
        // Initial Tests - OK
        var i = 0;
        var x = 0, y = 0, z = 0;
        while (i + 3 <= vin.length) {
            x = vin[i];
            y = vin[i + 1];
            z = vin[i + 2];
            vout[i] = x * this.rawData[0] + y * this.rawData[4] + z * this.rawData[8] + this.rawData[12];
            vout[i + 1] = x * this.rawData[1] + y * this.rawData[5] + z * this.rawData[9] + this.rawData[13];
            vout[i + 2] = x * this.rawData[2] + y * this.rawData[6] + z * this.rawData[10] + this.rawData[14];
            i += 3;
        }
    };
    /**
     * Converts the current Matrix3D object to a matrix where the rows and columns are swapped.
     */
    Matrix3D.prototype.transpose = function () {
        // Initial Tests - OK
        var oRawData = this.rawData.slice(0);
        this.rawData[1] = oRawData[4];
        this.rawData[2] = oRawData[8];
        this.rawData[3] = oRawData[12];
        this.rawData[4] = oRawData[1];
        this.rawData[6] = oRawData[9];
        this.rawData[7] = oRawData[13];
        this.rawData[8] = oRawData[2];
        this.rawData[9] = oRawData[6];
        this.rawData[11] = oRawData[14];
        this.rawData[12] = oRawData[3];
        this.rawData[13] = oRawData[7];
        this.rawData[14] = oRawData[11];
    };
    Matrix3D.getAxisRotation = function (x, y, z, degrees) {
        // internal class use by rotations which have been tested
        var m = new Matrix3D();
        var rad = degrees * (Math.PI / 180);
        var c = Math.cos(rad);
        var s = Math.sin(rad);
        var t = 1 - c;
        var tmp1, tmp2;
        m.rawData[0] = c + x * x * t;
        m.rawData[5] = c + y * y * t;
        m.rawData[10] = c + z * z * t;
        tmp1 = x * y * t;
        tmp2 = z * s;
        m.rawData[1] = tmp1 + tmp2;
        m.rawData[4] = tmp1 - tmp2;
        tmp1 = x * z * t;
        tmp2 = y * s;
        m.rawData[8] = tmp1 + tmp2;
        m.rawData[2] = tmp1 - tmp2;
        tmp1 = y * z * t;
        tmp2 = x * s;
        m.rawData[9] = tmp1 - tmp2;
        m.rawData[6] = tmp1 + tmp2;
        return m;
    };
    Object.defineProperty(Matrix3D.prototype, "determinant", {
        /**
         * [read-only] A Number that determines whether a matrix is invertible.
         */
        get: function () {
            return ((this.rawData[0] * this.rawData[5] - this.rawData[4] * this.rawData[1]) * (this.rawData[10] * this.rawData[15] - this.rawData[14] * this.rawData[11]) - (this.rawData[0] * this.rawData[9] - this.rawData[8] * this.rawData[1]) * (this.rawData[6] * this.rawData[15] - this.rawData[14] * this.rawData[7]) + (this.rawData[0] * this.rawData[13] - this.rawData[12] * this.rawData[1]) * (this.rawData[6] * this.rawData[11] - this.rawData[10] * this.rawData[7]) + (this.rawData[4] * this.rawData[9] - this.rawData[8] * this.rawData[5]) * (this.rawData[2] * this.rawData[15] - this.rawData[14] * this.rawData[3]) - (this.rawData[4] * this.rawData[13] - this.rawData[12] * this.rawData[5]) * (this.rawData[2] * this.rawData[11] - this.rawData[10] * this.rawData[3]) + (this.rawData[8] * this.rawData[13] - this.rawData[12] * this.rawData[9]) * (this.rawData[2] * this.rawData[7] - this.rawData[6] * this.rawData[3]));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Matrix3D.prototype, "position", {
        /**
         * A Vector3D object that holds the position, the 3D coordinate (x,y,z) of a display object within the
         * transformation's frame of reference.
         */
        get: function () {
            return new Vector3D(this.rawData[12], this.rawData[13], this.rawData[14]);
        },
        set: function (value) {
            this.rawData[12] = value.x;
            this.rawData[13] = value.y;
            this.rawData[14] = value.z;
        },
        enumerable: true,
        configurable: true
    });
    Matrix3D.prototype.toFixed = function (decimalPlace) {
        var magnitude = Math.pow(10, decimalPlace);
        return "matrix3d(" + Math.round(this.rawData[0] * magnitude) / magnitude + "," + Math.round(this.rawData[1] * magnitude) / magnitude + "," + Math.round(this.rawData[2] * magnitude) / magnitude + "," + Math.round(this.rawData[3] * magnitude) / magnitude + "," + Math.round(this.rawData[4] * magnitude) / magnitude + "," + Math.round(this.rawData[5] * magnitude) / magnitude + "," + Math.round(this.rawData[6] * magnitude) / magnitude + "," + Math.round(this.rawData[7] * magnitude) / magnitude + "," + Math.round(this.rawData[8] * magnitude) / magnitude + "," + Math.round(this.rawData[9] * magnitude) / magnitude + "," + Math.round(this.rawData[10] * magnitude) / magnitude + "," + Math.round(this.rawData[11] * magnitude) / magnitude + "," + Math.round(this.rawData[12] * magnitude) / magnitude + "," + Math.round(this.rawData[13] * magnitude) / magnitude + "," + Math.round(this.rawData[14] * magnitude) / magnitude + "," + Math.round(this.rawData[15] * magnitude) / magnitude + ")";
    };
    Matrix3D.prototype.toString = function () {
        return "matrix3d(" + Math.round(this.rawData[0] * 1000) / 1000 + "," + Math.round(this.rawData[1] * 1000) / 1000 + "," + Math.round(this.rawData[2] * 1000) / 1000 + "," + Math.round(this.rawData[3] * 1000) / 1000 + "," + Math.round(this.rawData[4] * 1000) / 1000 + "," + Math.round(this.rawData[5] * 1000) / 1000 + "," + Math.round(this.rawData[6] * 1000) / 1000 + "," + Math.round(this.rawData[7] * 1000) / 1000 + "," + Math.round(this.rawData[8] * 1000) / 1000 + "," + Math.round(this.rawData[9] * 1000) / 1000 + "," + Math.round(this.rawData[10] * 1000) / 1000 + "," + Math.round(this.rawData[11] * 1000) / 1000 + "," + Math.round(this.rawData[12] * 1000) / 1000 + "," + Math.round(this.rawData[13] * 1000) / 1000 + "," + Math.round(this.rawData[14] * 1000) / 1000 + "," + Math.round(this.rawData[15] * 1000) / 1000 + ")";
    };
    return Matrix3D;
})();
module.exports = Matrix3D;


},{"awayjs-core/lib/errors/ArgumentError":5,"awayjs-core/lib/geom/Orientation3D":22,"awayjs-core/lib/geom/Vector3D":26}],21:[function(require,module,exports){
var Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
/**
 * away.geom.Matrix3DUtils provides additional Matrix3D functions.
 */
var Matrix3DUtils = (function () {
    function Matrix3DUtils() {
    }
    /**
     * Fills the 3d matrix object with values representing the transformation made by the given quaternion.
     *
     * @param    quarternion    The quarterion object to convert.
     */
    Matrix3DUtils.quaternion2matrix = function (quarternion, m) {
        if (m === void 0) { m = null; }
        var x = quarternion.x;
        var y = quarternion.y;
        var z = quarternion.z;
        var w = quarternion.w;
        var xx = x * x;
        var xy = x * y;
        var xz = x * z;
        var xw = x * w;
        var yy = y * y;
        var yz = y * z;
        var yw = y * w;
        var zz = z * z;
        var zw = z * w;
        var raw = Matrix3DUtils.RAW_DATA_CONTAINER;
        raw[0] = 1 - 2 * (yy + zz);
        raw[1] = 2 * (xy + zw);
        raw[2] = 2 * (xz - yw);
        raw[4] = 2 * (xy - zw);
        raw[5] = 1 - 2 * (xx + zz);
        raw[6] = 2 * (yz + xw);
        raw[8] = 2 * (xz + yw);
        raw[9] = 2 * (yz - xw);
        raw[10] = 1 - 2 * (xx + yy);
        raw[3] = raw[7] = raw[11] = raw[12] = raw[13] = raw[14] = 0;
        raw[15] = 1;
        if (m) {
            m.copyRawDataFrom(raw);
            return m;
        }
        else
            return new Matrix3D(raw);
    };
    /**
     * Returns a normalised <code>Vector3D</code> object representing the forward vector of the given matrix.
     * @param    m        The Matrix3D object to use to get the forward vector
     * @param    v        [optional] A vector holder to prevent make new Vector3D instance if already exists. Default is null.
     * @return            The forward vector
     */
    Matrix3DUtils.getForward = function (m, v) {
        if (v === void 0) { v = null; }
        //v ||= new Vector3D(0.0, 0.0, 0.0);
        if (v === null) {
            v = new Vector3D(0.0, 0.0, 0.0);
        }
        m.copyColumnTo(2, v);
        v.normalize();
        return v;
    };
    /**
     * Returns a normalised <code>Vector3D</code> object representing the up vector of the given matrix.
     * @param    m        The Matrix3D object to use to get the up vector
     * @param    v        [optional] A vector holder to prevent make new Vector3D instance if already exists. Default is null.
     * @return            The up vector
     */
    Matrix3DUtils.getUp = function (m, v) {
        //v ||= new Vector3D(0.0, 0.0, 0.0);
        if (v === void 0) { v = null; }
        if (v === null) {
            v = new Vector3D(0.0, 0.0, 0.0);
        }
        m.copyColumnTo(1, v);
        v.normalize();
        return v;
    };
    /**
     * Returns a normalised <code>Vector3D</code> object representing the right vector of the given matrix.
     * @param    m        The Matrix3D object to use to get the right vector
     * @param    v        [optional] A vector holder to prevent make new Vector3D instance if already exists. Default is null.
     * @return            The right vector
     */
    Matrix3DUtils.getRight = function (m, v) {
        if (v === void 0) { v = null; }
        //v ||= new Vector3D(0.0, 0.0, 0.0);
        if (v === null) {
            v = new Vector3D(0.0, 0.0, 0.0);
        }
        m.copyColumnTo(0, v);
        v.normalize();
        return v;
    };
    /**
     * Returns a boolean value representing whether there is any significant difference between the two given 3d matrices.
     */
    Matrix3DUtils.compare = function (m1, m2) {
        var r1 = Matrix3DUtils.RAW_DATA_CONTAINER;
        var r2 = m2.rawData;
        m1.copyRawDataTo(r1);
        for (var i = 0; i < 16; ++i) {
            if (r1[i] != r2[i])
                return false;
        }
        return true;
    };
    Matrix3DUtils.lookAt = function (matrix, pos, dir, up) {
        var dirN;
        var upN;
        var lftN;
        var raw = Matrix3DUtils.RAW_DATA_CONTAINER;
        lftN = dir.crossProduct(up);
        lftN.normalize();
        upN = lftN.crossProduct(dir);
        upN.normalize();
        dirN = dir.clone();
        dirN.normalize();
        raw[0] = lftN.x;
        raw[1] = upN.x;
        raw[2] = -dirN.x;
        raw[3] = 0.0;
        raw[4] = lftN.y;
        raw[5] = upN.y;
        raw[6] = -dirN.y;
        raw[7] = 0.0;
        raw[8] = lftN.z;
        raw[9] = upN.z;
        raw[10] = -dirN.z;
        raw[11] = 0.0;
        raw[12] = -lftN.dotProduct(pos);
        raw[13] = -upN.dotProduct(pos);
        raw[14] = dirN.dotProduct(pos);
        raw[15] = 1.0;
        matrix.copyRawDataFrom(raw);
    };
    Matrix3DUtils.reflection = function (plane, target) {
        if (target === void 0) { target = null; }
        if (target === null)
            target = new Matrix3D();
        var a = plane.a, b = plane.b, c = plane.c, d = plane.d;
        var rawData = Matrix3DUtils.RAW_DATA_CONTAINER;
        var ab2 = -2 * a * b;
        var ac2 = -2 * a * c;
        var bc2 = -2 * b * c;
        // reflection matrix
        rawData[0] = 1 - 2 * a * a;
        rawData[4] = ab2;
        rawData[8] = ac2;
        rawData[12] = -2 * a * d;
        rawData[1] = ab2;
        rawData[5] = 1 - 2 * b * b;
        rawData[9] = bc2;
        rawData[13] = -2 * b * d;
        rawData[2] = ac2;
        rawData[6] = bc2;
        rawData[10] = 1 - 2 * c * c;
        rawData[14] = -2 * c * d;
        rawData[3] = 0;
        rawData[7] = 0;
        rawData[11] = 0;
        rawData[15] = 1;
        target.copyRawDataFrom(rawData);
        return target;
    };
    Matrix3DUtils.transformVector = function (matrix, vector, result) {
        if (result === void 0) { result = null; }
        if (!result)
            result = new Vector3D();
        var raw = Matrix3DUtils.RAW_DATA_CONTAINER;
        matrix.copyRawDataTo(raw);
        var a = raw[0];
        var e = raw[1];
        var i = raw[2];
        var m = raw[3];
        var b = raw[4];
        var f = raw[5];
        var j = raw[6];
        var n = raw[7];
        var c = raw[8];
        var g = raw[9];
        var k = raw[10];
        var o = raw[11];
        var d = raw[12];
        var h = raw[13];
        var l = raw[14];
        var p = raw[15];
        var x = vector.x;
        var y = vector.y;
        var z = vector.z;
        result.x = a * x + b * y + c * z + d;
        result.y = e * x + f * y + g * z + h;
        result.z = i * x + j * y + k * z + l;
        result.w = m * x + n * y + o * z + p;
        return result;
    };
    Matrix3DUtils.deltaTransformVector = function (matrix, vector, result) {
        if (result === void 0) { result = null; }
        if (!result)
            result = new Vector3D();
        var raw = Matrix3DUtils.RAW_DATA_CONTAINER;
        matrix.copyRawDataTo(raw);
        var a = raw[0];
        var e = raw[1];
        var i = raw[2];
        var m = raw[3];
        var b = raw[4];
        var f = raw[5];
        var j = raw[6];
        var n = raw[7];
        var c = raw[8];
        var g = raw[9];
        var k = raw[10];
        var o = raw[11];
        var x = vector.x;
        var y = vector.y;
        var z = vector.z;
        result.x = a * x + b * y + c * z;
        result.y = e * x + f * y + g * z;
        result.z = i * x + j * y + k * z;
        result.w = m * x + n * y + o * z;
        return result;
    };
    Matrix3DUtils.getTranslation = function (transform, result) {
        if (result === void 0) { result = null; }
        if (!result)
            result = new Vector3D();
        transform.copyColumnTo(3, result);
        return result;
    };
    Matrix3DUtils.deltaTransformVectors = function (matrix, vin, vout) {
        var raw = Matrix3DUtils.RAW_DATA_CONTAINER;
        matrix.copyRawDataTo(raw);
        var a = raw[0];
        var e = raw[1];
        var i = raw[2];
        var m = raw[3];
        var b = raw[4];
        var f = raw[5];
        var j = raw[6];
        var n = raw[7];
        var c = raw[8];
        var g = raw[9];
        var k = raw[10];
        var o = raw[11];
        var outIndex = 0;
        var length = vin.length;
        for (var index = 0; index < length; index += 3) {
            var x = vin[index];
            var y = vin[index + 1];
            var z = vin[index + 2];
            vout[outIndex++] = a * x + b * y + c * z;
            vout[outIndex++] = e * x + f * y + g * z;
            vout[outIndex++] = i * x + j * y + k * z;
        }
    };
    /**
     * A reference to a Vector to be used as a temporary raw data container, to prevent object creation.
     */
    Matrix3DUtils.RAW_DATA_CONTAINER = new Array(16);
    //public static RAW_DATA_CONTAINER:number[] = new Array<number>(16);
    Matrix3DUtils.CALCULATION_MATRIX = new Matrix3D();
    return Matrix3DUtils;
})();
module.exports = Matrix3DUtils;


},{"awayjs-core/lib/geom/Matrix3D":20,"awayjs-core/lib/geom/Vector3D":26}],22:[function(require,module,exports){
/**
 * A Quaternion object which can be used to represent rotations.
 */
var Orientation3D = (function () {
    function Orientation3D() {
    }
    /**
     * The axis angle orientation uses a combination of an axis and an angle to determine the orientation.
     * @type {string}
     */
    Orientation3D.AXIS_ANGLE = "axisAngle";
    /**
     * The default orientation for decompose() and recompose() methods, defines the orientation with three separate angles of rotation for each axis.
     * @type {string}
     */
    Orientation3D.EULER_ANGLES = "eulerAngles";
    /**
     * The quaternion orientation uses complex numbers.
     * @type {string}
     */
    Orientation3D.QUATERNION = "quaternion";
    return Orientation3D;
})();
module.exports = Orientation3D;


},{}],23:[function(require,module,exports){
var PlaneClassification = (function () {
    function PlaneClassification() {
    }
    // "back" is synonymous with "in", but used for planes (back of plane is "inside" a solid volume walled by a plane)
    PlaneClassification.BACK = 0;
    PlaneClassification.FRONT = 1;
    PlaneClassification.IN = 0;
    PlaneClassification.OUT = 1;
    PlaneClassification.INTERSECT = 2;
    return PlaneClassification;
})();
module.exports = PlaneClassification;


},{}],24:[function(require,module,exports){
/**
 * The Point object represents a location in a two-dimensional coordinate
 * system, where <i>x</i> represents the horizontal axis and <i>y</i>
 * represents the vertical axis.
 *
 * <p>The following code creates a point at(0,0):</p>
 *
 * <p>Methods and properties of the following classes use Point objects:</p>
 *
 * <ul>
 *   <li>BitmapData</li>
 *   <li>DisplayObject</li>
 *   <li>DisplayObjectContainer</li>
 *   <li>DisplacementMapFilter</li>
 *   <li>NativeWindow</li>
 *   <li>Matrix</li>
 *   <li>Rectangle</li>
 * </ul>
 *
 * <p>You can use the <code>new Point()</code> constructor to create a Point
 * object.</p>
 */
var Point = (function () {
    /**
     * Creates a new point. If you pass no parameters to this method, a point is
     * created at(0,0).
     *
     * @param x The horizontal coordinate.
     * @param y The vertical coordinate.
     */
    function Point(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    Object.defineProperty(Point.prototype, "length", {
        /**
         * The length of the line segment from(0,0) to this point.
         */
        get: function () {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Adds the coordinates of another point to the coordinates of this point to
     * create a new point.
     *
     * @param v The point to be added.
     * @return The new point.
     */
    Point.prototype.add = function (v) {
        return new Point(this.x + v.x, this.y + v.y);
    };
    /**
     * Creates a copy of this Point object.
     *
     * @return The new Point object.
     */
    Point.prototype.clone = function () {
        return new Point(this.x, this.y);
    };
    Point.prototype.copyFrom = function (sourcePoint) {
    };
    /**
     * Determines whether two points are equal. Two points are equal if they have
     * the same <i>x</i> and <i>y</i> values.
     *
     * @param toCompare The point to be compared.
     * @return A value of <code>true</code> if the object is equal to this Point
     *         object; <code>false</code> if it is not equal.
     */
    Point.prototype.equals = function (toCompare) {
        return (this.x == toCompare.x && this.y == toCompare.y);
    };
    /**
     * Scales the line segment between(0,0) and the current point to a set
     * length.
     *
     * @param thickness The scaling value. For example, if the current point is
     *                 (0,5), and you normalize it to 1, the point returned is
     *                  at(0,1).
     */
    Point.prototype.normalize = function (thickness) {
        if (thickness === void 0) { thickness = 1; }
        if (this.length != 0) {
            var invLength = thickness / this.length;
            this.x *= invLength;
            this.y *= invLength;
            return;
        }
        throw "Cannot divide by zero length.";
    };
    /**
     * Offsets the Point object by the specified amount. The value of
     * <code>dx</code> is added to the original value of <i>x</i> to create the
     * new <i>x</i> value. The value of <code>dy</code> is added to the original
     * value of <i>y</i> to create the new <i>y</i> value.
     *
     * @param dx The amount by which to offset the horizontal coordinate,
     *           <i>x</i>.
     * @param dy The amount by which to offset the vertical coordinate, <i>y</i>.
     */
    Point.prototype.offset = function (dx, dy) {
        this.x += dx;
        this.y += dy;
    };
    Point.prototype.setTo = function (xa, ya) {
    };
    /**
     * Subtracts the coordinates of another point from the coordinates of this
     * point to create a new point.
     *
     * @param v The point to be subtracted.
     * @return The new point.
     */
    Point.prototype.subtract = function (v) {
        return new Point(this.x - v.x, this.y - v.y);
    };
    /**
     * Returns a string that contains the values of the <i>x</i> and <i>y</i>
     * coordinates. The string has the form <code>"(x=<i>x</i>,
     * y=<i>y</i>)"</code>, so calling the <code>toString()</code> method for a
     * point at 23,17 would return <code>"(x=23, y=17)"</code>.
     *
     * @return The string representation of the coordinates.
     */
    Point.prototype.toString = function () {
        return "[Point] (x=" + this.x + ", y=" + this.y + ")";
    };
    /**
     * Returns the distance between <code>pt1</code> and <code>pt2</code>.
     *
     * @param pt1 The first point.
     * @param pt2 The second point.
     * @return The distance between the first and second points.
     */
    Point.distance = function (pt1, pt2) {
        var dx = pt2.x - pt1.x;
        var dy = pt2.y - pt1.y;
        return Math.sqrt(dx * dx + dy * dy);
    };
    /**
     * Determines a point between two specified points. The parameter
     * <code>f</code> determines where the new interpolated point is located
     * relative to the two end points specified by parameters <code>pt1</code>
     * and <code>pt2</code>. The closer the value of the parameter <code>f</code>
     * is to <code>1.0</code>, the closer the interpolated point is to the first
     * point(parameter <code>pt1</code>). The closer the value of the parameter
     * <code>f</code> is to 0, the closer the interpolated point is to the second
     * point(parameter <code>pt2</code>).
     *
     * @param pt1 The first point.
     * @param pt2 The second point.
     * @param f   The level of interpolation between the two points. Indicates
     *            where the new point will be, along the line between
     *            <code>pt1</code> and <code>pt2</code>. If <code>f</code>=1,
     *            <code>pt1</code> is returned; if <code>f</code>=0,
     *            <code>pt2</code> is returned.
     * @return The new, interpolated point.
     */
    Point.interpolate = function (pt1, pt2, f) {
        return new Point(pt2.x + (pt1.x - pt2.x) * f, pt2.y + (pt1.y - pt2.y) * f);
    };
    /**
     * Converts a pair of polar coordinates to a Cartesian point coordinate.
     *
     * @param len   The length coordinate of the polar pair.
     * @param angle The angle, in radians, of the polar pair.
     * @return The Cartesian point.
     */
    Point.polar = function (len, angle) {
        return new Point(len * Math.cos(angle), len * Math.sin(angle));
    };
    return Point;
})();
module.exports = Point;


},{}],25:[function(require,module,exports){
var Point = require("awayjs-core/lib/geom/Point");
/**
 * A Rectangle object is an area defined by its position, as indicated by its
 * top-left corner point(<i>x</i>, <i>y</i>) and by its width and its height.
 *
 *
 * <p>The <code>x</code>, <code>y</code>, <code>width</code>, and
 * <code>height</code> properties of the Rectangle class are independent of
 * each other; changing the value of one property has no effect on the others.
 * However, the <code>right</code> and <code>bottom</code> properties are
 * integrally related to those four properties. For example, if you change the
 * value of the <code>right</code> property, the value of the
 * <code>width</code> property changes; if you change the <code>bottom</code>
 * property, the value of the <code>height</code> property changes. </p>
 *
 * <p>The following methods and properties use Rectangle objects:</p>
 *
 * <ul>
 *   <li>The <code>applyFilter()</code>, <code>colorTransform()</code>,
 * <code>copyChannel()</code>, <code>copyPixels()</code>, <code>draw()</code>,
 * <code>fillRect()</code>, <code>generateFilterRect()</code>,
 * <code>getColorBoundsRect()</code>, <code>getPixels()</code>,
 * <code>merge()</code>, <code>paletteMap()</code>,
 * <code>pixelDisolve()</code>, <code>setPixels()</code>, and
 * <code>threshold()</code> methods, and the <code>rect</code> property of the
 * BitmapData class</li>
 *   <li>The <code>getBounds()</code> and <code>getRect()</code> methods, and
 * the <code>scrollRect</code> and <code>scale9Grid</code> properties of the
 * DisplayObject class</li>
 *   <li>The <code>getCharBoundaries()</code> method of the TextField
 * class</li>
 *   <li>The <code>pixelBounds</code> property of the Transform class</li>
 *   <li>The <code>bounds</code> parameter for the <code>startDrag()</code>
 * method of the Sprite class</li>
 *   <li>The <code>printArea</code> parameter of the <code>addPage()</code>
 * method of the PrintJob class</li>
 * </ul>
 *
 * <p>You can use the <code>new Rectangle()</code> constructor to create a
 * Rectangle object.</p>
 *
 * <p><b>Note:</b> The Rectangle class does not define a rectangular Shape
 * display object. To draw a rectangular Shape object onscreen, use the
 * <code>drawRect()</code> method of the Graphics class.</p>
 */
var Rectangle = (function () {
    /**
     * Creates a new Rectangle object with the top-left corner specified by the
     * <code>x</code> and <code>y</code> parameters and with the specified
     * <code>width</code> and <code>height</code> parameters. If you call this
     * public without parameters, a rectangle with <code>x</code>,
     * <code>y</code>, <code>width</code>, and <code>height</code> properties set
     * to 0 is created.
     *
     * @param x      The <i>x</i> coordinate of the top-left corner of the
     *               rectangle.
     * @param y      The <i>y</i> coordinate of the top-left corner of the
     *               rectangle.
     * @param width  The width of the rectangle, in pixels.
     * @param height The height of the rectangle, in pixels.
     */
    function Rectangle(x, y, width, height) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (width === void 0) { width = 0; }
        if (height === void 0) { height = 0; }
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    Object.defineProperty(Rectangle.prototype, "bottom", {
        /**
         * The sum of the <code>y</code> and <code>height</code> properties.
         */
        get: function () {
            return this.y + this.height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "bottomRight", {
        /**
         * The location of the Rectangle object's bottom-right corner, determined by
         * the values of the <code>right</code> and <code>bottom</code> properties.
         */
        get: function () {
            if (this._bottomRight == null)
                this._bottomRight = new Point();
            this._bottomRight.x = this.x + this.width;
            this._bottomRight.y = this.y + this.height;
            return this._bottomRight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "left", {
        /**
         * The <i>x</i> coordinate of the top-left corner of the rectangle. Changing
         * the <code>left</code> property of a Rectangle object has no effect on the
         * <code>y</code> and <code>height</code> properties. However it does affect
         * the <code>width</code> property, whereas changing the <code>x</code> value
         * does <i>not</i> affect the <code>width</code> property.
         *
         * <p>The value of the <code>left</code> property is equal to the value of
         * the <code>x</code> property.</p>
         */
        get: function () {
            return this.x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "right", {
        /**
         * The sum of the <code>x</code> and <code>width</code> properties.
         */
        get: function () {
            return this.x + this.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "size", {
        /**
         * The size of the Rectangle object, expressed as a Point object with the
         * values of the <code>width</code> and <code>height</code> properties.
         */
        get: function () {
            if (this._size == null)
                this._size = new Point();
            this._size.x = this.width;
            this._size.y = this.height;
            return this._size;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "top", {
        /**
         * The <i>y</i> coordinate of the top-left corner of the rectangle. Changing
         * the <code>top</code> property of a Rectangle object has no effect on the
         * <code>x</code> and <code>width</code> properties. However it does affect
         * the <code>height</code> property, whereas changing the <code>y</code>
         * value does <i>not</i> affect the <code>height</code> property.
         *
         * <p>The value of the <code>top</code> property is equal to the value of the
         * <code>y</code> property.</p>
         */
        get: function () {
            return this.y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Rectangle.prototype, "topLeft", {
        /**
         * The location of the Rectangle object's top-left corner, determined by the
         * <i>x</i> and <i>y</i> coordinates of the point.
         */
        get: function () {
            if (this._topLeft == null)
                this._topLeft = new Point();
            this._topLeft.x = this.x;
            this._topLeft.y = this.y;
            return this._topLeft;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Returns a new Rectangle object with the same values for the
     * <code>x</code>, <code>y</code>, <code>width</code>, and
     * <code>height</code> properties as the original Rectangle object.
     *
     * @return A new Rectangle object with the same values for the
     *         <code>x</code>, <code>y</code>, <code>width</code>, and
     *         <code>height</code> properties as the original Rectangle object.
     */
    Rectangle.prototype.clone = function () {
        return new Rectangle(this.x, this.y, this.width, this.height);
    };
    /**
     * Determines whether the specified point is contained within the rectangular
     * region defined by this Rectangle object.
     *
     * @param x The <i>x</i> coordinate(horizontal position) of the point.
     * @param y The <i>y</i> coordinate(vertical position) of the point.
     * @return A value of <code>true</code> if the Rectangle object contains the
     *         specified point; otherwise <code>false</code>.
     */
    Rectangle.prototype.contains = function (x, y) {
        return (this.x <= x && this.x + this.width >= x && this.y <= y && this.y + this.height >= y);
    };
    /**
     * Determines whether the specified point is contained within the rectangular
     * region defined by this Rectangle object. This method is similar to the
     * <code>Rectangle.contains()</code> method, except that it takes a Point
     * object as a parameter.
     *
     * @param point The point, as represented by its <i>x</i> and <i>y</i>
     *              coordinates.
     * @return A value of <code>true</code> if the Rectangle object contains the
     *         specified point; otherwise <code>false</code>.
     */
    Rectangle.prototype.containsPoint = function (point) {
        return (this.x <= point.x && this.x + this.width >= point.x && this.y <= point.y && this.y + this.height >= point.y);
    };
    /**
     * Determines whether the Rectangle object specified by the <code>rect</code>
     * parameter is contained within this Rectangle object. A Rectangle object is
     * said to contain another if the second Rectangle object falls entirely
     * within the boundaries of the first.
     *
     * @param rect The Rectangle object being checked.
     * @return A value of <code>true</code> if the Rectangle object that you
     *         specify is contained by this Rectangle object; otherwise
     *         <code>false</code>.
     */
    Rectangle.prototype.containsRect = function (rect) {
        return (this.x <= rect.x && this.x + this.width >= rect.x + rect.width && this.y <= rect.y && this.y + this.height >= rect.y + rect.height);
    };
    /**
     * Copies all of rectangle data from the source Rectangle object into the
     * calling Rectangle object.
     *
     * @param sourceRect The Rectangle object from which to copy the data.
     */
    Rectangle.prototype.copyFrom = function (sourceRect) {
    };
    /**
     * Determines whether the object specified in the <code>toCompare</code>
     * parameter is equal to this Rectangle object. This method compares the
     * <code>x</code>, <code>y</code>, <code>width</code>, and
     * <code>height</code> properties of an object against the same properties of
     * this Rectangle object.
     *
     * @param toCompare The rectangle to compare to this Rectangle object.
     * @return A value of <code>true</code> if the object has exactly the same
     *         values for the <code>x</code>, <code>y</code>, <code>width</code>,
     *         and <code>height</code> properties as this Rectangle object;
     *         otherwise <code>false</code>.
     */
    Rectangle.prototype.equals = function (toCompare) {
        return (this.x == toCompare.x && this.y == toCompare.y && this.width == toCompare.width && this.height == toCompare.height);
    };
    /**
     * Increases the size of the Rectangle object by the specified amounts, in
     * pixels. The center point of the Rectangle object stays the same, and its
     * size increases to the left and right by the <code>dx</code> value, and to
     * the top and the bottom by the <code>dy</code> value.
     *
     * @param dx The value to be added to the left and the right of the Rectangle
     *           object. The following equation is used to calculate the new
     *           width and position of the rectangle:
     * @param dy The value to be added to the top and the bottom of the
     *           Rectangle. The following equation is used to calculate the new
     *           height and position of the rectangle:
     */
    Rectangle.prototype.inflate = function (dx, dy) {
        this.x -= dx / 2;
        this.y -= dy / 2;
        this.width += dx / 2;
        this.height += dy / 2;
    };
    /**
     * Increases the size of the Rectangle object. This method is similar to the
     * <code>Rectangle.inflate()</code> method except it takes a Point object as
     * a parameter.
     *
     * <p>The following two code examples give the same result:</p>
     *
     * @param point The <code>x</code> property of this Point object is used to
     *              increase the horizontal dimension of the Rectangle object.
     *              The <code>y</code> property is used to increase the vertical
     *              dimension of the Rectangle object.
     */
    Rectangle.prototype.inflatePoint = function (point) {
        this.x -= point.x / 2;
        this.y -= point.y / 2;
        this.width += point.x / 2;
        this.height += point.y / 2;
    };
    /**
     * If the Rectangle object specified in the <code>toIntersect</code>
     * parameter intersects with this Rectangle object, returns the area of
     * intersection as a Rectangle object. If the rectangles do not intersect,
     * this method returns an empty Rectangle object with its properties set to
     * 0.
     *
     * @param toIntersect The Rectangle object to compare against to see if it
     *                    intersects with this Rectangle object.
     * @return A Rectangle object that equals the area of intersection. If the
     *         rectangles do not intersect, this method returns an empty
     *         Rectangle object; that is, a rectangle with its <code>x</code>,
     *         <code>y</code>, <code>width</code>, and <code>height</code>
     *         properties set to 0.
     */
    Rectangle.prototype.intersection = function (toIntersect) {
        if (this.intersects(toIntersect)) {
            var i = new Rectangle();
            if (this.x > toIntersect.x) {
                i.x = this.x;
                i.width = toIntersect.x - this.x + toIntersect.width;
                if (i.width > this.width)
                    i.width = this.width;
            }
            else {
                i.x = toIntersect.x;
                i.width = this.x - toIntersect.x + this.width;
                if (i.width > toIntersect.width)
                    i.width = toIntersect.width;
            }
            if (this.y > toIntersect.y) {
                i.y = this.y;
                i.height = toIntersect.y - this.y + toIntersect.height;
                if (i.height > this.height)
                    i.height = this.height;
            }
            else {
                i.y = toIntersect.y;
                i.height = this.y - toIntersect.y + this.height;
                if (i.height > toIntersect.height)
                    i.height = toIntersect.height;
            }
            return i;
        }
        return new Rectangle();
    };
    /**
     * Determines whether the object specified in the <code>toIntersect</code>
     * parameter intersects with this Rectangle object. This method checks the
     * <code>x</code>, <code>y</code>, <code>width</code>, and
     * <code>height</code> properties of the specified Rectangle object to see if
     * it intersects with this Rectangle object.
     *
     * @param toIntersect The Rectangle object to compare against this Rectangle
     *                    object.
     * @return A value of <code>true</code> if the specified object intersects
     *         with this Rectangle object; otherwise <code>false</code>.
     */
    Rectangle.prototype.intersects = function (toIntersect) {
        return (this.x + this.width > toIntersect.x && this.x < toIntersect.x + toIntersect.width && this.y + this.height > toIntersect.y && this.y < toIntersect.y + toIntersect.height);
    };
    /**
     * Determines whether or not this Rectangle object is empty.
     *
     * @return A value of <code>true</code> if the Rectangle object's width or
     *         height is less than or equal to 0; otherwise <code>false</code>.
     */
    Rectangle.prototype.isEmpty = function () {
        return (this.x == 0 && this.y == 0 && this.width == 0 && this.height == 0);
    };
    /**
     * Adjusts the location of the Rectangle object, as determined by its
     * top-left corner, by the specified amounts.
     *
     * @param dx Moves the <i>x</i> value of the Rectangle object by this amount.
     * @param dy Moves the <i>y</i> value of the Rectangle object by this amount.
     */
    Rectangle.prototype.offset = function (dx, dy) {
        this.x += dx;
        this.y += dy;
    };
    /**
     * Adjusts the location of the Rectangle object using a Point object as a
     * parameter. This method is similar to the <code>Rectangle.offset()</code>
     * method, except that it takes a Point object as a parameter.
     *
     * @param point A Point object to use to offset this Rectangle object.
     */
    Rectangle.prototype.offsetPoint = function (point) {
        this.x += point.x;
        this.y += point.y;
    };
    /**
     * Sets all of the Rectangle object's properties to 0. A Rectangle object is
     * empty if its width or height is less than or equal to 0.
     *
     * <p> This method sets the values of the <code>x</code>, <code>y</code>,
     * <code>width</code>, and <code>height</code> properties to 0.</p>
     *
     */
    Rectangle.prototype.setEmpty = function () {
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
    };
    /**
     * Sets the members of Rectangle to the specified values
     *
     * @param xa      The <i>x</i> coordinate of the top-left corner of the
     *                rectangle.
     * @param ya      The <i>y</i> coordinate of the top-left corner of the
     *                rectangle.
     * @param widtha  The width of the rectangle, in pixels.
     * @param heighta The height of the rectangle, in pixels.
     */
    Rectangle.prototype.setTo = function (xa, ya, widtha, heighta) {
        this.x = xa;
        this.y = ya;
        this.width = widtha;
        this.height = heighta;
    };
    /**
     * Builds and returns a string that lists the horizontal and vertical
     * positions and the width and height of the Rectangle object.
     *
     * @return A string listing the value of each of the following properties of
     *         the Rectangle object: <code>x</code>, <code>y</code>,
     *         <code>width</code>, and <code>height</code>.
     */
    Rectangle.prototype.toString = function () {
        return "[Rectangle] (x=" + this.x + ", y=" + this.y + ", width=" + this.width + ", height=" + this.height + ")";
    };
    /**
     * Adds two rectangles together to create a new Rectangle object, by filling
     * in the horizontal and vertical space between the two rectangles.
     *
     * <p><b>Note:</b> The <code>union()</code> method ignores rectangles with
     * <code>0</code> as the height or width value, such as: <code>var
     * rect2:Rectangle = new Rectangle(300,300,50,0);</code></p>
     *
     * @param toUnion A Rectangle object to add to this Rectangle object.
     * @return A new Rectangle object that is the union of the two rectangles.
     */
    Rectangle.prototype.union = function (toUnion) {
        var u = new Rectangle();
        if (this.x < toUnion.x) {
            u.x = this.x;
            u.width = toUnion.x - this.x + toUnion.width;
            if (u.width < this.width)
                u.width = this.width;
        }
        else {
            u.x = toUnion.x;
            u.width = this.x - toUnion.x + this.width;
            if (u.width < toUnion.width)
                u.width = toUnion.width;
        }
        if (this.y < toUnion.y) {
            u.y = this.y;
            u.height = toUnion.y - this.y + toUnion.height;
            if (u.height < this.height)
                u.height = this.height;
        }
        else {
            u.y = toUnion.y;
            u.height = this.y - toUnion.y + this.height;
            if (u.height < toUnion.height)
                u.height = toUnion.height;
        }
        return u;
    };
    return Rectangle;
})();
module.exports = Rectangle;


},{"awayjs-core/lib/geom/Point":24}],26:[function(require,module,exports){
/**
 * The Vector3D class represents a point or a location in the three-dimensional
 * space using the Cartesian coordinates x, y, and z. As in a two-dimensional
 * space, the x property represents the horizontal axis and the y property
 * represents the vertical axis. In three-dimensional space, the z property
 * represents depth. The value of the x property increases as the object moves
 * to the right. The value of the y property increases as the object moves
 * down. The z property increases as the object moves farther from the point
 * of view. Using perspective projection and scaling, the object is seen to be
 * bigger when near and smaller when farther away from the screen. As in a
 * right-handed three-dimensional coordinate system, the positive z-axis points
 * away from the viewer and the value of the z property increases as the object
 * moves away from the viewer's eye. The origin point (0,0,0) of the global
 * space is the upper-left corner of the stage.
 *
 * <p>The Vector3D class can also represent a direction, an arrow pointing from
 * the origin of the coordinates, such as (0,0,0), to an endpoint; or a
 * floating-point component of an RGB (Red, Green, Blue) color model.</p>
 *
 * <p>Quaternion notation introduces a fourth element, the w property, which
 * provides additional orientation information. For example, the w property can
 * define an angle of rotation of a Vector3D object. The combination of the
 * angle of rotation and the coordinates x, y, and z can determine the display
 * object's orientation. Here is a representation of Vector3D elements in
 * matrix notation:</p>
 */
var Vector3D = (function () {
    /**
     * Creates an instance of a Vector3D object. If you do not specify a
     * parameter for the constructor, a Vector3D object is created with
     * the elements (0,0,0,0).
     *
     * @param x The first element, such as the x coordinate.
     * @param y The second element, such as the y coordinate.
     * @param z The third element, such as the z coordinate.
     * @param w An optional element for additional data such as the angle
     *          of rotation.
     */
    function Vector3D(x, y, z, w) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (z === void 0) { z = 0; }
        if (w === void 0) { w = 0; }
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    Object.defineProperty(Vector3D.prototype, "length", {
        /**
         * The length, magnitude, of the current Vector3D object from the
         * origin (0,0,0) to the object's x, y, and z coordinates. The w
         * property is ignored. A unit vector has a length or magnitude of
         * one.
         */
        get: function () {
            return Math.sqrt(this.lengthSquared);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector3D.prototype, "lengthSquared", {
        /**
         * The square of the length of the current Vector3D object, calculated
         * using the x, y, and z properties. The w property is ignored. Use the
         * <code>lengthSquared()</code> method whenever possible instead of the
         * slower <code>Math.sqrt()</code> method call of the
         * <code>Vector3D.length()</code> method.
         */
        get: function () {
            return this.x * this.x + this.y * this.y + this.z * this.z;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Adds the value of the x, y, and z elements of the current Vector3D
     * object to the values of the x, y, and z elements of another Vector3D
     * object. The <code>add()</code> method does not change the current
     * Vector3D object. Instead, it returns a new Vector3D object with
     * the new values.
     *
     * <p>The result of adding two vectors together is a resultant vector.
     * One way to visualize the result is by drawing a vector from the
     * origin or tail of the first vector to the end or head of the second
     * vector. The resultant vector is the distance between the origin
     * point of the first vector and the end point of the second vector.
     * </p>
     */
    Vector3D.prototype.add = function (a) {
        return new Vector3D(this.x + a.x, this.y + a.y, this.z + a.z, this.w + a.w);
    };
    /**
     * Returns the angle in radians between two vectors. The returned angle
     * is the smallest radian the first Vector3D object rotates until it
     * aligns with the second Vector3D object.
     *
     * <p>The <code>angleBetween()</code> method is a static method. You
     * can use it directly as a method of the Vector3D class.</p>
     *
     * <p>To convert a degree to a radian, you can use the following
     * formula:</p>
     *
     * <p><code>radian = Math.PI/180 * degree</code></p>
     *
     * @param a The first Vector3D object.
     * @param b The second Vector3D object.
     * @returns The angle between two Vector3D objects.
     */
    Vector3D.angleBetween = function (a, b) {
        return Math.acos(a.dotProduct(b) / (a.length * b.length));
    };
    /**
     * Returns a new Vector3D object that is an exact copy of the current
     * Vector3D object.
     *
     * @returns A new Vector3D object that is a copy of the current
     * Vector3D object.
     */
    Vector3D.prototype.clone = function () {
        return new Vector3D(this.x, this.y, this.z, this.w);
    };
    /**
     * Copies all of vector data from the source Vector3D object into the
     * calling Vector3D object.
     *
     * @param src The Vector3D object from which to copy the data.
     */
    Vector3D.prototype.copyFrom = function (src) {
        this.x = src.x;
        this.y = src.y;
        this.z = src.z;
        this.w = src.w;
    };
    /**
     * Returns a new Vector3D object that is perpendicular (at a right
     * angle) to the current Vector3D and another Vector3D object. If the
     * returned Vector3D object's coordinates are (0,0,0), then the two
     * Vector3D objects are parallel to each other.
     *
     * <p>You can use the normalized cross product of two vertices of a
     * polygon surface with the normalized vector of the camera or eye
     * viewpoint to get a dot product. The value of the dot product can
     * identify whether a surface of a three-dimensional object is hidden
     * from the viewpoint.</p>
     *
     * @param a A second Vector3D object.
     * @returns A new Vector3D object that is perpendicular to the current
     *          Vector3D object and the Vector3D object specified as the
     *          parameter.
     */
    Vector3D.prototype.crossProduct = function (a) {
        return new Vector3D(this.y * a.z - this.z * a.y, this.z * a.x - this.x * a.z, this.x * a.y - this.y * a.x, 1);
    };
    /**
     * Decrements the value of the x, y, and z elements of the current
     * Vector3D object by the values of the x, y, and z elements of
     * specified Vector3D object. Unlike the
     * <code>Vector3D.subtract()</code> method, the
     * <code>decrementBy()</code> method changes the current Vector3D
     * object and does not return a new Vector3D object.
     *
     * @param a The Vector3D object containing the values to subtract from
     *          the current Vector3D object.
     */
    Vector3D.prototype.decrementBy = function (a) {
        this.x -= a.x;
        this.y -= a.y;
        this.z -= a.z;
    };
    /**
     * Returns the distance between two Vector3D objects. The
     * <code>distance()</code> method is a static method. You can use it
     * directly as a method of the Vector3D class to get the Euclidean
     * distance between two three-dimensional points.
     *
     * @param pt1 A Vector3D object as the first three-dimensional point.
     * @param pt2 A Vector3D object as the second three-dimensional point.
     * @returns The distance between two Vector3D objects.
     */
    Vector3D.distance = function (pt1, pt2) {
        var x = (pt1.x - pt2.x);
        var y = (pt1.y - pt2.y);
        var z = (pt1.z - pt2.z);
        return Math.sqrt(x * x + y * y + z * z);
    };
    /**
     * If the current Vector3D object and the one specified as the
     * parameter are unit vertices, this method returns the cosine of the
     * angle between the two vertices. Unit vertices are vertices that
     * point to the same direction but their length is one. They remove the
     * length of the vector as a factor in the result. You can use the
     * <code>normalize()</code> method to convert a vector to a unit
     * vector.
     *
     * <p>The <code>dotProduct()</code> method finds the angle between two
     * vertices. It is also used in backface culling or lighting
     * calculations. Backface culling is a procedure for determining which
     * surfaces are hidden from the viewpoint. You can use the normalized
     * vertices from the camera, or eye, viewpoint and the cross product of
     * the vertices of a polygon surface to get the dot product. If the dot
     * product is less than zero, then the surface is facing the camera or
     * the viewer. If the two unit vertices are perpendicular to each
     * other, they are orthogonal and the dot product is zero. If the two
     * vertices are parallel to each other, the dot product is one.</p>
     *
     * @param a The second Vector3D object.
     * @returns A scalar which is the dot product of the current Vector3D
     *          object and the specified Vector3D object.
     *
     * @see away.geom.Vector3D#crossProduct()
     * @see away.geom.Vector3D#normalize()
     */
    Vector3D.prototype.dotProduct = function (a) {
        return this.x * a.x + this.y * a.y + this.z * a.z;
    };
    /**
     * Determines whether two Vector3D objects are equal by comparing the
     * x, y, and z elements of the current Vector3D object with a
     * specified Vector3D object. If the values of these elements are the
     * same, the two Vector3D objects are equal. If the second optional
     * parameter is set to true, all four elements of the Vector3D objects,
     * including the w property, are compared.
     */
    /**
     *
     * @param toCompare The Vector3D object to be compared with the current
     *                  Vector3D object.
     * @param allFour   An optional parameter that specifies whether the w
     *                  property of the Vector3D objects is used in the
     *                  comparison.
     * @returns A value of true if the specified Vector3D object is equal
     *          to the current Vector3D object; false if it is not equal.
     */
    Vector3D.prototype.equals = function (toCompare, allFour) {
        if (allFour === void 0) { allFour = false; }
        return (this.x == toCompare.x && this.y == toCompare.y && this.z == toCompare.z && (!allFour || this.w == toCompare.w));
    };
    /**
     * Increments the value of the x, y, and z elements of the current
     * Vector3D object by the values of the x, y, and z elements of a
     * specified Vector3D object. Unlike the <code>Vector3D.add()</code>
     * method, the <code>incrementBy()</code> method changes the current
     * Vector3D object and does not return a new Vector3D object.
     *
     * @param a The Vector3D object to be added to the current Vector3D
     *          object.
     */
    Vector3D.prototype.incrementBy = function (a) {
        this.x += a.x;
        this.y += a.y;
        this.z += a.z;
    };
    /**
     * Compares the elements of the current Vector3D object with the
     * elements of a specified Vector3D object to determine whether they
     * are nearly equal. The two Vector3D objects are nearly equal if the
     * value of all the elements of the two vertices are equal, or the
     * result of the comparison is within the tolerance range. The
     * difference between two elements must be less than the number
     * specified as the tolerance parameter. If the third optional
     * parameter is set to <code>true</code>, all four elements of the
     * Vector3D objects, including the <code>w</code> property, are
     * compared. Otherwise, only the x, y, and z elements are included in
     * the comparison.
     */
    /**
     *
     * @param toCompare The Vector3D object to be compared with the current
     *                  Vector3D object.
     * @param tolerance A number determining the tolerance factor. If the
     *                  difference between the values of the Vector3D
     *                  element specified in the toCompare parameter and
     *                  the current Vector3D element is less than the
     *                  tolerance number, the two values are considered
     *                  nearly equal.
     * @param allFour   An optional parameter that specifies whether the w
     *                  property of the Vector3D objects is used in the
     *                  comparison.
     * @returns A value of true if the specified Vector3D object is nearly
     *          equal to the current Vector3D object; false if it is not
     *          equal.
     *
     * @see away.geom.Vector3D#equals()
     */
    Vector3D.prototype.nearEquals = function (toCompare, tolerance, allFour) {
        if (allFour === void 0) { allFour = true; }
        return ((Math.abs(this.x - toCompare.x) < tolerance) && (Math.abs(this.y - toCompare.y) < tolerance) && (Math.abs(this.z - toCompare.z) < tolerance) && (!allFour || Math.abs(this.w - toCompare.w) < tolerance));
    };
    /**
     * Sets the current Vector3D object to its inverse. The inverse object
     * is also considered the opposite of the original object. The value of
     * the x, y, and z properties of the current Vector3D object is changed
     * to -x, -y, and -z.
     */
    Vector3D.prototype.negate = function () {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
    };
    /**
     * Converts a Vector3D object to a unit vector by dividing the first
     * three elements (x, y, z) by the length of the vector. Unit vertices
     * are vertices that have a direction but their length is one. They
     * simplify vector calculations by removing length as a factor.
     */
    /**
     * Scales the line segment between(0,0) and the current point to a set
     * length.
     *
     * @param thickness The scaling value. For example, if the current
     *                  Vector3D object is (0,3,4), and you normalize it to
     *                  1, the point returned is at(0,0.6,0.8).
     */
    Vector3D.prototype.normalize = function (thickness) {
        if (thickness === void 0) { thickness = 1; }
        if (this.length != 0) {
            var invLength = thickness / this.length;
            this.x *= invLength;
            this.y *= invLength;
            this.z *= invLength;
            return;
        }
    };
    /**
     * Divides the value of the <code>x</code>, <code>y</code>, and
     * <code>z</code> properties of the current Vector3D object by the
     * value of its <code>w</code> property.
     *
     * <p>If the current Vector3D object is the result of multiplying a
     * Vector3D object by a projection Matrix3D object, the w property can
     * hold the transform value. The <code>project()</code> method then can
     * complete the projection by dividing the elements by the
     * <code>w</code> property. Use the <code>Matrix3D.rawData</code>
     * property to create a projection Matrix3D object.</p>
     */
    Vector3D.prototype.project = function () {
        this.x /= this.w;
        this.y /= this.w;
        this.z /= this.w;
    };
    /**
     * Scales the current Vector3D object by a scalar, a magnitude. The
     * Vector3D object's x, y, and z elements are multiplied by the scalar
     * number specified in the parameter. For example, if the vector is
     * scaled by ten, the result is a vector that is ten times longer. The
     * scalar can also change the direction of the vector. Multiplying the
     * vector by a negative number reverses its direction.
     *
     * @param s A multiplier (scalar) used to scale a Vector3D object.

     */
    Vector3D.prototype.scaleBy = function (s) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
    };
    /**
     * Sets the members of Vector3D to the specified values
     *
     * @param xa The first element, such as the x coordinate.
     * @param ya The second element, such as the y coordinate.
     * @param za The third element, such as the z coordinate.
     */
    Vector3D.prototype.setTo = function (xa, ya, za) {
        this.x = xa;
        this.y = ya;
        this.z = za;
    };
    /**
     * Subtracts the value of the x, y, and z elements of the current
     * Vector3D object from the values of the x, y, and z elements of
     * another Vector3D object. The <code>subtract()</code> method does not
     * change the current Vector3D object. Instead, this method returns a
     * new Vector3D object with the new values.
     *
     * @param a The Vector3D object to be subtracted from the current
     *          Vector3D object.
     * @returns A new Vector3D object that is the difference between the
     *          current Vector3D and the specified Vector3D object.
     *
     * @see away.geom.Vector3D#decrementBy()
     */
    Vector3D.prototype.subtract = function (a) {
        return new Vector3D(this.x - a.x, this.y - a.y, this.z - a.z);
    };
    /**
     * Returns a string representation of the current Vector3D object. The
     * string contains the values of the x, y, and z properties.
     */
    Vector3D.prototype.toString = function () {
        return "[Vector3D] (x:" + this.x + " ,y:" + this.y + ", z" + this.z + ", w:" + this.w + ")";
    };
    /**
     * The x axis defined as a Vector3D object with coordinates (1,0,0).
     */
    Vector3D.X_AXIS = new Vector3D(1, 0, 0);
    /**
     * The y axis defined as a Vector3D object with coordinates (0,1,0).
     */
    Vector3D.Y_AXIS = new Vector3D(0, 1, 0);
    /**
     * The z axis defined as a Vector3D object with coordinates (0,0,1).
     */
    Vector3D.Z_AXIS = new Vector3D(0, 0, 1);
    return Vector3D;
})();
module.exports = Vector3D;


},{}],27:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AssetLibraryIterator = require("awayjs-core/lib/library/AssetLibraryIterator");
var AssetLoader = require("awayjs-core/lib/library/AssetLoader");
var ConflictPrecedence = require("awayjs-core/lib/library/ConflictPrecedence");
var ConflictStrategy = require("awayjs-core/lib/library/ConflictStrategy");
var NamedAssetBase = require("awayjs-core/lib/library/NamedAssetBase");
var Error = require("awayjs-core/lib/errors/Error");
var AssetEvent = require("awayjs-core/lib/events/AssetEvent");
var IOErrorEvent = require("awayjs-core/lib/events/IOErrorEvent");
var LoaderEvent = require("awayjs-core/lib/events/LoaderEvent");
var EventDispatcher = require("awayjs-core/lib/events/EventDispatcher");
var ParserEvent = require("awayjs-core/lib/events/ParserEvent");
/**
 * AssetLibraryBundle enforces a multiton pattern and is not intended to be instanced directly.
 * Its purpose is to create a container for 3D data management, both before and after parsing.
 * If you are interested in creating multiple library bundles, please use the <code>getInstance()</code> method.
 */
var AssetLibraryBundle = (function (_super) {
    __extends(AssetLibraryBundle, _super);
    /**
     * Creates a new <code>AssetLibraryBundle</code> object.
     *
     * @param me A multiton enforcer for the AssetLibraryBundle ensuring it cannnot be instanced.
     */
    function AssetLibraryBundle() {
        var _this = this;
        _super.call(this);
        this._loadingSessionsGarbage = new Array();
        this._assets = new Array(); //new Vector.<IAsset>;
        this._assetDictionary = new Object();
        this._loadingSessions = new Array();
        this.conflictStrategy = ConflictStrategy.IGNORE.create();
        this.conflictPrecedence = ConflictPrecedence.FAVOR_NEW;
        this._onAssetRenameDelegate = function (event) { return _this.onAssetRename(event); };
        this._onAssetConflictResolvedDelegate = function (event) { return _this.onAssetConflictResolved(event); };
        this._onResourceCompleteDelegate = function (event) { return _this.onResourceComplete(event); };
        this._onTextureSizeErrorDelegate = function (event) { return _this.onTextureSizeError(event); };
        this._onAssetCompleteDelegate = function (event) { return _this.onAssetComplete(event); };
        this._onLoadErrorDelegate = function (event) { return _this.onLoadError(event); };
        this._onParseErrorDelegate = function (event) { return _this.onParseError(event); };
    }
    /**
     * Returns an AssetLibraryBundle instance. If no key is given, returns the default bundle instance (which is
     * similar to using the AssetLibraryBundle as a singleton.) To keep several separated library bundles,
     * pass a string key to this method to define which bundle should be returned. This is
     * referred to as using the AssetLibrary as a multiton.
     *
     * @param key Defines which multiton instance should be returned.
     * @return An instance of the asset library
     */
    AssetLibraryBundle.getInstance = function (key) {
        if (key === void 0) { key = 'default'; }
        if (!key)
            key = 'default';
        if (!AssetLibraryBundle._iInstances.hasOwnProperty(key))
            AssetLibraryBundle._iInstances[key] = new AssetLibraryBundle();
        return AssetLibraryBundle._iInstances[key];
    };
    /**
     *
     */
    AssetLibraryBundle.prototype.enableParser = function (parserClass) {
        AssetLoader.enableParser(parserClass);
    };
    /**
     *
     */
    AssetLibraryBundle.prototype.enableParsers = function (parserClasses) {
        AssetLoader.enableParsers(parserClasses);
    };
    Object.defineProperty(AssetLibraryBundle.prototype, "conflictStrategy", {
        /**
         * Defines which strategy should be used for resolving naming conflicts, when two library
         * assets are given the same name. By default, <code>ConflictStrategy.APPEND_NUM_SUFFIX</code>
         * is used which means that a numeric suffix is appended to one of the assets. The
         * <code>conflictPrecedence</code> property defines which of the two conflicting assets will
         * be renamed.
         *
         * @see naming.ConflictStrategy
         * @see AssetLibrary.conflictPrecedence
         */
        get: function () {
            return this._strategy;
        },
        set: function (val) {
            if (!val)
                throw new Error('namingStrategy must not be null. To ignore naming, use AssetLibrary.IGNORE');
            this._strategy = val.create();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AssetLibraryBundle.prototype, "conflictPrecedence", {
        /**
         * Defines which asset should have precedence when resolving a naming conflict between
         * two assets of which one has just been renamed by the user or by a parser. By default
         * <code>ConflictPrecedence.FAVOR_NEW</code> is used, meaning that the newly renamed
         * asset will keep it's new name while the older asset gets renamed to not conflict.
         *
         * This property is ignored for conflict strategies that do not actually rename an
         * asset automatically, such as ConflictStrategy.IGNORE and ConflictStrategy.THROW_ERROR.
         *
         * @see away.library.ConflictPrecedence
         * @see away.library.ConflictStrategy
         */
        get: function () {
            return this._strategyPreference;
        },
        set: function (val) {
            this._strategyPreference = val;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Create an AssetLibraryIterator instance that can be used to iterate over the assets
     * in this asset library instance. The iterator can filter assets on asset type and/or
     * namespace. A "null" filter value means no filter of that type is used.
     *
     * @param assetTypeFilter Asset type to filter on (from the AssetType enum class.) Use
     * null to not filter on asset type.
     * @param namespaceFilter Namespace to filter on. Use null to not filter on namespace.
     * @param filterFunc Callback function to use when deciding whether an asset should be
     * included in the iteration or not. This needs to be a function that takes a single
     * parameter of type IAsset and returns a boolean where true means it should be included.
     *
     * @see away.library.AssetType
     */
    AssetLibraryBundle.prototype.createIterator = function (assetTypeFilter, namespaceFilter, filterFunc) {
        if (assetTypeFilter === void 0) { assetTypeFilter = null; }
        if (namespaceFilter === void 0) { namespaceFilter = null; }
        if (filterFunc === void 0) { filterFunc = null; }
        return new AssetLibraryIterator(this._assets, assetTypeFilter, namespaceFilter, filterFunc);
    };
    /**
     * Loads a file and (optionally) all of its dependencies.
     *
     * @param req The URLRequest object containing the URL of the file to be loaded.
     * @param context An optional context object providing additional parameters for loading
     * @param ns An optional namespace string under which the file is to be loaded, allowing the differentiation of two resources with identical assets
     * @param parser An optional parser object for translating the loaded data into a usable resource. If not provided, AssetLoader will attempt to auto-detect the file type.
     * @return A handle to the retrieved resource.
     */
    AssetLibraryBundle.prototype.load = function (req, context, ns, parser) {
        if (context === void 0) { context = null; }
        if (ns === void 0) { ns = null; }
        if (parser === void 0) { parser = null; }
        var loader = new AssetLoader();
        if (!this._loadingSessions)
            this._loadingSessions = new Array();
        this._loadingSessions.push(loader);
        loader.addEventListener(LoaderEvent.RESOURCE_COMPLETE, this._onResourceCompleteDelegate);
        loader.addEventListener(AssetEvent.TEXTURE_SIZE_ERROR, this._onTextureSizeErrorDelegate);
        loader.addEventListener(AssetEvent.ASSET_COMPLETE, this._onAssetCompleteDelegate);
        // Error are handled separately (see documentation for addErrorHandler)
        loader._iAddErrorHandler(this._onLoadErrorDelegate);
        loader._iAddParseErrorHandler(this._onParseErrorDelegate);
        return loader.load(req, context, ns, parser);
    };
    /**
     * Loads a resource from existing data in memory.
     *
     * @param data The data object containing all resource information.
     * @param context An optional context object providing additional parameters for loading
     * @param ns An optional namespace string under which the file is to be loaded, allowing the differentiation of two resources with identical assets
     * @param parser An optional parser object for translating the loaded data into a usable resource. If not provided, AssetLoader will attempt to auto-detect the file type.
     * @return A handle to the retrieved resource.
     */
    AssetLibraryBundle.prototype.loadData = function (data, context, ns, parser) {
        if (context === void 0) { context = null; }
        if (ns === void 0) { ns = null; }
        if (parser === void 0) { parser = null; }
        var loader = new AssetLoader();
        if (!this._loadingSessions)
            this._loadingSessions = new Array();
        this._loadingSessions.push(loader);
        loader.addEventListener(LoaderEvent.RESOURCE_COMPLETE, this._onResourceCompleteDelegate);
        loader.addEventListener(AssetEvent.TEXTURE_SIZE_ERROR, this._onTextureSizeErrorDelegate);
        loader.addEventListener(AssetEvent.ASSET_COMPLETE, this._onAssetCompleteDelegate);
        // Error are handled separately (see documentation for addErrorHandler)
        loader._iAddErrorHandler(this._onLoadErrorDelegate);
        loader._iAddParseErrorHandler(this._onParseErrorDelegate);
        return loader.loadData(data, '', context, ns, parser);
    };
    /**
     *
     */
    AssetLibraryBundle.prototype.getAsset = function (name, ns) {
        //var asset : IAsset;
        if (ns === void 0) { ns = null; }
        if (this._assetDictDirty)
            this.rehashAssetDict();
        if (ns == null)
            ns = NamedAssetBase.DEFAULT_NAMESPACE;
        if (!this._assetDictionary.hasOwnProperty(ns))
            return null;
        return this._assetDictionary[ns][name];
    };
    /**
     * Adds an asset to the asset library, first making sure that it's name is unique
     * using the method defined by the <code>conflictStrategy</code> and
     * <code>conflictPrecedence</code> properties.
     */
    AssetLibraryBundle.prototype.addAsset = function (asset) {
        var ns;
        var old;
        // Bail if asset has already been added.
        if (this._assets.indexOf(asset) >= 0)
            return;
        old = this.getAsset(asset.name, asset.assetNamespace);
        ns = asset.assetNamespace || NamedAssetBase.DEFAULT_NAMESPACE;
        if (old != null)
            this._strategy.resolveConflict(asset, old, this._assetDictionary[ns], this._strategyPreference);
        //create unique-id (for now this is used in AwayBuilder only
        //asset.id = IDUtil.createUID();
        // Add it
        this._assets.push(asset);
        if (!this._assetDictionary.hasOwnProperty(ns))
            this._assetDictionary[ns] = new Object();
        this._assetDictionary[ns][asset.name] = asset;
        asset.addEventListener(AssetEvent.ASSET_RENAME, this._onAssetRenameDelegate);
        asset.addEventListener(AssetEvent.ASSET_CONFLICT_RESOLVED, this._onAssetConflictResolvedDelegate);
    };
    /**
     * Removes an asset from the library, and optionally disposes that asset by calling
     * it's disposeAsset() method (which for most assets is implemented as a default
     * version of that type's dispose() method.
     *
     * @param asset The asset which should be removed from this library.
     * @param dispose Defines whether the assets should also be disposed.
     */
    AssetLibraryBundle.prototype.removeAsset = function (asset, dispose) {
        if (dispose === void 0) { dispose = true; }
        var idx;
        this.removeAssetFromDict(asset);
        asset.removeEventListener(AssetEvent.ASSET_RENAME, this._onAssetRenameDelegate);
        asset.removeEventListener(AssetEvent.ASSET_CONFLICT_RESOLVED, this._onAssetConflictResolvedDelegate);
        idx = this._assets.indexOf(asset);
        if (idx >= 0)
            this._assets.splice(idx, 1);
        if (dispose)
            asset.dispose();
    };
    /**
     * Removes an asset which is specified using name and namespace.
     *
     * @param name The name of the asset to be removed.
     * @param ns The namespace to which the desired asset belongs.
     * @param dispose Defines whether the assets should also be disposed.
     *
     * @see away.library.AssetLibrary.removeAsset()
     */
    AssetLibraryBundle.prototype.removeAssetByName = function (name, ns, dispose) {
        if (ns === void 0) { ns = null; }
        if (dispose === void 0) { dispose = true; }
        var asset = this.getAsset(name, ns);
        if (asset)
            this.removeAsset(asset, dispose);
        return asset;
    };
    /**
     * Removes all assets from the asset library, optionally disposing them as they
     * are removed.
     *
     * @param dispose Defines whether the assets should also be disposed.
     */
    AssetLibraryBundle.prototype.removeAllAssets = function (dispose) {
        if (dispose === void 0) { dispose = true; }
        if (dispose) {
            var asset;
            for (var c = 0; c < this._assets.length; c++) {
                asset = this._assets[c];
                asset.dispose();
            }
        }
        this._assets.length = 0;
        this.rehashAssetDict();
    };
    /**
     * Removes all assets belonging to a particular namespace (null for default)
     * from the asset library, and optionall disposes them by calling their
     * disposeAsset() method.
     *
     * @param ns The namespace from which all assets should be removed.
     * @param dispose Defines whether the assets should also be disposed.
     *
     * @see away.library.AssetLibrary.removeAsset()
     */
    AssetLibraryBundle.prototype.removeNamespaceAssets = function (ns, dispose) {
        if (ns === void 0) { ns = null; }
        if (dispose === void 0) { dispose = true; }
        var idx = 0;
        var asset;
        var old_assets;
        // Empty the assets vector after having stored a copy of it.
        // The copy will be filled with all assets which weren't removed.
        old_assets = this._assets.concat();
        this._assets.length = 0;
        if (ns == null)
            ns = NamedAssetBase.DEFAULT_NAMESPACE;
        for (var d = 0; d < old_assets.length; d++) {
            asset = old_assets[d];
            // Remove from dict if in the supplied namespace. If not,
            // transfer over to the new vector.
            if (asset.assetNamespace == ns) {
                if (dispose)
                    asset.dispose();
                // Remove asset from dictionary, but don't try to auto-remove
                // the namespace, which will trigger an unnecessarily expensive
                // test that is not needed since we know that the namespace
                // will be empty when loop finishes.
                this.removeAssetFromDict(asset, false);
            }
            else {
                this._assets[idx++] = asset;
            }
        }
        /*
         for each (asset in old_assets) {
         // Remove from dict if in the supplied namespace. If not,
         // transfer over to the new vector.
         if (asset.assetNamespace == ns) {
         if (dispose)
         asset.dispose();

         // Remove asset from dictionary, but don't try to auto-remove
         // the namespace, which will trigger an unnecessarily expensive
         // test that is not needed since we know that the namespace
         // will be empty when loop finishes.
         removeAssetFromDict(asset, false);
         } else
         _assets[idx++] = asset;

         }
         */
        // Remove empty namespace
        if (this._assetDictionary.hasOwnProperty(ns))
            delete this._assetDictionary[ns];
    };
    AssetLibraryBundle.prototype.removeAssetFromDict = function (asset, autoRemoveEmptyNamespace) {
        if (autoRemoveEmptyNamespace === void 0) { autoRemoveEmptyNamespace = true; }
        if (this._assetDictDirty)
            this.rehashAssetDict();
        if (this._assetDictionary.hasOwnProperty(asset.assetNamespace)) {
            if (this._assetDictionary[asset.assetNamespace].hasOwnProperty(asset.name))
                delete this._assetDictionary[asset.assetNamespace][asset.name];
            if (autoRemoveEmptyNamespace) {
                var key;
                var empty = true;
                for (key in this._assetDictionary[asset.assetNamespace]) {
                    empty = false;
                    break;
                }
                if (empty)
                    delete this._assetDictionary[asset.assetNamespace];
            }
        }
    };
    AssetLibraryBundle.prototype.stopAllLoadingSessions = function () {
        var i;
        if (!this._loadingSessions)
            this._loadingSessions = new Array();
        var length = this._loadingSessions.length;
        for (i = 0; i < length; i++)
            this.killLoadingSession(this._loadingSessions[i]);
        this._loadingSessions = null;
    };
    AssetLibraryBundle.prototype.rehashAssetDict = function () {
        var asset;
        this._assetDictionary = {};
        var l = this._assets.length;
        for (var c = 0; c < l; c++) {
            asset = this._assets[c];
            if (!this._assetDictionary.hasOwnProperty(asset.assetNamespace))
                this._assetDictionary[asset.assetNamespace] = {};
            this._assetDictionary[asset.assetNamespace][asset.name] = asset;
        }
        this._assetDictDirty = false;
    };
    /**
     * Called when a an error occurs during loading.
     */
    AssetLibraryBundle.prototype.onLoadError = function (event) {
        if (this.hasEventListener(IOErrorEvent.IO_ERROR)) {
            this.dispatchEvent(event);
            return true;
        }
        else {
            return false;
        }
    };
    /**
     * Called when a an error occurs during parsing.
     */
    AssetLibraryBundle.prototype.onParseError = function (event) {
        if (this.hasEventListener(ParserEvent.PARSE_ERROR)) {
            this.dispatchEvent(event);
            return true;
        }
        else {
            return false;
        }
    };
    AssetLibraryBundle.prototype.onAssetComplete = function (event) {
        // Only add asset to library the first time.
        if (event.type == AssetEvent.ASSET_COMPLETE)
            this.addAsset(event.asset);
        this.dispatchEvent(event);
    };
    AssetLibraryBundle.prototype.onTextureSizeError = function (event) {
        this.dispatchEvent(event);
    };
    /**
     * Called when the resource and all of its dependencies was retrieved.
     */
    AssetLibraryBundle.prototype.onResourceComplete = function (event) {
        var _this = this;
        var loader = event.target;
        this.dispatchEvent(event);
        var index = this._loadingSessions.indexOf(loader);
        this._loadingSessions.splice(index, 1);
        // Add loader to a garbage array - for a collection sweep and kill
        this._loadingSessionsGarbage.push(loader);
        this._gcTimeoutIID = setTimeout(function () {
            _this.loadingSessionGC();
        }, 100);
    };
    AssetLibraryBundle.prototype.loadingSessionGC = function () {
        var loader;
        while (this._loadingSessionsGarbage.length > 0) {
            loader = this._loadingSessionsGarbage.pop();
            this.killLoadingSession(loader);
        }
        clearTimeout(this._gcTimeoutIID);
        this._gcTimeoutIID = null;
    };
    AssetLibraryBundle.prototype.killLoadingSession = function (loader) {
        loader.removeEventListener(LoaderEvent.RESOURCE_COMPLETE, this._onResourceCompleteDelegate);
        loader.removeEventListener(AssetEvent.TEXTURE_SIZE_ERROR, this._onTextureSizeErrorDelegate);
        loader.removeEventListener(AssetEvent.ASSET_COMPLETE, this._onAssetCompleteDelegate);
        loader.stop();
    };
    /**
     * Called when unespected error occurs
     */
    /*
     private onResourceError() : void
     {
     var msg:string = "Unexpected parser error";
     if(hasEventListener(LoaderEvent.DEPENDENCY_ERROR)){
     var re:LoaderEvent = new LoaderEvent(LoaderEvent.DEPENDENCY_ERROR, "");
     dispatchEvent(re);
     } else{
     throw new Error(msg);
     }
     }
     */
    AssetLibraryBundle.prototype.onAssetRename = function (event) {
        var asset = event.target; // TODO: was ev.currentTarget - watch this var
        var old = this.getAsset(asset.assetNamespace, asset.name);
        if (old != null) {
            this._strategy.resolveConflict(asset, old, this._assetDictionary[asset.assetNamespace], this._strategyPreference);
        }
        else {
            var dict = this._assetDictionary[event.asset.assetNamespace];
            if (dict == null)
                return;
            dict[event.assetPrevName] = null;
            dict[event.asset.name] = event.asset;
        }
    };
    AssetLibraryBundle.prototype.onAssetConflictResolved = function (event) {
        this.dispatchEvent(event.clone());
    };
    AssetLibraryBundle._iInstances = new Object();
    return AssetLibraryBundle;
})(EventDispatcher);
module.exports = AssetLibraryBundle;


},{"awayjs-core/lib/errors/Error":6,"awayjs-core/lib/events/AssetEvent":8,"awayjs-core/lib/events/EventDispatcher":10,"awayjs-core/lib/events/IOErrorEvent":12,"awayjs-core/lib/events/LoaderEvent":13,"awayjs-core/lib/events/ParserEvent":14,"awayjs-core/lib/library/AssetLibraryIterator":28,"awayjs-core/lib/library/AssetLoader":29,"awayjs-core/lib/library/ConflictPrecedence":32,"awayjs-core/lib/library/ConflictStrategy":33,"awayjs-core/lib/library/NamedAssetBase":37}],28:[function(require,module,exports){
var AssetLibraryIterator = (function () {
    function AssetLibraryIterator(assets, assetTypeFilter, namespaceFilter, filterFunc) {
        this._assets = assets;
        this.filter(assetTypeFilter, namespaceFilter, filterFunc);
    }
    Object.defineProperty(AssetLibraryIterator.prototype, "currentAsset", {
        get: function () {
            // Return current, or null if no current
            return (this._idx < this._filtered.length) ? this._filtered[this._idx] : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AssetLibraryIterator.prototype, "numAssets", {
        get: function () {
            return this._filtered.length;
        },
        enumerable: true,
        configurable: true
    });
    AssetLibraryIterator.prototype.next = function () {
        var next = null;
        if (this._idx < this._filtered.length)
            next = this._filtered[this._idx];
        this._idx++;
        return next;
    };
    AssetLibraryIterator.prototype.reset = function () {
        this._idx = 0;
    };
    AssetLibraryIterator.prototype.setIndex = function (index) {
        this._idx = index;
    };
    AssetLibraryIterator.prototype.filter = function (assetTypeFilter, namespaceFilter, filterFunc) {
        if (assetTypeFilter || namespaceFilter) {
            var idx;
            var asset;
            idx = 0;
            this._filtered = new Array(); //new Vector.<IAsset>;
            var l = this._assets.length;
            for (var c = 0; c < l; c++) {
                asset = this._assets[c];
                // Skip this assets if filtering on type and this is wrong type
                if (assetTypeFilter && asset.assetType != assetTypeFilter)
                    continue;
                // Skip this asset if filtering on namespace and this is wrong namespace
                if (namespaceFilter && asset.assetNamespace != namespaceFilter)
                    continue;
                // Skip this asset if a filter func has been provided and it returns false
                if (filterFunc != null && !filterFunc(asset))
                    continue;
                this._filtered[idx++] = asset;
            }
        }
        else {
            this._filtered = this._assets;
        }
    };
    return AssetLibraryIterator;
})();
module.exports = AssetLibraryIterator;


},{}],29:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AssetLoaderToken = require("awayjs-core/lib/library/AssetLoaderToken");
var URLLoader = require("awayjs-core/lib/net/URLLoader");
var URLLoaderDataFormat = require("awayjs-core/lib/net/URLLoaderDataFormat");
var Error = require("awayjs-core/lib/errors/Error");
var AssetEvent = require("awayjs-core/lib/events/AssetEvent");
var Event = require("awayjs-core/lib/events/Event");
var EventDispatcher = require("awayjs-core/lib/events/EventDispatcher");
var IOErrorEvent = require("awayjs-core/lib/events/IOErrorEvent");
var LoaderEvent = require("awayjs-core/lib/events/LoaderEvent");
var ParserEvent = require("awayjs-core/lib/events/ParserEvent");
var CubeTextureParser = require("awayjs-core/lib/parsers/CubeTextureParser");
var ResourceDependency = require("awayjs-core/lib/parsers/ResourceDependency");
var Texture2DParser = require("awayjs-core/lib/parsers/Texture2DParser");
/**
 * Dispatched when any asset finishes parsing. Also see specific events for each
 * individual asset type (meshes, materials et c.)
 *
 * @eventType away.events.AssetEvent
 */
//[Event(name="assetComplete", type="away3d.events.AssetEvent")]
/**
 * Dispatched when a full resource (including dependencies) finishes loading.
 *
 * @eventType away.events.LoaderEvent
 */
//[Event(name="resourceComplete", type="away3d.events.LoaderEvent")]
/**
 * Dispatched when a single dependency (which may be the main file of a resource)
 * finishes loading.
 *
 * @eventType away.events.LoaderEvent
 */
//[Event(name="dependencyComplete", type="away3d.events.LoaderEvent")]
/**
 * Dispatched when an error occurs during loading. I
 *
 * @eventType away.events.LoaderEvent
 */
//[Event(name="loadError", type="away3d.events.LoaderEvent")]
/**
 * Dispatched when an error occurs during parsing.
 *
 * @eventType away.events.ParserEvent
 */
//[Event(name="parseError", type="away3d.events.ParserEvent")]
/**
 * Dispatched when an image asset dimensions are not a power of 2
 *
 * @eventType away.events.AssetEvent
 */
//[Event(name="textureSizeError", type="away3d.events.AssetEvent")]
/**
 * AssetLoader can load any file format that away.supports (or for which a third-party parser
 * has been plugged in) and it's dependencies. Events are dispatched when assets are encountered
 * and for when the resource (or it's dependencies) have been loaded.
 *
 * The AssetLoader will not make assets available in any other way than through the dispatched
 * events. To store assets and make them available at any point from any module in an application,
 * use the AssetLibrary to load and manage assets.
 *
 * @see away.library.AssetLibrary
 */
var AssetLoader = (function (_super) {
    __extends(AssetLoader, _super);
    /**
     * Create a new ResourceLoadSession object.
     */
    function AssetLoader(materialMode) {
        var _this = this;
        if (materialMode === void 0) { materialMode = 0; }
        _super.call(this);
        this._materialMode = materialMode;
        this._stack = new Array();
        this._errorHandlers = new Array();
        this._parseErrorHandlers = new Array();
        this._onReadyForDependenciesDelegate = function (event) { return _this.onReadyForDependencies(event); };
        this._onParseCompleteDelegate = function (event) { return _this.onParseComplete(event); };
        this._onParseErrorDelegate = function (event) { return _this.onParseError(event); };
        this._onLoadCompleteDelegate = function (event) { return _this.onLoadComplete(event); };
        this._onLoadErrorDelegate = function (event) { return _this.onLoadError(event); };
        this._onTextureSizeErrorDelegate = function (event) { return _this.onTextureSizeError(event); };
        this._onAssetCompleteDelegate = function (event) { return _this.onAssetComplete(event); };
    }
    /**
     * Enables a specific parser.
     * When no specific parser is set for a loading/parsing opperation,
     * loader3d can autoselect the correct parser to use.
     * A parser must have been enabled, to be considered when autoselecting the parser.
     *
     * @param parser The parser class to enable.
     *
     * @see away.parsers.Parsers
     */
    AssetLoader.enableParser = function (parser) {
        if (AssetLoader._parsers.indexOf(parser) < 0)
            AssetLoader._parsers.push(parser);
    };
    /**
     * Enables a list of parsers.
     * When no specific parser is set for a loading/parsing opperation,
     * AssetLoader can autoselect the correct parser to use.
     * A parser must have been enabled, to be considered when autoselecting the parser.
     *
     * @param parsers A Vector of parser classes to enable.
     * @see away.parsers.Parsers
     */
    AssetLoader.enableParsers = function (parsers) {
        for (var c = 0; c < parsers.length; c++)
            AssetLoader.enableParser(parsers[c]);
    };
    Object.defineProperty(AssetLoader.prototype, "baseDependency", {
        /**
         * Returns the base dependency of the loader
         */
        get: function () {
            return this._baseDependency;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Loads a file and (optionally) all of its dependencies.
     *
     * @param req The URLRequest object containing the URL of the file to be loaded.
     * @param context An optional context object providing additional parameters for loading
     * @param ns An optional namespace string under which the file is to be loaded, allowing the differentiation of two resources with identical assets
     * @param parser An optional parser object for translating the loaded data into a usable resource. If not provided, AssetLoader will attempt to auto-detect the file type.
     */
    AssetLoader.prototype.load = function (req, context, ns, parser) {
        if (context === void 0) { context = null; }
        if (ns === void 0) { ns = null; }
        if (parser === void 0) { parser = null; }
        if (!this._token) {
            this._token = new AssetLoaderToken(this);
            this._uri = req.url = req.url.replace(/\\/g, "/");
            this._context = context;
            this._namespace = ns;
            this._baseDependency = new ResourceDependency('', req, null, parser, null);
            this.retrieveDependency(this._baseDependency);
            return this._token;
        }
        // TODO: Throw error (already loading)
        return null;
    };
    /**
     * Loads a resource from already loaded data.
     *
     * @param data The data object containing all resource information.
     * @param context An optional context object providing additional parameters for loading
     * @param ns An optional namespace string under which the file is to be loaded, allowing the differentiation of two resources with identical assets
     * @param parser An optional parser object for translating the loaded data into a usable resource. If not provided, AssetLoader will attempt to auto-detect the file type.
     */
    AssetLoader.prototype.loadData = function (data, id, context, ns, parser) {
        if (context === void 0) { context = null; }
        if (ns === void 0) { ns = null; }
        if (parser === void 0) { parser = null; }
        if (!this._token) {
            this._token = new AssetLoaderToken(this);
            this._uri = id;
            this._context = context;
            this._namespace = ns;
            this._baseDependency = new ResourceDependency(id, null, data, parser, null);
            this.retrieveDependency(this._baseDependency);
            return this._token;
        }
        // TODO: Throw error (already loading)
        return null;
    };
    /**
     * Recursively retrieves the next to-be-loaded and parsed dependency on the stack, or pops the list off the
     * stack when complete and continues on the top set.
     * @param parser The parser that will translate the data into a usable resource.
     */
    AssetLoader.prototype.retrieveNext = function (parser) {
        if (parser === void 0) { parser = null; }
        if (this._currentDependency.dependencies.length) {
            var next = this._currentDependency.dependencies.pop();
            this._stack.push(this._currentDependency);
            this.retrieveDependency(next);
        }
        else if (this._currentDependency.parser && this._currentDependency.parser.parsingPaused) {
            this._currentDependency.parser._iResumeParsingAfterDependencies();
            this._stack.pop();
        }
        else if (this._stack.length) {
            var prev = this._currentDependency;
            this._currentDependency = this._stack.pop();
            if (prev._iSuccess)
                prev.resolve();
            this.retrieveNext(parser);
        }
        else {
            this.dispatchEvent(new LoaderEvent(LoaderEvent.RESOURCE_COMPLETE, this._uri, this._baseDependency.parser.content, this._baseDependency.assets));
        }
    };
    /**
     * Retrieves a single dependency.
     * @param parser The parser that will translate the data into a usable resource.
     */
    AssetLoader.prototype.retrieveDependency = function (dependency) {
        var data;
        if (this._context && this._context.materialMode != 0)
            this._materialMode = this._context.materialMode;
        this._currentDependency = dependency;
        dependency._iLoader = new URLLoader();
        this.addEventListeners(dependency._iLoader);
        // Get already loaded (or mapped) data if available
        data = dependency.data;
        if (this._context && dependency.request && this._context._iHasDataForUrl(dependency.request.url))
            data = this._context._iGetDataForUrl(dependency.request.url);
        if (data) {
            if (data.constructor === Function)
                data = new data();
            dependency._iSetData(data);
            if (dependency.retrieveAsRawData) {
                // No need to parse. The parent parser is expecting this
                // to be raw data so it can be passed directly.
                dependency.resolve();
                // Move on to next dependency
                this.retrieveNext();
            }
            else {
                this.parseDependency(dependency);
            }
        }
        else {
            // Resolve URL and start loading
            dependency.request.url = this.resolveDependencyUrl(dependency);
            if (dependency.retrieveAsRawData) {
                // Always use binary for raw data loading
                dependency._iLoader.dataFormat = URLLoaderDataFormat.BINARY;
            }
            else {
                if (!dependency.parser)
                    dependency._iSetParser(this.getParserFromSuffix(dependency.request.url));
                if (dependency.parser) {
                    dependency._iLoader.dataFormat = dependency.parser.dataFormat;
                }
                else {
                    // Always use BINARY for unknown file formats. The thorough
                    // file type check will determine format after load, and if
                    // binary, a text load will have broken the file data.
                    dependency._iLoader.dataFormat = URLLoaderDataFormat.BINARY;
                }
            }
            dependency._iLoader.load(dependency.request);
        }
    };
    AssetLoader.prototype.joinUrl = function (base, end) {
        if (end.charAt(0) == '/')
            end = end.substr(1);
        if (base.length == 0)
            return end;
        if (base.charAt(base.length - 1) == '/')
            base = base.substr(0, base.length - 1);
        return base.concat('/', end);
    };
    AssetLoader.prototype.resolveDependencyUrl = function (dependency) {
        var scheme_re;
        var base;
        var url = dependency.request.url;
        // Has the user re-mapped this URL?
        if (this._context && this._context._iHasMappingForUrl(url))
            return this._context._iGetRemappedUrl(url);
        // This is the "base" dependency, i.e. the actual requested asset.
        // We will not try to resolve this since the user can probably be
        // thrusted to know this URL better than our automatic resolver. :)
        if (url == this._uri)
            return url;
        // Absolute URL? Check if starts with slash or a URL
        // scheme definition (e.g. ftp://, http://, file://)
        scheme_re = new RegExp('/^[a-zA-Z]{3,4}:\/\//');
        if (url.charAt(0) == '/') {
            if (this._context && this._context.overrideAbsolutePaths)
                return this.joinUrl(this._context.dependencyBaseUrl, url);
            else
                return url;
        }
        else if (scheme_re.test(url)) {
            // If overriding full URLs, get rid of scheme (e.g. "http://")
            // and replace with the dependencyBaseUrl defined by user.
            if (this._context && this._context.overrideFullURLs) {
                var noscheme_url = url.replace(scheme_re, ''); //url['replace'](scheme_re);
                return this.joinUrl(this._context.dependencyBaseUrl, noscheme_url);
            }
        }
        // Since not absolute, just get rid of base file name to find it's
        // folder and then concatenate dynamic URL
        if (this._context && this._context.dependencyBaseUrl) {
            base = this._context.dependencyBaseUrl;
            return this.joinUrl(base, url);
        }
        else {
            base = this._uri.substring(0, this._uri.lastIndexOf('/') + 1);
            return this.joinUrl(base, url);
        }
    };
    AssetLoader.prototype.retrieveParserDependencies = function () {
        if (!this._currentDependency)
            return;
        var parserDependancies = this._currentDependency.parser.dependencies;
        var i, len = parserDependancies.length;
        for (i = 0; i < len; i++)
            this._currentDependency.dependencies[i] = parserDependancies[i];
        // Since more dependencies might be added eventually, empty this
        // list so that the same dependency isn't retrieved more than once.
        parserDependancies.length = 0;
        this._stack.push(this._currentDependency);
        this.retrieveNext();
    };
    AssetLoader.prototype.resolveParserDependencies = function () {
        this._currentDependency._iSuccess = true;
        // Retrieve any last dependencies remaining on this parser, or
        // if none exists, just move on.
        if (this._currentDependency.parser && this._currentDependency.parser.dependencies.length && (!this._context || this._context.includeDependencies))
            this.retrieveParserDependencies();
        else
            this.retrieveNext();
    };
    /**
     * Called when a single dependency loading failed, and pushes further dependencies onto the stack.
     * @param event
     */
    AssetLoader.prototype.onLoadError = function (event) {
        var handled;
        var isDependency = (this._currentDependency != this._baseDependency);
        var loader = event.target; //TODO: keep on eye on this one
        this.removeEventListeners(loader);
        if (this.hasEventListener(IOErrorEvent.IO_ERROR)) {
            this.dispatchEvent(event);
            handled = true;
        }
        else {
            // TODO: Consider not doing this even when AssetLoader does have it's own LOAD_ERROR listener
            var i, len = this._errorHandlers.length;
            for (i = 0; i < len; i++)
                if (!handled)
                    handled = this._errorHandlers[i](event);
        }
        if (handled) {
            //if (isDependency && ! event.isDefaultPrevented()) {
            if (isDependency) {
                this._currentDependency.resolveFailure();
                this.retrieveNext();
            }
            else {
                // Either this was the base file (last left in the stack) or
                // default behavior was prevented by the handlers, and hence
                // there is nothing more to do than clean up and bail.
                this.dispose();
                return;
            }
        }
        else {
            throw new Error();
        }
    };
    /**
     * Called when a dependency parsing failed, and dispatches a <code>ParserEvent.PARSE_ERROR</code>
     * @param event
     */
    AssetLoader.prototype.onParseError = function (event) {
        var handled;
        var isDependency = (this._currentDependency != this._baseDependency);
        var loader = event.target;
        this.removeEventListeners(loader);
        if (this.hasEventListener(ParserEvent.PARSE_ERROR)) {
            this.dispatchEvent(event);
            handled = true;
        }
        else {
            // TODO: Consider not doing this even when AssetLoader does
            // have it's own LOAD_ERROR listener
            var i, len = this._parseErrorHandlers.length;
            for (i = 0; i < len; i++)
                if (!handled)
                    handled = this._parseErrorHandlers[i](event);
        }
        if (handled) {
            this.dispose();
            return;
        }
        else {
            throw new Error(event.message);
        }
    };
    AssetLoader.prototype.onAssetComplete = function (event) {
        // Add loaded asset to list of assets retrieved as part
        // of the current dependency. This list will be inspected
        // by the parent parser when dependency is resolved
        if (this._currentDependency)
            this._currentDependency.assets.push(event.asset);
        event.asset.resetAssetPath(event.asset.name, this._namespace);
        if (!this._currentDependency.suppresAssetEvents)
            this.dispatchEvent(event);
    };
    AssetLoader.prototype.onReadyForDependencies = function (event) {
        var parser = event.target;
        if (this._context && !this._context.includeDependencies)
            parser._iResumeParsingAfterDependencies();
        else
            this.retrieveParserDependencies();
    };
    /**
     * Called when a single dependency was parsed, and pushes further dependencies onto the stack.
     * @param event
     */
    AssetLoader.prototype.onLoadComplete = function (event) {
        var loader = event.target;
        this.removeEventListeners(loader);
        // Resolve this dependency
        this._currentDependency._iSetData(loader.data);
        if (this._currentDependency.retrieveAsRawData) {
            // No need to parse this data, which should be returned as is
            this.resolveParserDependencies();
        }
        else {
            this.parseDependency(this._currentDependency);
        }
    };
    /**
     * Called when parsing is complete.
     */
    AssetLoader.prototype.onParseComplete = function (event) {
        var parser = event.target;
        this.resolveParserDependencies(); //resolve in front of removing listeners to allow any remaining asset events to propagate
        parser.removeEventListener(ParserEvent.READY_FOR_DEPENDENCIES, this._onReadyForDependenciesDelegate);
        parser.removeEventListener(ParserEvent.PARSE_COMPLETE, this._onParseCompleteDelegate);
        parser.removeEventListener(ParserEvent.PARSE_ERROR, this._onParseErrorDelegate);
        parser.removeEventListener(AssetEvent.TEXTURE_SIZE_ERROR, this._onTextureSizeErrorDelegate);
        parser.removeEventListener(AssetEvent.ASSET_COMPLETE, this._onAssetCompleteDelegate);
    };
    /**
     * Called when an image is too large or it's dimensions are not a power of 2
     * @param event
     */
    AssetLoader.prototype.onTextureSizeError = function (event) {
        event.asset.name = this._currentDependency.resolveName(event.asset);
        this.dispatchEvent(event);
    };
    AssetLoader.prototype.addEventListeners = function (loader) {
        loader.addEventListener(Event.COMPLETE, this._onLoadCompleteDelegate);
        loader.addEventListener(IOErrorEvent.IO_ERROR, this._onLoadErrorDelegate);
    };
    AssetLoader.prototype.removeEventListeners = function (loader) {
        loader.removeEventListener(Event.COMPLETE, this._onLoadCompleteDelegate);
        loader.removeEventListener(IOErrorEvent.IO_ERROR, this._onLoadErrorDelegate);
    };
    AssetLoader.prototype.stop = function () {
        this.dispose();
    };
    AssetLoader.prototype.dispose = function () {
        this._errorHandlers = null;
        this._parseErrorHandlers = null;
        this._context = null;
        this._token = null;
        this._stack = null;
        if (this._currentDependency && this._currentDependency._iLoader)
            this.removeEventListeners(this._currentDependency._iLoader);
        this._currentDependency = null;
    };
    /**
     * @private
     * This method is used by other loader classes (e.g. Loader3D and AssetLibraryBundle) to
     * add error event listeners to the AssetLoader instance. This system is used instead of
     * the regular EventDispatcher system so that the AssetLibrary error handler can be sure
     * that if hasEventListener() returns true, it's client code that's listening for the
     * event. Secondly, functions added as error handler through this custom method are
     * expected to return a boolean value indicating whether the event was handled (i.e.
     * whether they in turn had any client code listening for the event.) If no handlers
     * return true, the AssetLoader knows that the event wasn't handled and will throw an RTE.
     */
    AssetLoader.prototype._iAddParseErrorHandler = function (handler) {
        if (this._parseErrorHandlers.indexOf(handler) < 0)
            this._parseErrorHandlers.push(handler);
    };
    AssetLoader.prototype._iAddErrorHandler = function (handler) {
        if (this._errorHandlers.indexOf(handler) < 0)
            this._errorHandlers.push(handler);
    };
    /**
     * Guesses the parser to be used based on the file contents.
     * @param data The data to be parsed.
     * @param uri The url or id of the object to be parsed.
     * @return An instance of the guessed parser.
     */
    AssetLoader.prototype.getParserFromData = function (data) {
        var len = AssetLoader._parsers.length;
        for (var i = len - 1; i >= 0; i--)
            if (AssetLoader._parsers[i].supportsData(data))
                return new AssetLoader._parsers[i]();
        return null;
    };
    /**
     * Initiates parsing of the loaded dependency.
     *
     * @param The dependency to be parsed.
     */
    AssetLoader.prototype.parseDependency = function (dependency) {
        var parser = dependency.parser;
        // If no parser has been defined, try to find one by letting
        // all plugged in parsers inspect the actual data.
        if (!parser)
            dependency._iSetParser(parser = this.getParserFromData(dependency.data));
        if (parser) {
            parser.addEventListener(ParserEvent.READY_FOR_DEPENDENCIES, this._onReadyForDependenciesDelegate);
            parser.addEventListener(ParserEvent.PARSE_COMPLETE, this._onParseCompleteDelegate);
            parser.addEventListener(ParserEvent.PARSE_ERROR, this._onParseErrorDelegate);
            parser.addEventListener(AssetEvent.TEXTURE_SIZE_ERROR, this._onTextureSizeErrorDelegate);
            parser.addEventListener(AssetEvent.ASSET_COMPLETE, this._onAssetCompleteDelegate);
            if (dependency.request && dependency.request.url)
                parser._iFileName = dependency.request.url;
            parser.materialMode = this._materialMode;
            parser.parseAsync(dependency.data);
        }
        else {
            var message = "No parser defined. To enable all parsers for auto-detection, use Parsers.enableAllBundled()";
            if (this.hasEventListener(ParserEvent.PARSE_ERROR))
                this.dispatchEvent(new ParserEvent(ParserEvent.PARSE_ERROR, message));
            else
                throw new Error(message);
        }
    };
    /**
     * Guesses the parser to be used based on the file extension.
     * @return An instance of the guessed parser.
     */
    AssetLoader.prototype.getParserFromSuffix = function (url) {
        // Get rid of query string if any and extract extension
        var base = (url.indexOf('?') > 0) ? url.split('?')[0] : url;
        var fileExtension = base.substr(base.lastIndexOf('.') + 1).toLowerCase();
        var len = AssetLoader._parsers.length;
        for (var i = len - 1; i >= 0; i--) {
            var parserClass = AssetLoader._parsers[i];
            if (parserClass.supportsType(fileExtension))
                return new parserClass();
        }
        return null;
    };
    // Image parser only parser that is added by default, to save file size.
    AssetLoader._parsers = new Array(Texture2DParser, CubeTextureParser);
    return AssetLoader;
})(EventDispatcher);
module.exports = AssetLoader;


},{"awayjs-core/lib/errors/Error":6,"awayjs-core/lib/events/AssetEvent":8,"awayjs-core/lib/events/Event":9,"awayjs-core/lib/events/EventDispatcher":10,"awayjs-core/lib/events/IOErrorEvent":12,"awayjs-core/lib/events/LoaderEvent":13,"awayjs-core/lib/events/ParserEvent":14,"awayjs-core/lib/library/AssetLoaderToken":30,"awayjs-core/lib/net/URLLoader":39,"awayjs-core/lib/net/URLLoaderDataFormat":40,"awayjs-core/lib/parsers/CubeTextureParser":44,"awayjs-core/lib/parsers/ResourceDependency":47,"awayjs-core/lib/parsers/Texture2DParser":48}],30:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var EventDispatcher = require("awayjs-core/lib/events/EventDispatcher");
/**
 * Dispatched when any asset finishes parsing. Also see specific events for each
 * individual asset type (meshes, materials et c.)
 *
 * @eventType away.events.AssetEvent
 */
//[Event(name="assetComplete", type="away3d.events.AssetEvent")]
/**
 * Dispatched when a full resource (including dependencies) finishes loading.
 *
 * @eventType away.events.LoaderEvent
 */
//[Event(name="resourceComplete", type="away3d.events.LoaderEvent")]
/**
 * Dispatched when a single dependency (which may be the main file of a resource)
 * finishes loading.
 *
 * @eventType away.events.LoaderEvent
 */
//[Event(name="dependencyComplete", type="away3d.events.LoaderEvent")]
/**
 * Dispatched when an error occurs during loading. I
 *
 * @eventType away.events.LoaderEvent
 */
//[Event(name="loadError", type="away3d.events.LoaderEvent")]
/**
 * Dispatched when an error occurs during parsing.
 *
 * @eventType away.events.ParserEvent
 */
//[Event(name="parseError", type="away3d.events.ParserEvent")]
/**
 * Dispatched when a skybox asset has been costructed from a ressource.
 *
 * @eventType away.events.AssetEvent
 */
//[Event(name="skyboxComplete", type="away3d.events.AssetEvent")]
/**
 * Dispatched when a camera3d asset has been costructed from a ressource.
 *
 * @eventType away.events.AssetEvent
 */
//[Event(name="cameraComplete", type="away3d.events.AssetEvent")]
/**
 * Dispatched when a mesh asset has been costructed from a ressource.
 *
 * @eventType away.events.AssetEvent
 */
//[Event(name="meshComplete", type="away3d.events.AssetEvent")]
/**
 * Dispatched when a geometry asset has been constructed from a resource.
 *
 * @eventType away.events.AssetEvent
 */
//[Event(name="geometryComplete", type="away3d.events.AssetEvent")]
/**
 * Dispatched when a skeleton asset has been constructed from a resource.
 *
 * @eventType away.events.AssetEvent
 */
//[Event(name="skeletonComplete", type="away3d.events.AssetEvent")]
/**
 * Dispatched when a skeleton pose asset has been constructed from a resource.
 *
 * @eventType away.events.AssetEvent
 */
//[Event(name="skeletonPoseComplete", type="away3d.events.AssetEvent")]
/**
 * Dispatched when a container asset has been constructed from a resource.
 *
 * @eventType away.events.AssetEvent
 */
//[Event(name="containerComplete", type="away3d.events.AssetEvent")]
/**
 * Dispatched when a texture asset has been constructed from a resource.
 *
 * @eventType away.events.AssetEvent
 */
//[Event(name="textureComplete", type="away3d.events.AssetEvent")]
/**
 * Dispatched when a texture projector asset has been constructed from a resource.
 *
 * @eventType away.events.AssetEvent
 */
//[Event(name="textureProjectorComplete", type="away3d.events.AssetEvent")]
/**
 * Dispatched when a material asset has been constructed from a resource.
 *
 * @eventType away.events.AssetEvent
 */
//[Event(name="materialComplete", type="away3d.events.AssetEvent")]
/**
 * Dispatched when a animator asset has been constructed from a resource.
 *
 * @eventType away.events.AssetEvent
 */
//[Event(name="animatorComplete", type="away3d.events.AssetEvent")]
/**
 * Dispatched when an animation set has been constructed from a group of animation state resources.
 *
 * @eventType away.events.AssetEvent
 */
//[Event(name="animationSetComplete", type="away3d.events.AssetEvent")]
/**
 * Dispatched when an animation state has been constructed from a group of animation node resources.
 *
 * @eventType away.events.AssetEvent
 */
//[Event(name="animationStateComplete", type="away3d.events.AssetEvent")]
/**
 * Dispatched when an animation node has been constructed from a resource.
 *
 * @eventType away.events.AssetEvent
 */
//[Event(name="animationNodeComplete", type="away3d.events.AssetEvent")]
/**
 * Dispatched when an animation state transition has been constructed from a group of animation node resources.
 *
 * @eventType away.events.AssetEvent
 */
//[Event(name="stateTransitionComplete", type="away3d.events.AssetEvent")]
/**
 * Dispatched when an light asset has been constructed from a resources.
 *
 * @eventType away.events.AssetEvent
 */
//[Event(name="lightComplete", type="away3d.events.AssetEvent")]
/**
 * Dispatched when an light picker asset has been constructed from a resources.
 *
 * @eventType away.events.AssetEvent
 */
//[Event(name="lightPickerComplete", type="away3d.events.AssetEvent")]
/**
 * Dispatched when an effect method asset has been constructed from a resources.
 *
 * @eventType away.events.AssetEvent
 */
//[Event(name="effectMethodComplete", type="away3d.events.AssetEvent")]
/**
 * Dispatched when an shadow map method asset has been constructed from a resources.
 *
 * @eventType away.events.AssetEvent
 */
//[Event(name="shadowMapMethodComplete", type="away3d.events.AssetEvent")]
/**
 * Instances of this class are returned as tokens by loading operations
 * to provide an object on which events can be listened for in cases where
 * the actual asset loader is not directly available (e.g. when using the
 * AssetLibrary to perform the load.)
 *
 * By listening for events on this class instead of directly on the
 * AssetLibrary, one can distinguish different loads from each other.
 *
 * The token will dispatch all events that the original AssetLoader dispatches,
 * while not providing an interface to obstruct the load and is as such a
 * safer return value for loader wrappers than the loader itself.
 */
var AssetLoaderToken = (function (_super) {
    __extends(AssetLoaderToken, _super);
    function AssetLoaderToken(loader) {
        _super.call(this);
        this._iLoader = loader;
    }
    AssetLoaderToken.prototype.addEventListener = function (type, listener) {
        this._iLoader.addEventListener(type, listener);
    };
    AssetLoaderToken.prototype.removeEventListener = function (type, listener) {
        this._iLoader.removeEventListener(type, listener);
    };
    AssetLoaderToken.prototype.hasEventListener = function (type, listener) {
        if (listener === void 0) { listener = null; }
        return this._iLoader.hasEventListener(type, listener);
    };
    return AssetLoaderToken;
})(EventDispatcher);
module.exports = AssetLoaderToken;


},{"awayjs-core/lib/events/EventDispatcher":10}],31:[function(require,module,exports){
var AssetType = (function () {
    function AssetType() {
    }
    AssetType.ANIMATION_NODE = 'animationNode';
    AssetType.ANIMATION_SET = 'animationSet';
    AssetType.ANIMATION_STATE = 'animationState';
    AssetType.ANIMATOR = 'animator';
    AssetType.BILLBOARD = 'billboard';
    AssetType.CAMERA = 'camera';
    AssetType.CONTAINER = 'container';
    AssetType.EFFECTS_METHOD = 'effectsMethod';
    AssetType.GEOMETRY = 'geometry';
    AssetType.LINE_SEGMENT = 'lineSegment';
    AssetType.LIGHT = 'light';
    AssetType.LIGHT_PICKER = 'lightPicker';
    AssetType.MATERIAL = 'material';
    AssetType.MESH = 'mesh';
    AssetType.TRIANGLE_SUB_MESH = 'triangleSubMesh';
    AssetType.LINE_SUB_MESH = 'lineSubMesh';
    AssetType.PRIMITIVE_PREFAB = 'primitivePrefab';
    AssetType.SHADOW_MAP_METHOD = 'shadowMapMethod';
    AssetType.SKELETON = 'skeleton';
    AssetType.SKELETON_POSE = 'skeletonPose';
    AssetType.SKYBOX = 'skybox';
    AssetType.STATE_TRANSITION = 'stateTransition';
    AssetType.TEXTURE = 'texture';
    AssetType.TEXTURE_PROJECTOR = 'textureProjector';
    AssetType.TIMELINE = 'timeline';
    return AssetType;
})();
module.exports = AssetType;


},{}],32:[function(require,module,exports){
/**
 * Enumaration class for precedence when resolving naming conflicts in the library.
 *
 * @see away.library.AssetLibrary.conflictPrecedence
 * @see away.library.AssetLibrary.conflictStrategy
 * @see away.library.naming.ConflictStrategy
 */
var ConflictPrecedence = (function () {
    function ConflictPrecedence() {
    }
    /**
     * Signals that in a conflict, the previous owner of the conflicting name
     * should be favored (and keep it's name) and that the newly renamed asset
     * is reverted to a non-conflicting name.
     */
    ConflictPrecedence.FAVOR_OLD = 'favorOld';
    /**
     * Signales that in a conflict, the newly renamed asset is favored (and keeps
     * it's newly defined name) and that the previous owner of that name gets
     * renamed to a non-conflicting name.
     */
    ConflictPrecedence.FAVOR_NEW = 'favorNew';
    return ConflictPrecedence;
})();
module.exports = ConflictPrecedence;


},{}],33:[function(require,module,exports){
var ErrorConflictStrategy = require("awayjs-core/lib/library/ErrorConflictStrategy");
var IgnoreConflictStrategy = require("awayjs-core/lib/library/IgnoreConflictStrategy");
var NumSuffixConflictStrategy = require("awayjs-core/lib/library/NumSuffixConflictStrategy");
/**
 * Enumeration class for bundled conflict strategies. Set one of these values (or an
 * instance of a self-defined sub-class of ConflictStrategyBase) to the conflictStrategy
 * property on an AssetLibrary to define how that library resolves naming conflicts.
 *
 * The value of the <code>AssetLibrary.conflictPrecedence</code> property defines which
 * of the conflicting assets will get to keep it's name, and which is renamed (if any.)
 *
 * @see away.library.AssetLibrary.conflictStrategy
 * @see away.library.naming.ConflictStrategyBase
 */
var ConflictStrategy = (function () {
    function ConflictStrategy(include) {
        //TODO: find out why typescript d.ts files do not include this class
    }
    /**
     * Specifies that in case of a naming conflict, one of the assets will be renamed and
     * a numeric suffix appended to the base name.
     */
    ConflictStrategy.APPEND_NUM_SUFFIX = new NumSuffixConflictStrategy();
    /**
     * Specifies that naming conflicts should be ignored. This is not recommended in most
     * cases, unless it can be 100% guaranteed that the application does not cause naming
     * conflicts in the library (i.e. when an app-level system is in place to prevent this.)
     */
    ConflictStrategy.IGNORE = new IgnoreConflictStrategy();
    /**
     * Specifies that an error should be thrown if a naming conflict is discovered. Use this
     * to be 100% sure that naming conflicts never occur unnoticed, and when it's undesirable
     * to have the library automatically rename assets to avoid such conflicts.
     */
    ConflictStrategy.THROW_ERROR = new ErrorConflictStrategy();
    return ConflictStrategy;
})();
module.exports = ConflictStrategy;


},{"awayjs-core/lib/library/ErrorConflictStrategy":35,"awayjs-core/lib/library/IgnoreConflictStrategy":36,"awayjs-core/lib/library/NumSuffixConflictStrategy":38}],34:[function(require,module,exports){
var ConflictPrecedence = require("awayjs-core/lib/library/ConflictPrecedence");
var AbstractMethodError = require("awayjs-core/lib/errors/AbstractMethodError");
var AssetEvent = require("awayjs-core/lib/events/AssetEvent");
/**
 * Abstract base class for naming conflict resolution classes. Extend this to create a
 * strategy class which the asset library can use to resolve asset naming conflicts, or
 * use one of the bundled concrete strategy classes:
 *
 * <ul>
 *   <li>IgnoreConflictStrategy (ConflictStrategy.IGNORE)</li>
 *   <li>ErrorConflictStrategy (ConflictStrategy.THROW_ERROR)</li>
 *   <li>NumSuffixConflictStrategy (ConflictStrategy.APPEND_NUM_SUFFIX)</li>
 * </ul>
 *
 * @see away.library.AssetLibrary.conflictStrategy
 * @see away.library.ConflictStrategy
 * @see away.library.IgnoreConflictStrategy
 * @see away.library.ErrorConflictStrategy
 * @see away.library.NumSuffixConflictStrategy
 */
var ConflictStrategyBase = (function () {
    function ConflictStrategyBase() {
    }
    /**
     * Resolve a naming conflict between two assets. Must be implemented by concrete strategy
     * classes.
     */
    ConflictStrategyBase.prototype.resolveConflict = function (changedAsset, oldAsset, assetsDictionary, precedence) {
        throw new AbstractMethodError();
    };
    /**
     * Create instance of this conflict strategy. Used internally by the AssetLibrary to
     * make sure the same strategy instance is not used in all AssetLibrary instances, which
     * would break any state caching that happens inside the strategy class.
     */
    ConflictStrategyBase.prototype.create = function () {
        throw new AbstractMethodError();
    };
    /**
     * Provided as a convenience method for all conflict strategy classes, as a way to finalize
     * the conflict resolution by applying the new names and dispatching the correct events.
     */
    ConflictStrategyBase.prototype._pUpdateNames = function (ns, nonConflictingName, oldAsset, newAsset, assetsDictionary, precedence) {
        var loser_prev_name;
        var winner;
        var loser;
        winner = (precedence === ConflictPrecedence.FAVOR_NEW) ? newAsset : oldAsset;
        loser = (precedence === ConflictPrecedence.FAVOR_NEW) ? oldAsset : newAsset;
        loser_prev_name = loser.name;
        assetsDictionary[winner.name] = winner;
        assetsDictionary[nonConflictingName] = loser;
        loser.resetAssetPath(nonConflictingName, ns, false);
        loser.dispatchEvent(new AssetEvent(AssetEvent.ASSET_CONFLICT_RESOLVED, loser, loser_prev_name));
    };
    return ConflictStrategyBase;
})();
module.exports = ConflictStrategyBase;


},{"awayjs-core/lib/errors/AbstractMethodError":4,"awayjs-core/lib/events/AssetEvent":8,"awayjs-core/lib/library/ConflictPrecedence":32}],35:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ConflictStrategyBase = require("awayjs-core/lib/library/ConflictStrategyBase");
var Error = require("awayjs-core/lib/errors/Error");
var ErrorConflictStrategy = (function (_super) {
    __extends(ErrorConflictStrategy, _super);
    function ErrorConflictStrategy() {
        _super.call(this);
    }
    ErrorConflictStrategy.prototype.resolveConflict = function (changedAsset, oldAsset, assetsDictionary, precedence) {
        throw new Error('Asset name collision while AssetLibrary.namingStrategy set to AssetLibrary.THROW_ERROR. Asset path: ' + changedAsset.assetFullPath);
    };
    ErrorConflictStrategy.prototype.create = function () {
        return new ErrorConflictStrategy();
    };
    return ErrorConflictStrategy;
})(ConflictStrategyBase);
module.exports = ErrorConflictStrategy;


},{"awayjs-core/lib/errors/Error":6,"awayjs-core/lib/library/ConflictStrategyBase":34}],36:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ConflictStrategyBase = require("awayjs-core/lib/library/ConflictStrategyBase");
var IgnoreConflictStrategy = (function (_super) {
    __extends(IgnoreConflictStrategy, _super);
    function IgnoreConflictStrategy() {
        _super.call(this);
    }
    IgnoreConflictStrategy.prototype.resolveConflict = function (changedAsset, oldAsset, assetsDictionary, precedence) {
        // Do nothing, ignore the fact that there is a conflict.
        return;
    };
    IgnoreConflictStrategy.prototype.create = function () {
        return new IgnoreConflictStrategy();
    };
    return IgnoreConflictStrategy;
})(ConflictStrategyBase);
module.exports = IgnoreConflictStrategy;


},{"awayjs-core/lib/library/ConflictStrategyBase":34}],37:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AbstractMethodError = require("awayjs-core/lib/errors/AbstractMethodError");
var AssetEvent = require("awayjs-core/lib/events/AssetEvent");
var EventDispatcher = require("awayjs-core/lib/events/EventDispatcher");
var NamedAssetBase = (function (_super) {
    __extends(NamedAssetBase, _super);
    function NamedAssetBase(name) {
        if (name === void 0) { name = null; }
        _super.call(this);
        this._id = NamedAssetBase.ID_COUNT++;
        if (name == null)
            name = 'null';
        this._name = name;
        this._originalName = name;
        this.updateFullPath();
    }
    Object.defineProperty(NamedAssetBase.prototype, "assetType", {
        /**
         *
         */
        get: function () {
            throw new AbstractMethodError();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NamedAssetBase.prototype, "originalName", {
        /**
         * The original name used for this asset in the resource (e.g. file) in which
         * it was found. This may not be the same as <code>name</code>, which may
         * have changed due to of a name conflict.
         */
        get: function () {
            return this._originalName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NamedAssetBase.prototype, "id", {
        /**
         * A unique id for the asset, used to identify assets in an associative array
         */
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NamedAssetBase.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (val) {
            var prev;
            prev = this._name;
            this._name = val;
            if (this._name == null)
                this._name = 'null';
            this.updateFullPath();
            //if (hasEventListener(AssetEvent.ASSET_RENAME))
            this.dispatchEvent(new AssetEvent(AssetEvent.ASSET_RENAME, this, prev));
        },
        enumerable: true,
        configurable: true
    });
    NamedAssetBase.prototype.dispose = function () {
        throw new AbstractMethodError();
    };
    Object.defineProperty(NamedAssetBase.prototype, "assetNamespace", {
        get: function () {
            return this._namespace;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NamedAssetBase.prototype, "assetFullPath", {
        get: function () {
            return this._full_path;
        },
        enumerable: true,
        configurable: true
    });
    NamedAssetBase.prototype.assetPathEquals = function (name, ns) {
        return (this._name == name && (!ns || this._namespace == ns));
    };
    NamedAssetBase.prototype.resetAssetPath = function (name, ns, overrideOriginal) {
        if (ns === void 0) { ns = null; }
        if (overrideOriginal === void 0) { overrideOriginal = true; }
        this._name = name ? name : 'null';
        this._namespace = ns ? ns : NamedAssetBase.DEFAULT_NAMESPACE;
        if (overrideOriginal)
            this._originalName = this._name;
        this.updateFullPath();
    };
    NamedAssetBase.prototype.updateFullPath = function () {
        this._full_path = [this._namespace, this._name];
    };
    NamedAssetBase.ID_COUNT = 0;
    NamedAssetBase.DEFAULT_NAMESPACE = 'default';
    return NamedAssetBase;
})(EventDispatcher);
module.exports = NamedAssetBase;


},{"awayjs-core/lib/errors/AbstractMethodError":4,"awayjs-core/lib/events/AssetEvent":8,"awayjs-core/lib/events/EventDispatcher":10}],38:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ConflictStrategyBase = require("awayjs-core/lib/library/ConflictStrategyBase");
var NumSuffixConflictStrategy = (function (_super) {
    __extends(NumSuffixConflictStrategy, _super);
    function NumSuffixConflictStrategy(separator) {
        if (separator === void 0) { separator = '.'; }
        _super.call(this);
        this._separator = separator;
        this._next_suffix = {};
    }
    NumSuffixConflictStrategy.prototype.resolveConflict = function (changedAsset, oldAsset, assetsDictionary, precedence) {
        var orig;
        var new_name;
        var base;
        var suffix;
        orig = changedAsset.name;
        if (orig.indexOf(this._separator) >= 0) {
            // Name has an ocurrence of the separator, so get base name and suffix,
            // unless suffix is non-numerical, in which case revert to zero and
            // use entire name as base
            base = orig.substring(0, orig.lastIndexOf(this._separator));
            suffix = parseInt(orig.substring(base.length - 1));
            if (isNaN(suffix)) {
                base = orig;
                suffix = 0;
            }
        }
        else {
            base = orig;
            suffix = 0;
        }
        if (suffix == 0 && this._next_suffix.hasOwnProperty(base)) {
            suffix = this._next_suffix[base];
        }
        do {
            suffix++;
            new_name = base.concat(this._separator, suffix.toString());
        } while (assetsDictionary.hasOwnProperty(new_name));
        this._next_suffix[base] = suffix;
        this._pUpdateNames(oldAsset.assetNamespace, new_name, oldAsset, changedAsset, assetsDictionary, precedence);
    };
    NumSuffixConflictStrategy.prototype.create = function () {
        return new NumSuffixConflictStrategy(this._separator);
    };
    return NumSuffixConflictStrategy;
})(ConflictStrategyBase);
module.exports = NumSuffixConflictStrategy;


},{"awayjs-core/lib/library/ConflictStrategyBase":34}],39:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var URLLoaderDataFormat = require("awayjs-core/lib/net/URLLoaderDataFormat");
var URLRequestMethod = require("awayjs-core/lib/net/URLRequestMethod");
var URLVariables = require("awayjs-core/lib/net/URLVariables");
var AwayEvent = require("awayjs-core/lib/events/Event");
var EventDispatcher = require("awayjs-core/lib/events/EventDispatcher");
var HTTPStatusEvent = require("awayjs-core/lib/events/HTTPStatusEvent");
var IOErrorEvent = require("awayjs-core/lib/events/IOErrorEvent");
var AwayProgressEvent = require("awayjs-core/lib/events/ProgressEvent");
/**
 * The URLLoader is used to load a single file, as part of a resource.
 *
 * While URLLoader can be used directly, e.g. to create a third-party asset
 * management system, it's recommended to use any of the classes Loader3D, AssetLoader
 * and AssetLibrary instead in most cases.
 *
 * @see AssetLoader
 * @see away.library.AssetLibrary
 */
var URLLoader = (function (_super) {
    __extends(URLLoader, _super);
    /**
     * Creates a new URLLoader object.
     */
    function URLLoader() {
        _super.call(this);
        this._bytesLoaded = 0;
        this._bytesTotal = 0;
        this._dataFormat = URLLoaderDataFormat.TEXT;
        this._loadError = false;
    }
    Object.defineProperty(URLLoader.prototype, "url", {
        /**
         *
         */
        get: function () {
            return this._request ? this._request.url : '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(URLLoader.prototype, "data", {
        /**
         *
         */
        get: function () {
            return this._data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(URLLoader.prototype, "dataFormat", {
        get: function () {
            return this._dataFormat;
        },
        /**
         *
         * URLLoaderDataFormat.BINARY
         * URLLoaderDataFormat.TEXT
         * URLLoaderDataFormat.VARIABLES
         *
         * @param format
         */
        set: function (format) {
            this._dataFormat = format;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(URLLoader.prototype, "bytesLoaded", {
        /**
         *
         * @returns {number}
         */
        get: function () {
            return this._bytesLoaded;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(URLLoader.prototype, "bytesTotal", {
        /**
         *
         * @returns {number}
         */
        get: function () {
            return this._bytesTotal;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Load a resource from a file.
     *
     * @param request The URLRequest object containing the URL of the object to be loaded.
     */
    URLLoader.prototype.load = function (request) {
        this._request = request;
        this.initXHR();
        if (request.method === URLRequestMethod.POST)
            this.postRequest(request);
        else
            this.getRequest(request);
    };
    /**
     *
     */
    URLLoader.prototype.close = function () {
        this._XHR.abort();
        this.disposeXHR();
    };
    /**
     *
     */
    URLLoader.prototype.dispose = function () {
        if (this._XHR)
            this._XHR.abort();
        this.disposeXHR();
        this._data = null;
        this._dataFormat = null;
        this._bytesLoaded = null;
        this._bytesTotal = null;
    };
    /**
     *
     * @param xhr
     * @param responseType
     */
    URLLoader.prototype.setResponseType = function (xhr, responseType) {
        switch (responseType) {
            case URLLoaderDataFormat.ARRAY_BUFFER:
            case URLLoaderDataFormat.BLOB:
            case URLLoaderDataFormat.TEXT:
                xhr.responseType = responseType;
                break;
            case URLLoaderDataFormat.VARIABLES:
                xhr.responseType = URLLoaderDataFormat.TEXT;
                break;
            case URLLoaderDataFormat.BINARY:
                xhr.responseType = '';
                break;
            default:
        }
    };
    /**
     *
     * @param request {URLRequest}
     */
    URLLoader.prototype.getRequest = function (request) {
        try {
            this._XHR.open(request.method, request.url, request.async);
            this.setResponseType(this._XHR, this._dataFormat);
            this._XHR.send(); // No data to send
        }
        catch (e) {
            this.handleXmlHttpRequestException(e);
        }
    };
    /**
     *
     * @param request {URLRequest}
     */
    URLLoader.prototype.postRequest = function (request) {
        this._loadError = false;
        this._XHR.open(request.method, request.url, request.async);
        if (request.data != null) {
            if (request.data instanceof URLVariables) {
                var urlVars = request.data;
                try {
                    this._XHR.responseType = 'text';
                    this._XHR.send(urlVars.formData);
                }
                catch (e) {
                    this.handleXmlHttpRequestException(e);
                }
            }
            else {
                this.setResponseType(this._XHR, this._dataFormat);
                if (request.data)
                    this._XHR.send(request.data); // TODO: Test
                else
                    this._XHR.send(); // no data to send
            }
        }
        else {
            this._XHR.send(); // No data to send
        }
    };
    /**
     *
     * @param error {XMLHttpRequestException}
     */
    URLLoader.prototype.handleXmlHttpRequestException = function (error /* <XMLHttpRequestException> */) {
        switch (error.code) {
            case 101:
                break;
        }
    };
    /**
     *
     */
    URLLoader.prototype.initXHR = function () {
        var _this = this;
        if (!this._XHR) {
            this._XHR = new XMLHttpRequest();
            this._XHR.onloadstart = function (event) { return _this.onLoadStart(event); }; // loadstart	        - When the request starts.
            this._XHR.onprogress = function (event) { return _this.onProgress(event); }; // progress	            - While loading and sending data.
            this._XHR.onabort = function (event) { return _this.onAbort(event); }; // abort	            - When the request has been aborted, either by invoking the abort() method or navigating away from the page.
            this._XHR.onerror = function (event) { return _this.onLoadError(event); }; // error	            - When the request has failed.
            this._XHR.onload = function (event) { return _this.onLoadComplete(event); }; // load	                - When the request has successfully completed.
            this._XHR.ontimeout = function (event) { return _this.onTimeOut(event); }; // timeout	            - When the author specified timeout has passed before the request could complete.
            this._XHR.onloadend = function (event) { return _this.onLoadEnd(event); }; // loadend	            - When the request has completed, regardless of whether or not it was successful.
            this._XHR.onreadystatechange = function (event) { return _this.onReadyStateChange(event); }; // onreadystatechange   - When XHR state changes
        }
    };
    /**
     *
     */
    URLLoader.prototype.disposeXHR = function () {
        if (this._XHR !== null) {
            this._XHR.onloadstart = null;
            this._XHR.onprogress = null;
            this._XHR.onabort = null;
            this._XHR.onerror = null;
            this._XHR.onload = null;
            this._XHR.ontimeout = null;
            this._XHR.onloadend = null;
            this._XHR = null;
        }
    };
    /**
     *
     * @param source
     */
    URLLoader.prototype.decodeURLVariables = function (source) {
        var result = new Object();
        source = source.split("+").join(" ");
        var tokens, re = /[?&]?([^=]+)=([^&]*)/g;
        while (tokens = re.exec(source))
            result[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
        return result;
    };
    // XMLHttpRequest - Event Handlers
    /**
     * When XHR state changes
     * @param event
     */
    URLLoader.prototype.onReadyStateChange = function (event) {
        if (this._XHR.readyState == 4) {
            if (this._XHR.status == 404) {
                this._loadError = true;
                if (!this._loadErrorEvent)
                    this._loadErrorEvent = new IOErrorEvent(IOErrorEvent.IO_ERROR);
                this.dispatchEvent(this._loadErrorEvent);
            }
            this.dispatchEvent(new HTTPStatusEvent(HTTPStatusEvent.HTTP_STATUS, this._XHR.status));
        }
    };
    /**
     * When the request has completed, regardless of whether or not it was successful.
     * @param event
     */
    URLLoader.prototype.onLoadEnd = function (event) {
        if (this._loadError === true)
            return;
    };
    /**
     * When the author specified timeout has passed before the request could complete.
     * @param event
     */
    URLLoader.prototype.onTimeOut = function (event) {
        //TODO: Timeout not currently implemented ( also not part of AS3 API )
    };
    /**
     * When the request has been aborted, either by invoking the abort() method or navigating away from the page.
     * @param event
     */
    URLLoader.prototype.onAbort = function (event) {
        // TODO: investigate whether this needs to be an IOError
    };
    /**
     * While loading and sending data.
     * @param event
     */
    URLLoader.prototype.onProgress = function (event) {
        if (!this._progressEvent)
            this._progressEvent = new AwayProgressEvent(AwayProgressEvent.PROGRESS);
        this._progressEvent.bytesTotal = event.total;
        this._progressEvent.bytesLoaded = event.loaded;
        this.dispatchEvent(this._progressEvent);
    };
    /**
     * When the request starts.
     * @param event
     */
    URLLoader.prototype.onLoadStart = function (event) {
        if (!this._loadStartEvent)
            this._loadStartEvent = new AwayEvent(AwayEvent.OPEN);
        this.dispatchEvent(this._loadStartEvent);
    };
    /**
     * When the request has successfully completed.
     * @param event
     */
    URLLoader.prototype.onLoadComplete = function (event) {
        if (this._loadError === true)
            return;
        switch (this._dataFormat) {
            case URLLoaderDataFormat.TEXT:
                this._data = this._XHR.responseText;
                break;
            case URLLoaderDataFormat.VARIABLES:
                this._data = this.decodeURLVariables(this._XHR.responseText);
                break;
            case URLLoaderDataFormat.BLOB:
            case URLLoaderDataFormat.ARRAY_BUFFER:
            case URLLoaderDataFormat.BINARY:
                this._data = this._XHR.response;
                break;
            default:
                this._data = this._XHR.responseText;
                break;
        }
        if (!this._loadCompleteEvent)
            this._loadCompleteEvent = new AwayEvent(AwayEvent.COMPLETE);
        this.dispatchEvent(this._loadCompleteEvent);
    };
    /**
     * When the request has failed. ( due to network issues ).
     * @param event
     */
    URLLoader.prototype.onLoadError = function (event) {
        this._loadError = true;
        if (!this._loadErrorEvent)
            this._loadErrorEvent = new IOErrorEvent(IOErrorEvent.IO_ERROR);
        this.dispatchEvent(this._loadErrorEvent);
    };
    return URLLoader;
})(EventDispatcher);
module.exports = URLLoader;


},{"awayjs-core/lib/events/Event":9,"awayjs-core/lib/events/EventDispatcher":10,"awayjs-core/lib/events/HTTPStatusEvent":11,"awayjs-core/lib/events/IOErrorEvent":12,"awayjs-core/lib/events/ProgressEvent":15,"awayjs-core/lib/net/URLLoaderDataFormat":40,"awayjs-core/lib/net/URLRequestMethod":42,"awayjs-core/lib/net/URLVariables":43}],40:[function(require,module,exports){
var URLLoaderDataFormat = (function () {
    function URLLoaderDataFormat() {
    }
    /**
     * TEXT
     * @type {string}
     */
    URLLoaderDataFormat.TEXT = "text";
    /**
     * Variables / Value Pairs
     * @type {string}
     */
    URLLoaderDataFormat.VARIABLES = "variables";
    /**
     *
     * @type {string}
     */
    URLLoaderDataFormat.BLOB = "blob";
    /**
     *
     * @type {string}
     */
    URLLoaderDataFormat.ARRAY_BUFFER = "arraybuffer";
    /**
     *
     * @type {string}
     */
    URLLoaderDataFormat.BINARY = "binary";
    return URLLoaderDataFormat;
})();
module.exports = URLLoaderDataFormat;


},{}],41:[function(require,module,exports){
var URLRequestMethod = require("awayjs-core/lib/net/URLRequestMethod");
var URLRequest = (function () {
    /**

     * @param url
     */
    function URLRequest(url) {
        if (url === void 0) { url = null; }
        /**
         *
         * away.net.URLRequestMethod.GET
         * away.net.URLRequestMethod.POST
         *
         * @type {string}
         */
        this.method = URLRequestMethod.GET;
        /**
         * Use asynchronous XMLHttpRequest
         * @type {boolean}
         */
        this.async = true;
        this._url = url;
    }
    Object.defineProperty(URLRequest.prototype, "url", {
        /**
         *
         * @returns {string}
         */
        get: function () {
            return this._url;
        },
        /**
         *
         * @param value
         */
        set: function (value) {
            this._url = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * dispose
     */
    URLRequest.prototype.dispose = function () {
        this.data = null;
        this._url = null;
    };
    return URLRequest;
})();
module.exports = URLRequest;


},{"awayjs-core/lib/net/URLRequestMethod":42}],42:[function(require,module,exports){
var URLRequestMethod = (function () {
    function URLRequestMethod() {
    }
    /**
     *
     * @type {string}
     */
    URLRequestMethod.POST = 'POST';
    /**
     *
     * @type {string}
     */
    URLRequestMethod.GET = 'GET';
    return URLRequestMethod;
})();
module.exports = URLRequestMethod;


},{}],43:[function(require,module,exports){
var URLVariables = (function () {
    /**
     *
     * @param source
     */
    function URLVariables(source) {
        if (source === void 0) { source = null; }
        this._variables = new Object();
        if (source !== null)
            this.decode(source);
    }
    /**
     *
     * @param source
     */
    URLVariables.prototype.decode = function (source) {
        source = source.split("+").join(" ");
        var tokens, re = /[?&]?([^=]+)=([^&]*)/g;
        while (tokens = re.exec(source))
            this._variables[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    };
    /**
     *
     * @returns {string}
     */
    URLVariables.prototype.toString = function () {
        return '';
    };
    Object.defineProperty(URLVariables.prototype, "variables", {
        /**
         *
         * @returns {Object}
         */
        get: function () {
            return this._variables;
        },
        /**
         *
         * @returns {Object}
         */
        set: function (obj) {
            this._variables = obj;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(URLVariables.prototype, "formData", {
        /**
         *
         * @returns {Object}
         */
        get: function () {
            var fd = new FormData();
            for (var s in this._variables)
                fd.append(s, this._variables[s]);
            return fd;
        },
        enumerable: true,
        configurable: true
    });
    return URLVariables;
})();
module.exports = URLVariables;


},{}],44:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var URLLoaderDataFormat = require("awayjs-core/lib/net/URLLoaderDataFormat");
var URLRequest = require("awayjs-core/lib/net/URLRequest");
var ParserBase = require("awayjs-core/lib/parsers/ParserBase");
var ImageCubeTexture = require("awayjs-core/lib/textures/ImageCubeTexture");
/**
 * CubeTextureParser provides a "parser" for natively supported image types (jpg, png). While it simply loads bytes into
 * a loader object, it wraps it in a BitmapDataResource so resource management can happen consistently without
 * exception cases.
 */
var CubeTextureParser = (function (_super) {
    __extends(CubeTextureParser, _super);
    /**
     * Creates a new CubeTextureParser object.
     * @param uri The url or id of the data or file to be parsed.
     * @param extra The holder for extra contextual data that the parser might need.
     */
    function CubeTextureParser() {
        _super.call(this, URLLoaderDataFormat.TEXT);
    }
    /**
     * Indicates whether or not a given file extension is supported by the parser.
     * @param extension The file extension of a potential file to be parsed.
     * @return Whether or not the given file type is supported.
     */
    CubeTextureParser.supportsType = function (extension) {
        extension = extension.toLowerCase();
        return extension == "cube";
    };
    /**
     * Tests whether a data block can be parsed by the parser.
     * @param data The data block to potentially be parsed.
     * @return Whether or not the given data is supported.
     */
    CubeTextureParser.supportsData = function (data) {
        try {
            var obj = JSON.parse(data);
            if (obj) {
                return true;
            }
            return false;
        }
        catch (e) {
            return false;
        }
        return false;
    };
    /**
     * @inheritDoc
     */
    CubeTextureParser.prototype._iResolveDependency = function (resourceDependency) {
    };
    /**
     * @inheritDoc
     */
    CubeTextureParser.prototype._iResolveDependencyFailure = function (resourceDependency) {
    };
    /**
     * @inheritDoc
     */
    CubeTextureParser.prototype._pProceedParsing = function () {
        if (this._imgDependencyDictionary != null) {
            var asset = new ImageCubeTexture(this._getHTMLImageElement(CubeTextureParser.posX), this._getHTMLImageElement(CubeTextureParser.negX), this._getHTMLImageElement(CubeTextureParser.posY), this._getHTMLImageElement(CubeTextureParser.negY), this._getHTMLImageElement(CubeTextureParser.posZ), this._getHTMLImageElement(CubeTextureParser.negZ));
            //clear dictionary
            this._imgDependencyDictionary = null;
            asset.name = this._iFileName;
            this._pFinalizeAsset(asset, this._iFileName);
            return ParserBase.PARSING_DONE;
        }
        try {
            var json = JSON.parse(this.data);
            var data = json.data;
            var rec;
            if (data.length != 6)
                this._pDieWithError('CubeTextureParser: Error - cube texture should have exactly 6 images');
            if (json) {
                this._imgDependencyDictionary = new Object();
                for (var c = 0; c < data.length; c++) {
                    rec = data[c];
                    this._imgDependencyDictionary[rec.id] = this._pAddDependency(rec.id, new URLRequest(rec.image.toString()));
                }
                if (!this._validateCubeData()) {
                    this._pDieWithError("CubeTextureParser: JSON data error - cubes require id of:   \n" + CubeTextureParser.posX + ', ' + CubeTextureParser.negX + ',  \n' + CubeTextureParser.posY + ', ' + CubeTextureParser.negY + ',  \n' + CubeTextureParser.posZ + ', ' + CubeTextureParser.negZ);
                    return ParserBase.PARSING_DONE;
                }
                this._pPauseAndRetrieveDependencies();
                return ParserBase.MORE_TO_PARSE;
            }
        }
        catch (e) {
            this._pDieWithError('CubeTexturePaser Error parsing JSON');
        }
        return ParserBase.PARSING_DONE;
    };
    CubeTextureParser.prototype._validateCubeData = function () {
        return (this._imgDependencyDictionary[CubeTextureParser.posX] != null && this._imgDependencyDictionary[CubeTextureParser.negX] != null && this._imgDependencyDictionary[CubeTextureParser.posY] != null && this._imgDependencyDictionary[CubeTextureParser.negY] != null && this._imgDependencyDictionary[CubeTextureParser.posZ] != null && this._imgDependencyDictionary[CubeTextureParser.negZ] != null);
    };
    CubeTextureParser.prototype._getHTMLImageElement = function (name) {
        var dependency = this._imgDependencyDictionary[name];
        if (dependency) {
            return dependency.assets[0].htmlImageElement;
        }
        return null;
    };
    CubeTextureParser.posX = 'posX';
    CubeTextureParser.negX = 'negX';
    CubeTextureParser.posY = 'posY';
    CubeTextureParser.negY = 'negY';
    CubeTextureParser.posZ = 'posZ';
    CubeTextureParser.negZ = 'negZ';
    return CubeTextureParser;
})(ParserBase);
module.exports = CubeTextureParser;


},{"awayjs-core/lib/net/URLLoaderDataFormat":40,"awayjs-core/lib/net/URLRequest":41,"awayjs-core/lib/parsers/ParserBase":45,"awayjs-core/lib/textures/ImageCubeTexture":54}],45:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AbstractMethodError = require("awayjs-core/lib/errors/AbstractMethodError");
var AssetEvent = require("awayjs-core/lib/events/AssetEvent");
var EventDispatcher = require("awayjs-core/lib/events/EventDispatcher");
var ParserEvent = require("awayjs-core/lib/events/ParserEvent");
var TimerEvent = require("awayjs-core/lib/events/TimerEvent");
var ParserUtils = require("awayjs-core/lib/parsers/ParserUtils");
var ResourceDependency = require("awayjs-core/lib/parsers/ResourceDependency");
var TextureUtils = require("awayjs-core/lib/utils/TextureUtils");
var Timer = require("awayjs-core/lib/utils/Timer");
var getTimer = require("awayjs-core/lib/utils/getTimer");
/**
 * <code>ParserBase</code> provides an abstract base class for objects that convert blocks of data to data structures
 * supported by away.
 *
 * If used by <code>AssetLoader</code> to automatically determine the parser type, two public static methods should
 * be implemented, with the following signatures:
 *
 * <code>public static supportsType(extension : string) : boolean</code>
 * Indicates whether or not a given file extension is supported by the parser.
 *
 * <code>public static supportsData(data : *) : boolean</code>
 * Tests whether a data block can be parsed by the parser.
 *
 * Furthermore, for any concrete subtype, the method <code>initHandle</code> should be overridden to immediately
 * create the object that will contain the parsed data. This allows <code>ResourceManager</code> to return an object
 * handle regardless of whether the object was loaded or not.
 *
 * @see AssetLoader
 */
var ParserBase = (function (_super) {
    __extends(ParserBase, _super);
    /**
     * Creates a new ParserBase object
     * @param format The data format of the file data to be parsed. Can be either <code>ParserDataFormat.BINARY</code> or <code>ParserDataFormat.PLAIN_TEXT</code>, and should be provided by the concrete subtype.
     *
     * @see away.loading.parsers.ParserDataFormat
     */
    function ParserBase(format) {
        var _this = this;
        _super.call(this);
        this._materialMode = 0;
        this._dataFormat = format;
        this._dependencies = new Array();
        this._pOnIntervalDelegate = function (event) { return _this._pOnInterval(event); };
    }
    //----------------------------------------------------------------------------------------------------------------------------------------------------------------
    // TODO: add error checking for the following ( could cause a problem if this function is not implemented )
    //----------------------------------------------------------------------------------------------------------------------------------------------------------------
    // Needs to be implemented in all Parsers (
    //<code>public static supportsType(extension : string) : boolean</code>
    //* Indicates whether or not a given file extension is supported by the parser.
    //----------------------------------------------------------------------------------------------------------------------------------------------------------------
    ParserBase.supportsType = function (extension) {
        throw new AbstractMethodError();
    };
    Object.defineProperty(ParserBase.prototype, "content", {
        /* Protected */
        get: function () {
            return this._pContent;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Validates a bitmapData loaded before assigning to a default BitmapMaterial
     */
    ParserBase.prototype.isBitmapDataValid = function (bitmapData) {
        var isValid = TextureUtils.isBitmapDataValid(bitmapData);
        if (!isValid) {
            console.log(">> Bitmap loaded is not having power of 2 dimensions or is higher than 2048");
        }
        return isValid;
    };
    Object.defineProperty(ParserBase.prototype, "parsingFailure", {
        get: function () {
            return this._parsingFailure;
        },
        set: function (b) {
            this._parsingFailure = b;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParserBase.prototype, "parsingPaused", {
        get: function () {
            return this._parsingPaused;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParserBase.prototype, "parsingComplete", {
        get: function () {
            return this._parsingComplete;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParserBase.prototype, "materialMode", {
        get: function () {
            return this._materialMode;
        },
        set: function (newMaterialMode) {
            this._materialMode = newMaterialMode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParserBase.prototype, "data", {
        get: function () {
            return this._data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParserBase.prototype, "dataFormat", {
        /**
         * The data format of the file data to be parsed. Options are <code>URLLoaderDataFormat.BINARY</code>, <code>URLLoaderDataFormat.ARRAY_BUFFER</code>, <code>URLLoaderDataFormat.BLOB</code>, <code>URLLoaderDataFormat.VARIABLES</code> or <code>URLLoaderDataFormat.TEXT</code>.
         */
        get: function () {
            return this._dataFormat;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Parse data (possibly containing bytearry, plain text or BitmapAsset) asynchronously, meaning that
     * the parser will periodically stop parsing so that the AVM may proceed to the
     * next frame.
     *
     * @param data The untyped data object in which the loaded data resides.
     * @param frameLimit number of milliseconds of parsing allowed per frame. The
     * actual time spent on a frame can exceed this number since time-checks can
     * only be performed between logical sections of the parsing procedure.
     */
    ParserBase.prototype.parseAsync = function (data, frameLimit) {
        if (frameLimit === void 0) { frameLimit = 30; }
        this._data = data;
        this._pStartParsing(frameLimit);
    };
    Object.defineProperty(ParserBase.prototype, "dependencies", {
        /**
         * A list of dependencies that need to be loaded and resolved for the object being parsed.
         */
        get: function () {
            return this._dependencies;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Resolve a dependency when it's loaded. For example, a dependency containing an ImageResource would be assigned
     * to a Mesh instance as a BitmapMaterial, a scene graph object would be added to its intended parent. The
     * dependency should be a member of the dependencies property.
     *
     * @param resourceDependency The dependency to be resolved.
     */
    ParserBase.prototype._iResolveDependency = function (resourceDependency) {
        throw new AbstractMethodError();
    };
    /**
     * Resolve a dependency loading failure. Used by parser to eventually provide a default map
     *
     * @param resourceDependency The dependency to be resolved.
     */
    ParserBase.prototype._iResolveDependencyFailure = function (resourceDependency) {
        throw new AbstractMethodError();
    };
    /**
     * Resolve a dependency name
     *
     * @param resourceDependency The dependency to be resolved.
     */
    ParserBase.prototype._iResolveDependencyName = function (resourceDependency, asset) {
        return asset.name;
    };
    ParserBase.prototype._iResumeParsingAfterDependencies = function () {
        this._parsingPaused = false;
        if (this._timer)
            this._timer.start();
    };
    ParserBase.prototype._pFinalizeAsset = function (asset, name) {
        if (name === void 0) { name = null; }
        var type_event;
        var type_name;
        if (name != null)
            asset.name = name;
        // If the asset has no name, give it
        // a per-type default name.
        if (!asset.name)
            asset.name = asset.assetType;
        this.dispatchEvent(new AssetEvent(AssetEvent.ASSET_COMPLETE, asset));
    };
    /**
     * Parse the next block of data.
     * @return Whether or not more data needs to be parsed. Can be <code>ParserBase.ParserBase.PARSING_DONE</code> or
     * <code>ParserBase.ParserBase.MORE_TO_PARSE</code>.
     */
    ParserBase.prototype._pProceedParsing = function () {
        throw new AbstractMethodError();
    };
    ParserBase.prototype._pDieWithError = function (message) {
        if (message === void 0) { message = 'Unknown parsing error'; }
        if (this._timer) {
            this._timer.removeEventListener(TimerEvent.TIMER, this._pOnIntervalDelegate);
            this._timer.stop();
            this._timer = null;
        }
        this.dispatchEvent(new ParserEvent(ParserEvent.PARSE_ERROR, message));
    };
    ParserBase.prototype._pAddDependency = function (id, req, retrieveAsRawData, data, suppressErrorEvents) {
        if (retrieveAsRawData === void 0) { retrieveAsRawData = false; }
        if (data === void 0) { data = null; }
        if (suppressErrorEvents === void 0) { suppressErrorEvents = false; }
        var dependency = new ResourceDependency(id, req, data, null, this, retrieveAsRawData, suppressErrorEvents);
        this._dependencies.push(dependency);
        return dependency;
    };
    ParserBase.prototype._pPauseAndRetrieveDependencies = function () {
        if (this._timer)
            this._timer.stop();
        this._parsingPaused = true;
        this.dispatchEvent(new ParserEvent(ParserEvent.READY_FOR_DEPENDENCIES));
    };
    /**
     * Tests whether or not there is still time left for parsing within the maximum allowed time frame per session.
     * @return True if there is still time left, false if the maximum allotted time was exceeded and parsing should be interrupted.
     */
    ParserBase.prototype._pHasTime = function () {
        return ((getTimer() - this._lastFrameTime) < this._frameLimit);
    };
    /**
     * Called when the parsing pause interval has passed and parsing can proceed.
     */
    ParserBase.prototype._pOnInterval = function (event) {
        if (event === void 0) { event = null; }
        this._lastFrameTime = getTimer();
        if (this._pProceedParsing() && !this._parsingFailure)
            this._pFinishParsing();
    };
    /**
     * Initializes the parsing of data.
     * @param frameLimit The maximum duration of a parsing session.
     */
    ParserBase.prototype._pStartParsing = function (frameLimit) {
        this._frameLimit = frameLimit;
        this._timer = new Timer(this._frameLimit, 0);
        this._timer.addEventListener(TimerEvent.TIMER, this._pOnIntervalDelegate);
        this._timer.start();
    };
    /**
     * Finish parsing the data.
     */
    ParserBase.prototype._pFinishParsing = function () {
        if (this._timer) {
            this._timer.removeEventListener(TimerEvent.TIMER, this._pOnIntervalDelegate);
            this._timer.stop();
        }
        this._timer = null;
        this._parsingComplete = true;
        this.dispatchEvent(new ParserEvent(ParserEvent.PARSE_COMPLETE));
    };
    /**
     *
     * @returns {string}
     * @private
     */
    ParserBase.prototype._pGetTextData = function () {
        return ParserUtils.toString(this._data);
    };
    /**
     *
     * @returns {string}
     * @private
     */
    ParserBase.prototype._pGetByteData = function () {
        return ParserUtils.toByteArray(this._data);
    };
    /**
     * Returned by <code>proceedParsing</code> to indicate no more parsing is needed.
     */
    ParserBase.PARSING_DONE = true;
    /* Protected */
    /**
     * Returned by <code>proceedParsing</code> to indicate more parsing is needed, allowing asynchronous parsing.
     */
    ParserBase.MORE_TO_PARSE = false;
    return ParserBase;
})(EventDispatcher);
module.exports = ParserBase;


},{"awayjs-core/lib/errors/AbstractMethodError":4,"awayjs-core/lib/events/AssetEvent":8,"awayjs-core/lib/events/EventDispatcher":10,"awayjs-core/lib/events/ParserEvent":14,"awayjs-core/lib/events/TimerEvent":17,"awayjs-core/lib/parsers/ParserUtils":46,"awayjs-core/lib/parsers/ResourceDependency":47,"awayjs-core/lib/utils/TextureUtils":62,"awayjs-core/lib/utils/Timer":63,"awayjs-core/lib/utils/getTimer":64}],46:[function(require,module,exports){
var ByteArray = require("awayjs-core/lib/utils/ByteArray");
var ParserUtils = (function () {
    function ParserUtils() {
    }
    /**
     * Converts an ArrayBuffer to a base64 string
     *
     * @param image data as a ByteArray
     *
     * @return HTMLImageElement
     *
     */
    ParserUtils.arrayBufferToImage = function (data) {
        var byteStr = '';
        var bytes = new Uint8Array(data);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++)
            byteStr += String.fromCharCode(bytes[i]);
        var base64Image = window.btoa(byteStr);
        var str = 'data:image/png;base64,' + base64Image;
        var img = new Image();
        img.src = str;
        return img;
    };
    /**
     * Converts an ByteArray to an Image - returns an HTMLImageElement
     *
     * @param image data as a ByteArray
     *
     * @return HTMLImageElement
     *
     */
    ParserUtils.byteArrayToImage = function (data) {
        var byteStr = '';
        var bytes = new Uint8Array(data.arraybytes);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++)
            byteStr += String.fromCharCode(bytes[i]);
        var base64Image = window.btoa(byteStr);
        var str = 'data:image/png;base64,' + base64Image;
        var img = new Image();
        img.src = str;
        return img;
    };
    /**
     * Converts an Blob to an Image - returns an HTMLImageElement
     *
     * @param image data as a Blob
     *
     * @return HTMLImageElement
     *
     */
    ParserUtils.blobToImage = function (data) {
        var URLObj = window['URL'] || window['webkitURL'];
        var src = URLObj.createObjectURL(data);
        var img = new Image();
        img.src = src;
        return img;
    };
    /**
     * Returns a object as ByteArray, if possible.
     *
     * @param data The object to return as ByteArray
     *
     * @return The ByteArray or null
     *
     */
    ParserUtils.toByteArray = function (data) {
        var b = new ByteArray();
        b.setArrayBuffer(data);
        return b;
    };
    /**
     * Returns a object as String, if possible.
     *
     * @param data The object to return as String
     * @param length The length of the returned String
     *
     * @return The String or null
     *
     */
    ParserUtils.toString = function (data, length) {
        if (length === void 0) { length = 0; }
        if (typeof data === 'string') {
            var s = data;
            if (s['substr'] != null)
                return s.substr(0, s.length);
        }
        if (data instanceof ByteArray) {
            var ba = data;
            ba.position = 0;
            return ba.readUTFBytes(Math.min(ba.getBytesAvailable(), length));
        }
        return null;
        /*
         var ba:ByteArray;

         length ||= uint.MAX_VALUE;

         if (data is String)
         return String(data).substr(0, length);

         ba = toByteArray(data);
         if (ba) {
         ba.position = 0;
         return ba.readUTFBytes(Math.min(ba.bytesAvailable, length));
         }

         return null;

         */
    };
    return ParserUtils;
})();
module.exports = ParserUtils;


},{"awayjs-core/lib/utils/ByteArray":59}],47:[function(require,module,exports){
/**
 * ResourceDependency represents the data required to load, parse and resolve additional files ("dependencies")
 * required by a parser, used by ResourceLoadSession.
 *
 */
var ResourceDependency = (function () {
    function ResourceDependency(id, request, data, parser, parentParser, retrieveAsRawData, suppressAssetEvents) {
        if (retrieveAsRawData === void 0) { retrieveAsRawData = false; }
        if (suppressAssetEvents === void 0) { suppressAssetEvents = false; }
        this._id = id;
        this._request = request;
        this._data = data;
        this._parser = parser;
        this._parentParser = parentParser;
        this._retrieveAsRawData = retrieveAsRawData;
        this._suppressAssetEvents = suppressAssetEvents;
        this._assets = new Array();
        this._dependencies = new Array();
    }
    Object.defineProperty(ResourceDependency.prototype, "id", {
        /**
         *
         */
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceDependency.prototype, "request", {
        /**
         *
         */
        get: function () {
            return this._request;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceDependency.prototype, "data", {
        /**
         * The data containing the dependency to be parsed, if the resource was already loaded.
         */
        get: function () {
            return this._data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceDependency.prototype, "parser", {
        /**
         *
         */
        get: function () {
            return this._parser;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceDependency.prototype, "parentParser", {
        /**
         * The parser which is dependent on this ResourceDependency object.
         */
        get: function () {
            return this._parentParser;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceDependency.prototype, "retrieveAsRawData", {
        /**
         *
         */
        get: function () {
            return this._retrieveAsRawData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceDependency.prototype, "suppresAssetEvents", {
        /**
         *
         */
        get: function () {
            return this._suppressAssetEvents;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceDependency.prototype, "assets", {
        /**
         *
         */
        get: function () {
            return this._assets;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ResourceDependency.prototype, "dependencies", {
        /**
         *
         */
        get: function () {
            return this._dependencies;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     * Method to set data after having already created the dependency object, e.g. after load.
     */
    ResourceDependency.prototype._iSetData = function (data) {
        this._data = data;
    };
    /**
     * @private
     *
     */
    ResourceDependency.prototype._iSetParser = function (parser) {
        this._parser = parser;
    };
    /**
     * Resolve the dependency when it's loaded with the parent parser. For example, a dependency containing an
     * ImageResource would be assigned to a Mesh instance as a BitmapMaterial, a scene graph object would be added
     * to its intended parent. The dependency should be a member of the dependencies property.
     */
    ResourceDependency.prototype.resolve = function () {
        if (this._parentParser)
            this._parentParser._iResolveDependency(this);
    };
    /**
     * Resolve a dependency failure. For example, map loading failure from a 3d file
     */
    ResourceDependency.prototype.resolveFailure = function () {
        if (this._parentParser)
            this._parentParser._iResolveDependencyFailure(this);
    };
    /**
     * Resolve the dependencies name
     */
    ResourceDependency.prototype.resolveName = function (asset) {
        if (this._parentParser)
            return this._parentParser._iResolveDependencyName(this, asset);
        return asset.name;
    };
    return ResourceDependency;
})();
module.exports = ResourceDependency;


},{}],48:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var URLLoaderDataFormat = require("awayjs-core/lib/net/URLLoaderDataFormat");
var ParserBase = require("awayjs-core/lib/parsers/ParserBase");
var ParserUtils = require("awayjs-core/lib/parsers/ParserUtils");
var ByteArray = require("awayjs-core/lib/utils/ByteArray");
var TextureUtils = require("awayjs-core/lib/utils/TextureUtils");
var ImageTexture = require("awayjs-core/lib/textures/ImageTexture");
/**
 * Texture2DParser provides a "parser" for natively supported image types (jpg, png). While it simply loads bytes into
 * a loader object, it wraps it in a BitmapDataResource so resource management can happen consistently without
 * exception cases.
 */
var Texture2DParser = (function (_super) {
    __extends(Texture2DParser, _super);
    /**
     * Creates a new Texture2DParser object.
     * @param uri The url or id of the data or file to be parsed.
     * @param extra The holder for extra contextual data that the parser might need.
     */
    function Texture2DParser() {
        _super.call(this, URLLoaderDataFormat.BLOB);
    }
    /**
     * Indicates whether or not a given file extension is supported by the parser.
     * @param extension The file extension of a potential file to be parsed.
     * @return Whether or not the given file type is supported.
     */
    Texture2DParser.supportsType = function (extension) {
        extension = extension.toLowerCase();
        return extension == "jpg" || extension == "jpeg" || extension == "png" || extension == "gif"; //|| extension == "bmp";//|| extension == "atf";
    };
    /**
     * Tests whether a data block can be parsed by the parser.
     * @param data The data block to potentially be parsed.
     * @return Whether or not the given data is supported.
     */
    Texture2DParser.supportsData = function (data) {
        if (data instanceof HTMLImageElement)
            return true;
        if (!(data instanceof ByteArray))
            return false;
        var ba = data;
        ba.position = 0;
        if (ba.readUnsignedShort() == 0xffd8)
            return true; // JPEG, maybe check for "JFIF" as well?
        ba.position = 0;
        if (ba.readShort() == 0x424D)
            return true; // BMP
        ba.position = 1;
        if (ba.readUTFBytes(3) == 'PNG')
            return true;
        ba.position = 0;
        if (ba.readUTFBytes(3) == 'GIF' && ba.readShort() == 0x3839 && ba.readByte() == 0x61)
            return true;
        ba.position = 0;
        if (ba.readUTFBytes(3) == 'ATF')
            return true;
        return false;
    };
    /**
     * @inheritDoc
     */
    Texture2DParser.prototype._pProceedParsing = function () {
        var _this = this;
        var asset;
        var sizeError = false;
        if (this._loadingImage) {
            return ParserBase.MORE_TO_PARSE;
        }
        else if (this._htmlImageElement) {
            if (TextureUtils.isHTMLImageElementValid(this._htmlImageElement)) {
                asset = new ImageTexture(this._htmlImageElement);
                this._pFinalizeAsset(asset, this._iFileName);
            }
        }
        else if (this.data instanceof HTMLImageElement) {
            if (TextureUtils.isHTMLImageElementValid(this.data)) {
                asset = new ImageTexture(this.data);
                this._pFinalizeAsset(asset, this._iFileName);
            }
            else {
                sizeError = true;
            }
        }
        else if (this.data instanceof ByteArray) {
            var ba = this.data;
            ba.position = 0;
            var htmlImageElement = ParserUtils.byteArrayToImage(this.data);
            if (TextureUtils.isHTMLImageElementValid(htmlImageElement)) {
                asset = new ImageTexture(htmlImageElement);
                this._pFinalizeAsset(asset, this._iFileName);
            }
            else {
                sizeError = true;
            }
        }
        else if (this.data instanceof ArrayBuffer) {
            this._htmlImageElement = ParserUtils.arrayBufferToImage(this.data);
            asset = new ImageTexture(this._htmlImageElement);
            this._pFinalizeAsset(asset, this._iFileName);
        }
        else if (this.data instanceof Blob) {
            this._htmlImageElement = ParserUtils.blobToImage(this.data);
            this._htmlImageElement.onload = function (event) { return _this.onLoadComplete(event); };
            this._loadingImage = true;
            return ParserBase.MORE_TO_PARSE;
        }
        if (sizeError == true) {
        }
        this._pContent = asset;
        return ParserBase.PARSING_DONE;
    };
    Texture2DParser.prototype.onLoadComplete = function (event) {
        this._loadingImage = false;
    };
    return Texture2DParser;
})(ParserBase);
module.exports = Texture2DParser;


},{"awayjs-core/lib/net/URLLoaderDataFormat":40,"awayjs-core/lib/parsers/ParserBase":45,"awayjs-core/lib/parsers/ParserUtils":46,"awayjs-core/lib/textures/ImageTexture":55,"awayjs-core/lib/utils/ByteArray":59,"awayjs-core/lib/utils/TextureUtils":62}],49:[function(require,module,exports){
/**
 * Provides constant values for camera lens projection options use the the <code>coordinateSystem</code> property
 *
 * @see away.projections.PerspectiveLens#coordinateSystem
 */
var CoordinateSystem = (function () {
    function CoordinateSystem() {
    }
    /**
     * Default option, projects to a left-handed coordinate system
     */
    CoordinateSystem.LEFT_HANDED = "leftHanded";
    /**
     * Projects to a right-handed coordinate system
     */
    CoordinateSystem.RIGHT_HANDED = "rightHanded";
    return CoordinateSystem;
})();
module.exports = CoordinateSystem;


},{}],50:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var CoordinateSystem = require("awayjs-core/lib/projections/CoordinateSystem");
var ProjectionBase = require("awayjs-core/lib/projections/ProjectionBase");
var PerspectiveProjection = (function (_super) {
    __extends(PerspectiveProjection, _super);
    function PerspectiveProjection(fieldOfView, coordinateSystem) {
        if (fieldOfView === void 0) { fieldOfView = 60; }
        if (coordinateSystem === void 0) { coordinateSystem = "leftHanded"; }
        _super.call(this, coordinateSystem);
        this._fieldOfView = 60;
        this._focalLength = 1000;
        this._hFieldOfView = 60;
        this._hFocalLength = 1000;
        this._preserveAspectRatio = true;
        this._preserveFocalLength = false;
        this.fieldOfView = fieldOfView;
    }
    Object.defineProperty(PerspectiveProjection.prototype, "preserveAspectRatio", {
        /**
         *
         */
        get: function () {
            return this._preserveAspectRatio;
        },
        set: function (value) {
            if (this._preserveAspectRatio == value)
                return;
            this._preserveAspectRatio = value;
            if (this._preserveAspectRatio)
                this.pInvalidateMatrix();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PerspectiveProjection.prototype, "preserveFocalLength", {
        /**
         *
         */
        get: function () {
            return this._preserveFocalLength;
        },
        set: function (value) {
            if (this._preserveFocalLength == value)
                return;
            this._preserveFocalLength = value;
            this.pInvalidateMatrix();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PerspectiveProjection.prototype, "fieldOfView", {
        /**
         *
         */
        get: function () {
            return this._fieldOfView;
        },
        set: function (value) {
            if (this._fieldOfView == value)
                return;
            this._fieldOfView = value;
            this.pInvalidateMatrix();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PerspectiveProjection.prototype, "focalLength", {
        /**
         *
         */
        get: function () {
            return this._focalLength;
        },
        set: function (value) {
            if (this._focalLength == value)
                return;
            this._focalLength = value;
            this.pInvalidateMatrix();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PerspectiveProjection.prototype, "hFieldOfView", {
        /**
         *
         */
        get: function () {
            return this._hFieldOfView;
        },
        set: function (value) {
            if (this._hFieldOfView == value)
                return;
            this._hFieldOfView = value;
            this._hFocalLength = 1 / Math.tan(this._hFieldOfView * Math.PI / 360);
            this.pInvalidateMatrix();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PerspectiveProjection.prototype, "hFocalLength", {
        /**
         *
         */
        get: function () {
            return this._hFocalLength;
        },
        set: function (value) {
            if (this._hFocalLength == value)
                return;
            this._hFocalLength = value;
            this.pInvalidateMatrix();
        },
        enumerable: true,
        configurable: true
    });
    //@override
    PerspectiveProjection.prototype.unproject = function (nX, nY, sZ) {
        var v = new Vector3D(nX, -nY, sZ, 1.0);
        v.x *= sZ;
        v.y *= sZ;
        v = this.unprojectionMatrix.transformVector(v);
        //z is unaffected by transform
        v.z = sZ;
        return v;
    };
    //@override
    PerspectiveProjection.prototype.clone = function () {
        var clone = new PerspectiveProjection(this._fieldOfView);
        clone._pNear = this._pNear;
        clone._pFar = this._pFar;
        clone._pAspectRatio = this._pAspectRatio;
        clone._pCoordinateSystem = this._pCoordinateSystem;
        return clone;
    };
    //@override
    PerspectiveProjection.prototype.pUpdateMatrix = function () {
        var raw = [];
        if (this._preserveFocalLength) {
            if (this._preserveAspectRatio)
                this._hFocalLength = this._focalLength;
            this._fieldOfView = Math.atan(0.5 * this._pScissorRect.height / this._focalLength) * 360 / Math.PI;
            this._hFieldOfView = Math.atan(0.5 * this._pScissorRect.width / this._hFocalLength) * 360 / Math.PI;
        }
        else {
            this._focalLength = 0.5 * this._pScissorRect.height / Math.tan(this._fieldOfView * Math.PI / 360);
            if (this._preserveAspectRatio)
                this._hFocalLength = this._focalLength;
            else
                this._hFocalLength = 0.5 * this._pScissorRect.width / Math.tan(this._hFieldOfView * Math.PI / 360);
        }
        var tanMinX = -this._pOriginX / this._hFocalLength;
        var tanMaxX = (1 - this._pOriginX) / this._hFocalLength;
        var tanMinY = -this._pOriginY / this._focalLength;
        var tanMaxY = (1 - this._pOriginY) / this._focalLength;
        var left;
        var right;
        var top;
        var bottom;
        // assume scissored frustum
        var center = -((tanMinX - tanMaxX) * this._pScissorRect.x + tanMinX * this._pScissorRect.width);
        var middle = ((tanMinY - tanMaxY) * this._pScissorRect.y + tanMinY * this._pScissorRect.height);
        left = center - (tanMaxX - tanMinX) * this._pViewPort.width;
        right = center;
        top = middle;
        bottom = middle + (tanMaxY - tanMinY) * this._pViewPort.height;
        raw[0] = 2 / (right - left);
        raw[5] = 2 / (bottom - top);
        raw[8] = (right + left) / (right - left);
        raw[9] = (bottom + top) / (bottom - top);
        raw[10] = (this._pFar + this._pNear) / (this._pFar - this._pNear);
        raw[11] = 1;
        raw[1] = raw[2] = raw[3] = raw[4] = raw[6] = raw[7] = raw[12] = raw[13] = raw[15] = 0;
        raw[14] = -2 * this._pFar * this._pNear / (this._pFar - this._pNear);
        if (this._pCoordinateSystem == CoordinateSystem.RIGHT_HANDED)
            raw[5] = -raw[5];
        this._pMatrix.copyRawDataFrom(raw);
        this._pFrustumCorners[0] = this._pFrustumCorners[9] = this._pNear * left;
        this._pFrustumCorners[3] = this._pFrustumCorners[6] = this._pNear * right;
        this._pFrustumCorners[1] = this._pFrustumCorners[4] = this._pNear * top;
        this._pFrustumCorners[7] = this._pFrustumCorners[10] = this._pNear * bottom;
        this._pFrustumCorners[12] = this._pFrustumCorners[21] = this._pFar * left;
        this._pFrustumCorners[15] = this._pFrustumCorners[18] = this._pFar * right;
        this._pFrustumCorners[13] = this._pFrustumCorners[16] = this._pFar * top;
        this._pFrustumCorners[19] = this._pFrustumCorners[22] = this._pFar * bottom;
        this._pFrustumCorners[2] = this._pFrustumCorners[5] = this._pFrustumCorners[8] = this._pFrustumCorners[11] = this._pNear;
        this._pFrustumCorners[14] = this._pFrustumCorners[17] = this._pFrustumCorners[20] = this._pFrustumCorners[23] = this._pFar;
        this._pMatrixInvalid = false;
    };
    return PerspectiveProjection;
})(ProjectionBase);
module.exports = PerspectiveProjection;


},{"awayjs-core/lib/geom/Vector3D":26,"awayjs-core/lib/projections/CoordinateSystem":49,"awayjs-core/lib/projections/ProjectionBase":51}],51:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
var Rectangle = require("awayjs-core/lib/geom/Rectangle");
var EventDispatcher = require("awayjs-core/lib/events/EventDispatcher");
var ProjectionEvent = require("awayjs-core/lib/events/ProjectionEvent");
var AbstractMethodError = require("awayjs-core/lib/errors/AbstractMethodError");
var ProjectionBase = (function (_super) {
    __extends(ProjectionBase, _super);
    function ProjectionBase(coordinateSystem) {
        if (coordinateSystem === void 0) { coordinateSystem = "leftHanded"; }
        _super.call(this);
        this._pMatrix = new Matrix3D();
        this._pScissorRect = new Rectangle();
        this._pViewPort = new Rectangle();
        this._pNear = 20;
        this._pFar = 3000;
        this._pAspectRatio = 1;
        this._pMatrixInvalid = true;
        this._pFrustumCorners = [];
        this._pOriginX = 0.5;
        this._pOriginY = 0.5;
        this._unprojectionInvalid = true;
        this.coordinateSystem = coordinateSystem;
    }
    Object.defineProperty(ProjectionBase.prototype, "coordinateSystem", {
        /**
         * The handedness of the coordinate system projection. The default is LEFT_HANDED.
         */
        get: function () {
            return this._pCoordinateSystem;
        },
        set: function (value) {
            if (this._pCoordinateSystem == value)
                return;
            this._pCoordinateSystem = value;
            this.pInvalidateMatrix();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProjectionBase.prototype, "frustumCorners", {
        get: function () {
            return this._pFrustumCorners;
        },
        set: function (frustumCorners) {
            this._pFrustumCorners = frustumCorners;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProjectionBase.prototype, "matrix", {
        get: function () {
            if (this._pMatrixInvalid) {
                this.pUpdateMatrix();
                this._pMatrixInvalid = false;
            }
            return this._pMatrix;
        },
        set: function (value) {
            this._pMatrix = value;
            this.pInvalidateMatrix();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProjectionBase.prototype, "near", {
        get: function () {
            return this._pNear;
        },
        set: function (value) {
            if (value == this._pNear) {
                return;
            }
            this._pNear = value;
            this.pInvalidateMatrix();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProjectionBase.prototype, "originX", {
        get: function () {
            return this._pOriginX;
        },
        set: function (value) {
            if (this._pOriginX == value)
                return;
            this._pOriginX = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProjectionBase.prototype, "originY", {
        get: function () {
            return this._pOriginY;
        },
        set: function (value) {
            if (this._pOriginY == value)
                return;
            this._pOriginY = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProjectionBase.prototype, "far", {
        get: function () {
            return this._pFar;
        },
        set: function (value) {
            if (value == this._pFar) {
                return;
            }
            this._pFar = value;
            this.pInvalidateMatrix();
        },
        enumerable: true,
        configurable: true
    });
    ProjectionBase.prototype.project = function (point3d) {
        var v = this.matrix.transformVector(point3d);
        v.x = v.x / v.w;
        v.y = -v.y / v.w;
        //z is unaffected by transform
        v.z = point3d.z;
        return v;
    };
    Object.defineProperty(ProjectionBase.prototype, "unprojectionMatrix", {
        get: function () {
            if (this._unprojectionInvalid) {
                if (!this._unprojection)
                    this._unprojection = new Matrix3D();
                this._unprojection.copyFrom(this.matrix);
                this._unprojection.invert();
                this._unprojectionInvalid = false;
            }
            return this._unprojection;
        },
        enumerable: true,
        configurable: true
    });
    ProjectionBase.prototype.unproject = function (nX, nY, sZ) {
        throw new AbstractMethodError();
    };
    ProjectionBase.prototype.clone = function () {
        throw new AbstractMethodError();
    };
    Object.defineProperty(ProjectionBase.prototype, "_iAspectRatio", {
        get: function () {
            return this._pAspectRatio;
        },
        set: function (value) {
            if (this._pAspectRatio == value)
                return;
            this._pAspectRatio = value;
            this.pInvalidateMatrix();
        },
        enumerable: true,
        configurable: true
    });
    ProjectionBase.prototype.pInvalidateMatrix = function () {
        this._pMatrixInvalid = true;
        this._unprojectionInvalid = true;
        this.dispatchEvent(new ProjectionEvent(ProjectionEvent.MATRIX_CHANGED, this));
    };
    ProjectionBase.prototype.pUpdateMatrix = function () {
        throw new AbstractMethodError();
    };
    ProjectionBase.prototype._iUpdateScissorRect = function (x, y, width, height) {
        this._pScissorRect.x = x;
        this._pScissorRect.y = y;
        this._pScissorRect.width = width;
        this._pScissorRect.height = height;
        this.pInvalidateMatrix();
    };
    ProjectionBase.prototype._iUpdateViewport = function (x, y, width, height) {
        this._pViewPort.x = x;
        this._pViewPort.y = y;
        this._pViewPort.width = width;
        this._pViewPort.height = height;
        this.pInvalidateMatrix();
    };
    return ProjectionBase;
})(EventDispatcher);
module.exports = ProjectionBase;


},{"awayjs-core/lib/errors/AbstractMethodError":4,"awayjs-core/lib/events/EventDispatcher":10,"awayjs-core/lib/events/ProjectionEvent":16,"awayjs-core/lib/geom/Matrix3D":20,"awayjs-core/lib/geom/Rectangle":25}],52:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Error = require("awayjs-core/lib/errors/Error");
var Texture2DBase = require("awayjs-core/lib/textures/Texture2DBase");
var TextureUtils = require("awayjs-core/lib/utils/TextureUtils");
var BitmapTexture = (function (_super) {
    __extends(BitmapTexture, _super);
    function BitmapTexture(bitmapData, generateMipmaps) {
        if (generateMipmaps === void 0) { generateMipmaps = false; }
        _super.call(this, generateMipmaps);
        this.bitmapData = bitmapData;
    }
    Object.defineProperty(BitmapTexture.prototype, "bitmapData", {
        /**
         *
         * @returns {BitmapData}
         */
        get: function () {
            return this._bitmapData;
        },
        set: function (value) {
            if (this._bitmapData == value)
                return;
            if (!TextureUtils.isBitmapDataValid(value))
                throw new Error("Invalid bitmapData: Width and height must be power of 2 and cannot exceed 2048");
            this._bitmapData = value;
            this.invalidateContent();
            this._pSetSize(value.width, value.height);
        },
        enumerable: true,
        configurable: true
    });
    BitmapTexture.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this._bitmapData.dispose();
        this._bitmapData = null;
    };
    BitmapTexture.prototype._iGetTextureData = function () {
        return this._bitmapData;
    };
    return BitmapTexture;
})(Texture2DBase);
module.exports = BitmapTexture;


},{"awayjs-core/lib/errors/Error":6,"awayjs-core/lib/textures/Texture2DBase":57,"awayjs-core/lib/utils/TextureUtils":62}],53:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AbstractMethodError = require("awayjs-core/lib/errors/AbstractMethodError");
var MipmapGenerator = require("awayjs-core/lib/textures/MipmapGenerator");
var TextureProxyBase = require("awayjs-core/lib/textures/TextureProxyBase");
var CubeTextureBase = (function (_super) {
    __extends(CubeTextureBase, _super);
    function CubeTextureBase(generateMipmaps) {
        if (generateMipmaps === void 0) { generateMipmaps = false; }
        _super.call(this, generateMipmaps);
        this._mipmapDataArray = new Array(6);
        this._mipmapDataDirtyArray = new Array(6);
    }
    /**
     *
     * @param width
     * @param height
     * @private
     */
    CubeTextureBase.prototype._pSetSize = function (size) {
        if (this._pSize != size)
            this.invalidateSize();
        for (var i = 0; i < 6; i++)
            this._mipmapDataDirtyArray[i] = true;
        this._pSize = size;
    };
    /**
     * @inheritDoc
     */
    CubeTextureBase.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        for (var i = 0; i < 6; i++) {
            var mipmapData = this._mipmapDataArray[i];
            var len = mipmapData.length;
            for (var j = 0; j < len; j++)
                MipmapGenerator.freeMipMapHolder(mipmapData[j]);
        }
    };
    /**
     *
     */
    CubeTextureBase.prototype.invalidateContent = function () {
        _super.prototype.invalidateContent.call(this);
        for (var i = 0; i < 6; i++)
            this._mipmapDataDirtyArray[i] = true;
    };
    CubeTextureBase.prototype._iGetMipmapData = function (side) {
        if (this._mipmapDataDirtyArray[side]) {
            this._mipmapDataDirtyArray[side] = false;
            var mipmapData = this._mipmapDataArray[side] || (this._mipmapDataArray[side] = new Array());
            MipmapGenerator.generateMipMaps(this._iGetTextureData(side), mipmapData, true);
        }
        return this._mipmapDataArray[side];
    };
    CubeTextureBase.prototype._iGetTextureData = function (side) {
        throw new AbstractMethodError();
    };
    return CubeTextureBase;
})(TextureProxyBase);
module.exports = CubeTextureBase;


},{"awayjs-core/lib/errors/AbstractMethodError":4,"awayjs-core/lib/textures/MipmapGenerator":56,"awayjs-core/lib/textures/TextureProxyBase":58}],54:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Error = require("awayjs-core/lib/errors/Error");
var CubeTextureBase = require("awayjs-core/lib/textures/CubeTextureBase");
var TextureUtils = require("awayjs-core/lib/utils/TextureUtils");
var ImageCubeTexture = (function (_super) {
    __extends(ImageCubeTexture, _super);
    function ImageCubeTexture(posX, negX, posY, negY, posZ, negZ, generateMipmaps) {
        if (generateMipmaps === void 0) { generateMipmaps = false; }
        _super.call(this, generateMipmaps);
        this._htmlImageElements = new Array(6);
        this._testSize(this._htmlImageElements[0] = posX);
        this._testSize(this._htmlImageElements[1] = negX);
        this._testSize(this._htmlImageElements[2] = posY);
        this._testSize(this._htmlImageElements[3] = negY);
        this._testSize(this._htmlImageElements[4] = posZ);
        this._testSize(this._htmlImageElements[5] = negZ);
        this.invalidateContent();
        this._pSetSize(posX.width);
    }
    Object.defineProperty(ImageCubeTexture.prototype, "positiveX", {
        /**
         * The texture on the cube's right face.
         */
        get: function () {
            return this._htmlImageElements[0];
        },
        set: function (value) {
            this._testSize(value);
            this.invalidateContent();
            this._pSetSize(value.width);
            this._htmlImageElements[0] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImageCubeTexture.prototype, "negativeX", {
        /**
         * The texture on the cube's left face.
         */
        get: function () {
            return this._htmlImageElements[1];
        },
        set: function (value) {
            this._testSize(value);
            this.invalidateContent();
            this._pSetSize(value.width);
            this._htmlImageElements[1] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImageCubeTexture.prototype, "positiveY", {
        /**
         * The texture on the cube's top face.
         */
        get: function () {
            return this._htmlImageElements[2];
        },
        set: function (value) {
            this._testSize(value);
            this.invalidateContent();
            this._pSetSize(value.width);
            this._htmlImageElements[2] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImageCubeTexture.prototype, "negativeY", {
        /**
         * The texture on the cube's bottom face.
         */
        get: function () {
            return this._htmlImageElements[3];
        },
        set: function (value) {
            this._testSize(value);
            this.invalidateContent();
            this._pSetSize(value.width);
            this._htmlImageElements[3] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImageCubeTexture.prototype, "positiveZ", {
        /**
         * The texture on the cube's far face.
         */
        get: function () {
            return this._htmlImageElements[4];
        },
        set: function (value) {
            this._testSize(value);
            this.invalidateContent();
            this._pSetSize(value.width);
            this._htmlImageElements[4] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImageCubeTexture.prototype, "negativeZ", {
        /**
         * The texture on the cube's near face.
         */
        get: function () {
            return this._htmlImageElements[5];
        },
        set: function (value) {
            this._testSize(value);
            this.invalidateContent();
            this._pSetSize(value.width);
            this._htmlImageElements[5] = value;
        },
        enumerable: true,
        configurable: true
    });
    ImageCubeTexture.prototype._testSize = function (value) {
        if (value.width != value.height)
            throw new Error("BitmapData should have equal width and height!");
        if (!TextureUtils.isHTMLImageElementValid(value))
            throw new Error("Invalid bitmapData: Width and height must be power of 2 and cannot exceed 2048");
    };
    ImageCubeTexture.prototype._iGetTextureData = function (side) {
        return this._htmlImageElements[side];
    };
    return ImageCubeTexture;
})(CubeTextureBase);
module.exports = ImageCubeTexture;


},{"awayjs-core/lib/errors/Error":6,"awayjs-core/lib/textures/CubeTextureBase":53,"awayjs-core/lib/utils/TextureUtils":62}],55:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Error = require("awayjs-core/lib/errors/Error");
var Texture2DBase = require("awayjs-core/lib/textures/Texture2DBase");
var TextureUtils = require("awayjs-core/lib/utils/TextureUtils");
var ImageTexture = (function (_super) {
    __extends(ImageTexture, _super);
    /**
     *
     * @param htmlImageElement
     * @param generateMipmaps
     */
    function ImageTexture(htmlImageElement, generateMipmaps) {
        if (generateMipmaps === void 0) { generateMipmaps = false; }
        _super.call(this, generateMipmaps);
        this.htmlImageElement = htmlImageElement;
    }
    Object.defineProperty(ImageTexture.prototype, "htmlImageElement", {
        /**
         *
         */
        get: function () {
            return this._htmlImageElement;
        },
        set: function (value) {
            if (this._htmlImageElement == value)
                return;
            if (!TextureUtils.isHTMLImageElementValid(value))
                throw new Error("Invalid bitmapData: Width and height must be power of 2 and cannot exceed 2048");
            this._htmlImageElement = value;
            this.invalidateContent();
            this._pSetSize(value.width, value.height);
        },
        enumerable: true,
        configurable: true
    });
    ImageTexture.prototype._iGetTextureData = function () {
        return this._htmlImageElement;
    };
    return ImageTexture;
})(Texture2DBase);
module.exports = ImageTexture;


},{"awayjs-core/lib/errors/Error":6,"awayjs-core/lib/textures/Texture2DBase":57,"awayjs-core/lib/utils/TextureUtils":62}],56:[function(require,module,exports){
var BitmapData = require("awayjs-core/lib/base/BitmapData");
var Matrix = require("awayjs-core/lib/geom/Matrix");
var Rectangle = require("awayjs-core/lib/geom/Rectangle");
/**
 * MipmapGenerator is a helper class that uploads BitmapData to a Texture including mipmap levels.
 */
var MipmapGenerator = (function () {
    function MipmapGenerator() {
    }
    MipmapGenerator.generateMipMaps = function (source, output, alpha) {
        if (alpha === void 0) { alpha = false; }
        var w = source.width;
        var h = source.height;
        var i = 0;
        var mipmap;
        MipmapGenerator._rect.width = w;
        MipmapGenerator._rect.height = h;
        while (w >= 1 && h >= 1) {
            mipmap = output[i] = MipmapGenerator._getMipmapHolder(output[i], w, h);
            if (alpha)
                mipmap.fillRect(MipmapGenerator._rect, 0);
            MipmapGenerator._matrix.a = MipmapGenerator._rect.width / source.width;
            MipmapGenerator._matrix.d = MipmapGenerator._rect.height / source.height;
            mipmap.draw(source, MipmapGenerator._matrix); //TODO: smoothing?
            w >>= 1;
            h >>= 1;
            MipmapGenerator._rect.width = w > 1 ? w : 1;
            MipmapGenerator._rect.height = h > 1 ? h : 1;
            i++;
        }
    };
    MipmapGenerator._getMipmapHolder = function (mipMapHolder, newW, newH) {
        if (mipMapHolder) {
            if (mipMapHolder.width == newW && mipMapHolder.height == newH)
                return mipMapHolder;
            MipmapGenerator.freeMipMapHolder(mipMapHolder);
        }
        if (!MipmapGenerator._mipMaps[newW]) {
            MipmapGenerator._mipMaps[newW] = [];
            MipmapGenerator._mipMapUses[newW] = [];
        }
        if (!MipmapGenerator._mipMaps[newW][newH]) {
            mipMapHolder = MipmapGenerator._mipMaps[newW][newH] = new BitmapData(newW, newH, true);
            MipmapGenerator._mipMapUses[newW][newH] = 1;
        }
        else {
            MipmapGenerator._mipMapUses[newW][newH] = MipmapGenerator._mipMapUses[newW][newH] + 1;
            mipMapHolder = MipmapGenerator._mipMaps[newW][newH];
        }
        return mipMapHolder;
    };
    MipmapGenerator.freeMipMapHolder = function (mipMapHolder) {
        var holderWidth = mipMapHolder.width;
        var holderHeight = mipMapHolder.height;
        if (--MipmapGenerator._mipMapUses[holderWidth][holderHeight] == 0) {
            MipmapGenerator._mipMaps[holderWidth][holderHeight].dispose();
            MipmapGenerator._mipMaps[holderWidth][holderHeight] = null;
        }
    };
    MipmapGenerator._mipMaps = [];
    MipmapGenerator._mipMapUses = [];
    MipmapGenerator._matrix = new Matrix();
    MipmapGenerator._rect = new Rectangle();
    return MipmapGenerator;
})();
module.exports = MipmapGenerator;


},{"awayjs-core/lib/base/BitmapData":1,"awayjs-core/lib/geom/Matrix":19,"awayjs-core/lib/geom/Rectangle":25}],57:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AbstractMethodError = require("awayjs-core/lib/errors/AbstractMethodError");
var MipmapGenerator = require("awayjs-core/lib/textures/MipmapGenerator");
var TextureProxyBase = require("awayjs-core/lib/textures/TextureProxyBase");
var Texture2DBase = (function (_super) {
    __extends(Texture2DBase, _super);
    function Texture2DBase(generateMipmaps) {
        if (generateMipmaps === void 0) { generateMipmaps = false; }
        _super.call(this, generateMipmaps);
    }
    Object.defineProperty(Texture2DBase.prototype, "width", {
        /**
         *
         * @returns {number}
         */
        get: function () {
            return this._pWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Texture2DBase.prototype, "height", {
        /**
         *
         * @returns {number}
         */
        get: function () {
            return this._pHeight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Texture2DBase.prototype, "size", {
        get: function () {
            return this._pWidth;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    Texture2DBase.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        if (this._mipmapData) {
            var len = this._mipmapData.length;
            for (var i = 0; i < len; i++)
                MipmapGenerator.freeMipMapHolder(this._mipmapData[i]);
        }
    };
    /**
     *
     */
    Texture2DBase.prototype.invalidateContent = function () {
        _super.prototype.invalidateContent.call(this);
        this._mipmapDataDirty = true;
    };
    /**
     *
     * @param width
     * @param height
     * @private
     */
    Texture2DBase.prototype._pSetSize = function (width, height) {
        if (this._pWidth != width || this._pHeight != height)
            this.invalidateSize();
        this._mipmapDataDirty = true;
        this._pWidth = width;
        this._pHeight = height;
    };
    Texture2DBase.prototype._iGetMipmapData = function () {
        if (this._mipmapDataDirty) {
            this._mipmapDataDirty = false;
            if (!this._mipmapData)
                this._mipmapData = new Array();
            MipmapGenerator.generateMipMaps(this._iGetTextureData(), this._mipmapData, true);
        }
        return this._mipmapData;
    };
    Texture2DBase.prototype._iGetTextureData = function () {
        throw new AbstractMethodError();
    };
    return Texture2DBase;
})(TextureProxyBase);
module.exports = Texture2DBase;


},{"awayjs-core/lib/errors/AbstractMethodError":4,"awayjs-core/lib/textures/MipmapGenerator":56,"awayjs-core/lib/textures/TextureProxyBase":58}],58:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AssetType = require("awayjs-core/lib/library/AssetType");
var NamedAssetBase = require("awayjs-core/lib/library/NamedAssetBase");
/**
 *
 */
var TextureProxyBase = (function (_super) {
    __extends(TextureProxyBase, _super);
    /**
     *
     */
    function TextureProxyBase(generateMipmaps) {
        if (generateMipmaps === void 0) { generateMipmaps = false; }
        _super.call(this);
        this._pFormat = "bgra";
        this._textureData = new Array();
        this._generateMipmaps = this._hasMipmaps = generateMipmaps;
    }
    Object.defineProperty(TextureProxyBase.prototype, "size", {
        get: function () {
            return this._pSize;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextureProxyBase.prototype, "hasMipmaps", {
        get: function () {
            return this._hasMipmaps;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextureProxyBase.prototype, "format", {
        /**
         *
         * @returns {string}
         */
        get: function () {
            return this._pFormat;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextureProxyBase.prototype, "generateMipmaps", {
        /**
         *
         * @returns {boolean}
         */
        get: function () {
            return this._generateMipmaps;
        },
        set: function (value) {
            if (this._generateMipmaps == value)
                return;
            this._generateMipmaps = this._hasMipmaps = value;
            this.invalidateContent();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TextureProxyBase.prototype, "assetType", {
        /**
         *
         * @returns {string}
         */
        get: function () {
            return AssetType.TEXTURE;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     */
    TextureProxyBase.prototype.invalidateContent = function () {
        var len = this._textureData.length;
        for (var i = 0; i < len; i++)
            this._textureData[i].invalidate();
    };
    /**
     *
     * @private
     */
    TextureProxyBase.prototype.invalidateSize = function () {
        while (this._textureData.length)
            this._textureData[0].dispose();
    };
    /**
     * @inheritDoc
     */
    TextureProxyBase.prototype.dispose = function () {
        while (this._textureData.length)
            this._textureData[0].dispose();
    };
    TextureProxyBase.prototype._iAddTextureData = function (textureData) {
        this._textureData.push(textureData);
        return textureData;
    };
    TextureProxyBase.prototype._iRemoveTextureData = function (textureData) {
        this._textureData.splice(this._textureData.indexOf(textureData), 1);
        return textureData;
    };
    return TextureProxyBase;
})(NamedAssetBase);
module.exports = TextureProxyBase;


},{"awayjs-core/lib/library/AssetType":31,"awayjs-core/lib/library/NamedAssetBase":37}],59:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ByteArrayBase = require("awayjs-core/lib/utils/ByteArrayBase");
var ByteArray = (function (_super) {
    __extends(ByteArray, _super);
    function ByteArray() {
        _super.call(this);
        this.maxlength = 0;
        this._mode = "Typed array";
        this.maxlength = 4;
        this.arraybytes = new ArrayBuffer(this.maxlength);
        this.unalignedarraybytestemp = new ArrayBuffer(16);
    }
    ByteArray.prototype.ensureWriteableSpace = function (n) {
        this.ensureSpace(n + this.position);
    };
    ByteArray.prototype.setArrayBuffer = function (aBuffer) {
        this.ensureSpace(aBuffer.byteLength);
        this.length = aBuffer.byteLength;
        var inInt8AView = new Int8Array(aBuffer);
        var localInt8View = new Int8Array(this.arraybytes, 0, this.length);
        localInt8View.set(inInt8AView);
        this.position = 0;
    };
    ByteArray.prototype.getBytesAvailable = function () {
        return (this.length) - (this.position);
    };
    ByteArray.prototype.ensureSpace = function (n) {
        if (n > this.maxlength) {
            var newmaxlength = (n + 255) & (~255);
            var newarraybuffer = new ArrayBuffer(newmaxlength);
            var view = new Uint8Array(this.arraybytes, 0, this.length);
            var newview = new Uint8Array(newarraybuffer, 0, this.length);
            newview.set(view); // memcpy
            this.arraybytes = newarraybuffer;
            this.maxlength = newmaxlength;
        }
    };
    ByteArray.prototype.writeByte = function (b) {
        this.ensureWriteableSpace(1);
        var view = new Int8Array(this.arraybytes);
        view[this.position++] = (~~b); // ~~ is cast to int in js...
        if (this.position > this.length) {
            this.length = this.position;
        }
    };
    ByteArray.prototype.readByte = function () {
        if (this.position >= this.length) {
            throw "ByteArray out of bounds read. Positon=" + this.position + ", Length=" + this.length;
        }
        var view = new Int8Array(this.arraybytes);
        return view[this.position++];
    };
    ByteArray.prototype.readBytes = function (bytes, offset, length) {
        if (offset === void 0) { offset = 0; }
        if (length === void 0) { length = 0; }
        if (length == null) {
            length = bytes.length;
        }
        bytes.ensureWriteableSpace(offset + length);
        var byteView = new Int8Array(bytes.arraybytes);
        var localByteView = new Int8Array(this.arraybytes);
        byteView.set(localByteView.subarray(this.position, this.position + length), offset);
        this.position += length;
        if (length + offset > bytes.length) {
            bytes.length += (length + offset) - bytes.length;
        }
    };
    ByteArray.prototype.writeUnsignedByte = function (b) {
        this.ensureWriteableSpace(1);
        var view = new Uint8Array(this.arraybytes);
        view[this.position++] = (~~b) & 0xff; // ~~ is cast to int in js...
        if (this.position > this.length) {
            this.length = this.position;
        }
    };
    ByteArray.prototype.readUnsignedByte = function () {
        if (this.position >= this.length) {
            throw "ByteArray out of bounds read. Positon=" + this.position + ", Length=" + this.length;
        }
        var view = new Uint8Array(this.arraybytes);
        return view[this.position++];
    };
    ByteArray.prototype.writeUnsignedShort = function (b) {
        this.ensureWriteableSpace(2);
        if ((this.position & 1) == 0) {
            var view = new Uint16Array(this.arraybytes);
            view[this.position >> 1] = (~~b) & 0xffff; // ~~ is cast to int in js...
        }
        else {
            var view = new Uint16Array(this.unalignedarraybytestemp, 0, 1);
            view[0] = (~~b) & 0xffff;
            var view2 = new Uint8Array(this.arraybytes, this.position, 2);
            var view3 = new Uint8Array(this.unalignedarraybytestemp, 0, 2);
            view2.set(view3);
        }
        this.position += 2;
        if (this.position > this.length) {
            this.length = this.position;
        }
    };
    ByteArray.prototype.readUTFBytes = function (len) {
        var value = "";
        var max = this.position + len;
        var data = new DataView(this.arraybytes);
        while (this.position < max) {
            var c = data.getUint8(this.position++);
            if (c < 0x80) {
                if (c == 0)
                    break;
                value += String.fromCharCode(c);
            }
            else if (c < 0xE0) {
                value += String.fromCharCode(((c & 0x3F) << 6) | (data.getUint8(this.position++) & 0x7F));
            }
            else if (c < 0xF0) {
                var c2 = data.getUint8(this.position++);
                value += String.fromCharCode(((c & 0x1F) << 12) | ((c2 & 0x7F) << 6) | (data.getUint8(this.position++) & 0x7F));
            }
            else {
                var c2 = data.getUint8(this.position++);
                var c3 = data.getUint8(this.position++);
                value += String.fromCharCode(((c & 0x0F) << 18) | ((c2 & 0x7F) << 12) | ((c3 << 6) & 0x7F) | (data.getUint8(this.position++) & 0x7F));
            }
        }
        return value;
    };
    ByteArray.prototype.readInt = function () {
        var data = new DataView(this.arraybytes);
        var int = data.getInt32(this.position, true);
        this.position += 4;
        return int;
    };
    ByteArray.prototype.readShort = function () {
        var data = new DataView(this.arraybytes);
        var short = data.getInt16(this.position, true);
        this.position += 2;
        return short;
    };
    ByteArray.prototype.readDouble = function () {
        var data = new DataView(this.arraybytes);
        var double = data.getFloat64(this.position, true);
        this.position += 8;
        return double;
    };
    ByteArray.prototype.readUnsignedShort = function () {
        if (this.position > this.length + 2) {
            throw "ByteArray out of bounds read. Position=" + this.position + ", Length=" + this.length;
        }
        if ((this.position & 1) == 0) {
            var view = new Uint16Array(this.arraybytes);
            var pa = this.position >> 1;
            this.position += 2;
            return view[pa];
        }
        else {
            var view = new Uint16Array(this.unalignedarraybytestemp, 0, 1);
            var view2 = new Uint8Array(this.arraybytes, this.position, 2);
            var view3 = new Uint8Array(this.unalignedarraybytestemp, 0, 2);
            view3.set(view2);
            this.position += 2;
            return view[0];
        }
    };
    ByteArray.prototype.writeUnsignedInt = function (b) {
        this.ensureWriteableSpace(4);
        if ((this.position & 3) == 0) {
            var view = new Uint32Array(this.arraybytes);
            view[this.position >> 2] = (~~b) & 0xffffffff; // ~~ is cast to int in js...
        }
        else {
            var view = new Uint32Array(this.unalignedarraybytestemp, 0, 1);
            view[0] = (~~b) & 0xffffffff;
            var view2 = new Uint8Array(this.arraybytes, this.position, 4);
            var view3 = new Uint8Array(this.unalignedarraybytestemp, 0, 4);
            view2.set(view3);
        }
        this.position += 4;
        if (this.position > this.length) {
            this.length = this.position;
        }
    };
    ByteArray.prototype.readUnsignedInt = function () {
        if (this.position > this.length + 4) {
            throw "ByteArray out of bounds read. Position=" + this.position + ", Length=" + this.length;
        }
        if ((this.position & 3) == 0) {
            var view = new Uint32Array(this.arraybytes);
            var pa = this.position >> 2;
            this.position += 4;
            return view[pa];
        }
        else {
            var view = new Uint32Array(this.unalignedarraybytestemp, 0, 1);
            var view2 = new Uint8Array(this.arraybytes, this.position, 4);
            var view3 = new Uint8Array(this.unalignedarraybytestemp, 0, 4);
            view3.set(view2);
            this.position += 4;
            return view[0];
        }
    };
    ByteArray.prototype.writeFloat = function (b) {
        this.ensureWriteableSpace(4);
        if ((this.position & 3) == 0) {
            var view = new Float32Array(this.arraybytes);
            view[this.position >> 2] = b;
        }
        else {
            var view = new Float32Array(this.unalignedarraybytestemp, 0, 1);
            view[0] = b;
            var view2 = new Uint8Array(this.arraybytes, this.position, 4);
            var view3 = new Uint8Array(this.unalignedarraybytestemp, 0, 4);
            view2.set(view3);
        }
        this.position += 4;
        if (this.position > this.length) {
            this.length = this.position;
        }
    };
    ByteArray.prototype.readFloat = function () {
        if (this.position > this.length + 4) {
            throw "ByteArray out of bounds read. Positon=" + this.position + ", Length=" + this.length;
        }
        if ((this.position & 3) == 0) {
            var view = new Float32Array(this.arraybytes);
            var pa = this.position >> 2;
            this.position += 4;
            return view[pa];
        }
        else {
            var view = new Float32Array(this.unalignedarraybytestemp, 0, 1);
            var view2 = new Uint8Array(this.arraybytes, this.position, 4);
            var view3 = new Uint8Array(this.unalignedarraybytestemp, 0, 4);
            view3.set(view2);
            this.position += 4;
            return view[0];
        }
    };
    return ByteArray;
})(ByteArrayBase);
module.exports = ByteArray;


},{"awayjs-core/lib/utils/ByteArrayBase":60}],60:[function(require,module,exports){
var AbstractMethodError = require("awayjs-core/lib/errors/AbstractMethodError");
var ByteArrayBase = (function () {
    function ByteArrayBase() {
        this.position = 0;
        this.length = 0;
        this._mode = "";
    }
    ByteArrayBase.prototype.writeByte = function (b) {
        throw "Virtual method";
    };
    ByteArrayBase.prototype.readByte = function () {
        throw "Virtual method";
    };
    ByteArrayBase.prototype.writeUnsignedByte = function (b) {
        throw "Virtual method";
    };
    ByteArrayBase.prototype.readUnsignedByte = function () {
        throw "Virtual method";
    };
    ByteArrayBase.prototype.writeUnsignedShort = function (b) {
        throw "Virtual method";
    };
    ByteArrayBase.prototype.readUnsignedShort = function () {
        throw "Virtual method";
    };
    ByteArrayBase.prototype.writeUnsignedInt = function (b) {
        throw "Virtual method";
    };
    ByteArrayBase.prototype.readUnsignedInt = function () {
        throw "Virtual method";
    };
    ByteArrayBase.prototype.writeFloat = function (b) {
        throw "Virtual method";
    };
    ByteArrayBase.prototype.toFloatBits = function (x) {
        throw "Virtual method";
    };
    ByteArrayBase.prototype.readFloat = function (b) {
        throw "Virtual method";
    };
    ByteArrayBase.prototype.fromFloatBits = function (x) {
        throw "Virtual method";
    };
    ByteArrayBase.prototype.getBytesAvailable = function () {
        throw new AbstractMethodError('ByteArrayBase, getBytesAvailable() not implemented ');
    };
    ByteArrayBase.prototype.toString = function () {
        return "[ByteArray] ( " + this._mode + " ) position=" + this.position + " length=" + this.length;
    };
    ByteArrayBase.prototype.compareEqual = function (other, count) {
        if (count == undefined || count > this.length - this.position)
            count = this.length - this.position;
        if (count > other.length - other.position)
            count = other.length - other.position;
        var co0 = count;
        var r = true;
        while (r && count >= 4) {
            count -= 4;
            if (this.readUnsignedInt() != other.readUnsignedInt())
                r = false;
        }
        while (r && count >= 1) {
            count--;
            if (this.readUnsignedByte() != other.readUnsignedByte())
                r = false;
        }
        var c0;
        this.position -= (c0 - count);
        other.position -= (c0 - count);
        return r;
    };
    ByteArrayBase.prototype.writeBase64String = function (s) {
        for (var i = 0; i < s.length; i++) {
            var v = s.charAt(i);
        }
    };
    ByteArrayBase.prototype.dumpToConsole = function () {
        var oldpos = this.position;
        this.position = 0;
        var nstep = 8;
        function asHexString(x, digits) {
            var lut = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
            var sh = "";
            for (var d = 0; d < digits; d++) {
                sh = lut[(x >> (d << 2)) & 0xf] + sh;
            }
            return sh;
        }
        for (var i = 0; i < this.length; i += nstep) {
            var s = asHexString(i, 4) + ":";
            for (var j = 0; j < nstep && i + j < this.length; j++) {
                s += " " + asHexString(this.readUnsignedByte(), 2);
            }
            console.log(s);
        }
        this.position = oldpos;
    };
    ByteArrayBase.prototype.readBase64String = function (count) {
        if (count == undefined || count > this.length - this.position)
            count = this.length - this.position;
        if (!(count > 0))
            return "";
        return ByteArrayBase.internalGetBase64String(count, this.readUnsignedByte, this);
    };
    ByteArrayBase.internalGetBase64String = function (count, getUnsignedByteFunc, self) {
        var r = "";
        var b0, b1, b2, enc1, enc2, enc3, enc4;
        var base64Key = ByteArrayBase.Base64Key;
        while (count >= 3) {
            b0 = getUnsignedByteFunc.apply(self);
            b1 = getUnsignedByteFunc.apply(self);
            b2 = getUnsignedByteFunc.apply(self);
            enc1 = b0 >> 2;
            enc2 = ((b0 & 3) << 4) | (b1 >> 4);
            enc3 = ((b1 & 15) << 2) | (b2 >> 6);
            enc4 = b2 & 63;
            r += base64Key.charAt(enc1) + base64Key.charAt(enc2) + base64Key.charAt(enc3) + base64Key.charAt(enc4);
            count -= 3;
        }
        // pad
        if (count == 2) {
            b0 = getUnsignedByteFunc.apply(self);
            b1 = getUnsignedByteFunc.apply(self);
            enc1 = b0 >> 2;
            enc2 = ((b0 & 3) << 4) | (b1 >> 4);
            enc3 = ((b1 & 15) << 2);
            r += base64Key.charAt(enc1) + base64Key.charAt(enc2) + base64Key.charAt(enc3) + "=";
        }
        else if (count == 1) {
            b0 = getUnsignedByteFunc.apply(self);
            enc1 = b0 >> 2;
            enc2 = ((b0 & 3) << 4);
            r += base64Key.charAt(enc1) + base64Key.charAt(enc2) + "==";
        }
        return r;
    };
    ByteArrayBase.Base64Key = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    return ByteArrayBase;
})();
module.exports = ByteArrayBase;


},{"awayjs-core/lib/errors/AbstractMethodError":4}],61:[function(require,module,exports){
/**
 *
 */
var ColorUtils = (function () {
    function ColorUtils() {
    }
    ColorUtils.float32ColorToARGB = function (float32Color) {
        var a = (float32Color & 0xff000000) >>> 24;
        var r = (float32Color & 0xff0000) >>> 16;
        var g = (float32Color & 0xff00) >>> 8;
        var b = float32Color & 0xff;
        var result = [a, r, g, b];
        return result;
    };
    ColorUtils.componentToHex = function (c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    };
    ColorUtils.RGBToHexString = function (argb) {
        return "#" + ColorUtils.componentToHex(argb[1]) + ColorUtils.componentToHex(argb[2]) + ColorUtils.componentToHex(argb[3]);
    };
    ColorUtils.ARGBToHexString = function (argb) {
        return "#" + ColorUtils.componentToHex(argb[0]) + ColorUtils.componentToHex(argb[1]) + ColorUtils.componentToHex(argb[2]) + ColorUtils.componentToHex(argb[3]);
    };
    return ColorUtils;
})();
module.exports = ColorUtils;


},{}],62:[function(require,module,exports){
var TextureUtils = (function () {
    function TextureUtils() {
    }
    TextureUtils.isBitmapDataValid = function (bitmapData) {
        if (bitmapData == null) {
            return true;
        }
        return TextureUtils.isDimensionValid(bitmapData.width) && TextureUtils.isDimensionValid(bitmapData.height);
    };
    TextureUtils.isHTMLImageElementValid = function (image) {
        if (image == null)
            return true;
        return TextureUtils.isDimensionValid(image.width) && TextureUtils.isDimensionValid(image.height);
    };
    TextureUtils.isDimensionValid = function (d) {
        return d >= 1 && d <= TextureUtils.MAX_SIZE && TextureUtils.isPowerOfTwo(d);
    };
    TextureUtils.isPowerOfTwo = function (value) {
        return value ? ((value & -value) == value) : false;
    };
    TextureUtils.getBestPowerOf2 = function (value) {
        var p = 1;
        while (p < value)
            p <<= 1;
        if (p > TextureUtils.MAX_SIZE)
            p = TextureUtils.MAX_SIZE;
        return p;
    };
    TextureUtils.MAX_SIZE = 2048;
    return TextureUtils;
})();
module.exports = TextureUtils;


},{}],63:[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Error = require("awayjs-core/lib/errors/Error");
var EventDispatcher = require("awayjs-core/lib/events/EventDispatcher");
var TimerEvent = require("awayjs-core/lib/events/TimerEvent");
var Timer = (function (_super) {
    __extends(Timer, _super);
    function Timer(delay, repeatCount) {
        if (repeatCount === void 0) { repeatCount = 0; }
        _super.call(this);
        this._repeatCount = 0;
        this._currentCount = 0;
        this._running = false;
        this._delay = delay;
        this._repeatCount = repeatCount;
        if (isNaN(delay) || delay < 0) {
            throw new Error("Delay is negative or not a number");
        }
    }
    Object.defineProperty(Timer.prototype, "currentCount", {
        get: function () {
            return this._currentCount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Timer.prototype, "delay", {
        get: function () {
            return this._delay;
        },
        set: function (value) {
            this._delay = value;
            if (this._running) {
                this.stop();
                this.start();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Timer.prototype, "repeatCount", {
        get: function () {
            return this._repeatCount;
        },
        set: function (value) {
            this._repeatCount = value;
        },
        enumerable: true,
        configurable: true
    });
    Timer.prototype.reset = function () {
        if (this._running) {
            this.stop();
        }
        this._currentCount = 0;
    };
    Object.defineProperty(Timer.prototype, "running", {
        get: function () {
            return this._running;
        },
        enumerable: true,
        configurable: true
    });
    Timer.prototype.start = function () {
        var _this = this;
        this._running = true;
        clearInterval(this._iid);
        this._iid = setInterval(function () { return _this.tick(); }, this._delay);
    };
    Timer.prototype.stop = function () {
        this._running = false;
        clearInterval(this._iid);
    };
    Timer.prototype.tick = function () {
        this._currentCount++;
        if ((this._repeatCount > 0) && this._currentCount >= this._repeatCount) {
            this.stop();
            this.dispatchEvent(new TimerEvent(TimerEvent.TIMER));
            this.dispatchEvent(new TimerEvent(TimerEvent.TIMER_COMPLETE));
        }
        else {
            this.dispatchEvent(new TimerEvent(TimerEvent.TIMER));
        }
    };
    return Timer;
})(EventDispatcher);
module.exports = Timer;


},{"awayjs-core/lib/errors/Error":6,"awayjs-core/lib/events/EventDispatcher":10,"awayjs-core/lib/events/TimerEvent":17}],64:[function(require,module,exports){
/**
 *
 *
 * @returns {number}
 */
function getTimer() {
    // number milliseconds of 1970/01/01
    // this different to AS3 implementation which gets the number of milliseconds
    // since instance of Flash player was initialised
    return Date.now();
}
module.exports = getTimer;


},{}],"awayjs-core\\lib\\base\\BitmapDataChannel":[function(require,module,exports){
module.exports=require(2)
},{"..\\awayjs-core\\lib\\base\\BitmapDataChannel.js":2}],"awayjs-core\\lib\\base\\BitmapData":[function(require,module,exports){
module.exports=require(1)
},{"..\\awayjs-core\\lib\\base\\BitmapData.js":1,"awayjs-core/lib/geom/Rectangle":25,"awayjs-core/lib/utils/ColorUtils":61}],"awayjs-core\\lib\\bounds\\AxisAlignedBoundingBox":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var BoundingVolumeBase = require("awayjs-core/lib/bounds/BoundingVolumeBase");
var Matrix3DUtils = require("awayjs-core/lib/geom/Matrix3DUtils");
var PlaneClassification = require("awayjs-core/lib/geom/PlaneClassification");
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
/**
 * AxisAlignedBoundingBox represents a bounding box volume that has its planes aligned to the local coordinate axes of the bounded object.
 * This is useful for most meshes.
 */
var AxisAlignedBoundingBox = (function (_super) {
    __extends(AxisAlignedBoundingBox, _super);
    /**
     * Creates a new <code>AxisAlignedBoundingBox</code> object.
     */
    function AxisAlignedBoundingBox() {
        _super.call(this);
        this._centerX = 0;
        this._centerY = 0;
        this._centerZ = 0;
        this._halfExtentsX = 0;
        this._halfExtentsY = 0;
        this._halfExtentsZ = 0;
    }
    Object.defineProperty(AxisAlignedBoundingBox.prototype, "centerX", {
        get: function () {
            return this._centerX;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisAlignedBoundingBox.prototype, "centerY", {
        get: function () {
            return this._centerY;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisAlignedBoundingBox.prototype, "centerZ", {
        get: function () {
            return this._centerZ;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @inheritDoc
     */
    AxisAlignedBoundingBox.prototype.nullify = function () {
        _super.prototype.nullify.call(this);
        this._centerX = this._centerY = this._centerZ = 0;
        this._halfExtentsX = this._halfExtentsY = this._halfExtentsZ = 0;
    };
    /**
     * @inheritDoc
     */
    AxisAlignedBoundingBox.prototype.isInFrustum = function (planes, numPlanes) {
        for (var i = 0; i < numPlanes; ++i) {
            var plane = planes[i];
            var a = plane.a;
            var b = plane.b;
            var c = plane.c;
            var flippedExtentX = a < 0 ? -this._halfExtentsX : this._halfExtentsX;
            var flippedExtentY = b < 0 ? -this._halfExtentsY : this._halfExtentsY;
            var flippedExtentZ = c < 0 ? -this._halfExtentsZ : this._halfExtentsZ;
            var projDist = a * (this._centerX + flippedExtentX) + b * (this._centerY + flippedExtentY) + c * (this._centerZ + flippedExtentZ) - plane.d;
            if (projDist < 0)
                return false;
        }
        return true;
    };
    AxisAlignedBoundingBox.prototype.rayIntersection = function (position, direction, targetNormal) {
        if (this.containsPoint(position))
            return 0;
        var px = position.x - this._centerX;
        var py = position.y - this._centerY;
        var pz = position.z - this._centerZ;
        var vx = direction.x;
        var vy = direction.y;
        var vz = direction.z;
        var ix;
        var iy;
        var iz;
        var rayEntryDistance;
        // ray-plane tests
        var intersects;
        if (vx < 0) {
            rayEntryDistance = (this._halfExtentsX - px) / vx;
            if (rayEntryDistance > 0) {
                iy = py + rayEntryDistance * vy;
                iz = pz + rayEntryDistance * vz;
                if (iy > -this._halfExtentsY && iy < this._halfExtentsY && iz > -this._halfExtentsZ && iz < this._halfExtentsZ) {
                    targetNormal.x = 1;
                    targetNormal.y = 0;
                    targetNormal.z = 0;
                    intersects = true;
                }
            }
        }
        if (!intersects && vx > 0) {
            rayEntryDistance = (-this._halfExtentsX - px) / vx;
            if (rayEntryDistance > 0) {
                iy = py + rayEntryDistance * vy;
                iz = pz + rayEntryDistance * vz;
                if (iy > -this._halfExtentsY && iy < this._halfExtentsY && iz > -this._halfExtentsZ && iz < this._halfExtentsZ) {
                    targetNormal.x = -1;
                    targetNormal.y = 0;
                    targetNormal.z = 0;
                    intersects = true;
                }
            }
        }
        if (!intersects && vy < 0) {
            rayEntryDistance = (this._halfExtentsY - py) / vy;
            if (rayEntryDistance > 0) {
                ix = px + rayEntryDistance * vx;
                iz = pz + rayEntryDistance * vz;
                if (ix > -this._halfExtentsX && ix < this._halfExtentsX && iz > -this._halfExtentsZ && iz < this._halfExtentsZ) {
                    targetNormal.x = 0;
                    targetNormal.y = 1;
                    targetNormal.z = 0;
                    intersects = true;
                }
            }
        }
        if (!intersects && vy > 0) {
            rayEntryDistance = (-this._halfExtentsY - py) / vy;
            if (rayEntryDistance > 0) {
                ix = px + rayEntryDistance * vx;
                iz = pz + rayEntryDistance * vz;
                if (ix > -this._halfExtentsX && ix < this._halfExtentsX && iz > -this._halfExtentsZ && iz < this._halfExtentsZ) {
                    targetNormal.x = 0;
                    targetNormal.y = -1;
                    targetNormal.z = 0;
                    intersects = true;
                }
            }
        }
        if (!intersects && vz < 0) {
            rayEntryDistance = (this._halfExtentsZ - pz) / vz;
            if (rayEntryDistance > 0) {
                ix = px + rayEntryDistance * vx;
                iy = py + rayEntryDistance * vy;
                if (iy > -this._halfExtentsY && iy < this._halfExtentsY && ix > -this._halfExtentsX && ix < this._halfExtentsX) {
                    targetNormal.x = 0;
                    targetNormal.y = 0;
                    targetNormal.z = 1;
                    intersects = true;
                }
            }
        }
        if (!intersects && vz > 0) {
            rayEntryDistance = (-this._halfExtentsZ - pz) / vz;
            if (rayEntryDistance > 0) {
                ix = px + rayEntryDistance * vx;
                iy = py + rayEntryDistance * vy;
                if (iy > -this._halfExtentsY && iy < this._halfExtentsY && ix > -this._halfExtentsX && ix < this._halfExtentsX) {
                    targetNormal.x = 0;
                    targetNormal.y = 0;
                    targetNormal.z = -1;
                    intersects = true;
                }
            }
        }
        return intersects ? rayEntryDistance : -1;
    };
    /**
     * @inheritDoc
     */
    AxisAlignedBoundingBox.prototype.containsPoint = function (position) {
        var px = position.x - this._centerX, py = position.y - this._centerY, pz = position.z - this._centerZ;
        return px <= this._halfExtentsX && px >= -this._halfExtentsX && py <= this._halfExtentsY && py >= -this._halfExtentsY && pz <= this._halfExtentsZ && pz >= -this._halfExtentsZ;
    };
    /**
     * @inheritDoc
     */
    AxisAlignedBoundingBox.prototype.fromExtremes = function (minX, minY, minZ, maxX, maxY, maxZ) {
        this._centerX = (maxX + minX) * .5;
        this._centerY = (maxY + minY) * .5;
        this._centerZ = (maxZ + minZ) * .5;
        this._halfExtentsX = (maxX - minX) * .5;
        this._halfExtentsY = (maxY - minY) * .5;
        this._halfExtentsZ = (maxZ - minZ) * .5;
        _super.prototype.fromExtremes.call(this, minX, minY, minZ, maxX, maxY, maxZ);
    };
    /**
     * @inheritDoc
     */
    AxisAlignedBoundingBox.prototype.clone = function () {
        var clone = new AxisAlignedBoundingBox();
        clone.fromExtremes(this._aabb.x, this._aabb.y + this._aabb.height, this._aabb.z, this._aabb.x + this._aabb.width, this._aabb.y, this._aabb.z + this._aabb.depth);
        return clone;
    };
    Object.defineProperty(AxisAlignedBoundingBox.prototype, "halfExtentsX", {
        get: function () {
            return this._halfExtentsX;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisAlignedBoundingBox.prototype, "halfExtentsY", {
        get: function () {
            return this._halfExtentsY;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AxisAlignedBoundingBox.prototype, "halfExtentsZ", {
        get: function () {
            return this._halfExtentsZ;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Finds the closest point on the bounding volume to another given point. This can be used for maximum error calculations for content within a given bound.
     * @param point The point for which to find the closest point on the bounding volume
     * @param target An optional Vector3D to store the result to prevent creating a new object.
     * @return
     */
    AxisAlignedBoundingBox.prototype.closestPointToPoint = function (point, target) {
        if (target === void 0) { target = null; }
        var p;
        if (target == null)
            target = new Vector3D();
        p = point.x;
        if (p < this._aabb.x)
            p = this._aabb.x;
        if (p > this._aabb.x + this._aabb.width)
            p = this._aabb.x + this._aabb.width;
        target.x = p;
        p = point.y;
        if (p < this._aabb.y + this._aabb.height)
            p = this._aabb.y + this._aabb.height;
        if (p > this._aabb.y)
            p = this._aabb.y;
        target.y = p;
        p = point.z;
        if (p < this._aabb.z)
            p = this._aabb.z;
        if (p > this._aabb.z + this._aabb.depth)
            p = this._aabb.z + this._aabb.depth;
        target.z = p;
        return target;
    };
    AxisAlignedBoundingBox.prototype.classifyToPlane = function (plane) {
        var a = plane.a;
        var b = plane.b;
        var c = plane.c;
        var centerDistance = a * this._centerX + b * this._centerY + c * this._centerZ - plane.d;
        if (a < 0)
            a = -a;
        if (b < 0)
            b = -b;
        if (c < 0)
            c = -c;
        var boundOffset = a * this._halfExtentsX + b * this._halfExtentsY + c * this._halfExtentsZ;
        return centerDistance > boundOffset ? PlaneClassification.FRONT : centerDistance < -boundOffset ? PlaneClassification.BACK : PlaneClassification.INTERSECT;
    };
    AxisAlignedBoundingBox.prototype.transformFrom = function (bounds, matrix) {
        var aabb = bounds;
        var cx = aabb._centerX;
        var cy = aabb._centerY;
        var cz = aabb._centerZ;
        var raw = Matrix3DUtils.RAW_DATA_CONTAINER;
        matrix.copyRawDataTo(raw);
        var m11 = raw[0], m12 = raw[4], m13 = raw[8], m14 = raw[12];
        var m21 = raw[1], m22 = raw[5], m23 = raw[9], m24 = raw[13];
        var m31 = raw[2], m32 = raw[6], m33 = raw[10], m34 = raw[14];
        this._centerX = cx * m11 + cy * m12 + cz * m13 + m14;
        this._centerY = cx * m21 + cy * m22 + cz * m23 + m24;
        this._centerZ = cx * m31 + cy * m32 + cz * m33 + m34;
        if (m11 < 0)
            m11 = -m11;
        if (m12 < 0)
            m12 = -m12;
        if (m13 < 0)
            m13 = -m13;
        if (m21 < 0)
            m21 = -m21;
        if (m22 < 0)
            m22 = -m22;
        if (m23 < 0)
            m23 = -m23;
        if (m31 < 0)
            m31 = -m31;
        if (m32 < 0)
            m32 = -m32;
        if (m33 < 0)
            m33 = -m33;
        var hx = aabb._halfExtentsX;
        var hy = aabb._halfExtentsY;
        var hz = aabb._halfExtentsZ;
        this._halfExtentsX = hx * m11 + hy * m12 + hz * m13;
        this._halfExtentsY = hx * m21 + hy * m22 + hz * m23;
        this._halfExtentsZ = hx * m31 + hy * m32 + hz * m33;
        this._aabb.width = this._aabb.height = this._aabb.depth = this._halfExtentsX * 2;
        this._aabb.x = this._centerX - this._halfExtentsX;
        this._aabb.y = this._centerY + this._halfExtentsY;
        this._aabb.z = this._centerZ - this._halfExtentsZ;
    };
    return AxisAlignedBoundingBox;
})(BoundingVolumeBase);
module.exports = AxisAlignedBoundingBox;


},{"awayjs-core/lib/bounds/BoundingVolumeBase":3,"awayjs-core/lib/geom/Matrix3DUtils":21,"awayjs-core/lib/geom/PlaneClassification":23,"awayjs-core/lib/geom/Vector3D":26}],"awayjs-core\\lib\\bounds\\BoundingSphere":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var BoundingVolumeBase = require("awayjs-core/lib/bounds/BoundingVolumeBase");
var PlaneClassification = require("awayjs-core/lib/geom/PlaneClassification");
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var BoundingSphere = (function (_super) {
    __extends(BoundingSphere, _super);
    function BoundingSphere() {
        _super.call(this);
        this._radius = 0;
        this._centerX = 0;
        this._centerY = 0;
        this._centerZ = 0;
    }
    Object.defineProperty(BoundingSphere.prototype, "radius", {
        get: function () {
            return this._radius;
        },
        enumerable: true,
        configurable: true
    });
    BoundingSphere.prototype.nullify = function () {
        _super.prototype.nullify.call(this);
        this._centerX = this._centerY = this._centerZ = 0;
        this._radius = 0;
    };
    BoundingSphere.prototype.isInFrustum = function (planes, numPlanes) {
        for (var i = 0; i < numPlanes; ++i) {
            var plane = planes[i];
            var flippedExtentX = plane.a < 0 ? -this._radius : this._radius;
            var flippedExtentY = plane.b < 0 ? -this._radius : this._radius;
            var flippedExtentZ = plane.c < 0 ? -this._radius : this._radius;
            var projDist = plane.a * (this._centerX + flippedExtentX) + plane.b * (this._centerY + flippedExtentY) + plane.c * (this._centerZ + flippedExtentZ) - plane.d;
            if (projDist < 0) {
                return false;
            }
        }
        return true;
    };
    BoundingSphere.prototype.fromSphere = function (center, radius) {
        this._centerX = center.x;
        this._centerY = center.y;
        this._centerZ = center.z;
        this._radius = radius;
        this._aabb.width = this._aabb.height = this._aabb.depth = radius * 2;
        this._aabb.x = this._centerX - radius;
        this._aabb.y = this._centerY + radius;
        this._aabb.z = this._centerZ - radius;
        this._pAabbPointsDirty = true;
    };
    BoundingSphere.prototype.fromExtremes = function (minX, minY, minZ, maxX, maxY, maxZ) {
        this._centerX = (maxX + minX) * .5;
        this._centerY = (maxY + minY) * .5;
        this._centerZ = (maxZ + minZ) * .5;
        var d = maxX - minX;
        var y = maxY - minY;
        var z = maxZ - minZ;
        if (y > d)
            d = y;
        if (z > d)
            d = z;
        this._radius = d * Math.sqrt(.5);
        _super.prototype.fromExtremes.call(this, minX, minY, minZ, maxX, maxY, maxZ);
    };
    BoundingSphere.prototype.clone = function () {
        var clone = new BoundingSphere();
        clone.fromSphere(new Vector3D(this._centerX, this._centerY, this._centerZ), this._radius);
        return clone;
    };
    BoundingSphere.prototype.rayIntersection = function (position, direction, targetNormal) {
        if (this.containsPoint(position)) {
            return 0;
        }
        var px = position.x - this._centerX, py = position.y - this._centerY, pz = position.z - this._centerZ;
        var vx = direction.x, vy = direction.y, vz = direction.z;
        var rayEntryDistance;
        var a = vx * vx + vy * vy + vz * vz;
        var b = 2 * (px * vx + py * vy + pz * vz);
        var c = px * px + py * py + pz * pz - this._radius * this._radius;
        var det = b * b - 4 * a * c;
        if (det >= 0) {
            var sqrtDet = Math.sqrt(det);
            rayEntryDistance = (-b - sqrtDet) / (2 * a);
            if (rayEntryDistance >= 0) {
                targetNormal.x = px + rayEntryDistance * vx;
                targetNormal.y = py + rayEntryDistance * vy;
                targetNormal.z = pz + rayEntryDistance * vz;
                targetNormal.normalize();
                return rayEntryDistance;
            }
        }
        // ray misses sphere
        return -1;
    };
    BoundingSphere.prototype.containsPoint = function (position) {
        var px = position.x - this._centerX;
        var py = position.y - this._centerY;
        var pz = position.z - this._centerZ;
        var distance = Math.sqrt(px * px + py * py + pz * pz);
        return distance <= this._radius;
    };
    //@override
    BoundingSphere.prototype.classifyToPlane = function (plane) {
        var a = plane.a;
        var b = plane.b;
        var c = plane.c;
        var dd = a * this._centerX + b * this._centerY + c * this._centerZ - plane.d;
        if (a < 0)
            a = -a;
        if (b < 0)
            b = -b;
        if (c < 0)
            c = -c;
        var rr = (a + b + c) * this._radius;
        return dd > rr ? PlaneClassification.FRONT : dd < -rr ? PlaneClassification.BACK : PlaneClassification.INTERSECT;
    };
    BoundingSphere.prototype.transformFrom = function (bounds, matrix) {
        var sphere = bounds;
        var cx = sphere._centerX;
        var cy = sphere._centerY;
        var cz = sphere._centerZ;
        var raw = new Array(16);
        matrix.copyRawDataTo(raw);
        var m11 = raw[0], m12 = raw[4], m13 = raw[8], m14 = raw[12];
        var m21 = raw[1], m22 = raw[5], m23 = raw[9], m24 = raw[13];
        var m31 = raw[2], m32 = raw[6], m33 = raw[10], m34 = raw[14];
        this._centerX = cx * m11 + cy * m12 + cz * m13 + m14;
        this._centerY = cx * m21 + cy * m22 + cz * m23 + m24;
        this._centerZ = cx * m31 + cy * m32 + cz * m33 + m34;
        if (m11 < 0)
            m11 = -m11;
        if (m12 < 0)
            m12 = -m12;
        if (m13 < 0)
            m13 = -m13;
        if (m21 < 0)
            m21 = -m21;
        if (m22 < 0)
            m22 = -m22;
        if (m23 < 0)
            m23 = -m23;
        if (m31 < 0)
            m31 = -m31;
        if (m32 < 0)
            m32 = -m32;
        if (m33 < 0)
            m33 = -m33;
        var r = sphere._radius;
        var rx = m11 + m12 + m13;
        var ry = m21 + m22 + m23;
        var rz = m31 + m32 + m33;
        this._radius = r * Math.sqrt(rx * rx + ry * ry + rz * rz);
        this._aabb.width = this._aabb.height = this._aabb.depth = this._radius * 2;
        this._aabb.x = this._centerX - this._radius;
        this._aabb.y = this._centerY + this._radius;
        this._aabb.z = this._centerZ - this._radius;
    };
    return BoundingSphere;
})(BoundingVolumeBase);
module.exports = BoundingSphere;


},{"awayjs-core/lib/bounds/BoundingVolumeBase":3,"awayjs-core/lib/geom/PlaneClassification":23,"awayjs-core/lib/geom/Vector3D":26}],"awayjs-core\\lib\\bounds\\BoundingVolumeBase":[function(require,module,exports){
module.exports=require(3)
},{"..\\awayjs-core\\lib\\bounds\\BoundingVolumeBase.js":3,"awayjs-core/lib/errors/AbstractMethodError":4,"awayjs-core/lib/geom/Box":18}],"awayjs-core\\lib\\bounds\\NullBounds":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var BoundingVolumeBase = require("awayjs-core/lib/bounds/BoundingVolumeBase");
var PlaneClassification = require("awayjs-core/lib/geom/PlaneClassification");
var NullBounds = (function (_super) {
    __extends(NullBounds, _super);
    function NullBounds(alwaysIn) {
        if (alwaysIn === void 0) { alwaysIn = true; }
        _super.call(this);
        this._alwaysIn = alwaysIn;
        this._aabb.width = this._aabb.height = this._aabb.depth = Number.POSITIVE_INFINITY;
        this._aabb.x = this._aabb.y = this._aabb.z = this._alwaysIn ? Number.NEGATIVE_INFINITY / 2 : Number.POSITIVE_INFINITY;
    }
    //@override
    NullBounds.prototype.clone = function () {
        return new NullBounds(this._alwaysIn);
    };
    //@override
    NullBounds.prototype.isInFrustum = function (planes, numPlanes) {
        return this._alwaysIn;
    };
    //		//@override
    //		public fromGeometry(geometry:away.base.Geometry)
    //		{
    //		}
    //@override
    NullBounds.prototype.fromSphere = function (center, radius) {
    };
    //@override
    NullBounds.prototype.fromExtremes = function (minX, minY, minZ, maxX, maxY, maxZ) {
    };
    NullBounds.prototype.classifyToPlane = function (plane) {
        return PlaneClassification.INTERSECT;
    };
    //@override
    NullBounds.prototype.transformFrom = function (bounds, matrix) {
        this._alwaysIn = bounds._alwaysIn;
    };
    return NullBounds;
})(BoundingVolumeBase);
module.exports = NullBounds;


},{"awayjs-core/lib/bounds/BoundingVolumeBase":3,"awayjs-core/lib/geom/PlaneClassification":23}],"awayjs-core\\lib\\errors\\AbstractMethodError":[function(require,module,exports){
module.exports=require(4)
},{"..\\awayjs-core\\lib\\errors\\AbstractMethodError.js":4,"awayjs-core/lib/errors/Error":6}],"awayjs-core\\lib\\errors\\ArgumentError":[function(require,module,exports){
module.exports=require(5)
},{"..\\awayjs-core\\lib\\errors\\ArgumentError.js":5,"awayjs-core/lib/errors/Error":6}],"awayjs-core\\lib\\errors\\DocumentError":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Error = require("awayjs-core/lib/errors/Error");
var DocumentError = (function (_super) {
    __extends(DocumentError, _super);
    function DocumentError(message, id) {
        if (message === void 0) { message = "DocumentError"; }
        if (id === void 0) { id = 0; }
        _super.call(this, message, id);
    }
    DocumentError.DOCUMENT_DOES_NOT_EXIST = "documentDoesNotExist";
    return DocumentError;
})(Error);
module.exports = DocumentError;


},{"awayjs-core/lib/errors/Error":6}],"awayjs-core\\lib\\errors\\Error":[function(require,module,exports){
module.exports=require(6)
},{"..\\awayjs-core\\lib\\errors\\Error.js":6}],"awayjs-core\\lib\\errors\\PartialImplementationError":[function(require,module,exports){
module.exports=require(7)
},{"..\\awayjs-core\\lib\\errors\\PartialImplementationError.js":7,"awayjs-core/lib/errors/Error":6}],"awayjs-core\\lib\\errors\\RangeError":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Error = require("awayjs-core/lib/errors/Error");
/**
 * RangeError is thrown when an index is accessed out of range of the number of
 * available indices on an Array.
 */
var RangeError = (function (_super) {
    __extends(RangeError, _super);
    /**
     * Create a new RangeError.
     *
     * @param message An optional message to override the default error message.
     * @param id The id of the error.
     */
    function RangeError(message, id) {
        if (message === void 0) { message = null; }
        if (id === void 0) { id = 0; }
        _super.call(this, message || "RangeError", id);
    }
    return RangeError;
})(Error);
module.exports = RangeError;


},{"awayjs-core/lib/errors/Error":6}],"awayjs-core\\lib\\events\\AssetEvent":[function(require,module,exports){
module.exports=require(8)
},{"..\\awayjs-core\\lib\\events\\AssetEvent.js":8,"awayjs-core/lib/events/Event":9}],"awayjs-core\\lib\\events\\EventDispatcher":[function(require,module,exports){
module.exports=require(10)
},{"..\\awayjs-core\\lib\\events\\EventDispatcher.js":10}],"awayjs-core\\lib\\events\\Event":[function(require,module,exports){
module.exports=require(9)
},{"..\\awayjs-core\\lib\\events\\Event.js":9}],"awayjs-core\\lib\\events\\HTTPStatusEvent":[function(require,module,exports){
module.exports=require(11)
},{"..\\awayjs-core\\lib\\events\\HTTPStatusEvent.js":11,"awayjs-core/lib/events/Event":9}],"awayjs-core\\lib\\events\\IEventDispatcher":[function(require,module,exports){



},{}],"awayjs-core\\lib\\events\\IOErrorEvent":[function(require,module,exports){
module.exports=require(12)
},{"..\\awayjs-core\\lib\\events\\IOErrorEvent.js":12,"awayjs-core/lib/events/Event":9}],"awayjs-core\\lib\\events\\LoaderEvent":[function(require,module,exports){
module.exports=require(13)
},{"..\\awayjs-core\\lib\\events\\LoaderEvent.js":13,"awayjs-core/lib/events/Event":9}],"awayjs-core\\lib\\events\\ParserEvent":[function(require,module,exports){
module.exports=require(14)
},{"..\\awayjs-core\\lib\\events\\ParserEvent.js":14,"awayjs-core/lib/events/Event":9}],"awayjs-core\\lib\\events\\ProgressEvent":[function(require,module,exports){
module.exports=require(15)
},{"..\\awayjs-core\\lib\\events\\ProgressEvent.js":15,"awayjs-core/lib/events/Event":9}],"awayjs-core\\lib\\events\\ProjectionEvent":[function(require,module,exports){
module.exports=require(16)
},{"..\\awayjs-core\\lib\\events\\ProjectionEvent.js":16,"awayjs-core/lib/events/Event":9}],"awayjs-core\\lib\\events\\TimerEvent":[function(require,module,exports){
module.exports=require(17)
},{"..\\awayjs-core\\lib\\events\\TimerEvent.js":17,"awayjs-core/lib/events/Event":9}],"awayjs-core\\lib\\geom\\Box":[function(require,module,exports){
module.exports=require(18)
},{"..\\awayjs-core\\lib\\geom\\Box.js":18,"awayjs-core/lib/geom/Vector3D":26}],"awayjs-core\\lib\\geom\\ColorTransform":[function(require,module,exports){
var ColorUtils = require("awayjs-core/lib/utils/ColorUtils");
/**
 * The ColorTransform class lets you adjust the color values in a display
 * object. The color adjustment or <i>color transformation</i> can be applied
 * to all four channels: red, green, blue, and alpha transparency.
 *
 * <p>When a ColorTransform object is applied to a display object, a new value
 * for each color channel is calculated like this:</p>
 *
 * <ul>
 *   <li>New red value = (old red value * <code>redMultiplier</code>) +
 * <code>redOffset</code></li>
 *   <li>New green value = (old green value * <code>greenMultiplier</code>) +
 * <code>greenOffset</code></li>
 *   <li>New blue value = (old blue value * <code>blueMultiplier</code>) +
 * <code>blueOffset</code></li>
 *   <li>New alpha value = (old alpha value * <code>alphaMultiplier</code>) +
 * <code>alphaOffset</code></li>
 * </ul>
 *
 * <p>If any of the color channel values is greater than 255 after the
 * calculation, it is set to 255. If it is less than 0, it is set to 0.</p>
 *
 * <p>You can use ColorTransform objects in the following ways:</p>
 *
 * <ul>
 *   <li>In the <code>colorTransform</code> parameter of the
 * <code>colorTransform()</code> method of the BitmapData class</li>
 *   <li>As the <code>colorTransform</code> property of a Transform object
 * (which can be used as the <code>transform</code> property of a display
 * object)</li>
 * </ul>
 *
 * <p>You must use the <code>new ColorTransform()</code> constructor to create
 * a ColorTransform object before you can call the methods of the
 * ColorTransform object.</p>
 *
 * <p>Color transformations do not apply to the background color of a movie
 * clip(such as a loaded SWF object). They apply only to graphics and symbols
 * that are attached to the movie clip.</p>
 */
var ColorTransform = (function () {
    /**
     * Creates a ColorTransform object for a display object with the specified
     * color channel values and alpha values.
     *
     * @param redMultiplier   The value for the red multiplier, in the range from
     *                        0 to 1.
     * @param greenMultiplier The value for the green multiplier, in the range
     *                        from 0 to 1.
     * @param blueMultiplier  The value for the blue multiplier, in the range
     *                        from 0 to 1.
     * @param alphaMultiplier The value for the alpha transparency multiplier, in
     *                        the range from 0 to 1.
     * @param redOffset       The offset value for the red color channel, in the
     *                        range from -255 to 255.
     * @param greenOffset     The offset value for the green color channel, in
     *                        the range from -255 to 255.
     * @param blueOffset      The offset for the blue color channel value, in the
     *                        range from -255 to 255.
     * @param alphaOffset     The offset for alpha transparency channel value, in
     *                        the range from -255 to 255.
     */
    function ColorTransform(redMultiplier, greenMultiplier, blueMultiplier, alphaMultiplier, redOffset, greenOffset, blueOffset, alphaOffset) {
        if (redMultiplier === void 0) { redMultiplier = 1; }
        if (greenMultiplier === void 0) { greenMultiplier = 1; }
        if (blueMultiplier === void 0) { blueMultiplier = 1; }
        if (alphaMultiplier === void 0) { alphaMultiplier = 1; }
        if (redOffset === void 0) { redOffset = 0; }
        if (greenOffset === void 0) { greenOffset = 0; }
        if (blueOffset === void 0) { blueOffset = 0; }
        if (alphaOffset === void 0) { alphaOffset = 0; }
        this.redMultiplier = redMultiplier;
        this.greenMultiplier = greenMultiplier;
        this.blueMultiplier = blueMultiplier;
        this.alphaMultiplier = alphaMultiplier;
        this.redOffset = redOffset;
        this.greenOffset = greenOffset;
        this.blueOffset = blueOffset;
        this.alphaOffset = alphaOffset;
    }
    Object.defineProperty(ColorTransform.prototype, "color", {
        /**
         * The RGB color value for a ColorTransform object.
         *
         * <p>When you set this property, it changes the three color offset values
         * (<code>redOffset</code>, <code>greenOffset</code>, and
         * <code>blueOffset</code>) accordingly, and it sets the three color
         * multiplier values(<code>redMultiplier</code>,
         * <code>greenMultiplier</code>, and <code>blueMultiplier</code>) to 0. The
         * alpha transparency multiplier and offset values do not change.</p>
         *
         * <p>When you pass a value for this property, use the format
         * 0x<i>RRGGBB</i>. <i>RR</i>, <i>GG</i>, and <i>BB</i> each consist of two
         * hexadecimal digits that specify the offset of each color component. The 0x
         * tells the ActionScript compiler that the number is a hexadecimal
         * value.</p>
         */
        get: function () {
            return ((this.redOffset << 16) | (this.greenOffset << 8) | this.blueOffset);
        },
        set: function (value) {
            var argb = ColorUtils.float32ColorToARGB(value);
            this.redOffset = argb[1]; //(value >> 16) & 0xFF;
            this.greenOffset = argb[2]; //(value >> 8) & 0xFF;
            this.blueOffset = argb[3]; //value & 0xFF;
            this.redMultiplier = 0;
            this.greenMultiplier = 0;
            this.blueMultiplier = 0;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Concatenates the ColorTranform object specified by the <code>second</code>
     * parameter with the current ColorTransform object and sets the current
     * object as the result, which is an additive combination of the two color
     * transformations. When you apply the concatenated ColorTransform object,
     * the effect is the same as applying the <code>second</code> color
     * transformation after the <i>original</i> color transformation.
     *
     * @param second The ColorTransform object to be combined with the current
     *               ColorTransform object.
     */
    ColorTransform.prototype.concat = function (second) {
        this.redMultiplier += second.redMultiplier;
        this.greenMultiplier += second.greenMultiplier;
        this.blueMultiplier += second.blueMultiplier;
        this.alphaMultiplier += second.alphaMultiplier;
    };
    return ColorTransform;
})();
module.exports = ColorTransform;


},{"awayjs-core/lib/utils/ColorUtils":61}],"awayjs-core\\lib\\geom\\MathConsts":[function(require,module,exports){
/**
* MathConsts provides some commonly used mathematical constants
*/
var MathConsts = (function () {
    function MathConsts() {
    }
    /**
     * The amount to multiply with when converting radians to degrees.
     */
    MathConsts.RADIANS_TO_DEGREES = 180 / Math.PI;
    /**
     * The amount to multiply with when converting degrees to radians.
     */
    MathConsts.DEGREES_TO_RADIANS = Math.PI / 180;
    return MathConsts;
})();
module.exports = MathConsts;


},{}],"awayjs-core\\lib\\geom\\Matrix3DUtils":[function(require,module,exports){
module.exports=require(21)
},{"..\\awayjs-core\\lib\\geom\\Matrix3DUtils.js":21,"awayjs-core/lib/geom/Matrix3D":20,"awayjs-core/lib/geom/Vector3D":26}],"awayjs-core\\lib\\geom\\Matrix3D":[function(require,module,exports){
module.exports=require(20)
},{"..\\awayjs-core\\lib\\geom\\Matrix3D.js":20,"awayjs-core/lib/errors/ArgumentError":5,"awayjs-core/lib/geom/Orientation3D":22,"awayjs-core/lib/geom/Vector3D":26}],"awayjs-core\\lib\\geom\\Matrix":[function(require,module,exports){
module.exports=require(19)
},{"..\\awayjs-core\\lib\\geom\\Matrix.js":19,"awayjs-core/lib/errors/ArgumentError":5,"awayjs-core/lib/geom/Point":24}],"awayjs-core\\lib\\geom\\Orientation3D":[function(require,module,exports){
module.exports=require(22)
},{"..\\awayjs-core\\lib\\geom\\Orientation3D.js":22}],"awayjs-core\\lib\\geom\\PerspectiveProjection":[function(require,module,exports){
/**
 * <p>The PerspectiveProjection class provides an easy way to assign or modify
 * the perspective transformations of a display object and all of its
 * children. For more complex or custom perspective transformations, use the
 * Matrix3D class. While the PerspectiveProjection class provides basic
 * three-dimensional presentation properties, the Matrix3D class provides more
 * detailed control over the three-dimensional presentation of display objects.
 * </p>
 *
 * <p>Projection is a way of representing a three-dimensional object in a
 * two-dimensional space, like a cube projected onto a computer screen.
 * Perspective projection uses a viewing frustum (a rectangular pyramid) to
 * model and project a three-dimensional world and its objects on the screen.
 * The viewing frustum becomes increasingly wider as it moves further from the
 * origin of the viewpoint. The origin of the viewpoint could be a camera or
 * the eyes of an observer facing the screen. The projected perspective
 * produces the illusion of three dimensions with depth and distance, where
 * the objects closer to the screen appear larger than the objects farther
 * from the screen.</p>
 *
 * <p>A default PerspectiveProjection object is a framework defined for
 * perspective transformation of the root object, based on the field of view
 * and aspect ratio (dimensions) of the stage. The projection center, the
 * vanishing point, is set to the center of the stage, which means the
 * three-dimensional display objects disappear toward the center of the stage
 * as they move back in the z axis. The default viewpoint is at point (0,0)
 * looking down the positive z axis. The y-axis points down toward the bottom
 * of the screen. You can gain access to the root display object's perspective
 * projection settings and change the field of view and projection center
 * properties of the perspectiveProjection property through the root object's
 * <code>DisplayObject.transform</code> property.</p>
 *
 * <p>You can also set a different perspective projection setting for a
 * display object through the parent's perspective projection. First, create a
 * PerspectiveProjection object and set its <code>fieldOfView</code> and
 * <code>projectionCenter</code> properties. Next, assign the
 * PerspectiveProjection object to the parent display object using the
 * <code>DisplayObject.transform</code> property. The specified projection
 * matrix and transformation will then apply to all the display object's
 * three-dimensional children.</p>
 *
 * <p>To modify a perspective projection of the stage or root object: use the
 * <code>transform.matrix</code> property of the root display object to gain
 * access to the PerspectiveProjection object. Or, apply different perspective
 * projection properties to a display object by setting the perspective
 * projection properties of the display object's parent. The child display
 * object inherits the new properties. Specifically, create a
 * PerspectiveProjection object and set its properties, then assign the
 * PerspectiveProjection object to the <code>perspectiveProjection</code>
 * property of the parent display object's <code>transform</code> property.
 * The specified projection transformation then applies to all the display
 * object's three-dimensional children.</p>
 *
 * <p>Since both PerspectiveProjection and Matrix3D objects perform
 * perspective transformations, do not assign both to a display object at the
 * same time. Use the PerspectiveProjection object for focal length and
 * projection center changes. For more control over the perspective
 * transformation, create a perspective projection Matrix3D object.</p>
 */
var PerspectiveProjection = (function () {
    /**
     * Creates an instance of a PerspectiveProjection object.
     */
    function PerspectiveProjection() {
    }
    /**
     * Returns the underlying Matrix3D object of the display object.
     *
     * <p>A display object, like the root object, can have a
     * PerspectiveProjection object without needing a Matrix3D property
     * defined for its transformations. In fact, use either a
     * PerspectiveProjection or a Matrix3D object to specify the
     * perspective transformation. If when using the PerspectiveProjection
     * object, a Matrix3D object was needed, the <code>toMatrix3D()</code>
     * method can retrieve the underlying Matrix3D object of the display
     * object. For example, the <code>toMatrix3D()</code> method can be
     * used with the <code>Utils3D.projectVectors()</code> method.</p>
     *
     * @see away.geom.Matrix3D
     */
    PerspectiveProjection.prototype.toMatrix3D = function () {
        return this._matrix3D;
    };
    return PerspectiveProjection;
})();
module.exports = PerspectiveProjection;


},{}],"awayjs-core\\lib\\geom\\Plane3D":[function(require,module,exports){
var PlaneClassification = require("awayjs-core/lib/geom/PlaneClassification");
var Plane3D = (function () {
    /**
     * Create a Plane3D with ABCD coefficients
     */
    function Plane3D(a, b, c, d) {
        if (a === void 0) { a = 0; }
        if (b === void 0) { b = 0; }
        if (c === void 0) { c = 0; }
        if (d === void 0) { d = 0; }
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        if (a == 0 && b == 0) {
            this._iAlignment = Plane3D.ALIGN_XY_AXIS;
        }
        else if (b == 0 && c == 0) {
            this._iAlignment = Plane3D.ALIGN_YZ_AXIS;
        }
        else if (a == 0 && c == 0) {
            this._iAlignment = Plane3D.ALIGN_XZ_AXIS;
        }
        else {
            this._iAlignment = Plane3D.ALIGN_ANY;
        }
    }
    /**
     * Fills this Plane3D with the coefficients from 3 points in 3d space.
     * @param p0 Vector3D
     * @param p1 Vector3D
     * @param p2 Vector3D
     */
    Plane3D.prototype.fromPoints = function (p0, p1, p2) {
        var d1x = p1.x - p0.x;
        var d1y = p1.y - p0.y;
        var d1z = p1.z - p0.z;
        var d2x = p2.x - p0.x;
        var d2y = p2.y - p0.y;
        var d2z = p2.z - p0.z;
        this.a = d1y * d2z - d1z * d2y;
        this.b = d1z * d2x - d1x * d2z;
        this.c = d1x * d2y - d1y * d2x;
        this.d = this.a * p0.x + this.b * p0.y + this.c * p0.z;
        // not using epsilon, since a plane is infinite and a small incorrection can grow very large
        if (this.a == 0 && this.b == 0) {
            this._iAlignment = Plane3D.ALIGN_XY_AXIS;
        }
        else if (this.b == 0 && this.c == 0) {
            this._iAlignment = Plane3D.ALIGN_YZ_AXIS;
        }
        else if (this.a == 0 && this.c == 0) {
            this._iAlignment = Plane3D.ALIGN_XZ_AXIS;
        }
        else {
            this._iAlignment = Plane3D.ALIGN_ANY;
        }
    };
    /**
     * Fills this Plane3D with the coefficients from the plane's normal and a point in 3d space.
     * @param normal Vector3D
     * @param point  Vector3D
     */
    Plane3D.prototype.fromNormalAndPoint = function (normal, point) {
        this.a = normal.x;
        this.b = normal.y;
        this.c = normal.z;
        this.d = this.a * point.x + this.b * point.y + this.c * point.z;
        if (this.a == 0 && this.b == 0) {
            this._iAlignment = Plane3D.ALIGN_XY_AXIS;
        }
        else if (this.b == 0 && this.c == 0) {
            this._iAlignment = Plane3D.ALIGN_YZ_AXIS;
        }
        else if (this.a == 0 && this.c == 0) {
            this._iAlignment = Plane3D.ALIGN_XZ_AXIS;
        }
        else {
            this._iAlignment = Plane3D.ALIGN_ANY;
        }
    };
    /**
     * Normalize this Plane3D
     * @return Plane3D This Plane3D.
     */
    Plane3D.prototype.normalize = function () {
        var len = 1 / Math.sqrt(this.a * this.a + this.b * this.b + this.c * this.c);
        this.a *= len;
        this.b *= len;
        this.c *= len;
        this.d *= len;
        return this;
    };
    /**
     * Returns the signed distance between this Plane3D and the point p.
     * @param p Vector3D
     * @returns Number
     */
    Plane3D.prototype.distance = function (p) {
        if (this._iAlignment == Plane3D.ALIGN_YZ_AXIS) {
            return this.a * p.x - this.d;
        }
        else if (this._iAlignment == Plane3D.ALIGN_XZ_AXIS) {
            return this.b * p.y - this.d;
        }
        else if (this._iAlignment == Plane3D.ALIGN_XY_AXIS) {
            return this.c * p.z - this.d;
        }
        else {
            return this.a * p.x + this.b * p.y + this.c * p.z - this.d;
        }
    };
    /**
     * Classify a point against this Plane3D. (in front, back or intersecting)
     * @param p Vector3D
     * @return int Plane3.FRONT or Plane3D.BACK or Plane3D.INTERSECT
     */
    Plane3D.prototype.classifyPoint = function (p, epsilon) {
        if (epsilon === void 0) { epsilon = 0.01; }
        // check NaN
        if (this.d != this.d)
            return PlaneClassification.FRONT;
        var len;
        if (this._iAlignment == Plane3D.ALIGN_YZ_AXIS)
            len = this.a * p.x - this.d;
        else if (this._iAlignment == Plane3D.ALIGN_XZ_AXIS)
            len = this.b * p.y - this.d;
        else if (this._iAlignment == Plane3D.ALIGN_XY_AXIS)
            len = this.c * p.z - this.d;
        else
            len = this.a * p.x + this.b * p.y + this.c * p.z - this.d;
        if (len < -epsilon)
            return PlaneClassification.BACK;
        else if (len > epsilon)
            return PlaneClassification.FRONT;
        else
            return PlaneClassification.INTERSECT;
    };
    Plane3D.prototype.toString = function () {
        return "Plane3D [a:" + this.a + ", b:" + this.b + ", c:" + this.c + ", d:" + this.d + "]";
    };
    // indicates the alignment of the plane
    Plane3D.ALIGN_ANY = 0;
    Plane3D.ALIGN_XY_AXIS = 1;
    Plane3D.ALIGN_YZ_AXIS = 2;
    Plane3D.ALIGN_XZ_AXIS = 3;
    return Plane3D;
})();
module.exports = Plane3D;


},{"awayjs-core/lib/geom/PlaneClassification":23}],"awayjs-core\\lib\\geom\\PlaneClassification":[function(require,module,exports){
module.exports=require(23)
},{"..\\awayjs-core\\lib\\geom\\PlaneClassification.js":23}],"awayjs-core\\lib\\geom\\Point":[function(require,module,exports){
module.exports=require(24)
},{"..\\awayjs-core\\lib\\geom\\Point.js":24}],"awayjs-core\\lib\\geom\\PoissonLookup":[function(require,module,exports){
var PoissonLookup = (function () {
    function PoissonLookup() {
    }
    PoissonLookup.initDistributions = function () {
        // precalculated for best control
        this._distributions = new Array();
        this._distributions[0] = new Array(0.3082841, 0.4320919);
        this._distributions[1] = new Array(0.3082841, 0.4320919, -0.2274942, -0.6640266);
        this._distributions[2] = new Array(0.8742689, 0.0009265686, -0.6864116, -0.5536607, -0.2325206, 0.7678371);
        this._distributions[3] = new Array(0.3913446, -0.7084417, -0.7511101, -0.5935929, -0.2323436, 0.5320091, 0.8435315, 0.5035911);
        this._distributions[4] = new Array(0.2122471, -0.5771395, -0.8543506, -0.1763534, 0.5189021, 0.8323698, -0.3616908, 0.5865368, 0.9523004, -0.04948437);
        this._distributions[5] = new Array(0.5791035, 0.3496495, 0.2959551, -0.6006749, -0.2419119, -0.06879545, -0.7403072, 0.6110353, -0.04555973, 0.8059174, -0.5275017, -0.737129);
        this._distributions[6] = new Array(0.06941478, 0.8519508, -0.7441907, 0.2426432, 0.6439992, -0.2405252, -0.1007523, -0.2327587, -0.6427067, -0.7248485, 0.8050759, 0.5492936, 0.3573822, -0.8824506);
        this._distributions[7] = new Array(0.8509863, 0.4452587, -0.09507271, 0.2073005, 0.1706571, -0.6434793, 0.8029777, -0.2718274, -0.4401725, 0.8196304, 0.2715359, 0.8598521, -0.8121575, -0.006447683, -0.6486837, -0.7237598);
        this._distributions[8] = new Array(0.6951686, -0.2680728, -0.04933243, 0.3710589, 0.6592212, 0.3661054, -0.01579228, -0.6909603, -0.3275101, -0.1756866, 0.3811549, 0.9218544, -0.216032, 0.9755028, -0.7065172, 0.3355389, -0.6579109, -0.6798355);
        this._distributions[9] = new Array(0.6181276, -0.09790418, -0.2537868, -0.5570995, -0.1964931, 0.3459414, 0.3474613, -0.8885581, 0.5135743, 0.5753114, -0.9549091, 0.1480672, -0.8711916, -0.4293123, -0.6928071, 0.6190156, -0.13369, 0.8892705, 0.0548224, -0.1246777);
        this._distributions[10] = new Array(0.4853027, -0.5080479, -0.1331675, -0.506597, 0.139575, 0.01316885, 0.803486, -0.07568797, 0.5240274, 0.4883182, -0.4334005, 0.1207938, -0.7794577, -0.3985141, 0.1576432, -0.9861221, -0.3712867, 0.6959021, 0.1517378, 0.9847429, -0.9762396, 0.1661073);
        this._distributions[11] = new Array(-0.2790166, -0.01252619, 0.3389016, 0.3921154, 0.2408341, -0.313211, -0.8151779, -0.3898362, -0.6347761, 0.3486495, 0.09471484, -0.7722448, -0.1385674, 0.6364574, 0.2456331, 0.9295807, -0.3864306, -0.8247881, 0.6111673, -0.7164014, 0.8287669, 0.05466961, 0.837706, 0.5415626);
        this._distributions[12] = new Array(0.056417, 0.3185693, -0.8245888, 0.1882799, 0.8575996, 0.1136829, 0.1070375, 0.875332, 0.4076743, -0.06000621, -0.4311306, 0.7239349, 0.2677574, -0.538472, -0.08486642, -0.2083647, -0.888989, -0.3906443, -0.4768958, -0.6664082, 0.09334993, -0.9861541, 0.808736, -0.455949, 0.5889823, 0.7660807);
        this._distributions[13] = new Array(-0.2681346, -0.3955857, -0.1315102, -0.8852947, -0.5143692, 0.09551838, 0.4344836, -0.546945, -0.8620899, -0.3813288, 0.1650431, 0.02034803, -0.1543657, 0.3842218, -0.828457, 0.5376903, -0.6145, -0.7818927, -0.2639062, 0.8784655, 0.1912684, 0.9720125, 0.3135219, 0.5224229, 0.7850655, 0.4592297, 0.7465045, -0.1368916);
        this._distributions[14] = new Array(0.4241029, 0.695281, 0.150511, -0.02304107, -0.2482675, 0.9120338, 0.8057325, 0.2622084, -0.2445909, 0.2765962, 0.8588713, -0.1772072, 0.3117845, -0.4385471, -0.3923851, -0.3298936, -0.1751254, -0.7405846, 0.6926506, -0.684163, -0.9304563, -0.3254691, -0.8533293, 0.1523024, 0.2510415, -0.917345, -0.6239773, -0.7105472, -0.6104624, 0.6041355);
        this._distributions[15] = new Array(0.5844554, 0.06651045, 0.1343258, 0.6756578, 0.3799674, -0.6301104, 0.5590436, 0.7940555, 0.09574714, 0.02262517, 0.8697868, 0.393301, 0.003945862, -0.421735, 0.9043913, -0.2432393, -0.4844007, 0.7190998, -0.3201078, 0.2972371, -0.3852352, -0.6341155, -0.5413069, -0.09223081, -0.8468984, -0.5126905, 0.004156174, -0.8633173, -0.9681889, -0.03305046, -0.846509, 0.4414353);
        this._distributions[16] = new Array(0.4506488, 0.657668, 0.4621297, 0.07441051, -0.2782125, 0.6201044, 0.9750003, 0.09110117, 0.1019436, 0.2986514, 0.03457398, 0.9631706, 0.542098, -0.5505635, 0.8675668, 0.4938077, -0.5414361, 0.2655292, -0.7941836, 0.6003053, -0.09847672, -0.1001604, -0.9316511, -0.08572888, 0.07286467, -0.611899, -0.5232627, -0.4082253, -0.5481608, -0.827938, -0.1551939, -0.9621193, 0.9220031, -0.3315949);
        this._distributions[17] = new Array(0.197908, -0.4697656, -0.4474689, -0.3428435, 0.8529873, -0.2228634, 0.6022478, -0.5469642, 0.2545276, -0.931133, -0.1507547, -0.7855865, -0.07606658, 0.1011628, 0.3046715, 0.2785755, 0.4698432, -0.1064076, 0.6831254, 0.4152522, 0.1374381, 0.8363233, -0.2166121, 0.6682042, 0.5511393, 0.7996449, -0.4278994, 0.28836, -0.8875198, 0.2181732, -0.8772842, -0.2818254, -0.7000262, 0.5762185, -0.6062385, -0.7439126);
        this._distributions[18] = new Array(0.6645703, -0.05678739, 0.5720971, 0.4533803, -0.07660709, 0.08802763, 0.5163431, -0.4426552, 0.1163455, -0.3404382, -0.4004807, -0.5046007, 0.2932099, -0.8201418, -0.5322125, 0.03834766, -0.1490209, -0.8817304, -0.8000439, -0.3509448, 0.5260983, 0.8421043, 0.1197811, 0.6963812, 0.9498612, 0.3122156, -0.9285746, 0.02120355, -0.6670724, 0.7217396, 0.9155889, -0.3510147, -0.271941, 0.4727852, 0.318879, 0.1634057, -0.2686755, 0.9253026);
        this._distributions[19] = new Array(0.5064292, 0.422527, 0.8935515, -0.06610427, 0.1199719, 0.175568, 0.403388, -0.2003276, 0.1657927, 0.8154403, 0.9301245, 0.2929218, -0.1644068, 0.6201534, 0.7113559, -0.6589743, -0.3364046, -0.1799502, 0.02109996, -0.392765, -0.382213, 0.3219992, -0.9201946, 0.1207967, -0.726185, 0.4291916, -0.7443482, -0.2480059, -0.5147594, 0.7418784, 0.1935272, -0.7406143, -0.3643523, -0.5559214, -0.7147766, -0.6326278, -0.2524151, -0.9096627, 0.5161405, 0.7908453);
        this._distributions[20] = new Array(0.7921003, -0.3032096, 0.5992879, -0.009052323, 0.2538549, -0.1872749, 0.7053444, 0.3677175, 0.5417761, -0.8170255, 0.9749611, 0.1210478, 0.1969143, -0.6117041, -0.1824499, -0.4634196, -0.1181338, -0.8668742, -0.3050112, -0.1352596, -0.4409327, -0.7082354, -0.03225285, 0.1171548, 0.3113096, 0.3250439, -0.8166144, -0.463995, -0.01014475, 0.4715334, -0.6868284, 0.05091889, -0.4011163, 0.2717285, -0.06756835, 0.8307694, -0.7938535, 0.4352129, -0.4663842, 0.7165329, 0.559729, 0.8093995);
        this._distributions[21] = new Array(0.07832243, 0.426151, -0.3856795, 0.5799953, 0.01970797, 0.06706189, 0.4822682, 0.3014512, -0.1532982, 0.87485, -0.4959527, 0.07888043, 0.260601, -0.2304784, 0.4996209, 0.7167382, 0.585986, -0.04265174, -0.7679967, 0.5509416, -0.9041753, 0.1802134, -0.8407655, -0.4442826, -0.2058258, -0.2636995, -0.4984115, -0.5928579, 0.2926032, -0.7886473, -0.06933882, -0.621177, 0.578115, -0.4813387, 0.8981777, -0.3291056, 0.1942733, 0.9255584, 0.8084362, 0.5066984, 0.9920095, 0.03103104, -0.2403206, -0.9389018);
        this._distributions[22] = new Array(-0.5691095, 0.1014316, -0.7788262, 0.384012, -0.8253665, -0.1645582, -0.1830993, 0.002997211, -0.2555013, -0.4177977, -0.6640869, -0.4794711, -0.2351242, 0.5850121, 0.02436554, 0.2825883, 0.006061143, -0.8200245, 0.1618791, -0.3063331, -0.3765897, -0.7249815, 0.6092919, -0.6769328, -0.5956934, 0.6957655, 0.5383642, 0.4522677, -0.1489165, 0.9125596, 0.4167473, 0.1335986, 0.1898309, 0.5874342, 0.2288171, 0.9624356, 0.7540846, -0.07672304, 0.8986252, 0.2788797, 0.3555991, -0.9262139, 0.8454325, -0.4027667, 0.4945236, -0.2935512);
        this._distributions[23] = new Array(-0.4481403, -0.3758374, -0.8877251, 0.08739938, 0.05015831, -0.1339983, -0.4070427, -0.8534173, 0.1019274, -0.5503222, -0.445998, 0.1997541, -0.8686263, -0.2788867, -0.7695944, -0.6033704, -0.05515742, -0.885711, -0.7714347, 0.5790485, 0.3466263, -0.8799297, 0.4487582, -0.5321087, -0.2461368, 0.6053771, -0.05568117, 0.2457351, -0.4668669, 0.8523816, 0.8103387, -0.4255538, 0.4054182, -0.175663, -0.2802011, -0.08920153, 0.2665959, 0.382935, 0.555679, 0.1621837, 0.105246, 0.8420411, 0.6921161, 0.6902903, 0.880946, 0.2483067, 0.9699264, -0.1021767);
        this._distributions[24] = new Array(-0.1703323, -0.3119385, 0.2916039, -0.2988263, -0.008472982, -0.9277695, -0.7730271, -0.3277904, 0.3440474, -0.6815342, -0.2910278, 0.03461745, -0.6764899, -0.657078, -0.3505501, -0.7311988, -0.03478927, 0.3258755, -0.6048835, 0.159423, 0.2035525, 0.02212214, 0.5116573, 0.2226856, 0.6664805, -0.2500189, 0.7147882, -0.6609634, 0.03030632, -0.5763278, -0.2516585, 0.6116219, -0.9434413, -0.0116792, 0.9061816, 0.2491155, 0.182867, 0.6076167, 0.286593, 0.9485695, -0.5992439, 0.6970096, -0.2082874, 0.9416641, 0.9880044, -0.1541709, -0.9122881, 0.331555, 0.7324886, 0.6725098);
        this._distributions[25] = new Array(0.3869598, -0.04974834, 0.7168844, -0.0693711, -0.07166742, 0.1725325, 0.4599592, 0.3232779, 0.5872094, -0.4198674, 0.2442266, -0.625667, 0.1254557, 0.4500048, -0.2290154, -0.1803567, 0.890583, 0.3373493, 0.1256081, 0.7853789, -0.2676466, 0.5305805, -0.7063224, 0.252168, -0.3989835, 0.1189921, 0.09617215, -0.2451447, 0.6302541, 0.6085876, 0.9380925, -0.3234899, 0.5086241, -0.8573482, 0.03576187, -0.9876697, -0.0876712, -0.6365195, -0.5276513, 0.823456, -0.6935764, -0.2240411, -0.5212318, -0.5383121, -0.2116208, 0.9639363, -0.9840096, 0.02743555, -0.3991577, -0.8994547, -0.7830126, 0.614068);
        this._distributions[26] = new Array(-0.8366601, 0.4464895, -0.5917366, -0.02073906, -0.9845258, 0.1635625, -0.3097973, 0.4379579, -0.5478154, 0.7173221, -0.1685888, 0.9261969, 0.01503595, 0.6046097, 0.4452421, 0.5449086, 0.0315687, 0.1944619, 0.3753404, 0.8688548, 0.4143643, 0.1396648, 0.8711032, 0.4304703, 0.7328773, 0.1461501, 0.6374492, -0.3521495, 0.145613, -0.1341466, 0.9040975, -0.135123, -0.7839059, -0.5450199, -0.516019, -0.3320859, -0.206158, -0.4431106, -0.9703014, -0.2368356, -0.2473119, -0.0864351, 0.2130725, -0.4604077, -0.003726701, -0.7122303, -0.4072131, -0.6833169, 0.1632999, -0.9776646, 0.4686888, -0.680495, -0.2293511, -0.9509777);
        this._distributions[27] = new Array(0.107311, -0.1311369, -0.4194764, -0.3148777, 0.6171439, -0.2745973, 0.2796618, 0.1937153, -0.09106886, 0.4180236, 0.6044006, 0.05577846, 0.02927299, -0.6738263, -0.2580845, 0.1179939, -0.09023564, -0.3830024, 0.3570953, -0.5000587, 0.81591, -0.5518309, 0.9300217, -0.1257987, 0.4904627, -0.8381903, -0.3163182, -0.8632009, 0.1137595, -0.9875998, 0.8390043, 0.3538185, 0.2149114, 0.4993694, 0.5191584, 0.3833552, 0.5002763, 0.7061465, -0.2567276, 0.9068756, -0.5197366, 0.3467845, 0.03668867, 0.9734009, -0.5347553, 0.66747, -0.9028882, 0.1023768, -0.8967977, 0.412834, -0.5821944, 0.0426479, -0.8032165, -0.2397038, -0.5597343, -0.6358021);
        this._distributions[28] = new Array(-0.6562496, -0.1781036, -0.9301494, 0.1185208, -0.3861143, -0.4153562, -0.1560799, -0.1099607, -0.5587025, 0.395218, -0.5322112, -0.699701, -0.5008639, 0.08726846, -0.970524, -0.1963461, -0.813577, -0.5185111, -0.1644458, 0.298, -0.3216791, 0.639982, 0.3315373, 0.3339162, 0.2383235, -0.00105722, 0.1137828, 0.5450742, -0.01899921, 0.8798413, 0.2849685, 0.8255596, 0.6974412, 0.2123175, 0.7588523, 0.5470437, 0.5102502, -0.1687844, 0.5853448, 0.8033476, 0.2590716, -0.5262504, 0.5607718, -0.6342825, 0.8666443, -0.1491841, 0.8341052, -0.4935003, -0.1568441, -0.6634066, 0.2512113, -0.8769391, -0.2559827, -0.9572457, -0.01928852, -0.3966542, -0.750667, 0.6409678);
        this._distributions[29] = new Array(0.3454786, -0.04837726, 0.2649553, 0.2406852, 0.5599093, -0.3839145, -0.1111814, -0.05502108, 0.7586042, -0.05818377, 0.2519488, -0.4665135, -0.1264972, 0.2602723, -0.08766216, -0.3671907, 0.6428129, 0.3999204, -0.6105871, -0.1246869, -0.4589451, -0.7646643, -0.03021116, -0.7899352, -0.6036922, -0.4293956, -0.2481938, 0.6534185, 0.102798, 0.6784465, -0.6392644, 0.4821358, -0.6789002, 0.1779133, -0.9140783, -0.1989647, -0.9262617, 0.3381507, 0.4794891, -0.8093274, 0.3959447, 0.668478, 0.9602883, 0.2272305, -0.123672, 0.9210883, 0.2375148, 0.9523395, -0.52898, 0.7973378, -0.382433, 0.1228794, 0.695015, 0.6948439, 0.7530277, -0.6458191, 0.8777987, -0.3272956, 0.2318525, -0.962768);
        this._distributions[30] = new Array(0.4518921, -0.1146195, 0.4720805, -0.4238748, 0.3655423, 0.1806341, 0.1589939, -0.23568, 0.7673324, -0.5149941, 0.01163658, 0.09045836, 0.7010971, 0.1245747, 0.7518286, -0.1855433, 0.4960719, 0.4601022, 0.2566979, -0.6308268, -0.0654714, -0.5126389, -0.1823319, -0.1343282, -0.1464312, 0.4883236, -0.3858738, 0.203523, 0.1484799, 0.4432284, -0.477109, -0.116241, 0.2719092, 0.7208626, 0.9104174, 0.3578536, -0.5956199, 0.7662588, -0.6996251, 0.3678654, -0.2514512, 0.9251933, 0.1275825, -0.9478135, -0.204608, -0.8611552, 0.4264838, -0.877443, 0.9854161, 0.05521112, 0.5912951, 0.7997434, 0.1140349, 0.982093, -0.9324368, -0.2094094, -0.42436, -0.6441524, -0.6722705, -0.3554261, -0.7844236, 0.08587621);
        this._distributions[31] = new Array(-0.4206714, -0.5613642, -0.8733016, -0.3373051, -0.1046226, -0.2902999, -0.1318562, -0.8434365, 0.1145093, -0.5962623, -0.4965627, -0.1873259, -0.5011808, -0.8546229, -0.7165636, -0.5743566, 0.1090901, 0.2017643, 0.3404809, -0.220455, -0.1989015, 0.2372122, -0.4538706, 0.0979171, 0.4514146, -0.572846, 0.2314168, -0.8514503, -0.4247236, 0.5650803, -0.943347, 0.04514639, -0.1309718, 0.5221877, -0.7004157, 0.4561877, 0.6306441, 0.04448673, 0.4301621, 0.5766876, 0.1078042, 0.7245752, 0.3875354, 0.2794483, 0.702876, -0.2924213, 0.7360667, -0.6210318, 0.7486517, 0.6531103, 0.4898235, 0.8591025, 0.6549174, 0.3854057, -0.2596106, 0.7916998, 0.9251194, -0.05296265, -0.5620695, 0.820877, -0.01228026, 0.9937211, 0.9612103, 0.2628758);
    };
    PoissonLookup.getDistribution = function (n /*int*/) {
        if (!this._distributions)
            this.initDistributions();
        if (n < 2 || n > 32)
            return null;
        return this._distributions[n - 1];
    };
    return PoissonLookup;
})();
module.exports = PoissonLookup;


},{}],"awayjs-core\\lib\\geom\\Quaternion":[function(require,module,exports){
var Matrix3DUtils = require("awayjs-core/lib/geom/Matrix3DUtils");
var Orientation3D = require("awayjs-core/lib/geom/Orientation3D");
var Matrix3D = require("awayjs-core/lib/geom/Matrix3D");
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
/**
 * A Quaternion object which can be used to represent rotations.
 */
var Quaternion = (function () {
    /**
     * Creates a new Quaternion object.
     * @param x The x value of the quaternion.
     * @param y The y value of the quaternion.
     * @param z The z value of the quaternion.
     * @param w The w value of the quaternion.
     */
    function Quaternion(x, y, z, w) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (z === void 0) { z = 0; }
        if (w === void 0) { w = 1; }
        /**
         * The x value of the quaternion.
         */
        this.x = 0;
        /**
         * The y value of the quaternion.
         */
        this.y = 0;
        /**
         * The z value of the quaternion.
         */
        this.z = 0;
        /**
         * The w value of the quaternion.
         */
        this.w = 1;
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    Object.defineProperty(Quaternion.prototype, "magnitude", {
        /**
         * Returns the magnitude of the quaternion object.
         */
        get: function () {
            return Math.sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Fills the quaternion object with the result from a multiplication of two quaternion objects.
     *
     * @param    qa    The first quaternion in the multiplication.
     * @param    qb    The second quaternion in the multiplication.
     */
    Quaternion.prototype.multiply = function (qa, qb) {
        var w1 = qa.w, x1 = qa.x, y1 = qa.y, z1 = qa.z;
        var w2 = qb.w, x2 = qb.x, y2 = qb.y, z2 = qb.z;
        this.w = w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2;
        this.x = w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2;
        this.y = w1 * y2 - x1 * z2 + y1 * w2 + z1 * x2;
        this.z = w1 * z2 + x1 * y2 - y1 * x2 + z1 * w2;
    };
    Quaternion.prototype.multiplyVector = function (vector, target) {
        if (target === void 0) { target = null; }
        //target ||= new Quaternion();
        if (target === null) {
            target = new Quaternion();
        }
        var x2 = vector.x;
        var y2 = vector.y;
        var z2 = vector.z;
        target.w = -this.x * x2 - this.y * y2 - this.z * z2;
        target.x = this.w * x2 + this.y * z2 - this.z * y2;
        target.y = this.w * y2 - this.x * z2 + this.z * x2;
        target.z = this.w * z2 + this.x * y2 - this.y * x2;
        return target;
    };
    /**
     * Fills the quaternion object with values representing the given rotation around a vector.
     *
     * @param    axis    The axis around which to rotate
     * @param    angle    The angle in radians of the rotation.
     */
    Quaternion.prototype.fromAxisAngle = function (axis, angle) {
        var sin_a = Math.sin(angle / 2);
        var cos_a = Math.cos(angle / 2);
        this.x = axis.x * sin_a;
        this.y = axis.y * sin_a;
        this.z = axis.z * sin_a;
        this.w = cos_a;
        this.normalize();
    };
    /**
     * Spherically interpolates between two quaternions, providing an interpolation between rotations with constant angle change rate.
     * @param qa The first quaternion to interpolate.
     * @param qb The second quaternion to interpolate.
     * @param t The interpolation weight, a value between 0 and 1.
     */
    Quaternion.prototype.slerp = function (qa, qb, t) {
        var w1 = qa.w, x1 = qa.x, y1 = qa.y, z1 = qa.z;
        var w2 = qb.w, x2 = qb.x, y2 = qb.y, z2 = qb.z;
        var dot = w1 * w2 + x1 * x2 + y1 * y2 + z1 * z2;
        // shortest direction
        if (dot < 0) {
            dot = -dot;
            w2 = -w2;
            x2 = -x2;
            y2 = -y2;
            z2 = -z2;
        }
        if (dot < 0.95) {
            // interpolate angle linearly
            var angle = Math.acos(dot);
            var s = 1 / Math.sin(angle);
            var s1 = Math.sin(angle * (1 - t)) * s;
            var s2 = Math.sin(angle * t) * s;
            this.w = w1 * s1 + w2 * s2;
            this.x = x1 * s1 + x2 * s2;
            this.y = y1 * s1 + y2 * s2;
            this.z = z1 * s1 + z2 * s2;
        }
        else {
            // nearly identical angle, interpolate linearly
            this.w = w1 + t * (w2 - w1);
            this.x = x1 + t * (x2 - x1);
            this.y = y1 + t * (y2 - y1);
            this.z = z1 + t * (z2 - z1);
            var len = 1.0 / Math.sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z);
            this.w *= len;
            this.x *= len;
            this.y *= len;
            this.z *= len;
        }
    };
    /**
     * Linearly interpolates between two quaternions.
     * @param qa The first quaternion to interpolate.
     * @param qb The second quaternion to interpolate.
     * @param t The interpolation weight, a value between 0 and 1.
     */
    Quaternion.prototype.lerp = function (qa, qb, t) {
        var w1 = qa.w, x1 = qa.x, y1 = qa.y, z1 = qa.z;
        var w2 = qb.w, x2 = qb.x, y2 = qb.y, z2 = qb.z;
        var len;
        // shortest direction
        if (w1 * w2 + x1 * x2 + y1 * y2 + z1 * z2 < 0) {
            w2 = -w2;
            x2 = -x2;
            y2 = -y2;
            z2 = -z2;
        }
        this.w = w1 + t * (w2 - w1);
        this.x = x1 + t * (x2 - x1);
        this.y = y1 + t * (y2 - y1);
        this.z = z1 + t * (z2 - z1);
        len = 1.0 / Math.sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z);
        this.w *= len;
        this.x *= len;
        this.y *= len;
        this.z *= len;
    };
    /**
     * Fills the quaternion object with values representing the given euler rotation.
     *
     * @param    ax        The angle in radians of the rotation around the ax axis.
     * @param    ay        The angle in radians of the rotation around the ay axis.
     * @param    az        The angle in radians of the rotation around the az axis.
     */
    Quaternion.prototype.fromEulerAngles = function (ax, ay, az) {
        var halfX = ax * .5, halfY = ay * .5, halfZ = az * .5;
        var cosX = Math.cos(halfX), sinX = Math.sin(halfX);
        var cosY = Math.cos(halfY), sinY = Math.sin(halfY);
        var cosZ = Math.cos(halfZ), sinZ = Math.sin(halfZ);
        this.w = cosX * cosY * cosZ + sinX * sinY * sinZ;
        this.x = sinX * cosY * cosZ - cosX * sinY * sinZ;
        this.y = cosX * sinY * cosZ + sinX * cosY * sinZ;
        this.z = cosX * cosY * sinZ - sinX * sinY * cosZ;
    };
    /**
     * Fills a target Vector3D object with the Euler angles that form the rotation represented by this quaternion.
     * @param target An optional Vector3D object to contain the Euler angles. If not provided, a new object is created.
     * @return The Vector3D containing the Euler angles.
     */
    Quaternion.prototype.toEulerAngles = function (target) {
        if (target === void 0) { target = null; }
        //target ||= new Vector3D();
        if (target === null) {
            target = new Vector3D();
        }
        target.x = Math.atan2(2 * (this.w * this.x + this.y * this.z), 1 - 2 * (this.x * this.x + this.y * this.y));
        target.y = Math.asin(2 * (this.w * this.y - this.z * this.x));
        target.z = Math.atan2(2 * (this.w * this.z + this.x * this.y), 1 - 2 * (this.y * this.y + this.z * this.z));
        return target;
    };
    /**
     * Normalises the quaternion object.
     */
    Quaternion.prototype.normalize = function (val) {
        if (val === void 0) { val = 1; }
        var mag = val / Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
        this.x *= mag;
        this.y *= mag;
        this.z *= mag;
        this.w *= mag;
    };
    /**
     * Used to trace the values of a quaternion.
     *
     * @return A string representation of the quaternion object.
     */
    Quaternion.prototype.toString = function () {
        return "{x:" + this.x + " y:" + this.y + " z:" + this.z + " w:" + this.w + "}";
    };
    /**
     * Converts the quaternion to a Matrix3D object representing an equivalent rotation.
     * @param target An optional Matrix3D container to store the transformation in. If not provided, a new object is created.
     * @return A Matrix3D object representing an equivalent rotation.
     */
    Quaternion.prototype.toMatrix3D = function (target) {
        if (target === void 0) { target = null; }
        var rawData = Matrix3DUtils.RAW_DATA_CONTAINER;
        var xy2 = 2.0 * this.x * this.y, xz2 = 2.0 * this.x * this.z, xw2 = 2.0 * this.x * this.w;
        var yz2 = 2.0 * this.y * this.z, yw2 = 2.0 * this.y * this.w, zw2 = 2.0 * this.z * this.w;
        var xx = this.x * this.x, yy = this.y * this.y, zz = this.z * this.z, ww = this.w * this.w;
        rawData[0] = xx - yy - zz + ww;
        rawData[4] = xy2 - zw2;
        rawData[8] = xz2 + yw2;
        rawData[12] = 0;
        rawData[1] = xy2 + zw2;
        rawData[5] = -xx + yy - zz + ww;
        rawData[9] = yz2 - xw2;
        rawData[13] = 0;
        rawData[2] = xz2 - yw2;
        rawData[6] = yz2 + xw2;
        rawData[10] = -xx - yy + zz + ww;
        rawData[14] = 0;
        rawData[3] = 0.0;
        rawData[7] = 0.0;
        rawData[11] = 0;
        rawData[15] = 1;
        if (!target)
            return new Matrix3D(rawData);
        target.copyRawDataFrom(rawData);
        return target;
    };
    /**
     * Extracts a quaternion rotation matrix out of a given Matrix3D object.
     * @param matrix The Matrix3D out of which the rotation will be extracted.
     */
    Quaternion.prototype.fromMatrix = function (matrix) {
        var v = matrix.decompose(Orientation3D.QUATERNION)[1];
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        this.w = v.w;
    };
    /**
     * Converts the quaternion to a Vector.&lt;Number&gt; matrix representation of a rotation equivalent to this quaternion.
     * @param target The Vector.&lt;Number&gt; to contain the raw matrix data.
     * @param exclude4thRow If true, the last row will be omitted, and a 4x3 matrix will be generated instead of a 4x4.
     */
    Quaternion.prototype.toRawData = function (target, exclude4thRow) {
        if (exclude4thRow === void 0) { exclude4thRow = false; }
        var xy2 = 2.0 * this.x * this.y, xz2 = 2.0 * this.x * this.z, xw2 = 2.0 * this.x * this.w;
        var yz2 = 2.0 * this.y * this.z, yw2 = 2.0 * this.y * this.w, zw2 = 2.0 * this.z * this.w;
        var xx = this.x * this.x, yy = this.y * this.y, zz = this.z * this.z, ww = this.w * this.w;
        target[0] = xx - yy - zz + ww;
        target[1] = xy2 - zw2;
        target[2] = xz2 + yw2;
        target[4] = xy2 + zw2;
        target[5] = -xx + yy - zz + ww;
        target[6] = yz2 - xw2;
        target[8] = xz2 - yw2;
        target[9] = yz2 + xw2;
        target[10] = -xx - yy + zz + ww;
        target[3] = target[7] = target[11] = 0;
        if (!exclude4thRow) {
            target[12] = target[13] = target[14] = 0;
            target[15] = 1;
        }
    };
    /**
     * Clones the quaternion.
     * @return An exact duplicate of the current Quaternion.
     */
    Quaternion.prototype.clone = function () {
        return new Quaternion(this.x, this.y, this.z, this.w);
    };
    /**
     * Rotates a point.
     * @param vector The Vector3D object to be rotated.
     * @param target An optional Vector3D object that will contain the rotated coordinates. If not provided, a new object will be created.
     * @return A Vector3D object containing the rotated point.
     */
    Quaternion.prototype.rotatePoint = function (vector, target) {
        if (target === void 0) { target = null; }
        var x1, y1, z1, w1;
        var x2 = vector.x, y2 = vector.y, z2 = vector.z;
        //target ||= new Vector3D();
        if (target === null) {
            target = new Vector3D();
        }
        // p*q'
        w1 = -this.x * x2 - this.y * y2 - this.z * z2;
        x1 = this.w * x2 + this.y * z2 - this.z * y2;
        y1 = this.w * y2 - this.x * z2 + this.z * x2;
        z1 = this.w * z2 + this.x * y2 - this.y * x2;
        target.x = -w1 * this.x + x1 * this.w - y1 * this.z + z1 * this.y;
        target.y = -w1 * this.y + x1 * this.z + y1 * this.w - z1 * this.x;
        target.z = -w1 * this.z - x1 * this.y + y1 * this.x + z1 * this.w;
        return target;
    };
    /**
     * Copies the data from a quaternion into this instance.
     * @param q The quaternion to copy from.
     */
    Quaternion.prototype.copyFrom = function (q) {
        this.x = q.x;
        this.y = q.y;
        this.z = q.z;
        this.w = q.w;
    };
    return Quaternion;
})();
module.exports = Quaternion;


},{"awayjs-core/lib/geom/Matrix3D":20,"awayjs-core/lib/geom/Matrix3DUtils":21,"awayjs-core/lib/geom/Orientation3D":22,"awayjs-core/lib/geom/Vector3D":26}],"awayjs-core\\lib\\geom\\Rectangle":[function(require,module,exports){
module.exports=require(25)
},{"..\\awayjs-core\\lib\\geom\\Rectangle.js":25,"awayjs-core/lib/geom/Point":24}],"awayjs-core\\lib\\geom\\UVTransform":[function(require,module,exports){
var Matrix = require("awayjs-core/lib/geom/Matrix");
var UVTransform = (function () {
    function UVTransform() {
        this._uvMatrix = new Matrix();
        this._rotation = 0;
        this._scaleU = 1;
        this._scaleV = 1;
        this._offsetU = 0;
        this._offsetV = 0;
    }
    Object.defineProperty(UVTransform.prototype, "offsetU", {
        /**
         *
         */
        get: function () {
            return this._offsetU;
        },
        set: function (value) {
            if (value == this._offsetU)
                return;
            this._offsetU = value;
            this._uvMatrixDirty = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UVTransform.prototype, "offsetV", {
        /**
         *
         */
        get: function () {
            return this._offsetV;
        },
        set: function (value) {
            if (value == this._offsetV)
                return;
            this._offsetV = value;
            this._uvMatrixDirty = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UVTransform.prototype, "rotation", {
        /**
         *
         */
        get: function () {
            return this._rotation;
        },
        set: function (value) {
            if (value == this._rotation)
                return;
            this._rotation = value;
            this._uvMatrixDirty = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UVTransform.prototype, "scaleU", {
        /**
         *
         */
        get: function () {
            return this._scaleU;
        },
        set: function (value) {
            if (value == this._scaleU)
                return;
            this._scaleU = value;
            this._uvMatrixDirty = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UVTransform.prototype, "scaleV", {
        /**
         *
         */
        get: function () {
            return this._scaleV;
        },
        set: function (value) {
            if (value == this._scaleV)
                return;
            this._scaleV = value;
            this._uvMatrixDirty = true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UVTransform.prototype, "matrix", {
        /**
         *
         */
        get: function () {
            if (this._uvMatrixDirty)
                this.updateUVMatrix();
            return this._uvMatrix;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     */
    UVTransform.prototype.updateUVMatrix = function () {
        this._uvMatrix.identity();
        if (this._rotation != 0)
            this._uvMatrix.rotate(this._rotation);
        if (this._scaleU != 1 || this._scaleV != 1)
            this._uvMatrix.scale(this._scaleU, this._scaleV);
        this._uvMatrix.translate(this._offsetU, this._offsetV);
        this._uvMatrixDirty = false;
    };
    return UVTransform;
})();
module.exports = UVTransform;


},{"awayjs-core/lib/geom/Matrix":19}],"awayjs-core\\lib\\geom\\Vector3D":[function(require,module,exports){
module.exports=require(26)
},{"..\\awayjs-core\\lib\\geom\\Vector3D.js":26}],"awayjs-core\\lib\\library\\AssetLibraryBundle":[function(require,module,exports){
module.exports=require(27)
},{"..\\awayjs-core\\lib\\library\\AssetLibraryBundle.js":27,"awayjs-core/lib/errors/Error":6,"awayjs-core/lib/events/AssetEvent":8,"awayjs-core/lib/events/EventDispatcher":10,"awayjs-core/lib/events/IOErrorEvent":12,"awayjs-core/lib/events/LoaderEvent":13,"awayjs-core/lib/events/ParserEvent":14,"awayjs-core/lib/library/AssetLibraryIterator":28,"awayjs-core/lib/library/AssetLoader":29,"awayjs-core/lib/library/ConflictPrecedence":32,"awayjs-core/lib/library/ConflictStrategy":33,"awayjs-core/lib/library/NamedAssetBase":37}],"awayjs-core\\lib\\library\\AssetLibraryIterator":[function(require,module,exports){
module.exports=require(28)
},{"..\\awayjs-core\\lib\\library\\AssetLibraryIterator.js":28}],"awayjs-core\\lib\\library\\AssetLibrary":[function(require,module,exports){
var AssetLibraryBundle = require("awayjs-core/lib/library/AssetLibraryBundle");
var AssetLoader = require("awayjs-core/lib/library/AssetLoader");
/**
 * AssetLibrary enforces a singleton pattern and is not intended to be instanced.
 * It's purpose is to allow access to the default library bundle through a set of static shortcut methods.
 * If you are interested in creating multiple library bundles, please use the <code>getBundle()</code> method.
 */
var AssetLibrary = (function () {
    /**
     * Creates a new <code>AssetLibrary</code> object.
     *
     */
    function AssetLibrary() {
    }
    //*/
    /**
     * Returns an AssetLibrary bundle instance. If no key is given, returns the default bundle (which is
     * similar to using the AssetLibraryBundle as a singleton). To keep several separated library bundles,
     * pass a string key to this method to define which bundle should be returned. This is
     * referred to as using the AssetLibraryBundle as a multiton.
     *
     * @param key Defines which multiton instance should be returned.
     * @return An instance of the asset library
     */
    AssetLibrary.getBundle = function (key) {
        if (key === void 0) { key = 'default'; }
        return AssetLibraryBundle.getInstance(key);
    };
    /**
     *
     */
    AssetLibrary.enableParser = function (parserClass) {
        AssetLoader.enableParser(parserClass);
    };
    /**
     *
     */
    AssetLibrary.enableParsers = function (parserClasses) {
        AssetLoader.enableParsers(parserClasses);
    };
    Object.defineProperty(AssetLibrary, "conflictStrategy", {
        /**
         * Short-hand for conflictStrategy property on default asset library bundle.
         *
         * @see AssetLibraryBundle.conflictStrategy
         */
        get: function () {
            return AssetLibrary.getBundle().conflictStrategy;
        },
        set: function (val) {
            AssetLibrary.getBundle().conflictStrategy = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AssetLibrary, "conflictPrecedence", {
        /**
         * Short-hand for conflictPrecedence property on default asset library bundle.
         *
         * @see AssetLibraryBundle.conflictPrecedence
         */
        get: function () {
            return AssetLibrary.getBundle().conflictPrecedence;
        },
        set: function (val) {
            AssetLibrary.getBundle().conflictPrecedence = val;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Short-hand for createIterator() method on default asset library bundle.
     *
     * @see AssetLibraryBundle.createIterator()
     */
    AssetLibrary.createIterator = function (assetTypeFilter, namespaceFilter, filterFunc) {
        if (assetTypeFilter === void 0) { assetTypeFilter = null; }
        if (namespaceFilter === void 0) { namespaceFilter = null; }
        if (filterFunc === void 0) { filterFunc = null; }
        return AssetLibrary.getBundle().createIterator(assetTypeFilter, namespaceFilter, filterFunc);
    };
    /**
     * Short-hand for load() method on default asset library bundle.
     *
     * @see AssetLibraryBundle.load()
     */
    AssetLibrary.load = function (req, context, ns, parser) {
        if (context === void 0) { context = null; }
        if (ns === void 0) { ns = null; }
        if (parser === void 0) { parser = null; }
        return AssetLibrary.getBundle().load(req, context, ns, parser);
    };
    /**
     * Short-hand for loadData() method on default asset library bundle.
     *
     * @see AssetLibraryBundle.loadData()
     */
    AssetLibrary.loadData = function (data, context, ns, parser) {
        if (context === void 0) { context = null; }
        if (ns === void 0) { ns = null; }
        if (parser === void 0) { parser = null; }
        return AssetLibrary.getBundle().loadData(data, context, ns, parser);
    };
    AssetLibrary.stopLoad = function () {
        AssetLibrary.getBundle().stopAllLoadingSessions();
    };
    /**
     * Short-hand for getAsset() method on default asset library bundle.
     *
     * @see AssetLibraryBundle.getAsset()
     */
    AssetLibrary.getAsset = function (name, ns) {
        if (ns === void 0) { ns = null; }
        return AssetLibrary.getBundle().getAsset(name, ns);
    };
    /**
     * Short-hand for addEventListener() method on default asset library bundle.
     */
    AssetLibrary.addEventListener = function (type, listener) {
        AssetLibrary.getBundle().addEventListener(type, listener);
    };
    /**
     * Short-hand for removeEventListener() method on default asset library bundle.
     */
    AssetLibrary.removeEventListener = function (type, listener) {
        AssetLibrary.getBundle().removeEventListener(type, listener);
    };
    /**
     * Short-hand for hasEventListener() method on default asset library bundle.

     public static hasEventListener(type:string):boolean
     {
        return AssetLibrary.getBundle().hasEventListener(type);
    }

     public static willTrigger(type:string):boolean
     {
        return getBundle().willTrigger(type);
    }
     */
    /**
     * Short-hand for addAsset() method on default asset library bundle.
     *
     * @see AssetLibraryBundle.addAsset()
     */
    AssetLibrary.addAsset = function (asset) {
        AssetLibrary.getBundle().addAsset(asset);
    };
    /**
     * Short-hand for removeAsset() method on default asset library bundle.
     *
     * @param asset The asset which should be removed from the library.
     * @param dispose Defines whether the assets should also be disposed.
     *
     * @see AssetLibraryBundle.removeAsset()
     */
    AssetLibrary.removeAsset = function (asset, dispose) {
        if (dispose === void 0) { dispose = true; }
        AssetLibrary.getBundle().removeAsset(asset, dispose);
    };
    /**
     * Short-hand for removeAssetByName() method on default asset library bundle.
     *
     * @param name The name of the asset to be removed.
     * @param ns The namespace to which the desired asset belongs.
     * @param dispose Defines whether the assets should also be disposed.
     *
     * @see AssetLibraryBundle.removeAssetByName()
     */
    AssetLibrary.removeAssetByName = function (name, ns, dispose) {
        if (ns === void 0) { ns = null; }
        if (dispose === void 0) { dispose = true; }
        return AssetLibrary.getBundle().removeAssetByName(name, ns, dispose);
    };
    /**
     * Short-hand for removeAllAssets() method on default asset library bundle.
     *
     * @param dispose Defines whether the assets should also be disposed.
     *
     * @see AssetLibraryBundle.removeAllAssets()
     */
    AssetLibrary.removeAllAssets = function (dispose) {
        if (dispose === void 0) { dispose = true; }
        AssetLibrary.getBundle().removeAllAssets(dispose);
    };
    /**
     * Short-hand for removeNamespaceAssets() method on default asset library bundle.
     *
     * @see AssetLibraryBundle.removeNamespaceAssets()
     */
    AssetLibrary.removeNamespaceAssets = function (ns, dispose) {
        if (ns === void 0) { ns = null; }
        if (dispose === void 0) { dispose = true; }
        AssetLibrary.getBundle().removeNamespaceAssets(ns, dispose);
    };
    return AssetLibrary;
})();
module.exports = AssetLibrary;


},{"awayjs-core/lib/library/AssetLibraryBundle":27,"awayjs-core/lib/library/AssetLoader":29}],"awayjs-core\\lib\\library\\AssetLoaderContext":[function(require,module,exports){
var AssetLoaderContext = (function () {
    /**
     * AssetLoaderContext provides configuration for the AssetLoader load() and parse() operations.
     * Use it to configure how (and if) dependencies are loaded, or to map dependency URLs to
     * embedded data.
     *
     * @see away.loading.AssetLoader
     */
    function AssetLoaderContext(includeDependencies, dependencyBaseUrl) {
        if (includeDependencies === void 0) { includeDependencies = true; }
        if (dependencyBaseUrl === void 0) { dependencyBaseUrl = null; }
        this._includeDependencies = includeDependencies;
        this._dependencyBaseUrl = dependencyBaseUrl || '';
        this._embeddedDataByUrl = {};
        this._remappedUrls = {};
        this._materialMode = AssetLoaderContext.UNDEFINED;
    }
    Object.defineProperty(AssetLoaderContext.prototype, "includeDependencies", {
        /**
         * Defines whether dependencies (all files except the one at the URL given to the load() or
         * parseData() operations) should be automatically loaded. Defaults to true.
         */
        get: function () {
            return this._includeDependencies;
        },
        set: function (val) {
            this._includeDependencies = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AssetLoaderContext.prototype, "materialMode", {
        /**
         * MaterialMode defines, if the Parser should create SinglePass or MultiPass Materials
         * Options:
         * 0 (Default / undefined) - All Parsers will create SinglePassMaterials, but the AWD2.1parser will create Materials as they are defined in the file
         * 1 (Force SinglePass) - All Parsers create SinglePassMaterials
         * 2 (Force MultiPass) - All Parsers will create MultiPassMaterials
         *
         */
        get: function () {
            return this._materialMode;
        },
        set: function (materialMode) {
            this._materialMode = materialMode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AssetLoaderContext.prototype, "dependencyBaseUrl", {
        /**
         * A base URL that will be prepended to all relative dependency URLs found in a loaded resource.
         * Absolute paths will not be affected by the value of this property.
         */
        get: function () {
            return this._dependencyBaseUrl;
        },
        set: function (val) {
            this._dependencyBaseUrl = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AssetLoaderContext.prototype, "overrideAbsolutePaths", {
        /**
         * Defines whether absolute paths (defined as paths that begin with a "/") should be overridden
         * with the dependencyBaseUrl defined in this context. If this is true, and the base path is
         * "base", /path/to/asset.jpg will be resolved as base/path/to/asset.jpg.
         */
        get: function () {
            return this._overrideAbsPath;
        },
        set: function (val) {
            this._overrideAbsPath = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AssetLoaderContext.prototype, "overrideFullURLs", {
        /**
         * Defines whether "full" URLs (defined as a URL that includes a scheme, e.g. http://) should be
         * overridden with the dependencyBaseUrl defined in this context. If this is true, and the base
         * path is "base", http://example.com/path/to/asset.jpg will be resolved as base/path/to/asset.jpg.
         */
        get: function () {
            return this._overrideFullUrls;
        },
        set: function (val) {
            this._overrideFullUrls = val;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Map a URL to another URL, so that files that are referred to by the original URL will instead
     * be loaded from the new URL. Use this when your file structure does not match the one that is
     * expected by the loaded file.
     *
     * @param originalUrl The original URL which is referenced in the loaded resource.
     * @param newUrl The URL from which away.should load the resource instead.
     *
     * @see mapUrlToData()
     */
    AssetLoaderContext.prototype.mapUrl = function (originalUrl, newUrl) {
        this._remappedUrls[originalUrl] = newUrl;
    };
    /**
     * Map a URL to embedded data, so that instead of trying to load a dependency from the URL at
     * which it's referenced, the dependency data will be retrieved straight from the memory instead.
     *
     * @param originalUrl The original URL which is referenced in the loaded resource.
     * @param data The embedded data. Can be ByteArray or a class which can be used to create a bytearray.
     */
    AssetLoaderContext.prototype.mapUrlToData = function (originalUrl, data) {
        this._embeddedDataByUrl[originalUrl] = data;
    };
    /**
     * @private
     * Defines whether embedded data has been mapped to a particular URL.
     */
    AssetLoaderContext.prototype._iHasDataForUrl = function (url) {
        return this._embeddedDataByUrl.hasOwnProperty(url);
    };
    /**
     * @private
     * Returns embedded data for a particular URL.
     */
    AssetLoaderContext.prototype._iGetDataForUrl = function (url) {
        return this._embeddedDataByUrl[url];
    };
    /**
     * @private
     * Defines whether a replacement URL has been mapped to a particular URL.
     */
    AssetLoaderContext.prototype._iHasMappingForUrl = function (url) {
        return this._remappedUrls.hasOwnProperty(url);
    };
    /**
     * @private
     * Returns new (replacement) URL for a particular original URL.
     */
    AssetLoaderContext.prototype._iGetRemappedUrl = function (originalUrl) {
        return this._remappedUrls[originalUrl];
    };
    AssetLoaderContext.UNDEFINED = 0;
    AssetLoaderContext.SINGLEPASS_MATERIALS = 1;
    AssetLoaderContext.MULTIPASS_MATERIALS = 2;
    return AssetLoaderContext;
})();
module.exports = AssetLoaderContext;


},{}],"awayjs-core\\lib\\library\\AssetLoaderToken":[function(require,module,exports){
module.exports=require(30)
},{"..\\awayjs-core\\lib\\library\\AssetLoaderToken.js":30,"awayjs-core/lib/events/EventDispatcher":10}],"awayjs-core\\lib\\library\\AssetLoader":[function(require,module,exports){
module.exports=require(29)
},{"..\\awayjs-core\\lib\\library\\AssetLoader.js":29,"awayjs-core/lib/errors/Error":6,"awayjs-core/lib/events/AssetEvent":8,"awayjs-core/lib/events/Event":9,"awayjs-core/lib/events/EventDispatcher":10,"awayjs-core/lib/events/IOErrorEvent":12,"awayjs-core/lib/events/LoaderEvent":13,"awayjs-core/lib/events/ParserEvent":14,"awayjs-core/lib/library/AssetLoaderToken":30,"awayjs-core/lib/net/URLLoader":39,"awayjs-core/lib/net/URLLoaderDataFormat":40,"awayjs-core/lib/parsers/CubeTextureParser":44,"awayjs-core/lib/parsers/ResourceDependency":47,"awayjs-core/lib/parsers/Texture2DParser":48}],"awayjs-core\\lib\\library\\AssetType":[function(require,module,exports){
module.exports=require(31)
},{"..\\awayjs-core\\lib\\library\\AssetType.js":31}],"awayjs-core\\lib\\library\\ConflictPrecedence":[function(require,module,exports){
module.exports=require(32)
},{"..\\awayjs-core\\lib\\library\\ConflictPrecedence.js":32}],"awayjs-core\\lib\\library\\ConflictStrategyBase":[function(require,module,exports){
module.exports=require(34)
},{"..\\awayjs-core\\lib\\library\\ConflictStrategyBase.js":34,"awayjs-core/lib/errors/AbstractMethodError":4,"awayjs-core/lib/events/AssetEvent":8,"awayjs-core/lib/library/ConflictPrecedence":32}],"awayjs-core\\lib\\library\\ConflictStrategy":[function(require,module,exports){
module.exports=require(33)
},{"..\\awayjs-core\\lib\\library\\ConflictStrategy.js":33,"awayjs-core/lib/library/ErrorConflictStrategy":35,"awayjs-core/lib/library/IgnoreConflictStrategy":36,"awayjs-core/lib/library/NumSuffixConflictStrategy":38}],"awayjs-core\\lib\\library\\ErrorConflictStrategy":[function(require,module,exports){
module.exports=require(35)
},{"..\\awayjs-core\\lib\\library\\ErrorConflictStrategy.js":35,"awayjs-core/lib/errors/Error":6,"awayjs-core/lib/library/ConflictStrategyBase":34}],"awayjs-core\\lib\\library\\IAsset":[function(require,module,exports){



},{}],"awayjs-core\\lib\\library\\IDUtil":[function(require,module,exports){
var IDUtil = (function () {
    function IDUtil() {
    }
    /**
     *  Generates a UID (unique identifier) based on ActionScript's
     *  pseudo-random number generator and the current time.
     *
     *  <p>The UID has the form
     *  <code>"XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"</code>
     *  where X is a hexadecimal digit (0-9, A-F).</p>
     *
     *  <p>This UID will not be truly globally unique; but it is the best
     *  we can do without player support for UID generation.</p>
     *
     *  @return The newly-generated UID.
     *
     *  @langversion 3.0
     *  @playerversion Flash 9
     *  @playerversion AIR 1.1
     *  @productversion Flex 3
     */
    IDUtil.createUID = function () {
        var uid = new Array(36);
        var index = 0;
        var i;
        var j;
        for (i = 0; i < 8; i++)
            uid[index++] = IDUtil.ALPHA_CHAR_CODES[Math.floor(Math.random() * 16)];
        for (i = 0; i < 3; i++) {
            uid[index++] = 45; // charCode for "-"
            for (j = 0; j < 4; j++)
                uid[index++] = IDUtil.ALPHA_CHAR_CODES[Math.floor(Math.random() * 16)];
        }
        uid[index++] = 45; // charCode for "-"
        var time = new Date().getTime();
        // Note: time is the number of milliseconds since 1970,
        // which is currently more than one trillion.
        // We use the low 8 hex digits of this number in the UID.
        // Just in case the system clock has been reset to
        // Jan 1-4, 1970 (in which case this number could have only
        // 1-7 hex digits), we pad on the left with 7 zeros
        // before taking the low digits.
        var timeString = ("0000000" + time.toString(16).toUpperCase()).substr(-8);
        for (i = 0; i < 8; i++)
            uid[index++] = timeString.charCodeAt(i);
        for (i = 0; i < 4; i++)
            uid[index++] = IDUtil.ALPHA_CHAR_CODES[Math.floor(Math.random() * 16)];
        return String.fromCharCode.apply(null, uid);
    };
    /**
     *  @private
     *  Char codes for 0123456789ABCDEF
     */
    IDUtil.ALPHA_CHAR_CODES = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70];
    return IDUtil;
})();
module.exports = IDUtil;


},{}],"awayjs-core\\lib\\library\\IgnoreConflictStrategy":[function(require,module,exports){
module.exports=require(36)
},{"..\\awayjs-core\\lib\\library\\IgnoreConflictStrategy.js":36,"awayjs-core/lib/library/ConflictStrategyBase":34}],"awayjs-core\\lib\\library\\NamedAssetBase":[function(require,module,exports){
module.exports=require(37)
},{"..\\awayjs-core\\lib\\library\\NamedAssetBase.js":37,"awayjs-core/lib/errors/AbstractMethodError":4,"awayjs-core/lib/events/AssetEvent":8,"awayjs-core/lib/events/EventDispatcher":10}],"awayjs-core\\lib\\library\\NumSuffixConflictStrategy":[function(require,module,exports){
module.exports=require(38)
},{"..\\awayjs-core\\lib\\library\\NumSuffixConflictStrategy.js":38,"awayjs-core/lib/library/ConflictStrategyBase":34}],"awayjs-core\\lib\\net\\CrossDomainPolicy":[function(require,module,exports){
var CrossDomainPolicy = (function () {
    function CrossDomainPolicy() {
    }
    CrossDomainPolicy.ANONYMOUS = 'anonymous';
    CrossDomainPolicy.USE_CREDENTIALS = 'use-credentials';
    return CrossDomainPolicy;
})();
module.exports = CrossDomainPolicy;


},{}],"awayjs-core\\lib\\net\\URLLoaderDataFormat":[function(require,module,exports){
module.exports=require(40)
},{"..\\awayjs-core\\lib\\net\\URLLoaderDataFormat.js":40}],"awayjs-core\\lib\\net\\URLLoader":[function(require,module,exports){
module.exports=require(39)
},{"..\\awayjs-core\\lib\\net\\URLLoader.js":39,"awayjs-core/lib/events/Event":9,"awayjs-core/lib/events/EventDispatcher":10,"awayjs-core/lib/events/HTTPStatusEvent":11,"awayjs-core/lib/events/IOErrorEvent":12,"awayjs-core/lib/events/ProgressEvent":15,"awayjs-core/lib/net/URLLoaderDataFormat":40,"awayjs-core/lib/net/URLRequestMethod":42,"awayjs-core/lib/net/URLVariables":43}],"awayjs-core\\lib\\net\\URLRequestMethod":[function(require,module,exports){
module.exports=require(42)
},{"..\\awayjs-core\\lib\\net\\URLRequestMethod.js":42}],"awayjs-core\\lib\\net\\URLRequest":[function(require,module,exports){
module.exports=require(41)
},{"..\\awayjs-core\\lib\\net\\URLRequest.js":41,"awayjs-core/lib/net/URLRequestMethod":42}],"awayjs-core\\lib\\net\\URLVariables":[function(require,module,exports){
module.exports=require(43)
},{"..\\awayjs-core\\lib\\net\\URLVariables.js":43}],"awayjs-core\\lib\\parsers\\CubeTextureParser":[function(require,module,exports){
module.exports=require(44)
},{"..\\awayjs-core\\lib\\parsers\\CubeTextureParser.js":44,"awayjs-core/lib/net/URLLoaderDataFormat":40,"awayjs-core/lib/net/URLRequest":41,"awayjs-core/lib/parsers/ParserBase":45,"awayjs-core/lib/textures/ImageCubeTexture":54}],"awayjs-core\\lib\\parsers\\ParserBase":[function(require,module,exports){
module.exports=require(45)
},{"..\\awayjs-core\\lib\\parsers\\ParserBase.js":45,"awayjs-core/lib/errors/AbstractMethodError":4,"awayjs-core/lib/events/AssetEvent":8,"awayjs-core/lib/events/EventDispatcher":10,"awayjs-core/lib/events/ParserEvent":14,"awayjs-core/lib/events/TimerEvent":17,"awayjs-core/lib/parsers/ParserUtils":46,"awayjs-core/lib/parsers/ResourceDependency":47,"awayjs-core/lib/utils/TextureUtils":62,"awayjs-core/lib/utils/Timer":63,"awayjs-core/lib/utils/getTimer":64}],"awayjs-core\\lib\\parsers\\ParserDataFormat":[function(require,module,exports){
/**
 * An enumeration providing values to describe the data format of parsed data.
 */
var ParserDataFormat = (function () {
    function ParserDataFormat() {
    }
    /**
     * Describes the format of a binary file.
     */
    ParserDataFormat.BINARY = "binary";
    /**
     * Describes the format of a plain text file.
     */
    ParserDataFormat.PLAIN_TEXT = "plainText";
    /**
     * Describes the format of an image file
     */
    ParserDataFormat.IMAGE = "image";
    return ParserDataFormat;
})();
module.exports = ParserDataFormat;


},{}],"awayjs-core\\lib\\parsers\\ParserUtils":[function(require,module,exports){
module.exports=require(46)
},{"..\\awayjs-core\\lib\\parsers\\ParserUtils.js":46,"awayjs-core/lib/utils/ByteArray":59}],"awayjs-core\\lib\\parsers\\ResourceDependency":[function(require,module,exports){
module.exports=require(47)
},{"..\\awayjs-core\\lib\\parsers\\ResourceDependency.js":47}],"awayjs-core\\lib\\parsers\\Texture2DParser":[function(require,module,exports){
module.exports=require(48)
},{"..\\awayjs-core\\lib\\parsers\\Texture2DParser.js":48,"awayjs-core/lib/net/URLLoaderDataFormat":40,"awayjs-core/lib/parsers/ParserBase":45,"awayjs-core/lib/parsers/ParserUtils":46,"awayjs-core/lib/textures/ImageTexture":55,"awayjs-core/lib/utils/ByteArray":59,"awayjs-core/lib/utils/TextureUtils":62}],"awayjs-core\\lib\\pool\\ITextureData":[function(require,module,exports){



},{}],"awayjs-core\\lib\\projections\\CoordinateSystem":[function(require,module,exports){
module.exports=require(49)
},{"..\\awayjs-core\\lib\\projections\\CoordinateSystem.js":49}],"awayjs-core\\lib\\projections\\FreeMatrixProjection":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var PerspectiveProjection = require("awayjs-core/lib/projections/PerspectiveProjection");
var ProjectionBase = require("awayjs-core/lib/projections/ProjectionBase");
var FreeMatrixProjection = (function (_super) {
    __extends(FreeMatrixProjection, _super);
    function FreeMatrixProjection() {
        _super.call(this);
        this._pMatrix.copyFrom(new PerspectiveProjection().matrix);
    }
    Object.defineProperty(FreeMatrixProjection.prototype, "near", {
        //@override
        set: function (value) {
            this._pNear = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FreeMatrixProjection.prototype, "far", {
        //@override
        set: function (value) {
            this._pFar = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FreeMatrixProjection.prototype, "iAspectRatio", {
        //@override
        set: function (value) {
            this._pAspectRatio = value;
        },
        enumerable: true,
        configurable: true
    });
    //@override
    FreeMatrixProjection.prototype.clone = function () {
        var clone = new FreeMatrixProjection();
        clone._pMatrix.copyFrom(this._pMatrix);
        clone._pNear = this._pNear;
        clone._pFar = this._pFar;
        clone._pAspectRatio = this._pAspectRatio;
        clone.pInvalidateMatrix();
        return clone;
    };
    //@override
    FreeMatrixProjection.prototype.pUpdateMatrix = function () {
        this._pMatrixInvalid = false;
    };
    return FreeMatrixProjection;
})(ProjectionBase);
module.exports = FreeMatrixProjection;


},{"awayjs-core/lib/projections/PerspectiveProjection":50,"awayjs-core/lib/projections/ProjectionBase":51}],"awayjs-core\\lib\\projections\\IProjection":[function(require,module,exports){



},{}],"awayjs-core\\lib\\projections\\ObliqueNearPlaneProjection":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var ProjectionEvent = require("awayjs-core/lib/events/ProjectionEvent");
var ProjectionBase = require("awayjs-core/lib/projections/ProjectionBase");
var ObliqueNearPlaneProjection = (function (_super) {
    __extends(ObliqueNearPlaneProjection, _super);
    function ObliqueNearPlaneProjection(baseProjection, plane) {
        var _this = this;
        _super.call(this);
        this.baseProjection = baseProjection;
        this.plane = plane;
        this._onProjectionMatrixChangedDelegate = function (event) { return _this.onProjectionMatrixChanged(event); };
    }
    Object.defineProperty(ObliqueNearPlaneProjection.prototype, "frustumCorners", {
        //@override
        get: function () {
            return this._baseProjection.frustumCorners;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ObliqueNearPlaneProjection.prototype, "near", {
        //@override
        get: function () {
            return this._baseProjection.near;
        },
        //@override
        set: function (value) {
            this._baseProjection.near = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ObliqueNearPlaneProjection.prototype, "far", {
        //@override
        get: function () {
            return this._baseProjection.far;
        },
        //@override
        set: function (value) {
            this._baseProjection.far = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ObliqueNearPlaneProjection.prototype, "iAspectRatio", {
        //@override
        get: function () {
            return this._baseProjection._iAspectRatio;
        },
        //@override
        set: function (value) {
            this._baseProjection._iAspectRatio = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ObliqueNearPlaneProjection.prototype, "plane", {
        get: function () {
            return this._plane;
        },
        set: function (value) {
            this._plane = value;
            this.pInvalidateMatrix();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ObliqueNearPlaneProjection.prototype, "baseProjection", {
        set: function (value) {
            if (this._baseProjection) {
                this._baseProjection.removeEventListener(ProjectionEvent.MATRIX_CHANGED, this._onProjectionMatrixChangedDelegate);
            }
            this._baseProjection = value;
            if (this._baseProjection) {
                this._baseProjection.addEventListener(ProjectionEvent.MATRIX_CHANGED, this._onProjectionMatrixChangedDelegate);
            }
            this.pInvalidateMatrix();
        },
        enumerable: true,
        configurable: true
    });
    ObliqueNearPlaneProjection.prototype.onProjectionMatrixChanged = function (event) {
        this.pInvalidateMatrix();
    };
    //@override
    ObliqueNearPlaneProjection.prototype.pUpdateMatrix = function () {
        this._pMatrix.copyFrom(this._baseProjection.matrix);
        var cx = this._plane.a;
        var cy = this._plane.b;
        var cz = this._plane.c;
        var cw = -this._plane.d + .05;
        var signX = cx >= 0 ? 1 : -1;
        var signY = cy >= 0 ? 1 : -1;
        var p = new Vector3D(signX, signY, 1, 1);
        var inverse = this._pMatrix.clone();
        inverse.invert();
        var q = inverse.transformVector(p);
        this._pMatrix.copyRowTo(3, p);
        var a = (q.x * p.x + q.y * p.y + q.z * p.z + q.w * p.w) / (cx * q.x + cy * q.y + cz * q.z + cw * q.w);
        this._pMatrix.copyRowFrom(2, new Vector3D(cx * a, cy * a, cz * a, cw * a));
    };
    return ObliqueNearPlaneProjection;
})(ProjectionBase);
module.exports = ObliqueNearPlaneProjection;


},{"awayjs-core/lib/events/ProjectionEvent":16,"awayjs-core/lib/geom/Vector3D":26,"awayjs-core/lib/projections/ProjectionBase":51}],"awayjs-core\\lib\\projections\\OrthographicOffCenterProjection":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var ProjectionBase = require("awayjs-core/lib/projections/ProjectionBase");
var OrthographicOffCenterProjection = (function (_super) {
    __extends(OrthographicOffCenterProjection, _super);
    function OrthographicOffCenterProjection(minX, maxX, minY, maxY) {
        _super.call(this);
        this._minX = minX;
        this._maxX = maxX;
        this._minY = minY;
        this._maxY = maxY;
    }
    Object.defineProperty(OrthographicOffCenterProjection.prototype, "minX", {
        get: function () {
            return this._minX;
        },
        set: function (value) {
            this._minX = value;
            this.pInvalidateMatrix();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OrthographicOffCenterProjection.prototype, "maxX", {
        get: function () {
            return this._maxX;
        },
        set: function (value) {
            this._maxX = value;
            this.pInvalidateMatrix();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OrthographicOffCenterProjection.prototype, "minY", {
        get: function () {
            return this._minY;
        },
        set: function (value) {
            this._minY = value;
            this.pInvalidateMatrix();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OrthographicOffCenterProjection.prototype, "maxY", {
        get: function () {
            return this._maxY;
        },
        set: function (value) {
            this._maxY = value;
            this.pInvalidateMatrix();
        },
        enumerable: true,
        configurable: true
    });
    //@override
    OrthographicOffCenterProjection.prototype.unproject = function (nX, nY, sZ) {
        var v = new Vector3D(nX, -nY, sZ, 1.0);
        v = this.unprojectionMatrix.transformVector(v);
        //z is unaffected by transform
        v.z = sZ;
        return v;
    };
    //@override
    OrthographicOffCenterProjection.prototype.clone = function () {
        var clone = new OrthographicOffCenterProjection(this._minX, this._maxX, this._minY, this._maxY);
        clone._pNear = this._pNear;
        clone._pFar = this._pFar;
        clone._pAspectRatio = this._pAspectRatio;
        return clone;
    };
    //@override
    OrthographicOffCenterProjection.prototype.pUpdateMatrix = function () {
        var raw = [];
        var w = 1 / (this._maxX - this._minX);
        var h = 1 / (this._maxY - this._minY);
        var d = 1 / (this._pFar - this._pNear);
        raw[0] = 2 * w;
        raw[5] = 2 * h;
        raw[10] = d;
        raw[12] = -(this._maxX + this._minX) * w;
        raw[13] = -(this._maxY + this._minY) * h;
        raw[14] = -this._pNear * d;
        raw[15] = 1;
        raw[1] = raw[2] = raw[3] = raw[4] = raw[6] = raw[7] = raw[8] = raw[9] = raw[11] = 0;
        this._pMatrix.copyRawDataFrom(raw);
        this._pFrustumCorners[0] = this._pFrustumCorners[9] = this._pFrustumCorners[12] = this._pFrustumCorners[21] = this._minX;
        this._pFrustumCorners[3] = this._pFrustumCorners[6] = this._pFrustumCorners[15] = this._pFrustumCorners[18] = this._maxX;
        this._pFrustumCorners[1] = this._pFrustumCorners[4] = this._pFrustumCorners[13] = this._pFrustumCorners[16] = this._minY;
        this._pFrustumCorners[7] = this._pFrustumCorners[10] = this._pFrustumCorners[19] = this._pFrustumCorners[22] = this._maxY;
        this._pFrustumCorners[2] = this._pFrustumCorners[5] = this._pFrustumCorners[8] = this._pFrustumCorners[11] = this._pNear;
        this._pFrustumCorners[14] = this._pFrustumCorners[17] = this._pFrustumCorners[20] = this._pFrustumCorners[23] = this._pFar;
        this._pMatrixInvalid = false;
    };
    return OrthographicOffCenterProjection;
})(ProjectionBase);
module.exports = OrthographicOffCenterProjection;


},{"awayjs-core/lib/geom/Vector3D":26,"awayjs-core/lib/projections/ProjectionBase":51}],"awayjs-core\\lib\\projections\\OrthographicProjection":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Vector3D = require("awayjs-core/lib/geom/Vector3D");
var ProjectionBase = require("awayjs-core/lib/projections/ProjectionBase");
var OrthographicProjection = (function (_super) {
    __extends(OrthographicProjection, _super);
    function OrthographicProjection(projectionHeight) {
        if (projectionHeight === void 0) { projectionHeight = 500; }
        _super.call(this);
        this._projectionHeight = projectionHeight;
    }
    Object.defineProperty(OrthographicProjection.prototype, "projectionHeight", {
        get: function () {
            return this._projectionHeight;
        },
        set: function (value) {
            if (value == this._projectionHeight) {
                return;
            }
            this._projectionHeight = value;
            this.pInvalidateMatrix();
        },
        enumerable: true,
        configurable: true
    });
    //@override
    OrthographicProjection.prototype.unproject = function (nX, nY, sZ) {
        var v = new Vector3D(nX + this.matrix.rawData[12], -nY + this.matrix.rawData[13], sZ, 1.0);
        v = this.unprojectionMatrix.transformVector(v);
        //z is unaffected by transform
        v.z = sZ;
        return v;
    };
    //@override
    OrthographicProjection.prototype.clone = function () {
        var clone = new OrthographicProjection();
        clone._pNear = this._pNear;
        clone._pFar = this._pFar;
        clone._pAspectRatio = this._pAspectRatio;
        clone.projectionHeight = this._projectionHeight;
        return clone;
    };
    //@override
    OrthographicProjection.prototype.pUpdateMatrix = function () {
        var raw = [];
        this._yMax = this._projectionHeight * .5;
        this._xMax = this._yMax * this._pAspectRatio;
        var left;
        var right;
        var top;
        var bottom;
        if (this._pScissorRect.x == 0 && this._pScissorRect.y == 0 && this._pScissorRect.width == this._pViewPort.width && this._pScissorRect.height == this._pViewPort.height) {
            // assume symmetric frustum
            left = -this._xMax;
            right = this._xMax;
            top = -this._yMax;
            bottom = this._yMax;
            raw[0] = 2 / (this._projectionHeight * this._pAspectRatio);
            raw[5] = 2 / this._projectionHeight;
            raw[10] = 1 / (this._pFar - this._pNear);
            raw[14] = this._pNear / (this._pNear - this._pFar);
            raw[1] = raw[2] = raw[3] = raw[4] = raw[6] = raw[7] = raw[8] = raw[9] = raw[11] = raw[12] = raw[13] = 0;
            raw[15] = 1;
        }
        else {
            var xWidth = this._xMax * (this._pViewPort.width / this._pScissorRect.width);
            var yHgt = this._yMax * (this._pViewPort.height / this._pScissorRect.height);
            var center = this._xMax * (this._pScissorRect.x * 2 - this._pViewPort.width) / this._pScissorRect.width + this._xMax;
            var middle = -this._yMax * (this._pScissorRect.y * 2 - this._pViewPort.height) / this._pScissorRect.height - this._yMax;
            left = center - xWidth;
            right = center + xWidth;
            top = middle - yHgt;
            bottom = middle + yHgt;
            raw[0] = 2 * 1 / (right - left);
            raw[5] = -2 * 1 / (top - bottom);
            raw[10] = 1 / (this._pFar - this._pNear);
            raw[12] = (right + left) / (right - left);
            raw[13] = (bottom + top) / (bottom - top);
            raw[14] = this._pNear / (this.near - this.far);
            raw[1] = raw[2] = raw[3] = raw[4] = raw[6] = raw[7] = raw[8] = raw[9] = raw[11] = 0;
            raw[15] = 1;
        }
        this._pFrustumCorners[0] = this._pFrustumCorners[9] = this._pFrustumCorners[12] = this._pFrustumCorners[21] = left;
        this._pFrustumCorners[3] = this._pFrustumCorners[6] = this._pFrustumCorners[15] = this._pFrustumCorners[18] = right;
        this._pFrustumCorners[1] = this._pFrustumCorners[4] = this._pFrustumCorners[13] = this._pFrustumCorners[16] = top;
        this._pFrustumCorners[7] = this._pFrustumCorners[10] = this._pFrustumCorners[19] = this._pFrustumCorners[22] = bottom;
        this._pFrustumCorners[2] = this._pFrustumCorners[5] = this._pFrustumCorners[8] = this._pFrustumCorners[11] = this._pNear;
        this._pFrustumCorners[14] = this._pFrustumCorners[17] = this._pFrustumCorners[20] = this._pFrustumCorners[23] = this._pFar;
        this._pMatrix.copyRawDataFrom(raw);
        this._pMatrixInvalid = false;
    };
    return OrthographicProjection;
})(ProjectionBase);
module.exports = OrthographicProjection;


},{"awayjs-core/lib/geom/Vector3D":26,"awayjs-core/lib/projections/ProjectionBase":51}],"awayjs-core\\lib\\projections\\PerspectiveProjection":[function(require,module,exports){
module.exports=require(50)
},{"..\\awayjs-core\\lib\\projections\\PerspectiveProjection.js":50,"awayjs-core/lib/geom/Vector3D":26,"awayjs-core/lib/projections/CoordinateSystem":49,"awayjs-core/lib/projections/ProjectionBase":51}],"awayjs-core\\lib\\projections\\ProjectionBase":[function(require,module,exports){
module.exports=require(51)
},{"..\\awayjs-core\\lib\\projections\\ProjectionBase.js":51,"awayjs-core/lib/errors/AbstractMethodError":4,"awayjs-core/lib/events/EventDispatcher":10,"awayjs-core/lib/events/ProjectionEvent":16,"awayjs-core/lib/geom/Matrix3D":20,"awayjs-core/lib/geom/Rectangle":25}],"awayjs-core\\lib\\textures\\BitmapCubeTexture":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Error = require("awayjs-core/lib/errors/Error");
var CubeTextureBase = require("awayjs-core/lib/textures/CubeTextureBase");
var TextureUtils = require("awayjs-core/lib/utils/TextureUtils");
var BitmapCubeTexture = (function (_super) {
    __extends(BitmapCubeTexture, _super);
    function BitmapCubeTexture(posX, negX, posY, negY, posZ, negZ, generateMipmaps) {
        if (generateMipmaps === void 0) { generateMipmaps = false; }
        _super.call(this, generateMipmaps);
        this._bitmapDatas = new Array(6);
        this._testSize(this._bitmapDatas[0] = posX);
        this._testSize(this._bitmapDatas[1] = negX);
        this._testSize(this._bitmapDatas[2] = posY);
        this._testSize(this._bitmapDatas[3] = negY);
        this._testSize(this._bitmapDatas[4] = posZ);
        this._testSize(this._bitmapDatas[5] = negZ);
        this.invalidateContent();
        this._pSetSize(posX.width);
    }
    Object.defineProperty(BitmapCubeTexture.prototype, "positiveX", {
        /**
         * The texture on the cube's right face.
         */
        get: function () {
            return this._bitmapDatas[0];
        },
        set: function (value) {
            this._testSize(value);
            this.invalidateContent();
            this._pSetSize(value.width);
            this._bitmapDatas[0] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BitmapCubeTexture.prototype, "negativeX", {
        /**
         * The texture on the cube's left face.
         */
        get: function () {
            return this._bitmapDatas[1];
        },
        set: function (value) {
            this._testSize(value);
            this.invalidateContent();
            this._pSetSize(value.width);
            this._bitmapDatas[1] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BitmapCubeTexture.prototype, "positiveY", {
        /**
         * The texture on the cube's top face.
         */
        get: function () {
            return this._bitmapDatas[2];
        },
        set: function (value) {
            this._testSize(value);
            this.invalidateContent();
            this._pSetSize(value.width);
            this._bitmapDatas[2] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BitmapCubeTexture.prototype, "negativeY", {
        /**
         * The texture on the cube's bottom face.
         */
        get: function () {
            return this._bitmapDatas[3];
        },
        set: function (value) {
            this._testSize(value);
            this.invalidateContent();
            this._pSetSize(value.width);
            this._bitmapDatas[3] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BitmapCubeTexture.prototype, "positiveZ", {
        /**
         * The texture on the cube's far face.
         */
        get: function () {
            return this._bitmapDatas[4];
        },
        set: function (value) {
            this._testSize(value);
            this.invalidateContent();
            this._pSetSize(value.width);
            this._bitmapDatas[4] = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BitmapCubeTexture.prototype, "negativeZ", {
        /**
         * The texture on the cube's near face.
         */
        get: function () {
            return this._bitmapDatas[5];
        },
        set: function (value) {
            this._testSize(value);
            this.invalidateContent();
            this._pSetSize(value.width);
            this._bitmapDatas[5] = value;
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     * @param value
     * @private
     */
    BitmapCubeTexture.prototype._testSize = function (value) {
        if (value.width != value.height)
            throw new Error("BitmapData should have equal width and height!");
        if (!TextureUtils.isBitmapDataValid(value))
            throw new Error("Invalid bitmapData: Width and height must be power of 2 and cannot exceed 2048");
    };
    BitmapCubeTexture.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        var len = this._bitmapDatas.length;
        for (var i = 0; i < len; i++) {
            this._bitmapDatas[i].dispose();
            this._bitmapDatas[i] = null;
        }
        this._bitmapDatas = null;
    };
    BitmapCubeTexture.prototype._iGetTextureData = function (side) {
        return this._bitmapDatas[side];
    };
    return BitmapCubeTexture;
})(CubeTextureBase);
module.exports = BitmapCubeTexture;


},{"awayjs-core/lib/errors/Error":6,"awayjs-core/lib/textures/CubeTextureBase":53,"awayjs-core/lib/utils/TextureUtils":62}],"awayjs-core\\lib\\textures\\BitmapTexture":[function(require,module,exports){
module.exports=require(52)
},{"..\\awayjs-core\\lib\\textures\\BitmapTexture.js":52,"awayjs-core/lib/errors/Error":6,"awayjs-core/lib/textures/Texture2DBase":57,"awayjs-core/lib/utils/TextureUtils":62}],"awayjs-core\\lib\\textures\\CubeTextureBase":[function(require,module,exports){
module.exports=require(53)
},{"..\\awayjs-core\\lib\\textures\\CubeTextureBase.js":53,"awayjs-core/lib/errors/AbstractMethodError":4,"awayjs-core/lib/textures/MipmapGenerator":56,"awayjs-core/lib/textures/TextureProxyBase":58}],"awayjs-core\\lib\\textures\\ImageCubeTexture":[function(require,module,exports){
module.exports=require(54)
},{"..\\awayjs-core\\lib\\textures\\ImageCubeTexture.js":54,"awayjs-core/lib/errors/Error":6,"awayjs-core/lib/textures/CubeTextureBase":53,"awayjs-core/lib/utils/TextureUtils":62}],"awayjs-core\\lib\\textures\\ImageTexture":[function(require,module,exports){
module.exports=require(55)
},{"..\\awayjs-core\\lib\\textures\\ImageTexture.js":55,"awayjs-core/lib/errors/Error":6,"awayjs-core/lib/textures/Texture2DBase":57,"awayjs-core/lib/utils/TextureUtils":62}],"awayjs-core\\lib\\textures\\MipmapGenerator":[function(require,module,exports){
module.exports=require(56)
},{"..\\awayjs-core\\lib\\textures\\MipmapGenerator.js":56,"awayjs-core/lib/base/BitmapData":1,"awayjs-core/lib/geom/Matrix":19,"awayjs-core/lib/geom/Rectangle":25}],"awayjs-core\\lib\\textures\\RenderTexture":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Error = require("awayjs-core/lib/errors/Error");
var Texture2DBase = require("awayjs-core/lib/textures/Texture2DBase");
var TextureUtils = require("awayjs-core/lib/utils/TextureUtils");
var RenderTexture = (function (_super) {
    __extends(RenderTexture, _super);
    function RenderTexture(width, height) {
        _super.call(this, false);
        this._pSetSize(width, height);
    }
    Object.defineProperty(RenderTexture.prototype, "width", {
        /**
         *
         * @returns {number}
         */
        get: function () {
            return this._pWidth;
        },
        set: function (value) {
            if (value == this._pWidth)
                return;
            if (!TextureUtils.isDimensionValid(value))
                throw new Error("Invalid size: Width and height must be power of 2 and cannot exceed 2048");
            this.invalidateContent();
            this._pSetSize(value, this._pHeight);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RenderTexture.prototype, "height", {
        /**
         *
         * @returns {number}
         */
        get: function () {
            return this._pHeight;
        },
        set: function (value) {
            if (value == this._pHeight)
                return;
            if (!TextureUtils.isDimensionValid(value))
                throw new Error("Invalid size: Width and height must be power of 2 and cannot exceed 2048");
            this.invalidateContent();
            this._pSetSize(this._pWidth, value);
        },
        enumerable: true,
        configurable: true
    });
    return RenderTexture;
})(Texture2DBase);
module.exports = RenderTexture;


},{"awayjs-core/lib/errors/Error":6,"awayjs-core/lib/textures/Texture2DBase":57,"awayjs-core/lib/utils/TextureUtils":62}],"awayjs-core\\lib\\textures\\SpecularBitmapTexture":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var BitmapData = require("awayjs-core/lib/base/BitmapData");
var BitmapDataChannel = require("awayjs-core/lib/base/BitmapDataChannel");
var Point = require("awayjs-core/lib/geom/Point");
var BitmapTexture = require("awayjs-core/lib/textures/BitmapTexture");
/**
 * A convenience texture that encodes a specular map in the red channel, and the gloss map in the green channel, as expected by BasicSpecularMapMethod
 */
var SpecularBitmapTexture = (function (_super) {
    __extends(SpecularBitmapTexture, _super);
    function SpecularBitmapTexture(specularMap, glossMap, generateMipmaps) {
        if (specularMap === void 0) { specularMap = null; }
        if (glossMap === void 0) { glossMap = null; }
        if (generateMipmaps === void 0) { generateMipmaps = true; }
        var bmd = specularMap ? specularMap : glossMap;
        bmd = bmd ? new BitmapData(bmd.width, bmd.height, false, 0xffffff) : new BitmapData(1, 1, false, 0xffffff);
        _super.call(this, bmd, generateMipmaps);
        this.specularMap = specularMap;
        this.glossMap = glossMap;
    }
    Object.defineProperty(SpecularBitmapTexture.prototype, "specularMap", {
        get: function () {
            return this._specularMap;
        },
        set: function (value) {
            this._specularMap = value;
            this.invalidateContent();
            this._testSize();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpecularBitmapTexture.prototype, "glossMap", {
        get: function () {
            return this._glossMap;
        },
        set: function (value) {
            this._glossMap = value;
            this.invalidateContent();
            this._testSize();
        },
        enumerable: true,
        configurable: true
    });
    SpecularBitmapTexture.prototype._testSize = function () {
        var w, h;
        if (this._specularMap) {
            w = this._specularMap.width;
            h = this._specularMap.height;
        }
        else if (this._glossMap) {
            w = this._glossMap.width;
            h = this._glossMap.height;
        }
        else {
            w = 1;
            h = 1;
        }
        if (w != this._bitmapData.width && h != this._bitmapData.height) {
            var oldBitmap = this._bitmapData;
            this.bitmapData = new BitmapData(this._specularMap.width, this._specularMap.height, false, 0xffffff);
            oldBitmap.dispose();
        }
    };
    SpecularBitmapTexture.prototype._iGetTextureData = function () {
        var rect = this._specularMap.rect;
        var origin = new Point();
        this._bitmapData.fillRect(rect, 0xffffff);
        if (this._glossMap)
            this._bitmapData.copyChannel(this._glossMap, rect, origin, BitmapDataChannel.GREEN, BitmapDataChannel.GREEN);
        if (this._specularMap)
            this._bitmapData.copyChannel(this._specularMap, rect, origin, BitmapDataChannel.RED, BitmapDataChannel.RED);
        return this._bitmapData;
    };
    return SpecularBitmapTexture;
})(BitmapTexture);
module.exports = SpecularBitmapTexture;


},{"awayjs-core/lib/base/BitmapData":1,"awayjs-core/lib/base/BitmapDataChannel":2,"awayjs-core/lib/geom/Point":24,"awayjs-core/lib/textures/BitmapTexture":52}],"awayjs-core\\lib\\textures\\Texture2DBase":[function(require,module,exports){
module.exports=require(57)
},{"..\\awayjs-core\\lib\\textures\\Texture2DBase.js":57,"awayjs-core/lib/errors/AbstractMethodError":4,"awayjs-core/lib/textures/MipmapGenerator":56,"awayjs-core/lib/textures/TextureProxyBase":58}],"awayjs-core\\lib\\textures\\TextureProxyBase":[function(require,module,exports){
module.exports=require(58)
},{"..\\awayjs-core\\lib\\textures\\TextureProxyBase.js":58,"awayjs-core/lib/library/AssetType":31,"awayjs-core/lib/library/NamedAssetBase":37}],"awayjs-core\\lib\\ui\\Keyboard":[function(require,module,exports){
var Keyboard = (function () {
    function Keyboard() {
    }
    /**
     * Constant associated with the key code value for the A key (65).
     */
    Keyboard.A = 65;
    /**
     * Constant associated with the key code value for the Alternate (Option) key  (18).
     */
    Keyboard.ALTERNATE = 18;
    /**
     * Select the audio mode
     */
    Keyboard.AUDIO = 0x01000017;
    /**
     * Constant associated with the key code value for the B key (66).
     */
    Keyboard.B = 66;
    /**
     * Return to previous page in application
     */
    Keyboard.BACK = 0x01000016;
    /**
     * Constant associated with the key code value for the ` key (192).
     */
    Keyboard.BACKQUOTE = 192;
    /**
     * Constant associated with the key code value for the \ key (220).
     */
    Keyboard.BACKSLASH = 220;
    /**
     * Constant associated with the key code value for the Backspace key (8).
     */
    Keyboard.BACKSPACE = 8;
    /**
     * Blue function key button
     */
    Keyboard.BLUE = 0x01000003;
    /**
     * Constant associated with the key code value for the C key (67).
     */
    Keyboard.C = 67;
    /**
     * Constant associated with the key code value for the Caps Lock key (20).
     */
    Keyboard.CAPS_LOCK = 20;
    /**
     * Channel down
     */
    Keyboard.CHANNEL_DOWN = 0x01000005;
    /**
     * Channel up
     */
    Keyboard.CHANNEL_UP = 0x01000005;
    /**
     * Constant associated with the key code value for the , key (188).
     */
    Keyboard.COMMA = 188;
    /**
     * Constant associated with the Mac command key (15). This constant is
     * currently only used for setting menu key equivalents.
     */
    Keyboard.COMMAND = 15;
    /**
     * Constant associated with the key code value for the Control key (17).
     */
    Keyboard.CONTROL = 17;
    /**
     * Constant associated with the key code value for the D key (68).
     */
    Keyboard.D = 68;
    /**
     * Constant associated with the key code value for the Delete key (46).
     */
    Keyboard.DELETE = 46;
    /**
     * Constant associated with the key code value for the Down Arrow key (40).
     */
    Keyboard.DOWN = 40;
    /**
     * Engage DVR application mode
     */
    Keyboard.DVR = 0x01000019;
    /**
     * Constant associated with the key code value for the E key (69).
     */
    Keyboard.E = 69;
    /**
     * Constant associated with the key code value for the End key (35).
     */
    Keyboard.END = 35;
    /**
     * Constant associated with the key code value for the Enter key (13).
     */
    Keyboard.ENTER = 13;
    /**
     * Constant associated with the key code value for the = key (187).
     */
    Keyboard.EQUAL = 187;
    /**
     * Constant associated with the key code value for the Escape key (27).
     */
    Keyboard.ESCAPE = 27;
    /**
     * Exits current application mode
     */
    Keyboard.EXIT = 0x01000015;
    /**
     * Constant associated with the key code value for the F key (70).
     */
    Keyboard.F = 70;
    /**
     * Constant associated with the key code value for the F1 key (112).
     */
    Keyboard.F1 = 112;
    /**
     * Constant associated with the key code value for the F10 key (121).
     */
    Keyboard.F10 = 121;
    /**
     * Constant associated with the key code value for the F11 key (122).
     */
    Keyboard.F11 = 122;
    /**
     * Constant associated with the key code value for the F12 key (123).
     */
    Keyboard.F12 = 123;
    /**
     * Constant associated with the key code value for the F13 key (124).
     */
    Keyboard.F13 = 124;
    /**
     * Constant associated with the key code value for the F14 key (125).
     */
    Keyboard.F14 = 125;
    /**
     * Constant associated with the key code value for the F15 key (126).
     */
    Keyboard.F15 = 126;
    /**
     * Constant associated with the key code value for the F2 key (113).
     */
    Keyboard.F2 = 113;
    /**
     * Constant associated with the key code value for the F3 key (114).
     */
    Keyboard.F3 = 114;
    /**
     * Constant associated with the key code value for the F4 key (115).
     */
    Keyboard.F4 = 115;
    /**
     * Constant associated with the key code value for the F5 key (116).
     */
    Keyboard.F5 = 116;
    /**
     * Constant associated with the key code value for the F6 key (117).
     */
    Keyboard.F6 = 117;
    /**
     * Constant associated with the key code value for the F7 key (118).
     */
    Keyboard.F7 = 118;
    /**
     * Constant associated with the key code value for the F8 key (119).
     */
    Keyboard.F8 = 119;
    /**
     * Constant associated with the key code value for the F9 key (120).
     */
    Keyboard.F9 = 120;
    /**
     * Engage fast-forward transport mode
     */
    Keyboard.FAST_FORWARD = 0x0100000A;
    /**
     * Constant associated with the key code value for the G key (71).
     */
    Keyboard.G = 71;
    /**
     * Green function key button
     */
    Keyboard.GREEN = 0x01000001;
    /**
     * Engage program guide
     */
    Keyboard.GUIDE = 0x01000014;
    /**
     * Constant associated with the key code value for the H key (72).
     */
    Keyboard.H = 72;
    /**
     * Engage help application or context-sensitive help
     */
    Keyboard.HELP = 0x0100001D;
    /**
     * Constant associated with the key code value for the Home key (36).
     */
    Keyboard.HOME = 36;
    /**
     * Constant associated with the key code value for the I key (73).
     */
    Keyboard.I = 73;
    /**
     * Info button
     */
    Keyboard.INFO = 0x01000013;
    /**
     * Cycle input
     */
    Keyboard.INPUT = 0x0100001B;
    /**
     * Constant associated with the key code value for the Insert key (45).
     */
    Keyboard.INSERT = 45;
    /**
     * Constant associated with the key code value for the J key (74).
     */
    Keyboard.J = 74;
    /**
     * Constant associated with the key code value for the K key (75).
     */
    Keyboard.K = 75;
    /**
     * The Begin key
     */
    Keyboard.KEYNAME_BEGIN = "Begin";
    /**
     * The Break key
     */
    Keyboard.KEYNAME_BREAK = "Break";
    /**
     * The Clear Display key
     */
    Keyboard.KEYNAME_CLEARDISPLAY = "ClrDsp";
    /**
     * The Clear Line key
     */
    Keyboard.KEYNAME_CLEARLINE = "ClrLn";
    /**
     * The Delete key
     */
    Keyboard.KEYNAME_DELETE = "Delete";
    /**
     * The Delete Character key
     */
    Keyboard.KEYNAME_DELETECHAR = "DelChr";
    /**
     * The Delete Line key
     */
    Keyboard.KEYNAME_DELETELINE = "DelLn";
    /**
     * The down arrow
     */
    Keyboard.KEYNAME_DOWNARROW = "Down";
    /**
     * The End key
     */
    Keyboard.KEYNAME_END = "End";
    /**
     * The Execute key
     */
    Keyboard.KEYNAME_EXECUTE = "Exec";
    /**
     * The F1 key
     */
    Keyboard.KEYNAME_F1 = "F1";
    /**
     * The F10 key
     */
    Keyboard.KEYNAME_F10 = "F10";
    /**
     * The F11 key
     */
    Keyboard.KEYNAME_F11 = "F11";
    /**
     * The F12 key
     */
    Keyboard.KEYNAME_F12 = "F12";
    /**
     * The F13 key
     */
    Keyboard.KEYNAME_F13 = "F13";
    /**
     * The F14 key
     */
    Keyboard.KEYNAME_F14 = "F14";
    /**
     * The F15 key
     */
    Keyboard.KEYNAME_F15 = "F15";
    /**
     * The F16 key
     */
    Keyboard.KEYNAME_F16 = "F16";
    /**
     * The F17 key
     */
    Keyboard.KEYNAME_F17 = "F17";
    /**
     * The F18 key
     */
    Keyboard.KEYNAME_F18 = "F18";
    /**
     * The F19 key
     */
    Keyboard.KEYNAME_F19 = "F19";
    /**
     * The F2 key
     */
    Keyboard.KEYNAME_F2 = "F2";
    /**
     * The F20 key
     */
    Keyboard.KEYNAME_F20 = "F20";
    /**
     * The F21 key
     */
    Keyboard.KEYNAME_F21 = "F21";
    /**
     * The F22 key
     */
    Keyboard.KEYNAME_F22 = "F22";
    /**
     * The F23 key
     */
    Keyboard.KEYNAME_F23 = "F23";
    /**
     * The F24 key
     */
    Keyboard.KEYNAME_F24 = "F24";
    /**
     * The F25 key
     */
    Keyboard.KEYNAME_F25 = "F25";
    /**
     * The F26 key
     */
    Keyboard.KEYNAME_F26 = "F26";
    /**
     * The F27 key
     */
    Keyboard.KEYNAME_F27 = "F27";
    /**
     * The F28 key
     */
    Keyboard.KEYNAME_F28 = "F28";
    /**
     * The F29 key
     */
    Keyboard.KEYNAME_F29 = "F29";
    /**
     * The F3 key
     */
    Keyboard.KEYNAME_F3 = "F3";
    /**
     * The F30 key
     */
    Keyboard.KEYNAME_F30 = "F30";
    /**
     * The F31 key
     */
    Keyboard.KEYNAME_F31 = "F31";
    /**
     * The F32 key
     */
    Keyboard.KEYNAME_F32 = "F32";
    /**
     * The F33 key
     */
    Keyboard.KEYNAME_F33 = "F33";
    /**
     * The F34 key
     */
    Keyboard.KEYNAME_F34 = "F34";
    /**
     * The F35 key
     */
    Keyboard.KEYNAME_F35 = "F35";
    /**
     * The F4 key
     */
    Keyboard.KEYNAME_F4 = "F4";
    /**
     * The F5 key
     */
    Keyboard.KEYNAME_F5 = "F5";
    /**
     * The F6 key
     */
    Keyboard.KEYNAME_F6 = "F6";
    /**
     * The F7 key
     */
    Keyboard.KEYNAME_F7 = "F7";
    /**
     * The F8 key
     */
    Keyboard.KEYNAME_F8 = "F8";
    /**
     * The F9 key
     */
    Keyboard.KEYNAME_F9 = "F9";
    /**
     * The Find key
     */
    Keyboard.KEYNAME_FIND = "Find";
    /**
     * The Help key
     */
    Keyboard.KEYNAME_HELP = "Help";
    /**
     * The Home key
     */
    Keyboard.KEYNAME_HOME = "Home";
    /**
     * The Insert key
     */
    Keyboard.KEYNAME_INSERT = "Insert";
    /**
     * The Insert Character key
     */
    Keyboard.KEYNAME_INSERTCHAR = "InsChr";
    /**
     * The Insert Line key
     */
    Keyboard.KEYNAME_INSERTLINE = "LnsLn";
    /**
     * The left arrow
     */
    Keyboard.KEYNAME_LEFTARROW = "Left";
    /**
     * The Menu key
     */
    Keyboard.KEYNAME_MENU = "Menu";
    /**
     * The Mode Switch key
     */
    Keyboard.KEYNAME_MODESWITCH = "ModeSw";
    /**
     * The Next key
     */
    Keyboard.KEYNAME_NEXT = "Next";
    /**
     * The Page Down key
     */
    Keyboard.KEYNAME_PAGEDOWN = "PgDn";
    /**
     * The Page Up key
     */
    Keyboard.KEYNAME_PAGEUP = "PgUp";
    /**
     * The Pause key
     */
    Keyboard.KEYNAME_PAUSE = "Pause";
    /**
     * The Previous key
     */
    Keyboard.KEYNAME_PREV = "Prev";
    /**
     * The PRINT key
     */
    Keyboard.KEYNAME_PRINT = "Print";
    /**
     * The PRINT Screen
     */
    Keyboard.KEYNAME_PRINTSCREEN = "PrntScrn";
    /**
     * The Redo key
     */
    Keyboard.KEYNAME_REDO = "Redo";
    /**
     * The Reset key
     */
    Keyboard.KEYNAME_RESET = "Reset";
    /**
     * The right arrow
     */
    Keyboard.KEYNAME_RIGHTARROW = "Right";
    /**
     * The Scroll Lock key
     */
    Keyboard.KEYNAME_SCROLLLOCK = "ScrlLck";
    /**
     * The Select key
     */
    Keyboard.KEYNAME_SELECT = "Select";
    /**
     * The Stop key
     */
    Keyboard.KEYNAME_STOP = "Stop";
    /**
     * The System Request key
     */
    Keyboard.KEYNAME_SYSREQ = "SysReq";
    /**
     * The System key
     */
    Keyboard.KEYNAME_SYSTEM = "Sys";
    /**
     * The Undo key
     */
    Keyboard.KEYNAME_UNDO = "Undo";
    /**
     * The up arrow
     */
    Keyboard.KEYNAME_UPARROW = "Up";
    /**
     * The User key
     */
    Keyboard.KEYNAME_USER = "User";
    /**
     * Constant associated with the key code value for the L key (76).
     */
    Keyboard.L = 76;
    /**
     * Watch last channel or show watched
     */
    Keyboard.LAST = 0x01000011;
    /**
     * Constant associated with the key code value for the Left Arrow key (37).
     */
    Keyboard.LEFT = 37;
    /**
     * Constant associated with the key code value for the [ key (219).
     */
    Keyboard.LEFTBRACKET = 219;
    /**
     * Return to live [position in broadcast]
     */
    Keyboard.LIVE = 0x01000010;
    /**
     * Constant associated with the key code value for the M key (77).
     */
    Keyboard.M = 77;
    /**
     * Engage "Master Shell" e.g. TiVo or other vendor button
     */
    Keyboard.MASTER_SHELL = 0x0100001E;
    /**
     * Engage menu
     */
    Keyboard.MENU = 0x01000012;
    /**
     * Constant associated with the key code value for the - key (189).
     */
    Keyboard.MINUS = 189;
    /**
     * Constant associated with the key code value for the N key (78).
     */
    Keyboard.N = 78;
    /**
     * Skip to next track or chapter
     */
    Keyboard.NEXT = 0x0100000E;
    /**
     * Constant associated with the key code value for the 0 key (48).
     */
    Keyboard.NUMBER_0 = 48;
    /**
     * Constant associated with the key code value for the 1 key (49).
     */
    Keyboard.NUMBER_1 = 49;
    /**
     * Constant associated with the key code value for the 2 key (50).
     */
    Keyboard.NUMBER_2 = 50;
    /**
     * Constant associated with the key code value for the 3 key (51).
     */
    Keyboard.NUMBER_3 = 51;
    /**
     * Constant associated with the key code value for the 4 key (52).
     */
    Keyboard.NUMBER_4 = 52;
    /**
     * Constant associated with the key code value for the 5 key (53).
     */
    Keyboard.NUMBER_5 = 53;
    /**
     * Constant associated with the key code value for the 6 key (54).
     */
    Keyboard.NUMBER_6 = 54;
    /**
     * Constant associated with the key code value for the 7 key (55).
     */
    Keyboard.NUMBER_7 = 55;
    /**
     * Constant associated with the key code value for the 8 key (56).
     */
    Keyboard.NUMBER_8 = 56;
    /**
     * Constant associated with the key code value for the 9 key (57).
     */
    Keyboard.NUMBER_9 = 57;
    /**
     * Constant associated with the pseudo-key code for the the number pad (21). Use to set numpad modifier on key equivalents
     */
    Keyboard.NUMPAD = 21;
    /**
     * Constant associated with the key code value for the number 0 key on the number pad (96).
     */
    Keyboard.NUMPAD_0 = 96;
    /**
     * Constant associated with the key code value for the number 1 key on the number pad (97).
     */
    Keyboard.NUMPAD_1 = 97;
    /**
     * Constant associated with the key code value for the number 2 key on the number pad (98).
     */
    Keyboard.NUMPAD_2 = 98;
    /**
     * Constant associated with the key code value for the number 3 key on the number pad (99).
     */
    Keyboard.NUMPAD_3 = 99;
    /**
     * Constant associated with the key code value for the number 4 key on the number pad (100).
     */
    Keyboard.NUMPAD_4 = 100;
    /**
     * Constant associated with the key code value for the number 5 key on the number pad (101).
     */
    Keyboard.NUMPAD_5 = 101;
    /**
     * Constant associated with the key code value for the number 6 key on the number pad (102).
     */
    Keyboard.NUMPAD_6 = 102;
    /**
     * Constant associated with the key code value for the number 7 key on the number pad (103).
     */
    Keyboard.NUMPAD_7 = 103;
    /**
     * Constant associated with the key code value for the number 8 key on the number pad (104).
     */
    Keyboard.NUMPAD_8 = 104;
    /**
     * Constant associated with the key code value for the number 9 key on the number pad (105).
     */
    Keyboard.NUMPAD_9 = 105;
    /**
     * Constant associated with the key code value for the addition key on the number pad (107).
     */
    Keyboard.NUMPAD_ADD = 107;
    /**
     * Constant associated with the key code value for the decimal key on the number pad (110).
     */
    Keyboard.NUMPAD_DECIMAL = 110;
    /**
     * Constant associated with the key code value for the division key on the number pad (111).
     */
    Keyboard.NUMPAD_DIVIDE = 111;
    /**
     * Constant associated with the key code value for the Enter key on the number pad (108).
     */
    Keyboard.NUMPAD_ENTER = 108;
    /**
     * Constant associated with the key code value for the multiplication key on the number pad (106).
     */
    Keyboard.NUMPAD_MULTIPLY = 106;
    /**
     * Constant associated with the key code value for the subtraction key on the number pad (109).
     */
    Keyboard.NUMPAD_SUBTRACT = 109;
    /**
     * Constant associated with the key code value for the O key (79).
     */
    Keyboard.O = 79;
    /**
     * Constant associated with the key code value for the P key (80).
     */
    Keyboard.P = 80;
    /**
     * Constant associated with the key code value for the Page Down key (34).
     */
    Keyboard.PAGE_DOWN = 34;
    /**
     * Constant associated with the key code value for the Page Up key (33).
     */
    Keyboard.PAGE_UP = 33;
    /**
     * Engage pause transport mode
     */
    Keyboard.PAUSE = 0x01000008;
    /**
     * Constant associated with the key code value for the . key (190).
     */
    Keyboard.PERIOD = 190;
    /**
     * Engage play transport mode
     */
    Keyboard.PLAY = 0x01000007;
    /**
     * Skip to previous track or chapter
     */
    Keyboard.PREVIOUS = 0x0100000F;
    /**
     * Constant associated with the key code value for the Q key (81).
     */
    Keyboard.Q = 81;
    /**
     * Constant associated with the key code value for the ' key (222).
     */
    Keyboard.QUOTE = 222;
    /**
     * Constant associated with the key code value for the R key (82).
     */
    Keyboard.R = 82;
    /**
     * Record item or engage record transport mode
     */
    Keyboard.RECORD = 0x01000006;
    /**
     * Red function key button
     */
    Keyboard.RED = 0x01000000;
    /**
     * Engage rewind transport mode
     */
    Keyboard.REWIND = 0x0100000B;
    /**
     * Constant associated with the key code value for the Right Arrow key (39).
     */
    Keyboard.RIGHT = 39;
    /**
     * Constant associated with the key code value for the ] key (221).
     */
    Keyboard.RIGHTBRACKET = 221;
    /**
     * Constant associated with the key code value for the S key (83).
     */
    Keyboard.S = 83;
    /**
     * Search button
     */
    Keyboard.SEARCH = 0x0100001F;
    /**
     * Constant associated with the key code value for the ; key (186).
     */
    Keyboard.SEMICOLON = 186;
    /**
     * Engage setup application or menu
     */
    Keyboard.SETUP = 0x0100001C;
    /**
     * Constant associated with the key code value for the Shift key (16).
     */
    Keyboard.SHIFT = 16;
    /**
     * Quick skip backward (usually 7-10 seconds)
     */
    Keyboard.SKIP_BACKWARD = 0x0100000D;
    /**
     * Quick skip ahead (usually 30 seconds)
     */
    Keyboard.SKIP_FORWARD = 0x0100000C;
    /**
     * Constant associated with the key code value for the / key (191).
     */
    Keyboard.SLASH = 191;
    /**
     * Constant associated with the key code value for the Spacebar (32).
     */
    Keyboard.SPACE = 32;
    /**
     * Engage stop transport mode
     */
    Keyboard.STOP = 0x01000009;
    /**
     * Toggle subtitles
     */
    Keyboard.SUBTITLE = 0x01000018;
    /**
     * Constant associated with the key code value for the T key (84).
     */
    Keyboard.T = 84;
    /**
     * Constant associated with the key code value for the Tab key (9).
     */
    Keyboard.TAB = 9;
    /**
     * Constant associated with the key code value for the U key (85).
     */
    Keyboard.U = 85;
    /**
     * Constant associated with the key code value for the Up Arrow key (38).
     */
    Keyboard.UP = 38;
    /**
     * Constant associated with the key code value for the V key (86).
     */
    Keyboard.V = 86;
    /**
     * Engage video-on-demand
     */
    Keyboard.VOD = 0x0100001A;
    /**
     * Constant associated with the key code value for the W key (87).
     */
    Keyboard.W = 87;
    /**
     * Constant associated with the key code value for the X key (88).
     */
    Keyboard.X = 88;
    /**
     * Constant associated with the key code value for the Y key (89).
     */
    Keyboard.Y = 89;
    /**
     * Yellow function key button
     */
    Keyboard.YELLOW = 0x01000002;
    /**
     * Constant associated with the key code value for the Z key (90).
     */
    Keyboard.Z = 90;
    return Keyboard;
})();
module.exports = Keyboard;


},{}],"awayjs-core\\lib\\utils\\ByteArrayBase":[function(require,module,exports){
module.exports=require(60)
},{"..\\awayjs-core\\lib\\utils\\ByteArrayBase.js":60,"awayjs-core/lib/errors/AbstractMethodError":4}],"awayjs-core\\lib\\utils\\ByteArrayBuffer":[function(require,module,exports){
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ByteArrayBase = require("awayjs-core/lib/utils/ByteArrayBase");
var ByteArrayBuffer = (function (_super) {
    __extends(ByteArrayBuffer, _super);
    function ByteArrayBuffer() {
        _super.call(this);
        this._bytes = [];
        this._mode = "Array";
    }
    ByteArrayBuffer.prototype.writeByte = function (b) {
        var bi = ~~b;
        this._bytes[this.position++] = bi;
        if (this.position > this.length) {
            this.length = this.position;
        }
    };
    ByteArrayBuffer.prototype.readByte = function () {
        if (this.position >= this.length) {
            throw "ByteArray out of bounds read. Position=" + this.position + ", Length=" + this.length;
        }
        return this._bytes[this.position++];
    };
    ByteArrayBuffer.prototype.writeUnsignedByte = function (b) {
        var bi = ~~b;
        this._bytes[this.position++] = bi & 0xff;
        if (this.position > this.length) {
            this.length = this.position;
        }
    };
    ByteArrayBuffer.prototype.readUnsignedByte = function () {
        if (this.position >= this.length) {
            throw "ByteArray out of bounds read. Position=" + this.position + ", Length=" + this.length;
        }
        return this._bytes[this.position++];
    };
    ByteArrayBuffer.prototype.writeUnsignedShort = function (b) {
        var bi = ~~b;
        this._bytes[this.position++] = bi & 0xff;
        this._bytes[this.position++] = (bi >> 8) & 0xff;
        if (this.position > this.length) {
            this.length = this.position;
        }
    };
    ByteArrayBuffer.prototype.readUnsignedShort = function () {
        if (this.position + 2 > this.length) {
            throw "ByteArray out of bounds read. Position=" + this.position + ", Length=" + this.length;
        }
        var r = this._bytes[this.position] | (this._bytes[this.position + 1] << 8);
        this.position += 2;
        return r;
    };
    ByteArrayBuffer.prototype.writeUnsignedInt = function (b) {
        var bi = ~~b;
        this._bytes[this.position++] = bi & 0xff;
        this._bytes[this.position++] = (bi >>> 8) & 0xff;
        this._bytes[this.position++] = (bi >>> 16) & 0xff;
        this._bytes[this.position++] = (bi >>> 24) & 0xff;
        if (this.position > this.length) {
            this.length = this.position;
        }
    };
    ByteArrayBuffer.prototype.readUnsignedInt = function () {
        if (this.position + 4 > this.length) {
            throw "ByteArray out of bounds read. Position=" + this.position + ", Length=" + this.length;
        }
        var r = this._bytes[this.position] | (this._bytes[this.position + 1] << 8) | (this._bytes[this.position + 2] << 16) | (this._bytes[this.position + 3] << 24);
        this.position += 4;
        return r >>> 0;
    };
    ByteArrayBuffer.prototype.writeFloat = function (b) {
        // this is crazy slow and silly, but as a fallback...
        this.writeUnsignedInt(this.toFloatBits(Number(b)));
    };
    ByteArrayBuffer.prototype.toFloatBits = function (x) {
        // don't handle inf/nan yet
        // special case zero
        if (x == 0) {
            return 0;
        }
        // remove the sign, after this we only deal with positive numbers
        var sign = 0;
        if (x < 0) {
            x = -x;
            sign = 1;
        }
        else {
            sign = 0;
        }
        // a float value is now defined as: x = (1+(mantissa*2^-23))*(2^(exponent-127))
        var exponent = Math.log(x) / Math.log(2); // rough exponent
        exponent = Math.floor(exponent);
        x = x * Math.pow(2, 23 - exponent); // normalize to 24 bits
        var mantissa = Math.floor(x) - 0x800000;
        exponent = exponent + 127;
        return ((sign << 31) >>> 0) | (exponent << 23) | mantissa;
    };
    ByteArrayBuffer.prototype.readFloat = function (b) {
        return this.fromFloatBits(this.readUnsignedInt());
    };
    ByteArrayBuffer.prototype.fromFloatBits = function (x) {
        if (x == 0) {
            return 0;
        }
        var exponent = (x >>> 23) & 0xff;
        var mantissa = (x & 0x7fffff) | 0x800000;
        var y = Math.pow(2, (exponent - 127) - 23) * mantissa;
        if (x >>> 31 != 0) {
            y = -y;
        }
        return y;
    };
    return ByteArrayBuffer;
})(ByteArrayBase);
module.exports = ByteArrayBuffer;


},{"awayjs-core/lib/utils/ByteArrayBase":60}],"awayjs-core\\lib\\utils\\ByteArray":[function(require,module,exports){
module.exports=require(59)
},{"..\\awayjs-core\\lib\\utils\\ByteArray.js":59,"awayjs-core/lib/utils/ByteArrayBase":60}],"awayjs-core\\lib\\utils\\CSS":[function(require,module,exports){
var CSS = (function () {
    function CSS() {
    }
    CSS.setElementSize = function (element, width, height) {
        element.style.width = width + "px";
        element.style.height = height + "px";
        element["width"] = width;
        element["height"] = height;
    };
    CSS.setElementWidth = function (element, width) {
        element.style.width = width + "px";
        element["width"] = width;
    };
    CSS.setElementHeight = function (element, height) {
        element.style.height = height + "px";
        element["height"] = height;
    };
    CSS.setElementX = function (element, x) {
        element.style.position = 'absolute';
        element.style.left = x + "px";
    };
    CSS.setElementY = function (element, y) {
        element.style.position = 'absolute';
        element.style.top = y + "px";
    };
    CSS.getElementVisibility = function (element) {
        return element.style.visibility == 'visible';
    };
    CSS.setElementVisibility = function (element, visible) {
        if (visible) {
            element.style.visibility = 'visible';
        }
        else {
            element.style.visibility = 'hidden';
        }
    };
    CSS.setElementAlpha = function (element, alpha) {
        if (element instanceof HTMLCanvasElement) {
            var context = element.getContext("2d");
            context.globalAlpha = alpha;
        }
    };
    CSS.setElementPosition = function (element, x, y, absolute) {
        if (absolute === void 0) { absolute = false; }
        if (absolute) {
            element.style.position = "absolute";
        }
        else {
            element.style.position = "relative";
        }
        element.style.left = x + "px";
        element.style.top = y + "px";
    };
    return CSS;
})();
module.exports = CSS;


},{}],"awayjs-core\\lib\\utils\\ColorUtils":[function(require,module,exports){
module.exports=require(61)
},{"..\\awayjs-core\\lib\\utils\\ColorUtils.js":61}],"awayjs-core\\lib\\utils\\Debug":[function(require,module,exports){
var PartialImplementationError = require("awayjs-core/lib/errors/PartialImplementationError");
/**
 *
 */
var Debug = (function () {
    function Debug() {
    }
    Debug.breakpoint = function () {
        Debug['break']();
    };
    Debug.throwPIROnKeyWordOnly = function (str, enable) {
        if (enable === void 0) { enable = true; }
        if (!enable)
            Debug.keyword = null;
        else
            Debug.keyword = str;
    };
    Debug.throwPIR = function (clss, fnc, msg) {
        Debug.logPIR('PartialImplementationError ' + clss, fnc, msg);
        if (Debug.THROW_ERRORS) {
            if (Debug.keyword) {
                var e = clss + fnc + msg;
                if (e.indexOf(Debug.keyword) == -1)
                    return;
            }
            throw new PartialImplementationError(clss + '.' + fnc + ': ' + msg);
        }
    };
    Debug.logPIR = function (clss, fnc, msg) {
        if (msg === void 0) { msg = ''; }
        if (Debug.LOG_PI_ERRORS)
            console.log(clss + '.' + fnc + ': ' + msg);
    };
    Debug.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        if (Debug.ENABLE_LOG)
            console.log(args);
    };
    Debug.THROW_ERRORS = true;
    Debug.ENABLE_LOG = true;
    Debug.LOG_PI_ERRORS = true;
    Debug.keyword = null;
    return Debug;
})();
module.exports = Debug;


},{"awayjs-core/lib/errors/PartialImplementationError":7}],"awayjs-core\\lib\\utils\\RequestAnimationFrame":[function(require,module,exports){
var getTimer = require("awayjs-core/lib/utils/getTimer");
var RequestAnimationFrame = (function () {
    function RequestAnimationFrame(callback, callbackContext) {
        var _this = this;
        this._active = false;
        this._argsArray = new Array();
        this._getTimer = getTimer;
        this.setCallback(callback, callbackContext);
        this._rafUpdateFunction = function () {
            if (_this._active)
                _this._tick();
        };
        this._argsArray.push(this._dt);
    }
    // Public
    /**
     *
     * @param callback
     * @param callbackContext
     */
    RequestAnimationFrame.prototype.setCallback = function (callback, callbackContext) {
        this._callback = callback;
        this._callbackContext = callbackContext;
    };
    /**
     *
     */
    RequestAnimationFrame.prototype.start = function () {
        this._prevTime = this._getTimer();
        this._active = true;
        if (window.requestAnimationFrame) {
            window.requestAnimationFrame(this._rafUpdateFunction);
        }
        else {
            if (window['mozRequestAnimationFrame'])
                window.requestAnimationFrame = window['mozRequestAnimationFrame'];
            else if (window['webkitRequestAnimationFrame'])
                window.requestAnimationFrame = window['webkitRequestAnimationFrame'];
            else if (window['oRequestAnimationFrame'])
                window.requestAnimationFrame = window['oRequestAnimationFrame'];
        }
    };
    /**
     *
     */
    RequestAnimationFrame.prototype.stop = function () {
        this._active = false;
    };
    Object.defineProperty(RequestAnimationFrame.prototype, "active", {
        // Get / Set
        /**
         *
         * @returns {boolean}
         */
        get: function () {
            return this._active;
        },
        enumerable: true,
        configurable: true
    });
    // Private
    /**
     *
     * @private
     */
    RequestAnimationFrame.prototype._tick = function () {
        this._currentTime = this._getTimer();
        this._dt = this._currentTime - this._prevTime;
        this._argsArray[0] = this._dt;
        this._callback.apply(this._callbackContext, this._argsArray);
        window.requestAnimationFrame(this._rafUpdateFunction);
        this._prevTime = this._currentTime;
    };
    return RequestAnimationFrame;
})();
module.exports = RequestAnimationFrame;


},{"awayjs-core/lib/utils/getTimer":64}],"awayjs-core\\lib\\utils\\TextureUtils":[function(require,module,exports){
module.exports=require(62)
},{"..\\awayjs-core\\lib\\utils\\TextureUtils.js":62}],"awayjs-core\\lib\\utils\\Timer":[function(require,module,exports){
module.exports=require(63)
},{"..\\awayjs-core\\lib\\utils\\Timer.js":63,"awayjs-core/lib/errors/Error":6,"awayjs-core/lib/events/EventDispatcher":10,"awayjs-core/lib/events/TimerEvent":17}],"awayjs-core\\lib\\utils\\getTimer":[function(require,module,exports){
module.exports=require(64)
},{"..\\awayjs-core\\lib\\utils\\getTimer.js":64}]},{},[])


//# sourceMappingURL=awayjs-core.js.map