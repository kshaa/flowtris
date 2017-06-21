define([
    "require", "./lib/randomize/randomize", "./lib/mechanics/mechanics",
    "./data/game", "./lib/hook/hook"
],
function(
    require, Randomize, Mechanics,
    Gamestate, Hook
) {
    return function TetrisEngine(seed) {

        //

        this.hook       = new Hook()
        this._game      = new Gamestate()
        this._randomize = new Randomize()
        this._mechanics = new Mechanics(this._game, this._randomize)

        // Info

        this.seed = this._randomize.seed
        this.field = this._mechanics.field

        // Loop
        
        this._main = function() {
            let fps = 60
            let delta = this._logTime()                

            this.hook._runBefores(this, delta)
            if (this._game.settings.playing &&
                !this._game.settings.delayed) {
                this._mechanics.spawn()
                this._mechanics.move()
                this._mechanics.flushMoves()
                this._mechanics.lock(() => {
                    this._mechanics.storePiece.bind(
                        this._mechanics
                    )()
                    this._mechanics.removeFilled.bind(
                        this._mechanics
                    )()
                })
            }
            this.hook._runAfters(this, delta)

            setTimeout(() => {
                window.requestAnimationFrame(this._main.bind(this))
            }, ((1000 / 60) - delta))
        }

        this._logTime = function() {
            if (typeof (this._game.settings.startedAt) === 'undefined') {
                var t1 = performance.now()
                this._game.settings.startedAt = t1
            } else {
                var last = this._game.frame.lastTime
                var t1 = last
            }
            var t2 = performance.now()
            this._game.frame.lastTime = t2
            return t2 - t1
        }

        // Interactions

        this.move = function(key) {
            this._game.frame.moves.push(key);
        }
        this.pause = function() {
            this._game.settings.playing = false
        }
        this.unpause = function() {
            this._game.settings.playing = true
        }
        this.togglePause = function() {
            console.log('toggle')
            this._game.settings.playing = !this._game.settings.playing
        }
        this.delay = function() {
            this._game.settings.delayed = true
        }
        this.undelay = function() {
            this._game.settings.delayed = false
        }
        this.toggleDelay = function() {
            this._game.settings.delayed = !this._game.settings.delayed
        }
        this.start = function(wait) {
            if (typeof(this._game.settings.startedAt) !== 'undefined') {
                // Get set
                this._game = new Gamestate()
                this._randomize = new Randomize(seed)
                this._mechanics = new Mechanics(this._game, this._randomize)
            }

            // Ready
            this._game.settings.frameId = window.requestAnimationFrame(this._main.bind(this))

            // Go / Wait a bit
            wait = (typeof wait === 'undefined') ? false : true
            this._game.settings.playing = wait ? false : true
        }
        this.stop = function() {
            var id = this._game.settings.frameId
            window.cancelAnimationFrame(id)

            this.start(true)
        }
        this.restart = function() {
            this.stop()
            this.start()
        }
    }
})

