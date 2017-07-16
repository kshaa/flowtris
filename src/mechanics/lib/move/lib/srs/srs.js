define(["./lib/rotate/rotate", "./lib/offset/offset"],
function(Rotate, Offset) {
    return function SRS() {
        this.rotateClockwise = function(t) {
            let clone = JSON.parse(JSON.stringify(t))
            let rotated = this._rotate.clockwise(clone)
            let offsets = this._offset.clockwise(clone)
            let pieces = new Array()

            for (let offset of offsets) {
                let clone = JSON.parse(JSON.stringify(rotated))
                console.log('oldx: ', clone.x)
                console.log('offset: ', offset[0])
                clone.x += offset[0]
                clone.y -= offset[1]
                console.log('newx: ', clone.x)
                clone.rotation = this._offset.clockwiseKey(
                    clone.rotation.toString()
                )
                pieces.push(clone)
            }

            return pieces
        }
        this.rotateAnticlockwise = function(t) {
            let clone = JSON.parse(JSON.stringify(t))
            let rotated = this._rotate.anticlockwise(clone)
            let offsets = this._offset.anticlockwise(clone)
            let pieces = new Array()

            for (let offset of offsets) {
                let clone = JSON.parse(JSON.stringify(rotated))
                clone.x += offset[0]
                clone.y -= offset[1]
                clone.rotation = this._offset.anticlockwiseKey(
                    clone.rotation.toString()
                )
                pieces.push(clone)
            }

            return pieces
        }
        this._rotate = new Rotate()
        this._offset = new Offset()
    }
})
