define(["./srs/rotate", "./srs/offset"],
function(rotate, offset) {
    return {
        rotateClockwise(t, f) {
            var c = JSON.parse(JSON.stringify(t))
            var c = this._rotate.clockwise(c)
            var os = this._offset.clockwise(c)
            var o = os.find((o) => {
                return this._offset.validate(c, f, o)
            })
            if (typeof(o) == "undefined") {
                return t
            } else {
                var x = c['position'][0] + o[0]
                var y = c['position'][1] + o[1]
                c['position'] = [x, y]
                return c
            }
        },
        rotateAnticlockwise(t, f) {
            var c = JSON.parse(JSON.stringify(t))
            var c = this._rotate.anticlockwise(c)
            var os = this._offset.anticlockwise(c)
            var o = os.find((o) => {
                return this._offset.validate(c, f, o)
            })
            if (typeof(o) == "undefined") {
                return t
            } else {
                c['position'] = this._sum(c['position'], o)
                return c
            }
        },
        _rotate: rotate,
        _offset: offset
    }
})
