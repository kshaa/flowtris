import React from 'react'
import { Route, IndexRoute } from 'react-router'
import Layout from './components/Layout';
import EntryPage from './components/EntryPage';
import NoPage from './components/NoPage';

const routes = (
    <Route path="/" component={Layout}>
        <IndexRoute component={EntryPage}/>
        <Route path="*" component={NoPage}/>
    </Route>
);

export default routes;
