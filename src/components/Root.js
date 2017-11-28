import React from 'react'
import { Provider, connect } from 'react-redux'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { leaveRoomWrtc } from '../actions/wrtc'
import App from './App'
import EntryPage from './EntryPage'
import LobbyPage from './LobbyPage'
import RoomPage from './RoomPage'
import NoPage from './NoPage'

class Root extends React.Component {
    render() {
        return (
            <Provider store={ this.props.store }>
                <Router history={ browserHistory } onUpdate={ () => window.scrollTo(0, 0) }>
                    <Route path="/" component={ App } onChange={ this.props.leaveRoomWrtc }>
                        <IndexRoute component={ EntryPage }/>
                        <Route path="lobby" component={ LobbyPage }/>
                        <Route path="room/:id" component={ RoomPage }/>
                        <Route path="*" component={ NoPage }/>
                    </Route>
                </Router>
            </Provider>
        )
    }
}

export default connect(
    state => ({}),
    dispatch => ({
        leaveRoomWrtc() { dispatch(leaveRoomWrtc) }
    })    
)(Root)
