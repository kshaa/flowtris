define(["./data/wallkicks", "./parser"],
function(wallkicks, parser) {
    return {
        validate(t, f, o) {
            var c = JSON.parse(JSON.stringify(t))
            c['position'] = this._sum(c['position'], o)
            return this._parser.fits(c, f)
        },
        clockwise(t) {
            var r = this._rotations
            var r1 = t.rotation
            var r2 = r[(r.indexOf(r1) + 1) % 4]
            return this._offsets(t['key'], r1, r2)
        },
        anticlockwise(t) {
            var r = this._rotations
            var r1 = t.rotation
            var r2 = r[(r.indexOf(r1) + 3) % 4]
            return this._offsets(t['key'], r1, r2)
        },
        _offsets(k, r1, r2) {
            var w = this._wallkicks
            var w1 = w[k][r1]
            var w2 = w[k][r2]
            var offsets = new Array()
            for (i = 0; i < offsets.length; i++) {
                var x = w1[i][0] - w2[i][0]
                var y = w1[i][1] - w2[i][1]
                offsets[i] = [x, y]
            }
            return offsets
        },
        _rotations: ['0', 'r', '2', 'l'],
        _wallkicks: wallkicks,
        _parser: parser
    }
})
