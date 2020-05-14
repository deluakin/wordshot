import React, { Component } from 'react';
import Start from './components/start'
import './App.css';
import Variables from './components/config';

class App extends Component {

  state = {
    isReady: false,
}
componentWillMount(){
  var random = parseInt(Math.random() * Variables.words.length)
  Variables.word = Variables.words[random].toUpperCase()
  fetch(`${Variables.apiBase}get.php?v=${Math.random()}`,
      {mode: 'cors'})
        .then(results => {
          return results.json();
        }).then(data => {
          if(data.hasOwnProperty('score')){
            Variables.targetPoint = data.score
            this.setState({
              isReady: true
            })
          }
        })
}

render() {
  return (
    <div className="App">
      {this.state.isReady && 
       <Start />
      }
    </div>
  );
}

}
export default App;