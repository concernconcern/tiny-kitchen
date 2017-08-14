import React from 'react';
import { connect } from 'react-redux'
import { Bar, Logo, Links } from './styled-components'
import { Link } from 'react-router-dom'

const Navbar = (props) => {
  const { children, isLoggedIn, handleClick } = props;
  return (
    <Bar>
      <Logo>Tiny Kitchen</Logo>
      {
        isLoggedIn
          ?
          <Links>
            <Link to='/recipe-box'><span className="glyphicon glyphicon-user" style={{ color: "white" }} aria-hidden="true"></span></Link>
            <a href='#' onClick={handleClick}>Logout</a>
          </Links>
          :
          <Links>
            <Link to='/login'>Login</Link>
            <Link to='/signup'>Sign Up</Link>
          </Links>
      }
    </Bar>
  )
}



export default Navbar;