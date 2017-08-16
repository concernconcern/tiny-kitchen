import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'


/**
 * COMPONENT
 */
class UserHome extends React.Component{

  constructor(props){
    super(props)
  }


  render(){
    const {email} = this.props.email;

    return (
      <h2>email</h2>
    )
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
