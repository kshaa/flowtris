import React from 'react'
import classnames from 'classnames'

export default class Player extends React.Component {
    constructor() {
        super()
        this.onClick = this.onClick.bind(this)
    }

    onClick(e) {
        if (this.props.player.loaded) {
            this.props.onClick(
                this.props.player
            )
        }
    }

    render() {
        const playerClasses = classnames({
            player: true,
            button: true,
            disabled: !this.props.player.loaded
        })
        return (
            <div tabIndex='1' className={ playerClasses } onClick={ this.onClick }>
                { this.props.player.loaded ? (
                    <p>{ this.props.player.nick }</p>
                ) : (
                    <p>...</p>
                )}
            </div>
        )
    }
}
