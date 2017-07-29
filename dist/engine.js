/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_RESULT__;

!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
    return function Rotate() {
        this.clockwise = function (t) {
            var piece = JSON.parse(JSON.stringify(t));
            var tetromino = this._clockwiseTetromino(piece.tetramino);
            piece.tetramino = tetromino;
            return piece;
        };
        this.anticlockwise = function (t) {
            var piece = JSON.parse(JSON.stringify(t));
            var tetromino = this._anticlockwiseTetromino(piece.tetramino);
            piece.tetramino = tetromino;
            return piece;
        };
        this._clockwiseTetromino = function (array) {
            var transposed = this._transpose(array);
            return this._reverseRows(transposed);
        };
        this._anticlockwiseTetromino = function (array) {
            var reversed = this._reverseRows(array);
            return this._transpose(reversed);
        };
        this._transpose = function (array) {
            var clone = JSON.parse(JSON.stringify(array));
            for (var i = 0; i < clone.length; i++) {
                for (var j = 0; j < i; j++) {
                    var temp = clone[i][j];
                    clone[i][j] = clone[j][i];
                    clone[j][i] = temp;
                }
            }
            return clone;
        };
        this._reverseRows = function (array) {
            var clone = JSON.parse(JSON.stringify(array));
            return clone.map(function (r) {
                return r.reverse();
            });
        };
    };
}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_RESULT__;

!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {
    var state = __webpack_require__(2),
        hook = __webpack_require__(3),
        randomize = __webpack_require__(4),
        mechanics = __webpack_require__(6);

    return function TetrisEngine(seed) {

        //

        this.hook = new hook();
        this._game = new state();
        this._randomize = new randomize();
        this._mechanics = new mechanics(this._game, this._randomize);

        // Info

        this.seed = this._randomize.seed;
        this.field = this._mechanics.field;

        // Loop

        this._main = function () {
            var _this = this;

            var fps = 60,
                delta = this._logTime();

            this.hook._runBefores(this, delta);
            if (this._game.settings.playing && !this._game.settings.delayed) {
                this._mechanics.spawn();
                this._mechanics.move();
                this._mechanics.flushMoves();
                this._mechanics.lock(function () {
                    _this._mechanics.storePiece.bind(_this._mechanics)();
                    _this._mechanics.removeFilled.bind(_this._mechanics)();
                });
            }
            this.hook._runAfters(this, delta);

            setTimeout(function () {
                window.requestAnimationFrame(_this._main.bind(_this));
            }, 1000 / 60 - delta);
        };

        this._logTime = function () {
            if (typeof this._game.settings.startedAt === 'undefined') {
                var t1 = performance.now();
                this._game.settings.startedAt = t1;
            } else {
                var last = this._game.frame.lastTime;
                var t1 = last;
            }
            var t2 = performance.now();
            this._game.frame.lastTime = t2;
            return t2 - t1;
        };

        // Interactions

        this.move = function (key) {
            this._game.frame.moves.push(key);
        };
        this.pause = function () {
            this._game.settings.playing = false;
        };
        this.unpause = function () {
            this._game.settings.playing = true;
        };
        this.togglePause = function () {
            console.log('toggle');
            this._game.settings.playing = !this._game.settings.playing;
        };
        this.delay = function () {
            this._game.settings.delayed = true;
        };
        this.undelay = function () {
            this._game.settings.delayed = false;
        };
        this.toggleDelay = function () {
            this._game.settings.delayed = !this._game.settings.delayed;
        };
        this.start = function (wait) {
            if (typeof this._game.settings.startedAt !== 'undefined') {
                // Get set
                this._game = new Gamestate();
                this._randomize = new Randomize(seed);
                this._mechanics = new Mechanics(this._game, this._randomize);
            }

            // Ready
            this._game.settings.frameId = window.requestAnimationFrame(this._main.bind(this));

            // Go / Wait a bit
            wait = typeof wait === 'undefined' ? false : true;
            this._game.settings.playing = wait ? false : true;
        };
        this.stop = function () {
            var id = this._game.settings.frameId;
            window.cancelAnimationFrame(id);

            this.start(true);
        };
        this.restart = function () {
            this.stop();
            this.start();
        };
    };
}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_RESULT__;

