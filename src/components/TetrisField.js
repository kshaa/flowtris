import React from 'react'
import classNames from 'classnames'

export default class TetrisField extends React.Component {
    componentDidMount() {
        console.log('tada', this.props)
    }

    render() {
        const fieldClass = classNames({
            field: true,
            remote: !this.props.main,
            self: this.props.main
        })

        return (
            <div tabIndex='1' className={ fieldClass }>
                {this.props.main &&
                    <p>{ this.props.config.nick }</p>
                }
                {!this.props.main && !this.props.player.loaded &&
                    <p>...</p>
                }
                {!this.props.main && this.props.player.loaded &&
                    <p>{ this.props.player.nick }</p>
                }
            </div>
        )
    }
}
