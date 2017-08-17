import React from 'react';
import { Clock, Add, Modify } from './styled-components';
import * as action from '../store';
import {connect} from 'react-redux';

class Timer extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      stopped: true,
      timer: setInterval(this.tick, 1000),
      done: false
    };
    this.toggleTimer = this.toggleTimer.bind(this);
    this.tick = this.tick.bind(this);
    this.stop = this.stop.bind(this);
    this.changeTime = this.changeTime.bind(this);
  }

  stop(){
    this.setState({done: true});
  }

  tick(){
    console.log(this.props.timerState);
    if (this.props.timerState){
      let time = this.props.timer;
      console.log('TICK AGAIN');
      if (time <= 999){
        this.stop();
      } else {
        console.log('TICK', this.props.timer, typeof time);
        this.props.changeTimer(time - 1000);
      }
    }

  }

  toggleTimer(){
    let state = this.props.timerState;
    if (!state) {
      this.props.changeTimerState(true);
      console.log('toggle timer!');
      let timer = setInterval(this.tick, 1000);
      this.setState({timer});
    } else {
      this.props.changeTimerState(false);
      clearInterval(this.state.timer);
    }
  }

  changeTime(evt){
    console.log(evt.target.name);
    let time = this.props.timer;
    switch (evt.target.name){
      case 'hourAdd':
        this.props.changeTimer(time + (60*60*1000));
        break;
      case 'minutesAdd':
        this.props.changeTimer(time + (60*1000));
        break;
      case 'secondsAdd':
        this.props.changeTimer(time + (1000));
        break;
      case 'hourSub':
        this.props.changeTimer(time - (60*60*1000));
        break;
      case 'minutesSub':
        this.props.changeTimer(time - (60*1000));
        break;
      case 'secondsSub':
        this.props.changeTimer(time - (1000));
        break;
      default: break;
    }
  }

  render(){
    let ms = this.props.timer;
    let hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((ms % (1000 * 60)) / 1000);

    return (
      <Clock>

        <Add name="hourAdd" onClick={this.changeTime}>+</Add>
        <Add name="minutesAdd" onClick={this.changeTime}>+</Add>
        <Add name="secondsAdd" onClick={this.changeTime}>+</Add>
        <br />
        {twoDigits(hours) + ':' + twoDigits(minutes) + ':' + twoDigits(seconds)}
        <button type="button" className="btn btn-info" onClick={this.toggleTimer}>
          {
            this.state.stopped ?
            <span className="glyphicon glyphicon-play"/>
            :
            <span className="glyphicon glyphicon-pause" />
          }
        </button>
        <br />
        <Add name="hourSub" onClick={this.changeTime}> - </Add>
        <Add name="minutesSub" onClick={this.changeTime}> - </Add>
        <Add name="secondsSub" onClick={this.changeTime}> - </Add>
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
    timer: state.ai.time,
    timerState: state.ai.timerState
  };
};

const mapDispatch = (dispatch) => {
  return {
    changeTimer (time){
     if (time >= 0){
       dispatch(action.setTimer(time));
     }
   },
    changeTimerState(state){
      dispatch(action.changeTimerState(state));
    }
  };
};


export default connect(mapState, mapDispatch)(Timer);
