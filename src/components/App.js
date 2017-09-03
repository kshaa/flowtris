import React from 'react'
import { Link } from 'react-router'

export default class App extends React.Component {
    render() {
        return (
            <div className="flowtris">
                { this.props.children }
            </div>
        );
    }
}

