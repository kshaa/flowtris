define(['keyboardjs/dist/keyboard.min'], function(kb) {
    return function Controls(t) {
        // Control the tetromino
        kb.bind('up', function() {
            t.move('cw')
        }, null)
        kb.bind('down', function() {
            t.move('down')
        }, null)
        kb.bind('left', function() {
            t.move('left')
        }, null)
        kb.bind('right', function() {
            t.move('right')
        }, null)
        kb.bind('space', function() {
            t.move('drop')
        }, null)

        // Pause
        kb.bind('p', function(e) {
            t.togglePause()
        }, null)
        kb.bind('r', function(e) {
            t.restart()
        }, null)

    }
})
