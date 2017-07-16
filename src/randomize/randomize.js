define(function(require) {
    var tetrominos = require('./tetrominos')

    return function Randomize(seed) {
        if (typeof seed === 'undefined') {
            this._seed = Math.round(Math.random() * Math.pow(10, 17))
        } else {
            this._seed = seed
        }
        this._id = 0
        this._keys = new Array()
        this._tetrominos = tetrominos
        this._random = function() { // Random value from sin with seed
            var x = Math.sin(this._seed++) * 10000;
            return x - Math.floor(x);
        }
        this._populate = function() { // Shuffle tetrominos w/ Fisher-Yates algorithm
            var array = Object.keys(this._tetrominos)
            var currentIndex = array.length, temporaryValue, randomIndex

            while (0 !== currentIndex) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;
                temporaryValue = array[currentIndex]
                array[currentIndex] = array[randomIndex]
                array[randomIndex] = temporaryValue
            }

            this._keys = this._keys.concat(array)
        }
        this._stock = function() {
            if ((this._id + 1) % 7 == 1) {
                this._populate()
            }
        },
        this._getTetrominoFromKey = function(key) {
            var tetromino = this._tetrominos[key]
            var clone = JSON.parse(JSON.stringify(tetromino))
            clone['key'] = key
            clone['active'] = false
            return clone
        }
        this._getTetrominoLast = function() {
            var key = this._keys[this._id]
            var tetromino = this._getTetrominoFromKey(key)
            this._id++
            return tetromino
        }
        this.seed = function(s) {
            if (arguments.length == 0) {
                return this._seed
            } else {
                this._seed = s
            }
        },
        this.tetromino = function() {
            this._stock()
            return this._getTetrominoLast()
        }
    }
})
