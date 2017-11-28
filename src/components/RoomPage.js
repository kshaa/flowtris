import React from 'react'
import TetrisField from './TetrisField'
import { connect } from 'react-redux'
import { initWrtc } from '../actions/wrtc'
import { initPlayers } from '../actions/players'
import { startRoom } from '../actions/game'
import { Link } from 'react-router';
import classNames from 'classnames'

export const room = 'room'

class Room extends React.Component {
    constructor(props) {
        super(props)

        this.roomId = this.props.routeParams.id
    }

    componentDidMount() {
        this.props.initWrtc(room + this.roomId)
        this.props.initPlayers()
        const self = this
        setTimeout(
        function() {
            self.props.startRoom()
        }, 2000)
    }

    failMessage() {
        return (
            <div className="sorry-message center">
                <p>This place seems real empty!</p>
                <p>The developer was probably too lazy to create a refreshable game connection.</p>
                <span className="emoji">😒</span>
                <Link to="/lobby">
                    <button>Back to lobby</button>
                </Link>
            </div>
        )
    }

    render() {
        const returnButtonClasses = classNames({
            hidden: !this.props.roomEnded,
            return: true
        })

        return (
            <div className="room">
                <header>Game room</header>
                <div className="fields">
                    {Object.keys(this.props.games.remote).length === 0 &&
                        this.failMessage()
                    }
                    {Object.keys(this.props.games.remote).length !== 0 &&
                        <TetrisField remote={ false } config={ this.props.config } game={ this.props.games.self }/>
                    }
                    {Object.keys(this.props.games.remote).map((id) => {
                        return (
                            <TetrisField remote={ true } key={ id } game={ this.props.games.remote[id] }
                                player={ this.props.players.filter((player) => player.id == id)[0] } />
                        )
                    })}
                </div>
                <Link className={ returnButtonClasses } to="/lobby">
                    <button className="button">Back to lobby</button>
                </Link>
            </div>
        );
    }
}

export default connect(
    state => ({
        config: state.config,
        players: state.players,
        games: state.room.roomGames,
        roomEnded: state.room.roomEnded
    }),
    dispatch => ({
        initWrtc(room) { return dispatch(initWrtc(room)) },
        initPlayers() { return dispatch(initPlayers) },
        startRoom() { return dispatch(startRoom) }
    })    
)(Room)
