import React from 'react'
import Players from './Players'

export default class Lobby extends React.Component {
    constructor() {
        super()
        this.state = { player: '' }
    }

    selectPlayer = (player) => {
        this.setState({ player })
    }

    render() {
        return (
            <div className="lobby">
                <p>Selected player: { this.state.player }</p>
                <Players onSelect={ this.selectPlayer } />
            </div>
        );
    }
}
