import React from 'react'
import { Link } from 'react-router'

export default class Sidebar extends React.Component {
    render() {
        return (
            <div className="sidebar">
                <Link to="/">
                    <p>Flowtris</p>
                </Link>
                <p>P2P HTML5 Tetris</p>
                <div className="wrapper">
                    { this.props.children }
                </div>
            </div>
        )
    }
}
