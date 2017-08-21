import React from 'react';
import { Clock, Add, Modify, Time, Title, TimeDisplay } from './styled-components';
import * as action from '../store';
import { connect } from 'react-redux';
import Mochi from '../mochi'
import IconButton from 'material-ui/IconButton';

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stopped: true,
      timerId: null,
    };
    this.toggleTimer = this.toggleTimer.bind(this);
    this.tick = this.tick.bind(this);
    this.changeTime = this.changeTime.bind(this);
    this.resetAlarm = this.resetAlarm.bind(this);
  }

  tick() {
    let time = this.props.time
    if (time <= 999) {
      Mochi.say('times up')
      this.setState({ stopped: true })
      clearInterval(this.state.timerId);
    } else if (!this.state.stopped) {
      this.props.changeTimer(time - 1000);
    }
  }

  resetAlarm() {
    this.props.changeTimer(0)
  }

  toggleTimer() {
    if (this.state.stopped) {
      this.setState({ stopped: false, timerId: setInterval(this.tick, 1000) })
    }
    else {
      this.setState({ stopped: true })
      clearInterval(this.state.timerId);
    }
  }

  componentDidUpdate() {
    if (this.props.autoStart) {
      this.toggleTimer()
      this.props.changeTimer(this.props.time)
    }
  }

  changeTime(evt) {
    let time = this.props.time
    switch (evt.target.id) {
      case 'hourAdd':
        this.props.changeTimer(time + (60 * 60 * 1000));
        break;
      case 'minutesAdd':
        this.props.changeTimer(time + (60 * 1000));
        break;
      case 'secondsAdd':
        this.props.changeTimer(time + (1000));
        break;
      case 'hourSub':
        this.props.changeTimer(time - (60 * 60 * 1000));
        break;
      case 'minutesSub':
        this.props.changeTimer(time - (60 * 1000));
        break;
      case 'secondsSub':
        this.props.changeTimer(time - (1000));
        break;
      default: break;
    }
  }

  render() {
    let ms = this.props.time;
    let hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((ms % (1000 * 60)) / 1000);
    let buttonStyle = { padding: "7px", width: "28px", height: "28px" }
    let iconStyle = { fontSize: "20px", color: "#59a5f6" }
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Title secondary>Timer</Title> {this.state.stopped ?
            <IconButton
              style={buttonStyle}
              iconStyle={iconStyle}
              iconClassName="material-icons"
              tooltip="Start Timer"
              onClick={this.toggleTimer}
              tooltipPosition="bottom-right">
              play_arrow
        </IconButton>
            :
            <IconButton
              style={buttonStyle}
              iconStyle={iconStyle}
              iconClassName="material-icons"
              tooltip="Pause Timer"
              onClick={this.toggleTimer}
              tooltipPosition="bottom-right">
              pause
        </IconButton>}
          <IconButton
            style={buttonStyle}
            iconStyle={iconStyle}
            iconClassName="material-icons"
            tooltip="Reset Timer"
            onClick={this.resetAlarm}
            tooltipPosition="bottom-right">
            stop
    </IconButton></div>
        <TimeDisplay>
          <div style={{ display: "flex" }}>
            <i className="material-icons" id="hourAdd" onClick={this.changeTime} >add</i>
            <i className="material-icons" id="minutesAdd" onClick={this.changeTime}>add</i>
            <i className="material-icons" id="secondsAdd" onClick={this.changeTime}>add</i>
          </div>
          <Time>
            {twoDigits(hours) + ':' + twoDigits(minutes) + ':' + twoDigits(seconds)}
          </Time>
          <div style={{ display: "flex" }}>
            <i id="hourSub" className="material-icons" onClick={this.changeTime}> remove </i>
            <i id="minutesSub" className="material-icons" onClick={this.changeTime}> remove </i>
            <i id="secondsSub" className="material-icons" onClick={this.changeTime}>remove </i>
          </div>
        </TimeDisplay>
      </div >
    );
  }
}

function twoDigits(n) {
  return (n < 10 ? '0' : '') + n;
}

const mapState = (state) => {
  return {
    time: state.timer.time,
    autoStart: state.timer.fromAi,
  }
}
const mapDispatch = (dispatch) => {
  return {
    changeTimer(time) {
      dispatch(action.setTimer({ time: time, fromAi: false }))
    },
  }
}


export default connect(mapState, mapDispatch)(Timer);
