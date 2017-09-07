import React from 'react'

export default class Player extends React.Component {
    constructor() {
        super()
        this.onClick = this.onClick.bind(this)
    }

    onClick(e) {
        this.props.onClick(
            this.props.player
        )
    }

    render() {
        return (
            <div tabIndex='1' className='player' onClick={ this.onClick }>
                { this.props.player.loaded ? (
                    <p>{ this.props.player.nick }</p>
                ) : (
                    <p>...</p>
                )}
            </div>
        )
    }
}
