define(function() {
    return function Validator(g) {
        this.check = function(ts) {
            return ts.find(this.fits.bind(this)) 
        }
        this.fits = function(t) {
            if (this._inbounds(t)) {
                return this._fits(t)
            } else {
                return false
            }
        }
        this._inbounds = function(t) {
            var fits = true
            for (i = 0; i < t.tetramino.length; i++) {
                for (j = 0; j < t.tetramino[0].length; j++) {
                    if (t.tetramino[i][j] != 0) {
                        let pixelfits = this._inboundsPixel(t.x + j, t.y + i)
                        fits = fits && pixelfits
                    }
                }
            }
            return fits;
        }
        this._inboundsPixel = function(x, y) {
            var f = g.frame.field
            var overzeroes = (x >= 0) && (y >= 0)
            var beforewall = x < f[0].length
            var beforeground = y < f.length
            return overzeroes && beforewall && beforeground
        }
        this._fits = function(t) { // Does a tetromino fit in position at boolean field
            var f = g.frame.field
            var x = t['x']
            var y = t['y']
            var d = t['tetramino']
            for (i = 0; i < d.length; i++) {
                for (j = 0; j < d[0].length; j++) {
                    if (d[i][j] != 0) {
                        var fieldValue = f[i + y][j + x]
                        var tetrominoValue = d[i][j]
                        if ((fieldValue != 0) && (tetrominoValue != 0)) {
                            return false
                        }
                    }
                }
            }
            return true
        }
    }
})
