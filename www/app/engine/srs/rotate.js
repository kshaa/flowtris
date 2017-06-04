define({
    clockwise(t) {
        var tetromino = this._clockwiseTetromino(t['tetromino'])
        var piece = JSON.parse(JSON.stringify(t))
        piece['tetromino'] = tetromino
        return piece
    },
    anticlockwise(t) {
        var tetromino = this._anticlockwiseTetromino(t['tetromino'])
        var piece = JSON.parse(JSON.stringify(t))
        piece['tetromino'] = tetromino
        return piece
    },
    _clockwiseTetromino(array) {
        var transposed = this._transpose(array)
        return this._reverseRows(transposed)
    },
    _anticlockwiseTetromino(array) {
        var reversed = this._reverseRows(array)
        return this._transpose(reversed)
    },
    _transpose(array) {
        var clone = JSON.parse(JSON.stringify(array))
        for (var i = 0; i < clone.length; i++) {
            for (var j = 0; j <i; j++) {
                var temp = clone[i][j];
                clone[i][j] = clone[j][i];
                clone[j][i] = temp;
            }
        }
        return clone
    },
    _reverseRows(array) {
        var clone = JSON.parse(JSON.stringify(array))
        return clone.map((r) => {
            return r.reverse()
        })
    }
})
