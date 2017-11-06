import React from 'react'
import Players from './Players'
import InviteOverlay from './InviteOverlay'
import { connect } from 'react-redux'
import { initWrtc } from '../actions/wrtc'
import { sendInvite } from '../actions/lobby'

const room = 'lobby'

class Lobby extends React.Component {
    componentDidMount() {
        this.props.initWrtc(room)
    }

    selectPlayer = (selectedPlayer) => {
        this.props.sendInvite(selectedPlayer)
    }

    render() {
        return (
            <div className="lobby">
                <InviteOverlay/>
                <header>Lobby</header>
                <Players onSelect={ this.selectPlayer }/>
            </div>
        );
    }
}

export default connect(
    state => ({}),
    dispatch => ({
        initWrtc(room) { dispatch(initWrtc(room)) },
        sendInvite(player) { dispatch(sendInvite(player)) }
    })
)(Lobby)
