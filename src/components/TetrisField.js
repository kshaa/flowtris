import React from 'react'
import classNames from 'classnames'
import KeyHandler, {KEYDOWN} from 'react-key-handler'
import { connect } from 'react-redux'
import {
    moveLeft,
    moveRight,
    moveClockwise,
    moveDown,
    moveDrop
} from '../actions/game'

class TetrisField extends React.Component {
    cellClass(cellType) {
        return classNames({
            cell: true,
            [cellType]: true,
            x: cellType === 0
        })
    }

    bindKeyboard() {
        return (
            <div className="keyboard-bind">
                {/* WASD */}
                <KeyHandler keyValue="a" onKeyHandle={this.props.moveLeft} keyEventName={KEYDOWN} />
                <KeyHandler keyValue="d" onKeyHandle={this.props.moveRight} keyEventName={KEYDOWN} />
                <KeyHandler keyValue="s" onKeyHandle={this.props.moveDown} keyEventName={KEYDOWN} />
                <KeyHandler keyValue="w" onKeyHandle={this.props.moveClockwise} keyEventName={KEYDOWN} />

                {/* Arrows */}
                <KeyHandler keyValue="ArrowLeft" onKeyHandle={this.props.moveLeft} keyEventName={KEYDOWN} />
                <KeyHandler keyValue="ArrowRight" onKeyHandle={this.props.moveRight} keyEventName={KEYDOWN} />
                <KeyHandler keyValue="ArrowDown" onKeyHandle={this.props.moveDown} keyEventName={KEYDOWN} />
                <KeyHandler keyValue="ArrowUp" onKeyHandle={this.props.moveClockwise} keyEventName={KEYDOWN} />

                {/* Space Drop */}
                <KeyHandler keyValue=" " onKeyHandle={this.props.moveDrop} keyEventName={KEYDOWN} />
            </div>
        )
    }

    render() {
        const loaded = !this.props.remote || (this.props.player && this.props.player.loaded),
              nick = this.props.remote ? (this.props.player ? this.props.player.nick : 'This dude') :
                     this.props.config ? this.props.config.nick : 'You',
              lost = this.props.game.lost,
              won = this.props.game.won, // Add winning ;D
              remote = this.props.remote,
              game = this.props.game,
              empty = JSON.stringify(game.field) === JSON.stringify([]),
              boardClass = classNames({
                  board: true,
                  remote: !this.props.remote,
                  local: this.props.remote,
                  loaded: loaded && !empty
              })

        return (
            <div className={ boardClass }>
                {!this.props.remote &&
                    this.bindKeyboard()
                }
                <div className="nickname">
                    {!loaded &&
                        <p>...</p>
                    }
                    {loaded && remote &&
                        <p>{ nick }</p>
                    }
                    {loaded && !remote &&
                        <p>{ nick+ " (You)"}</p>
                    }
                </div>
                <div className="game">
                    <div className="status">
                        {!loaded && !lost && !won &&
                            <p>{ "Waiting for player to join" }</p>
                        }
                        {remote && lost &&
                        <p>{ nick + " lost" }</p>
                        }
                        {remote && won &&
                        <p>{ nick + " won" }</p>
                        }
                        {!remote && won &&
                        <p>{ "You won! 😊" }</p>
                        }
                        {!remote && lost &&
                        <p>{ "You lost 😞" }</p>
                        }
                    </div>
                    <div className="field">
                        {loaded && game && game.field.map((row, index) => {
                            return (
                                <div className="row" key={ index }>
                                    {row.map((cellType, index) => {
                                        return (
                                            <span className={ this.cellClass(cellType) } key={index}>
                                                { cellType }
                                            </span>
                                        )
                                    })}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({}),
    dispatch => ({
        moveLeft() { return dispatch(moveLeft) },
        moveRight() { return dispatch(moveRight) },
        moveClockwise() { return dispatch(moveClockwise) },
        moveDown() { return dispatch(moveDown) },
        moveDrop() { return dispatch(moveDrop) }
    })
)(TetrisField)
