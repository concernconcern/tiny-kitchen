import React from 'react';
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import { TileTitle, TileText } from './styled-components'
import * as action from '../store'


export default class Tile extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      hover: false
    }

    this.style = {
      backgroundImage: 'url(' + props.recipe.picture_url + ')',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: '100%',
      width: '33.3vw',
      height: '40vh'
    }

    this.hoverStyle = {
      backgroundImage: 'linear-gradient(rgba(255, 0, 0, 0.45), rgba(255, 0, 0, 0.45)), url(' + props.recipe.picture_url + ')',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: '100%',
      width: '33.3vw',
      height: '40vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center'
    }

    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }
  
  handleMouseEnter(e){
    this.setState({hover: true})
  }

  handleMouseLeave(e){
    this.setState({hover: false})
  }

  render(){
    return (
      <div>
        {
          this.state.hover ?
          <div
            style={this.hoverStyle}
            onMouseLeave={this.handleMouseLeave}>
            <TileTitle>{this.props.recipe.title}</TileTitle>
          </div> :
          <div
            style={this.style}
            onMouseEnter={this.handleMouseEnter}>
         </div>
        }
      </div>
    )
  }
}