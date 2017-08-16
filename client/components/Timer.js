import React from 'react';
import { Clock } from './styled-components';

class Timer extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      ms: props.time,
      stopped: true,
      timer: null,
      done: false
    };
    this.toggleTimer = this.toggleTimer.bind(this);
    this.tick = this.tick.bind(this);
    this.stop = this.stop.bind(this);
  }

  stop(){
    this.setState({done: true});
  }

  tick(){
    if (this.state.stopped === false){
      if (this.state.ms <= 999){
        this.stop();
      } else {
        this.setState({
          counter: this.state.counter - 1,
          ms: this.state.ms - 1000
        });
      }
    }

  }

  toggleTimer(){
    if (this.state.stopped){
      this.setState({stopped: false});
      let timer = setInterval(this.tick, 1000);
      this.setState({timer});
    } else {
      this.setState({stopped: true});
      clearInterval(this.state.timer);
    }
  }

  render(){
    let ms = this.state.ms;
    let hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let seconds = Math.floor((ms % (1000 * 60)) / 1000);

    return (
      <Clock>
       <h4>Timer</h4>
        {twoDigits(hours) + ':' + twoDigits(minutes) + ':' + twoDigits(seconds)}
        <button type="button" className="btn btn-info btn-lg" onClick={this.toggleTimer}>
          {
            this.state.stopped ?
            <span className="glyphicon glyphicon-play"/>
            :
            <span className="glyphicon glyphicon-pause" />
          }
        </button>
        {(this.state.done === true) ?
        <audio autoPlay className="player" preload="false">
          <source src="https://freesound.org/people/kwahmah_02/sounds/250629/download/250629__kwahmah-02__alarm1.mp3" />
        </audio> : null}

      </Clock>
    );
  }
}

function twoDigits(n){
  return (n < 10 ? '0' : '') + n;
}

export default Timer;
