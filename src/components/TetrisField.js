import React from 'react'
import classNames from 'classnames'

export default class TetrisField extends React.Component {
    componentDidMount() {
        console.log('tada', this.props)
    }

    cellClass(cellType) {
        return classNames({
            cell: true,
            [cellType]: true,
            x: cellType === 0
        })
    }

    render() {
        const loaded = !this.props.remote || (this.props.player && this.props.player.loaded),
              started = this.props.game.started,
              remote = this.props.remote,
              game = this.props.game,
              empty = JSON.stringify(game) === JSON.stringify([]),
              boardClass = classNames({
                  board: true,
                  remote: !this.props.remote,
                  local: this.props.remote,
                  loaded: loaded && !empty
              })

        return (
            <div className={ boardClass }>
                <div className="nickname">
                    {!loaded &&
                        <p>...</p>
                    }
                    {loaded && remote &&
                        <p>{ this.props.player.nick }</p>
                    }
                    {loaded && !remote &&
                        <p>{ this.props.config.nick }</p>
                    }
                </div>
                <div className="game">
                    <div className="status">
                        {!loaded &&
                            <p>{ "Waiting for player to join" }</p>
                        }
                    </div>
                    <div className="field">
                        {loaded && game && /* started && */ game.field.map((row, index) => {
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
