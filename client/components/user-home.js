import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'


/**
 * COMPONENT
 */
class UserHome extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      i: 0
    }
  }

  // Momo.say('Hello World!');
  render(){


  }

}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    email: state.user.email
  }
}

export default connect(mapState)(UserHome)

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string
}
