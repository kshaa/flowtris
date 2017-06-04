define(["require", "./engine/generator", "./engine/srs", "./engine/data/field"],
function(require, generator, srs, field) {
    return {
        _settings: {
            gravity: 0.1, // Tetris G's - cells per frame 
            height: 24, // Upper two lines are the spawn
            width: 10
        },
        _generator: generator,
        _srs: srs,
        _field: field,
        _game: {
                time: 0, // Start of computation (ms)
                piece: { // Current tetromino piece on field
                    key: undefined, // What type of tetromino
                    x: undefined, // Bounding box's upper left coordinate
                    y: undefined, // Bounding box's upper left coordinate
                    rotation: undefined, // 0 R 2 L
                    tetramino: undefined // [ [ (Boolean) ] ]
                },
                moves: new Array(), // [ Char ] Moves to be executed
                field: undefined // [ [ (Tetromino type) ] ]
        },
        _history: new Array(), // List of old game states
        start() {
            // Generate empty field
            var s = this._settings
            this._game.field = field.generate(s.width, s.height)

            // Spawn piece
            
        },
        // stop()
        // _main()
        move(m) {
            this._game.moves.push(m)
        },
        seed(s) {
            if (arguments.length == 0) {
                return this._generator.seed()
            } else {
                this._generator.seed(s)
            }
        },
        field() {
            return this._game.field // Add on top current tetris position
        }
        // actions() // what has happened
    }
})
