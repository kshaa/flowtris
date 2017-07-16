define(function(require) {
    var move = require('./lib/move/move')

    return function Mechanics(g, r) {
        this._move = new move(g)
        this.move = this._move.move.bind(this._move)
        this.field = function() {
            let justfield = JSON.parse(JSON.stringify(g.frame.field))
            let piece = g.frame.piece
            let t = piece.tetramino
            if (piece.active) {
                for (i = 0; i < t.length; i++) {
                    for (j = 0; j < t[0].length; j++) {
                        if (t[i][j] != 0) {
                            let val = t[i][j]
                            console.log(justfield, piece, i, j)
                            justfield[piece.y + i][piece.x + j] = val ? piece.key : '0'
                        }
                    }
                }
            }
            return justfield
        }
        this.spawn = function() {
            if (!g.frame.piece.active) {
                g.frame.piece = r.tetromino()
                g.frame.piece.active = true
            }
        }
        this.flushMoves = function() {
            g.frame.moves = new Array()
        }
        this.storePiece = function() {
            g.frame.field = this.field()
            g.frame.piece.active = false
        }
        this.removeFilled = function() {
            let f1 = g.frame.field
            let fillds = f1.map((r) => {
                return (-1 == r.findIndex((val) => {
                    return (val == 0)
                }))
            })
            for (i = 0; i < fillds.length; i++) {
                let f = g.frame.field
                if (fillds[i]) {
                    let empty = new Array(g.settings.width)
                    empty.fill(0)
                    empty = [empty]
                    g.frame.field = empty.concat(
                        f.splice(0, i).concat(
                            f.splice(i+1, f.length - i - 1)
                        )
                    )
                    console.log(i, f, empty, fillds)
                }
            }
        }
        this.lock = function(callback) {
            let piece = g.frame.piece
            if (this._move.minDistance(piece) == 0) {
                let s = g.settings
                if (s.locking == false) {
                    s.locking = true
                    s.lockingSince = performance.now()
                } else {
                    let t1 = s.lockingSince
                    let t2 = performance.now()
                    if (t2 - t1 > s.lockTime) {
                        s.locking = false
                        callback()
                    }
                }
            }
        }

    }
})
