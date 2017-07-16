define(function() {
    return function Hook() {
        this.before = function(callback) {
            this._befores.push(callback)
            return this._befores.length - 1 // Action id
        }
        this._runBefores = function(engine, delay) {
            for (i = 0; i < this._befores.length; i++) {
                this._befores[i](engine, delay)
            }
        }
        this._befores = new Array() // Functions to run before each frame
        this.after = function(callback) {
            this._afters.push(callback)
            return this._afters.length - 1 // Action id
        }
        this._runAfters = function(engine, delay) {
            for (i = 0; i < this._afters.length; i++) {
                this._afters[i](engine, delay)
            }
        }
        this._afters = new Array() // Functions to run after each frame
    }
})

