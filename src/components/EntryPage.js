import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { configNick } from '../actions/config'

class Entry extends React.Component {
    constructor(props) {
        super(props)
        this.state = { nick: '' }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        this.setState({ nick: this.props.nick })
    }

    handleChange(e) {
        this.setState({ nick: e.target.value })
    }

    handleSubmit(e) {
        this.props.setNick(this.state.nick)
        browserHistory.push('/lobby')
        e.preventDefault()
    }

    render() {
        return (
            <div className="entry">
                <header>Flowtris</header>
                <form onSubmit={this.handleSubmit}>
                    <input type="text" placeholder="Nickname" value={ this.state.nick }
                        onChange={ this.handleChange }/>
                    <button type="submit">
                        <span>Start</span>
                    </button>
                </form>
            </div>
        );
    }
}

export default connect(
    state => state.config,
    dispatch => ({
        setNick: (nick) => dispatch(configNick(nick))
    })    
)(Entry)