!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
    return function state() {
        this.settings = {
            gravity: 1000, // Tetris G's - miliseconds between drops
            height: 24, // Upper two lines are the spawn
            width: 10,
            droppedAt: 0,
            startedAt: undefined,
            playing: false,
            delayed: false, // Animation induced delay
            delayTime: 300,
            frameId: undefined,
            locking: false,
            lockingSince: 0,
            lockTime: 500
        };
        this.frame = {
            time: 0, // Last computation end time (ms)
            piece: { // Current tetromino piece on field
                active: false,
                key: undefined, // What type of tetromino
                x: undefined, // Bounding box's upper left coordinate
                y: undefined, // Bounding box's upper left coordinate
                rotation: undefined, // 0 R 2 L
                tetramino: undefined // [ [ (Boolean) ] ]
            },
            moves: new Array(), // [ Char ] Moves to be executed
            field: undefined // [ [ (Tetromino type) ] ]


            // Create empty field
        };this.frame.field = new Array(this.settings.height);
        for (i = 0; i < this.settings.height; i++) {
            field[i] = new Array(this.settings.width).fill(0);
        }
    };
}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_RESULT__;

!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
    return function Hook() {
        this.before = function (callback) {
            this._befores.push(callback);
            return this._befores.length - 1; // Action id
        };
        this._runBefores = function (engine, delay) {
            for (i = 0; i < this._befores.length; i++) {
                this._befores[i](engine, delay);
            }
        };
        this._befores = new Array(); // Functions to run before each frame
        this.after = function (callback) {
            this._afters.push(callback);
            return this._afters.length - 1; // Action id
        };
        this._runAfters = function (engine, delay) {
            for (i = 0; i < this._afters.length; i++) {
                this._afters[i](engine, delay);
            }
        };
        this._afters = new Array(); // Functions to run after each frame
    };
}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_RESULT__;

!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {
    var tetrominos = __webpack_require__(5);

    return function Randomize(seed) {
        if (typeof seed === 'undefined') {
            this._seed = Math.round(Math.random() * Math.pow(10, 17));
        } else {
            this._seed = seed;
        }
        this._id = 0;
        this._keys = new Array();
        this._tetrominos = tetrominos;
        this._random = function () {
            // Random value from sin with seed
            var x = Math.sin(this._seed++) * 10000;
            return x - Math.floor(x);
        };
        this._populate = function () {
            // Shuffle tetrominos w/ Fisher-Yates algorithm
            var array = Object.keys(this._tetrominos);
            var currentIndex = array.length,
                temporaryValue,
                randomIndex;

            while (0 !== currentIndex) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }

            this._keys = this._keys.concat(array);
        };
        this._stock = function () {
            if ((this._id + 1) % 7 == 1) {
                this._populate();
            }
        }, this._getTetrominoFromKey = function (key) {
            var tetromino = this._tetrominos[key];
            var clone = JSON.parse(JSON.stringify(tetromino));
            clone['key'] = key;
            clone['active'] = false;
            return clone;
        };
        this._getTetrominoLast = function () {
            var key = this._keys[this._id];
            var tetromino = this._getTetrominoFromKey(key);
            this._id++;
            return tetromino;
        };
        this.seed = function (s) {
            if (arguments.length == 0) {
                return this._seed;
            } else {
                this._seed = s;
            }
        }, this.tetromino = function () {
            this._stock();
            return this._getTetrominoLast();
        };
    };
}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


