import React from 'react';
import { Clock, Modify } from './styled-components';
import * as action from '../store';
import {connect} from 'react-redux';

class Timer extends React.Component{
  constructor(props){
    super(props);
    this.state = {
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
      let time = this.props.timer;
      if (time <= 999){
        this.stop();
      } else {
        // this.setState({
        //   ms: this.state.ms - 1000
        // });
        console.log('TICK', this.props.timer, typeof time);

        this.props.changeTimer(time - 1000);
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
    let ms = this.props.timer;
    console.log('RENDER', this.props);
    let hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let seconds = Math.floor((ms % (1000 * 60)) / 1000);

    return (
      <Clock>
       <h4>Timer</h4>
        <Modify href="#" name="hourAdd">+</Modify>
       <Modify href="#" name="minutesAdd">+</Modify>
       <Modify href="#"  name="secondsAdd">+</Modify>
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

const mapState = (state) => {
  return {
    timer: state.ai.time
  };
};

const mapDispatch = (dispatch) => {
  return {
    changeTimer (time){
      console.log('CHANGE TIMER', time);
     dispatch(action.setTimer(time))
   }
  };
};


export default connect(mapState, mapDispatch)(Timer);
