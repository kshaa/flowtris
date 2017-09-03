import React from 'react'
import Player from './Player'
import { connect } from 'react-redux'
import { playersInit } from '../actions/players'

class Players extends React.Component {
    componentDidMount() {
        this.props.playersInit()
    }

    handleSelect(peer) {
        this.props.onSelect(peer);
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
                        {this.props.players.map((player) =>
                            <Player key={ player.id } player={ player }/>
                        )}
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
        playersInit() { dispatch(playersInit) }
    })
)(Players)

