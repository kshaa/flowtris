import React from 'react'
import { render } from 'react-dom'
import Root from './components/Root'

import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers/root'

const store = createStore(
    rootReducer,
    {},
    applyMiddleware(thunk)
)

window.onload = () => {
    render(
        <Root store={ store }/>,
        document.getElementById('root')
    );
};

