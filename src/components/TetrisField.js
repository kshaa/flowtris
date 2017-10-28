import React from 'react'
import classNames from 'classnames'

export default class TetrisField extends React.Component {
    componentDidMount() {
        console.log('tada', this.props)
    }

    render() {
        const loaded = !this.props.remote || (this.props.player && this.props.player.loaded),
              started = this.props.game.started,
              remote = this.props.remote,
              fieldClass = classNames({
                  field: true,
                  remote: !this.props.remote,
                  local: this.props.remote,
              })

        return (
            <div tabIndex='1' className={ fieldClass }>
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
                <div className="status">
                    {!loaded &&
                        <p>{ "Waiting for player to join" }</p>
                    }
                    {loaded &&
                        <p>{ "Ready!" }</p>
                    }
                </div>
                <div className="field">
                </div>
            </div>
        )
    }
}
