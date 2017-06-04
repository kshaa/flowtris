# HTML5 / WebRTC Tetris
Motivation for this project was a lack of good multiplayer tetris
written with nice controls and without flash as a dependency.

# Features / Specifications
* [7 system / random bag](https://tetris.wiki/Random_Generator) tetromino generation
    (Long run without a desired tetromino is less likely)
* Seed-based tetromino generation
    (Equal chances in multiplayer)
* [Super rotation system](https://tetris.wiki/SRS)
    (Rotation around walls, T-Spins, magical tetris saves)
* Modifiable lock delay. Default: 2.5s // Not yet implemented
    (Tetromino locks down when it has touched ground after a delay)

# Compiling
To compile, run this:
```
    # Get dependencies
    npm install
    # Optimize // not necessary
    node node_modules/requirejs/bin/r.js -o tools/build.js
```
