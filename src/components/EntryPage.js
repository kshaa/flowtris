import React from 'react'
import { Link } from 'react-router'

export default class Entry extends React.Component {
    render() {
        return (
            <div className="entry">
                <header>Flowtris</header>
                <input type="text" placeholder="Guest"></input>
                <Link to="/lobby">
                    <button>&gt;</button>
                </Link>
            </div>
        );
    }
}
