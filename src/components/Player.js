import React from 'react'

export default class Player extends React.Component {
    render() {
        return (
            <div className="player">
                {this.props.player.loaded ? (
                    <p>{ this.props.player.nick }</p>
                ) : (
                    <p>...</p>
                )}
            </div>
        )
    }
}
