import React from 'react';
import { connect } from 'react-redux'
import { Bar, Logo, Links, SearchInput } from './styled-components'
import SearchBar from './SearchBar'
import { Link } from 'react-router-dom'

const Navbar = (props) => {
  const { children, isLoggedIn, handleClick } = props;
  return (
    <Bar>
      <Link to='/'><Logo>Tiny Kitchen</Logo></Link>
      {
        isLoggedIn
          ?
          <Links>
            <SearchBar />
            <Link to='/home'><span className="glyphicon glyphicon-user" style={{ color: "white" }} aria-hidden="true"></span></Link>
            <a href='#' onClick={handleClick}>Logout</a>
          </Links>
          :
          <Links>
            <SearchBar />
            <Link to='/login'>Login</Link>
            <Link to='/signup'>Sign Up</Link>
          </Links>
      }
    </Bar>
  )
}



export default Navbar;