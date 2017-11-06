import React from 'react'

export default class LoadingDots extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tick: 0
        }
    }

    componentDidMount() {
        this.tickerId = setInterval(
            () => this.tick(),
            this.props.timing
        )
    }

    componentWillUnmount() {
        clearInterval(this.tickerId)
    }

    tick() {
        console.log(this.state)
        this.setState({
            tick: this.state.tick == 3 ? 0 : this.state.tick++
        })
    }


    render() {
        const dot = this.props.thick ? '*' : '.'
        const dots = []
        for (let i = 0; i < this.state.tick; i++) {
            dots.push(dot)
        }
        return (
            <span className="loading dots">
                {dots.map((dot) => {
                    return (
                        <span key={i}>{ dot }</span>
                    )
                })}
            </span>
        )
    }
}