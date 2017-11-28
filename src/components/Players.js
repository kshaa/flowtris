import React from 'react'
import Player from './Player'
import LoadingDots from './LoadingDots'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { initPlayers } from '../actions/players'

class Players extends React.Component {
    componentDidMount() {
        this.props.initPlayers()
    }

    render() {
        const loading = this.props.wrtcIsLoading,
            errored = this.props.wrtcHasErrored,
            noPlayers = this.props.players.length == 0,
            empty = !loading && !errored && noPlayers,
            listClasses = classNames({
                list: true,
                empty: empty
            })

        return (
            <div className="players">
                <div className="status">
                    {errored &&
                        <p>Connection error</p>
                    }
                    {loading &&
                        <p>Connecting...</p>
                    }
                    {empty &&
                        <div className="multiline">
                            <p>Huh, seems you're the only one here. :/</p>
                            <p>Let's just wait for a while</p>
                            <LoadingDots/>
                        </div>
                    }
                </div>
                <div className={listClasses}>
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

