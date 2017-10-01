import React from 'react'
import TetrisField from './TetrisField'
import { connect } from 'react-redux'
import { initWrtc } from '../actions/wrtc'
import { initPlayers } from '../actions/players'

export const room = 'room'

class Room extends React.Component {
    constructor(props) {
        super(props)

        this.roomId = this.props.routeParams.id
    }

    componentDidMount() {
        console.log('switching room')
        this.props.initWrtc(room + this.roomId)
        this.props.initPlayers()
    }

    render() {
        return (
            <div className="room">
                <header>Game room</header>
                <TetrisField main={ true } config={ this.props.config }/>
                {this.props.players.map((player) => {
                    return (
                        <TetrisField main={ false } key={player.id} player={player}/>
                    )
                })}
            </div>
        );
    }
}

export default connect(
    state => ({
        config: state.config,
        players: state.players
    }),
    dispatch => ({
        initWrtc(room) { return dispatch(initWrtc(room)) },
        initPlayers() { return dispatch(initPlayers) }
    })    
)(Room)
