import React from 'react';
import { Clock, Add, Modify } from './styled-components';
import * as action from '../store';
import {connect} from 'react-redux';

class Timer extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      stopped: true,
      timerId: null
    };
    this.toggleTimer = this.toggleTimer.bind(this);
    this.tick = this.tick.bind(this);
    this.changeTime = this.changeTime.bind(this);
  }

  tick(){
    let time = this.props.time
    console.log('autostart', this.props.autoStart)
    if (time <= 999){
      this.setState({stopped: true})
      clearInterval(this.state.timerId);
    } else if (!this.state.stopped) {
        this.props.changeTimer(time - 1000);
    }
  }

  toggleTimer(){
    if (this.state.stopped){
      this.setState({stopped: false, timerId: setInterval(this.tick, 1000)})
    }
    else {
      this.setState({stopped: true})
      clearInterval(this.state.timerId);
    }
  }

  componentDidUpdate(){
    if (this.props.autoStart){
      this.toggleTimer()
      this.props.changeTimer(this.props.time)
    }
  }

  changeTime(evt){
    let time = this.props.time
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
    console.log('STOPPED', this.state.stopped, this.props.time);
    console.log('AUTOSTART', this.props.autoStart)
    let ms = this.props.time;
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
        {(this.props.time === 0 && !this.state.stopped) ?
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
    time: state.timer.time,
    autoStart: state.timer.fromAi
  }
}
const mapDispatch = (dispatch) => {
  return {
    changeTimer(time){
      dispatch(action.setTimer({time: time, fromAi: false}))
    }
  }
}


export default connect(mapState, mapDispatch)(Timer);
