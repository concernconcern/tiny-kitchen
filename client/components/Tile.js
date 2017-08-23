import React from 'react';
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import { TileTitle, TileText } from './styled-components'
import * as action from '../store'


export default class Tile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hover: false
    }
    this.renderStyle = (picture_url) => {
      return {
        backgroundImage: 'url(' + picture_url + ')',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        width: '33.33vw',
        height: '40vh'
      }
    }
    this.welcomeStyle = () => {
      return {
        background: "white",
        width: '33.33vw',
        height: '40vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center'
      }
    }
    this.renderHoverStyle = (picture_url) => {
      return {
        backgroundImage: 'linear-gradient(rgba(255, 0, 0, 0.45), rgba(255, 0, 0, 0.45)), url(' + picture_url + ')',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        width: '33.33vw',
        height: '40vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center'
      }
    }
  }

  handleMouseEnter = (e) => {
    this.setState({ hover: true })
  }

  handleMouseLeave = (e) => {
    this.setState({ hover: false })
  }

  render() {
    return (
      <div>
        {this.props.isWelcome ?
          <div
            style={this.welcomeStyle()}>
            <TileTitle style={{ color: "#db3434", fontFamily: "'Bad Script', cursive" }}>{this.props.recipe.title}</TileTitle>
          </div> :
          this.state.hover ?
            <div
              style={this.renderHoverStyle(this.props.recipe.picture_url)}
              onMouseLeave={this.handleMouseLeave}>
              <TileTitle>{this.props.recipe.title}</TileTitle>
            </div>
            :
            <div
              style={this.renderStyle(this.props.recipe.picture_url)}
              onMouseEnter={this.handleMouseEnter}>
            </div>
        }
      </div>
    )
  }
}