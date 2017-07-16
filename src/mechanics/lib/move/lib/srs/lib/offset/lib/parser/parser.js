define({
    fits(t, f) {
        if (this._inbounds(t, f)) {
            return this._fits(t, f)
        } else {
            return false
        }
    },
    _inbounds(t, f) {
        var overzeroes = (t.x >= 0) && (t.y >= 0)
        var beforewall = t[0].tetromino.length + t.x < f[0].length
        var beforeground = t.tetromino.length + t.y < f.length
        return overzeroes && beforewall && beforeground
    },
    _fits(t, f) { // Does a tetromino fit in position at boolean field
        var x = t['x']
        var y = t['y']
        var d = t['tetramino']
        for (i = 0; i < d.length; i++) {
            for (j = 0; j < d[0].length; j++) {
                var fieldValue = f[i + y][j + x]
                var tetrominoValue = d[i][j]
                if ((fieldValue != 0) && (tetrominoValue != 0)) {
                    return false
                }
            }
        }
        return true
    }
})
