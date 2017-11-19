import React from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import {
    listenInvite,
    abortInvite,
    listenAbortInvite,
    acceptInvite,
    listenAcceptInvite,
    declineInvite,
    listenDeclineInvite,
    NO_INITIATOR,
    SELF_INITIATOR,
    REMOTE_INITIATOR
} from '../actions/lobby'

class InviteOverlay extends React.Component {
    componentDidMount() {
        this.props.listenInvite()
        this.props.listenAbortInvite()
        this.props.listenAcceptInvite()
        this.props.listenDeclineInvite()
    }

    render() {
        const overlayClass = classNames({
            overlay: true,
            hidden: this.props.initiator === NO_INITIATOR,
            remote: this.props.initiator === REMOTE_INITIATOR,
            self: this.props.initiator === SELF_INITIATOR
        })

        return (
            <div className={ overlayClass }>
                {this.props.initiator === SELF_INITIATOR &&
                    <div className="wrapper">
                        <h1>Inviting { this.props.buddy.nick }</h1>
                        <div className="input-wrapper spaced">
                            <a className="button cancel" onClick={ this.props.abortInvite }>Cancel</a>
                        </div>
                    </div>
                }
                {this.props.initiator === REMOTE_INITIATOR && 
                    <div className="wrapper">
                        <h1>{ this.props.buddy.nick } wants to play w/ you</h1>
                        <div className="input-wrapper spaced">
                            <a className="button accept" onClick={ this.props.acceptInvite }>Yaas</a>
                            <a className="button deny" onClick={ this.props.declineInvite }>No, thanks</a>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

/**
 * This should all be done in actions
 * it's an anti-pattern, but I want to see a working
 * application first, so whatever
 * TODO - Rework when implementing multiplayer
 */

const populateBuddies = (buddies, players) => {
    const buddiesClone = {} // Mustn't modify state
    Object.keys(buddies).map((id) => {
        const player = players.filter((player) => player.id == id)[0]
        buddiesClone[id] = buddies[id]
        buddiesClone[id]['nick'] = player.nick
    })

    return buddiesClone
}

const getFirstBuddy = (buddies) => {
    return Object.values(buddies)[0]
}

export default connect(
    state => ({
        initiator: state.room.roomInitiator,
        buddy: getFirstBuddy(populateBuddies(state.room.roomGames.remote, state.players))
    }),
    dispatch => ({
        listenInvite() { dispatch(listenInvite) },
        abortInvite() { dispatch(abortInvite) },
        listenAbortInvite() { dispatch(listenAbortInvite) },
        acceptInvite() { dispatch(acceptInvite) },
        listenAcceptInvite() { dispatch(listenAcceptInvite) },
        declineInvite() { dispatch(declineInvite) },
        listenDeclineInvite() { dispatch(listenDeclineInvite) }
    })
)(InviteOverlay)
