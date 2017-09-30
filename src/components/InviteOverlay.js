import React from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import {
    listenInvite,
    abortInvite,
    NO_INITIATOR,
    SELF_INITIATOR,
    REMOTE_INITIATOR,
} from '../actions/room'

class InviteOverlay extends React.Component {
    componentDidMount() {
        this.props.listenInvite()
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
                    <p>Inviting { this.props.buddy.nick }</p>
                }
                {this.props.initiator === REMOTE_INITIATOR &&
                    <p>{ this.props.buddy.nick } wants to play w/ you</p>
                }
                <a className="button cancel" onClick={ this.props.abortInvite }>Cancel</a>
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
        abortInvite() { dispatch(abortInvite) }
    })
)(InviteOverlay)
