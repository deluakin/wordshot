import React, { Component } from 'react'
import GetStarted from './get_started'
import NewGame from './new_game'

export class Start extends Component {
    state = {
        begin: 1
    };

    changeHandler = (value) => {
        this.setState({
            begin: value
        });
    }

    render() {
        const begin = this.state.begin;
        if (begin === 1) {
        return (
            <GetStarted onChange={this.changeHandler} />
        );
        }else if (begin === 2) {
        return (
            <NewGame onChange={this.changeHandler}  />
        );
        }
    }
}

export default Start