!(module.exports = {
    // All Pieces - J L S T Z I O
    // Rotation - spawn
    i: {
        tetramino: [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 1, 1, 1, 1], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
        x: 2,
        y: 0,
        rotation: 0
    },
    j: {
        tetramino: [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
        x: 3,
        y: 1,
        rotation: 0
    },
    l: {
        tetramino: [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
        x: 3,
        y: 1,
        rotation: 0
    },
    o: {
        tetramino: [[0, 1, 1], [0, 1, 1], [0, 0, 0]],
        x: 3,
        y: 1,
        rotation: 0
    },
    s: {
        tetramino: [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
        x: 3,
        y: 1,
        rotation: 0
    },
    z: {
        tetramino: [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
        x: 3,
        y: 1,
        rotation: 0
    },
    t: {
        tetramino: [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
        x: 3,
        y: 1,
        rotation: 0
    }
});

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_RESULT__;

!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require) {
    var move = __webpack_require__(7);

    return function Mechanics(g, r) {
        this._move = new move(g);
        this.move = this._move.move.bind(this._move);
        this.field = function () {
            var justfield = JSON.parse(JSON.stringify(g.frame.field));
            var piece = g.frame.piece;
            var t = piece.tetramino;
            if (piece.active) {
                for (i = 0; i < t.length; i++) {
                    for (j = 0; j < t[0].length; j++) {
                        if (t[i][j] != 0) {
                            var val = t[i][j];
                            console.log(justfield, piece, i, j);
                            justfield[piece.y + i][piece.x + j] = val ? piece.key : '0';
                        }
                    }
                }
            }
            return justfield;
        };
        this.spawn = function () {
            if (!g.frame.piece.active) {
                g.frame.piece = r.tetromino();
                g.frame.piece.active = true;
            }
        };
        this.flushMoves = function () {
            g.frame.moves = new Array();
        };
        this.storePiece = function () {
            g.frame.field = this.field();
            g.frame.piece.active = false;
        };
        this.removeFilled = function () {
            var f1 = g.frame.field;
            var fillds = f1.map(function (r) {
                return -1 == r.findIndex(function (val) {
                    return val == 0;
                });
            });
            for (i = 0; i < fillds.length; i++) {
                var f = g.frame.field;
                if (fillds[i]) {
                    var empty = new Array(g.settings.width);
                    empty.fill(0);
                    empty = [empty];
                    g.frame.field = empty.concat(f.splice(0, i).concat(f.splice(i + 1, f.length - i - 1)));
                    console.log(i, f, empty, fillds);
                }
            }
        };
        this.lock = function (callback) {
            var piece = g.frame.piece;
            if (this._move.minDistance(piece) == 0) {
                var s = g.settings;
                if (s.locking == false) {
                    s.locking = true;
                    s.lockingSince = performance.now();
                } else {
                    var t1 = s.lockingSince;
                    var t2 = performance.now();
                    if (t2 - t1 > s.lockTime) {
                        s.locking = false;
                        callback();
                    }
                }
            }
        };
    };
}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, __webpack_require__(8), __webpack_require__(0), __webpack_require__(11)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, SRS, Rotate, Validator) {
    return function Move(g) {
        this._srs = new SRS();
        this._rotate = new Rotate();
        this._validator = new Validator(g);
        this._intentional = function () {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = g.frame.moves[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var move = _step.value;

                    this._set(move);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        };
        this._forced = function () {
            var t1 = g.settings.droppedAt;
            var t2 = performance.now();
            var gravity = g.settings.gravity;
            if (t2 - t1 > gravity) {
                g.settings.droppedAt = performance.now();
                this._set('down');
            }
        };
        this.move = function (move) {
            this._intentional();
            this._forced();
        };
        this._set = function (move) {
            var piece = this._check(move);
            if (typeof piece !== 'undefined') {
                switch (move) {
                    case 'down':
                        g.settings.droppedAt = performance.now();
                        break;
                    case 'drop':
                        g.settings.lockingSince = 0;
                        g.settings.locking = true;
                        break;
                }
                for (var property in piece) {
                    g.frame.piece[property] = piece[property];
                }
            }
        };
        this._bottoms = function (piece) {
            var t = JSON.parse(JSON.stringify(piece.tetramino));
            var bottoms = new Array();
            var tcolumns = this._rotate._clockwiseTetromino(t);
            for (i = 0; i < t.length; i++) {
                d = tcolumns[i].findIndex(function (x) {
                    return x != 0;
                });
                if (d == -1) {
                    bottoms[i] = -1;
                } else {
                    bottoms[i] = t.length - d - 1;
                }
            }
            return bottoms;
        };
        this._getColumn = function (array, n) {
            var column = new Array();
            for (j = 0; j < array.length; j++) {
                column[j] = array[j][n];
            }
            return column;
        };
        this._distances = function (piece) {
            var f = JSON.parse(JSON.stringify(g.frame.field));
            var bottoms = this._bottoms(piece);
            var distances = new Array();
            for (i = 0; i < bottoms.length; i++) {
                if (bottoms[i] != -1) {
                    var column = this._getColumn(f, piece.x + i);
                    var position = bottoms[i] + piece.y;
                    var path = column.splice(position + 1, column.length - position - 1);
                    var distance = path.findIndex(function (x) {
                        return x != 0;
                    });
                    if (distance == -1) {
                        distances[i] = path.length;
                    } else {
                        distances[i] = distance;
                    }
                } else {
                    // Larger value than column height
                    distances[i] = f.length + 1;
                }
            }
            return distances;
        };
        this.minDistance = function (piece) {
            var distances = this._distances(piece);
            var min = Math.min.apply(Math, distances);
            return min;
        };
        this._drop = function (piece) {
            piece.y += this.minDistance(piece);
            return piece;
        };
        this._check = function (move) {
            var piece = g.frame.piece;
            var pieces = new Array();
            var clone = undefined;
            switch (move.toLowerCase()) {
                case 'cw':
                    pieces = this._srs.rotateClockwise(piece);
                    console.log(pieces);
                    break;
                case 'ccw':
                    pieces = this._srs.rotateAnticlockwise(piece);
                    break;
                case 'left':
                    clone = JSON.parse(JSON.stringify(piece));
                    clone.x -= 1;
                    pieces.push(clone);
                    break;
                case 'right':
                    clone = JSON.parse(JSON.stringify(piece));
                    clone.x += 1;
                    pieces.push(clone);
                    break;
                case 'down':
                    clone = JSON.parse(JSON.stringify(piece));
                    clone.y += 1;
                    pieces.push(clone);
                    break;
                case 'drop':
                    clone = JSON.parse(JSON.stringify(piece));
                    pieces.push(this._drop(clone));
                    break;
                default:
                    console.log('Unknown movement key in Mechanics: "' + move.toLowerCase() + '"');
                    break;
            }
            return this._validator.check(pieces);
        };
    };
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0), __webpack_require__(9)], __WEBPACK_AMD_DEFINE_RESULT__ = function (Rotate, Offset) {
    return function SRS() {
        this.rotateClockwise = function (t) {
            var clone = JSON.parse(JSON.stringify(t));
            var rotated = this._rotate.clockwise(clone);
            var offsets = this._offset.clockwise(clone);
            var pieces = new Array();

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = offsets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var offset = _step.value;

                    var _clone = JSON.parse(JSON.stringify(rotated));
                    console.log('oldx: ', _clone.x);
                    console.log('offset: ', offset[0]);
                    _clone.x += offset[0];
                    _clone.y -= offset[1];
                    console.log('newx: ', _clone.x);
                    _clone.rotation = this._offset.clockwiseKey(_clone.rotation.toString());
                    pieces.push(_clone);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return pieces;
        };
        this.rotateAnticlockwise = function (t) {
            var clone = JSON.parse(JSON.stringify(t));
            var rotated = this._rotate.anticlockwise(clone);
            var offsets = this._offset.anticlockwise(clone);
            var pieces = new Array();

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = offsets[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var offset = _step2.value;

                    var _clone2 = JSON.parse(JSON.stringify(rotated));
                    _clone2.x += offset[0];
                    _clone2.y -= offset[1];
                    _clone2.rotation = this._offset.anticlockwiseKey(_clone2.rotation.toString());
                    pieces.push(_clone2);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            return pieces;
        };
        this._rotate = new Rotate();
        this._offset = new Offset();
    };
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;

!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(10)], __WEBPACK_AMD_DEFINE_RESULT__ = function (Wallkicks) {
    return function Offset() {
        this.clockwise = function (t) {
            var r1 = t.rotation.toString();
            var r2 = this.clockwiseKey(r1);
            return this._offsets(t.key, r1, r2);
        };
        this.clockwiseKey = function (r1) {
            var r = this._rotations;
            var r2 = r[(r.indexOf(r1) + 1) % 4];
            return r2;
        };
        this.anticlockwise = function (t) {
            var r1 = t.rotation.toString();
            var r2 = this.anticlockwiseKey(r1);
            return this._offsets(t.key, r1, r2);
        };
        this.anticlockwiseKey = function (r1) {
            var r = this._rotations;
            var r2 = r[(r.indexOf(r1) + 3) % 4];
            return r2;
        };
        this._offsets = function (k, r1, r2) {
            var w = this._wallkicks;
            var w1 = w[k][r1];
            var w2 = w[k][r2];
            var offsets = new Array();
            for (i = 0; i < w1.length; i++) {
                var x = w1[i][0] - w2[i][0];
                var y = w1[i][1] - w2[i][1];
                offsets[i] = [x, y];
            }
            console.log(offsets);
            return offsets;
        };
        this._rotations = ['0', 'r', '2', 'l'];
        this._wallkicks = new Wallkicks();
    };
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_RESULT__;

!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
    return function Wallkicks() {
        this.j = {
            0: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
            r: [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
            2: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
            l: [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]]
        };
        this.i = {
            0: [[0, 0], [-1, 0], [2, 0], [-1, 0], [2, 0]],
            r: [[-1, 0], [0, 0], [0, 0], [0, 1], [0, -2]],
            2: [[-1, 1], [1, 1], [-2, 1], [1, 0], [-2, 0]],
            l: [[0, 1], [0, 1], [0, 1], [0, -1], [0, 2]]
        };
        this.o = {
            0: [[0, 0]],
            r: [[0, -1]],
            2: [[-1, -1]],
            l: [[-1, 0]]
        };
        this.l = this.j;
        this.s = this.j;
        this.t = this.j;
        this.z = this.j;
    };
}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_RESULT__;

!(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
    return function Validator(g) {
        this.check = function (ts) {
            return ts.find(this.fits.bind(this));
        };
        this.fits = function (t) {
            if (this._inbounds(t)) {
                return this._fits(t);
            } else {
                return false;
            }
        };
        this._inbounds = function (t) {
            var fits = true;
            for (i = 0; i < t.tetramino.length; i++) {
                for (j = 0; j < t.tetramino[0].length; j++) {
                    if (t.tetramino[i][j] != 0) {
                        var pixelfits = this._inboundsPixel(t.x + j, t.y + i);
                        fits = fits && pixelfits;
                    }
                }
            }
            return fits;
        };
        this._inboundsPixel = function (x, y) {
            var f = g.frame.field;
            var overzeroes = x >= 0 && y >= 0;
            var beforewall = x < f[0].length;
            var beforeground = y < f.length;
            return overzeroes && beforewall && beforeground;
        };
        this._fits = function (t) {
            // Does a tetromino fit in position at boolean field
            var f = g.frame.field;
            var x = t['x'];
            var y = t['y'];
            var d = t['tetramino'];
            for (i = 0; i < d.length; i++) {
                for (j = 0; j < d[0].length; j++) {
                    if (d[i][j] != 0) {
                        var fieldValue = f[i + y][j + x];
                        var tetrominoValue = d[i][j];
                        if (fieldValue != 0 && tetrominoValue != 0) {
                            return false;
                        }
                    }
                }
            }
            return true;
        };
    };
}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ })
/******/ ]);