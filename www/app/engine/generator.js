define(["./data/tetrominos"],
function(tetrominos) {
    return {
        _seed: Math.round(Math.random() * Math.pow(10, 17)),
        _id: 0,
        _keys: new Array(),
        _tetrominos: tetrominos,
        _random() { // Random value from sin with seed
            var x = Math.sin(this._seed++) * 10000;
            return x - Math.floor(x);
        },
        _populate() { // Shuffle tetrominos w/ Fisher-Yates algorithm
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
        },
        _stock() {
            if ((this._id + 1) % 7 == 1) {
                this._populate()
            }
        },
        _getTetrominoFromKey(key) {
            var tetromino = this._tetrominos[key]
            var clone = JSON.parse(JSON.stringify(tetromino))
            clone['key'] = key
            return clone
        },
        _getTetrominoLast() {
            var key = this._keys[this._id]
            var tetromino = this._getTetrominoFromKey(key)
            this._id++
            return tetromino
        },
        seed(s) {
            if (arguments.length == 0) {
                return this._seed
            } else {
                this._seed = s
            }
        },
        tetromino() {
            this._stock()
            return this._getTetrominoLast()
        }
    }
})
