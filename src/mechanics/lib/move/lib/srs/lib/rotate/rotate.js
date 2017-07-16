define(function() {
    return function Rotate() {
        this.clockwise = function(t) {
            var piece = JSON.parse(JSON.stringify(t))
            var tetromino = this._clockwiseTetromino(piece.tetramino)
            piece.tetramino = tetromino
            return piece
        }
        this.anticlockwise = function(t) {
            var piece = JSON.parse(JSON.stringify(t))
            var tetromino = this._anticlockwiseTetromino(piece.tetramino)
            piece.tetramino = tetromino
            return piece
        }
        this._clockwiseTetromino = function(array) {
            var transposed = this._transpose(array)
            return this._reverseRows(transposed)
        }
        this._anticlockwiseTetromino = function(array) {
            var reversed = this._reverseRows(array)
            return this._transpose(reversed)
        }
        this._transpose = function(array) {
            var clone = JSON.parse(JSON.stringify(array))
            for (var i = 0; i < clone.length; i++) {
                for (var j = 0; j <i; j++) {
                    var temp = clone[i][j];
                    clone[i][j] = clone[j][i];
                    clone[j][i] = temp;
                }
            }
            return clone
        }
        this._reverseRows = function(array) {
            var clone = JSON.parse(JSON.stringify(array))
            return clone.map((r) => {
                return r.reverse()
            })
        }
    }
})
