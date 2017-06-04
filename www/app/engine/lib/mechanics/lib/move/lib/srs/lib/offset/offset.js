define(["./data/wallkicks"],
function(Wallkicks) {
    return function Offset() {
        this.clockwise = function(t) {
            var r1 = t.rotation.toString()
            var r2 = this.clockwiseKey(r1)
            return this._offsets(t.key, r1, r2)
        }
        this.clockwiseKey = function(r1) {
            var r = this._rotations
            var r2 = r[(r.indexOf(r1) + 1) % 4]
            return r2
        }
        this.anticlockwise = function(t) {
            var r1 = t.rotation.toString()
            var r2 = this.anticlockwiseKey(r1)
            return this._offsets(t.key, r1, r2)
        }
        this.anticlockwiseKey = function(r1) {
            var r = this._rotations
            var r2 = r[(r.indexOf(r1) + 3) % 4]
            return r2
        }
        this._offsets = function(k, r1, r2) {
            var w = this._wallkicks
            var w1 = w[k][r1]
            var w2 = w[k][r2]
            var offsets = new Array()
            for (i = 0; i < w1.length; i++) {
                var x = w1[i][0] - w2[i][0]
                var y = w1[i][1] - w2[i][1]
                offsets[i] = [x, y]
            }
            console.log(offsets)
            return offsets
        }
        this._rotations = ['0', 'r', '2', 'l']
        this._wallkicks = new Wallkicks()
    }
})
