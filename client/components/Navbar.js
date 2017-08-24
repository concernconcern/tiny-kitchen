import React from 'react';
import { connect } from 'react-redux'
import { Bar, Logo, Links, SearchInput, NavLink, LogoWrap } from './styled-components'
import Search from './SearchBar'
import { Link } from 'react-router-dom'
import { Login, Signup } from './auth-form'
import Mochi from './styled-components/mochi'

const Navbar = (props) => {
  const { children, isLoggedIn, handleClick } = props;
  return (
    <Bar>
      <LogoWrap>
        <Mochi height="10vh" />
        <Link to='/' style={{ textDecoration: 'none' }}><Logo>Tiny Kitchen</Logo></Link>
      </LogoWrap>
      {
        isLoggedIn
          ?
          <Links>
            <Search />
            <Link to='/home'>
              <i className="material-icons" style={{ color: "white", fontSize: "45px" }}>account_circle</i>
            </Link>
            <NavLink to="/add-recipe" >Add Recipe</NavLink>
            <NavLink to="/" onClick={handleClick}>Logout</NavLink>
          </Links>
          :
          <Links>
            <Search />
            <Login />
            <Signup />
          </Links>
      }
    </Bar >
  )
}



export default Navbar;
