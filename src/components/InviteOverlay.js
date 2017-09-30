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
} from '../actions/room'

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
                        <p>Inviting { this.props.buddy.nick }</p>
                        <a className="button cancel" onClick={ this.props.abortInvite }>Actually, let's not</a>
                    </div>
                }
                {this.props.initiator === REMOTE_INITIATOR && 
                    <div className="wrapper">
                        <p>{ this.props.buddy.nick } wants to play w/ you</p>
                        <a className="button accept" onClick={ this.props.acceptInvite }>Sure, I guess</a>
                        <a className="button deny" onClick={ this.props.declineInvite }>Nah, thanks</a>
                    </div>
                }
            </div>
        );
    }
}

export default connect(
    state => ({
        initiator: state.room.roomInitiator,
        buddy: state.room.roomBuddy
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
