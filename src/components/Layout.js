import React from 'react'
import { Link } from 'react-router'
import Sidebar from './Sidebar'

export default class Layout extends React.Component {
    render() {
        return (
            <div className="flowtris">
                <Sidebar/>
                <div className="page">
                { this.props.children }
                </div>
            </div>
        );
    }
}
