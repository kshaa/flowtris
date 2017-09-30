import React from 'react'
import Player from './Player'
import { connect } from 'react-redux'
import { initPlayers } from '../actions/players'

class Players extends React.Component {
    componentDidMount() {
        this.props.initPlayers()
    }

    render() {
        return (
            <div className="players">
                <div className="status">
                    {this.props.wrtcHasErrored &&
                        <p>Connection error</p>
                    }
                    {this.props.wrtcIsLoading &&
                        <p>Connecting...</p>
                    }
                </div>
                <div className="list">
                    <ul>
                        {this.props.players.map((player) => {
                            return (
                                <Player key={ player.id } onClick={ this.props.onSelect } player={ player } />
                            )
                        })}
                    </ul>
                </div>
            </div>
        );
    }
}

export default connect(
    state => ({
        players: state.players,
        ...state.wrtc
    }),
    dispatch => ({
        initPlayers() { dispatch(initPlayers) } 
    })
)(Players)

