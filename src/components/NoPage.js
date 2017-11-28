import React from 'react';
import { Link } from 'react-router';

export default class NoPage extends React.Component {
    render() {
        return (
            <div>
                <header>Page not found</header>
                <Link to="/lobby">
                    <button>Back to lobby</button>
                </Link>
            </div>
        );
    }
}
