import React from 'react'
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import App from './App'
import EntryPage from './EntryPage'
import LobbyPage from './LobbyPage'
import NoPage from './NoPage'

export default class Root extends React.Component {
    render() {
        return (
            <Provider store={ this.props.store }>
                <Router history={ browserHistory } onUpdate={ () => window.scrollTo(0, 0) }>
                    <Route path="/" component={ App }>
                        <IndexRoute component={ EntryPage }/>
                        <Route path="lobby" component={ LobbyPage }/>
                        <Route path="*" component={ NoPage }/>
                    </Route>
                </Router>
            </Provider>
        )
    }
}

