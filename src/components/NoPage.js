import React from 'react';

export default class NoPage extends React.Component {
    render() {
        <div>
            <header>Page not found</header>
            <Link to="/lobby">
                <button>Back to lobby</button>
            </Link>
        </div>
    }
}
