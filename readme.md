# Tetris engine
## Features / Specifications
* [7 system / random bag](https://tetris.wiki/Random_Generator) tetromino generation
    (Long run without a desired tetromino is less likely)
* Seed-based tetromino generation
    (Equal chances in multiplayer)
* [Super rotation system](https://tetris.wiki/SRS)
    (Rotation around walls, T-Spins, magical tetris saves)

## Bugs
* If a line above the 0th is cleared, the field shrinks by one line
    and doesn't regenerate an empty line at the top :D

# Compiling
To compile, run this:
```
    # Get dependencies
    npm install

    # Compile
    npm run build
```
