import React from 'react'
import { render } from 'react-dom'
import Root from './components/Root'

import { createStore, compose, applyMiddleware } from 'redux'
import { persistStore, autoRehydrate } from 'redux-persist'
import createActionBuffer from 'redux-action-buffer'
import { REHYDRATE } from 'redux-persist/constants'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import rootReducer from './reducers/root'

const store = createStore(
    rootReducer,
    undefined,    
    compose(
        applyMiddleware(thunk),
        autoRehydrate(),
        applyMiddleware(
            createActionBuffer(REHYDRATE)
        ),
        applyMiddleware(createLogger({
              collapsed: (getState, action, logEntry) => !logEntry.error
        }))
    )
)

persistStore(store, {
    whitelist: ['config']
}, () => {
    render(
        <Root store={ store }/>,
        document.getElementById('root')
    );

})


