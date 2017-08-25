import React from 'react';
import { connect } from 'react-redux'
import { Bar, Logo, Links, SearchInput, NavLink, LogoWrap } from './styled-components'
import Search from './SearchBar'
import { Link } from 'react-router-dom'
import { Login, Signup } from './auth-form'
import Mochi from './styled-components/mochi'
import IconButton from 'material-ui/IconButton';

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
              <IconButton
                iconStyle={{ fontSize: "45px", color: "white" }}
                iconClassName="material-icons"
                tooltip="Profile"
                tooltipPosition="bottom-right" >account_circle</IconButton>
            </Link>
            <NavLink to="/add-recipe" >Add Recipe</NavLink>
            <NavLink to="/" onClick={handleClick}>Logout</NavLink>
            <a href="https://chrome.google.com/webstore/detail/tiny-kitchen/pgpcblkokcddbnlifngkfpjanehlpaoi/reviews?hl=en">
              <IconButton
                iconStyle={{ fontSize: "20px", color: "white" }}
                style={{ width: "0" }}
                iconClassName="fa fa-chrome"
                tooltip="Chrome extension"
                tooltipPosition="bottom-right">
              </IconButton>
            </a>
            <a href="https://github.com/concernconcern/tiny-kitchen">
              <IconButton
                style={{ width: "0" }}
                iconStyle={{ fontSize: "24px", color: "white" }}
                iconClassName="fa fa-github"
                tooltip="Github"
                tooltipPosition="bottom-right">
              </IconButton>
            </a>
          </Links>
          :
          <Links>
            <Search />
            <Login />
            <Signup />
            <a href="https://chrome.google.com/webstore/detail/tiny-kitchen/pgpcblkokcddbnlifngkfpjanehlpaoi/reviews?hl=en">
              <IconButton
                iconStyle={{ fontSize: "20px", padding: "0", color: "white" }}
                iconClassName="fa fa-chrome"
                tooltip="Chrome extension"
                tooltipPosition="bottom-right">
              </IconButton>
            </a>
            <a href="https://github.com/concernconcern/tiny-kitchen">
              <IconButton
                iconStyle={{ fontSize: "24px", padding: "0", color: "white" }}
                iconClassName="fa fa-github"
                tooltip="Github"
                tooltipPosition="bottom-right">
              </IconButton>
            </a>
          </Links>
      }
    </Bar >
  )
}



export default Navbar;
