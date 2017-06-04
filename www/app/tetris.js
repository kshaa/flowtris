define(['./engine/engine', './renderer/renderer', './controls/controls'],
function(TetrisEngine, Renderer, Controls) {
    // peerjs = require('peerjs/dist/peer')

    var t = new TetrisEngine()
    var r = new Renderer(t)
    var c = new Controls(t)

    t.start()
    t.hook.after(r.draw.bind(r))

})
