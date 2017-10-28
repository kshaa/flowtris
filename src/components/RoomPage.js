import React from 'react'
import TetrisField from './TetrisField'
import { connect } from 'react-redux'
import { initWrtc } from '../actions/wrtc'
import { initPlayers } from '../actions/players'
import { startRoom } from '../actions/game'
import { SELF_INITIATOR } from '../actions/lobby'

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
        const self = this
        setTimeout(
                function() {
                
        self.props.startRoom()
                },
                2000)
    }

    render() {
        return (
            <div className="room">
                <header>Game room</header>
                <TetrisField remote={ false } config={ this.props.config } game={ this.props.games.self }/>
                {Object.keys(this.props.games.remote).map((id) => {
                    console.log(id, this.props.games.remote[id], this.props.players.filter((player) => player.id == id)[0])
                    return (
                        <TetrisField remote={ true } key={ id } game={ this.props.games.remote[id] }
                            player={ this.props.players.filter((player) => player.id == id)[0] } />
                    )
                })}
            </div>
        );
    }
}

export default connect(
    state => ({
        config: state.config,
        players: state.players,
        games: state.room.roomGames
    }),
    dispatch => ({
        initWrtc(room) { return dispatch(initWrtc(room)) },
        initPlayers() { return dispatch(initPlayers) },
        startRoom() { return dispatch(startRoom) }
    })    
)(Room)
