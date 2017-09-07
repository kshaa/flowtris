import React from 'react'
import Players from './Players'

export default class Lobby extends React.Component {
    constructor() {
        super()
        this.state = { selectedPlayer: {} }
    }

    selectPlayer = (selectedPlayer) => {
        this.setState({ selectedPlayer })
    }

    render() {
        return (
            <div className="lobby">
                <p>Selected player: { this.state.selectedPlayer.nick }</p>
                <Players onSelect={ this.selectPlayer }
                    selectedPlayer={ this.state.selectedPlayer }/>
            </div>
        );
    }
}
