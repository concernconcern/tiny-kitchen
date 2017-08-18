import React, {Component} from 'react'
import Audio from 'react-audio'

  export default class Alarm extends Component {
    render() {
      return (
        <Audio source="https://freesound.org/people/kwahmah_02/sounds/250629/download/250629__kwahmah-02__alarm1.mp3" loop={true} />
      )
    }
  }
