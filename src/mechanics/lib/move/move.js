define(["require", "./lib/srs/srs", "./lib/srs/lib/rotate/rotate", "./lib/validator/validator"],
    function(require, SRS, Rotate, Validator) {
        return function Move(g) {
            this._srs = new SRS()
            this._rotate = new Rotate()
            this._validator = new Validator(g)
            this._intentional = function() {
                for (var move of g.frame.moves) {
                    this._set(move)
                }
            }
            this._forced = function() {
                let t1 = g.settings.droppedAt
                let t2 = performance.now()
                let gravity = g.settings.gravity
                if (t2 - t1 > gravity) {
                    g.settings.droppedAt = performance.now();
                    this._set('down')
                }
            }
            this.move = function(move) {
                this._intentional()
                this._forced()
            }
            this._set = function(move) {
                let piece = this._check(move)
                if ((typeof piece) !== 'undefined') {
                    switch (move) {
                        case 'down':
                            g.settings.droppedAt = performance.now()
                            break
                        case 'drop':
                            g.settings.lockingSince = 0
                            g.settings.locking = true
                            break
                    }
                    for (var property in piece) {
                        g.frame.piece[property] = piece[property]
                    }
                }
            }
            this._bottoms = function (piece) {
                let t = JSON.parse(JSON.stringify(piece.tetramino))
                let bottoms = new Array()
                let tcolumns = this._rotate._clockwiseTetromino(t)
                for (i = 0; i < t.length; i++) {
                    d = tcolumns[i].findIndex((x) => {
                        return x != 0
                    })
                    if (d == -1) {
                        bottoms[i] = -1
                    } else {
                        bottoms[i] = t.length - d - 1
                    }
                }
                return bottoms
            }
            this._getColumn = function(array, n) {
                let column = new Array()
                for (j = 0; j < array.length; j++) {
                    column[j] = array[j][n]
                }
                return column
            }
            this._distances = function(piece) {
                let f = JSON.parse(JSON.stringify(g.frame.field))
                let bottoms = this._bottoms(piece)
                let distances = new Array()
                for (i = 0; i < bottoms.length; i++) {
                    if (bottoms[i] != -1) {
                        let column = this._getColumn(f, (piece.x + i))
                        let position = bottoms[i] + piece.y 
                        let path = column.splice(position + 1, column.length - position - 1)
                        let distance = path.findIndex((x) => {
                            return x != 0
                        })
                        if (distance == -1) {
                            distances[i] = path.length
                        } else {
                            distances[i] = distance
                        }
                    } else {
                        // Larger value than column height
                        distances[i] = f.length + 1
                    }
                }
                return distances
            }
            this.minDistance = function(piece) {
                let distances = this._distances(piece)
                let min = Math.min.apply(Math, distances)
                return min
            }
            this._drop = function(piece) {
                piece.y += this.minDistance(piece)
                return piece
            }
            this._check = function(move) {
                let piece = g.frame.piece
                let pieces = new Array()
                let clone = undefined
                switch(move.toLowerCase()) {
                    case 'cw':
                        pieces = this._srs.rotateClockwise(piece)
                        console.log(pieces)
                        break
                    case 'ccw':
                        pieces = this._srs.rotateAnticlockwise(piece)
                        break
                    case 'left':
                        clone = JSON.parse(JSON.stringify(piece))
                        clone.x -= 1;
                        pieces.push(clone)
                        break
                    case 'right':
                        clone = JSON.parse(JSON.stringify(piece))
                        clone.x += 1;
                        pieces.push(clone)
                        break
                    case 'down':
                        clone = JSON.parse(JSON.stringify(piece))
                        clone.y += 1;
                        pieces.push(clone)
                        break
                    case 'drop':
                        clone = JSON.parse(JSON.stringify(piece))
                        pieces.push(this._drop(clone))
                        break
                    default:
                        console.log('Unknown movement key in Mechanics: "' + move.toLowerCase() + '"')
                        break
                }
                return this._validator.check(pieces)
            }
        }
    }
)
