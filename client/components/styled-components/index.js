import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Wrapper = styled.div`
  display: flex;
  width: 100vw;
  height: ${props => props.height ? '100vh' : ''};
  font-family: 'Roboto', sans-serif;
  flex-direction: ${props => props.column ? 'column' : 'row'};
  justify-content: space-between;
`
export const RecipeImg = styled.img`
  height: ${props => props.secondary ? '300px' : '88vh'};
  width: ${props => props.secondary ? '760px' : '50vw'};
  margin: ${props => props.secondary ? '30px 0 00' : ''};
  object-fit: cover;
`
export const RecipeText = styled.div`
  height: 88vh;
  width: 50vw;
  padding: 25px;
  overflow: auto;
`

export const NavLink = styled.a`
color: white;
font-family: Roboto, 'sans-serif';
text-transform: uppercase;
transition: border-bottom 1s linear;
border-bottom: 1px solid transparent;
font-size: 14px;
padding: 10px;
cursor: pointer;
font-weight:bold;
&:hover{
  text-decoration: none;
  color: white;
  border-bottom: 1px solid white;
}
&:focus{
    text-decoration: none;
    color: white;
}
`

export const NavLinkR = styled(Link) `
  color: white;
  font-family: Roboto, 'sans-serif';
  text-transform: uppercase;
  font-size: 14px;
  padding: 10px;
  cursor: pointer;
  font-weight:bold;
  &:hover{
    text-decoration: none;
    color: white;
  }
  &:focus{
      text-decoration: none;
      color: white;
  }
`

export const Title = styled.h1`
  font-size: ${props => props.secondary ? '25px' : '50px'};
  color: ${props => props.secondary ? '#5e5e5e' : 'black'};
  padding: ${props => props.secondary ? '12px' : '0 0 20px 0'};
  margin: 0;
  font-family: 'Playfair Display', serif;
`
export const Bar = styled.div`
  width: 100vw;
  height: 12vh;
  padding: 20px;
  display: flex;
  z-index: 1;
  box-shadow: -1px -5px 28px 3px rgba(0,0,0,0.75);
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  background: #db3434;
  color: white;
`
export const Logo = styled.a`
  font-size: 40px;
  padding: 0 20px;
  text-decoration: none;
  border-bottom: 2px solid transparent;
  font-family: 'Bad Script', cursive;
  color: white;
     &:hover {
       color: white;
       text-decoration: none;
     }
    &:active {
      color: white;
      text-decoration: none;
    }
    &:focus {
      color: white;
      text-decoration: none;
    }
`
export const LogoWrap = styled.div`
  display: flex;
  width: 40vw;
  align-items: center;
`

export const Links = styled.div`
  font-size: 20px;
  display: flex;
  align-items: center;
  width: 35vw;
  justify-content: space-around;
`
export const List = styled.ul`
  color: grey;
  margin: 0 25px;
  list-style-type: ${props => props.directions ? 'decimal' : 'square'};
`

export const Tiles = styled.div`
  display: flex;
  width: 100vw;
  flex-wrap: wrap;
`
export const TileTitle = styled.h2`
  font-size: 30px;
  color: white;
  padding: 0px 20px;
  margin: 0px;
  font-family: 'Playfair Display', serif;
`
export const TileLink = styled(Link) `
cursor:pointer;
&:hover {
  color: white;
  text-decoration: none;
}
&:active {
 color: white;
 text-decoration: none;
}
&:focus {
 color: white;
 text-decoration: none;
}
`

export const Input = styled.input`
  font-family: ${props => props.title ? 'Playfair Display, serif' : 'Roboto, sans-serif'};
  font-size: ${props => props.title ? '50px' : '14px'};
  width: ${props => props.title ? '775px' : '300px'};
  padding: 5px;
  display: inline;
  height: auto;
  margin: 5px;
  border: 1px solid #db7d7d;
  &:active {
    background-color: green;
}
`
export const Box = styled.div`
  padding: 10px;
`
export const TextArea = styled.textarea`
  font-family: 'Roboto', sans-serif;
  display: inline;
  font-size: 14px;
  width: 400px;
  height: 100px;
  padding: 5px;
  border: 1px solid #db7d7d;
`
export const Form = styled.form`
  padding: 20px;
  display:flex;
  align-items: center;
  flex-direction: column;
`
export const SecondaryWrap = styled.div`
  padding: 20px;
  display: flex;
  justify-content: center;
`
export const Sidebar = styled.div`
  flex: 1;
  padding: 20px 0;
  height: 80vh;
  overflow:scroll;
`

export const ExitLink = styled(Link) `
  font-size: 55px;
  color: #db3434 !important;
  top: 1px;
  right: 20px;
  font-family: 'Roboto', serif;
  position: absolute;
  cursor: pointer;
  &:hover{
    color:  black;
    text-decoration: none;
  }
`
export const Notes = styled.p`
  margin: 0 25px;
  color: grey;
`
export const Button = styled.button`
  color: white;
  font-size: 24px;
  background: #db3434;
  border: none;
  display: inline;
  outline: none;
  height: ${props => props.add ? '50px' : '50px'};
  width: ${props => props.add ? '50px' : '400px'};
  font-family: 'Roboto', sans-serif;
  letter-spacing: 3px;
  &:hover{
    background:#c91a1a;
  }
`
export const AccentButton = styled.button`
  background: ${props => props.small ? '#C4CCE0' : '#53BDFF'};
  outline: none;
  color:white;
  border: 1px solid ${props => props.small ? '#C4CCE0' : '#35A6FF'};
  padding: ${props => props.small ? '4px 8px' : '15px 20px'};
  border-radius: 5px;
  &:hover{
    background: ${props => props.small ? '#cfd6e6' : '#3bb8f7'};
  }
  ${props => props.small ? 'font-size: 10px;' : null}
`

export const Modify = styled.a`
  font-size: 24px;
  color: ${props => props.x ? 'grey' : '#db3434'};
  border-radius: 50%;
  padding: 5px;
  display: inline;
  float: ${props => props.x ? '' : 'right'};
  &:hover{
    text-decoration: none;
    color: ${props => props.x ? '#db3434' : 'grey'};
  }
  &:focus{
    text-decoration: none;
    color:  #db3434;
  }
`
// increment/decrement buttons on timer
export const Add = styled.a`
  font-size: 24px;
  color: ${props => props.x ? 'grey' : '#db3434'};
  border-radius: 50%;
  padding: 5px;
  &:hover{
    text-decoration: none;
    color: ${props => props.x ? '#db3434' : 'grey'};
  }
  &:focus{
    text-decoration: none;
    color:  #db3434;
  }
`

export const Time = styled.p`
font-size: 30px;
color: grey;
`


export const Directions = styled.div`
  height: 70vh;
   width: 75vw;
`

export const CurrentStep = styled.div`
  padding: 20px;
    height: 90vh;
    padding: 10px;
  font-family: 'Playfair Display', serif;
  flex-direction: ${props => props.column ? 'column' : 'row'};
`
export const ControlPanel = styled.div`
  display: flex;
  padding: ${props => props.profile ? '0px 0px 10px 0px' : '20px'};
  align-items: center;
  justify-content: ${props => props.profile ? 'space-between' : 'flex-start'};
`
export const UpNext = styled.div`
  flex: 3;
  height: 100%;
  overflow:hidden;
  color: grey;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
export const Controls = styled.div`
  flex: 1;
  text-align: center;
`
//user profile styles
export const ProfileUpperArea = styled.div`
  height: 35vh;
  flex: 1;
  display: flex;
  padding: 25px;
  flex-direction: ${props => props.column ? 'column' : 'row'};
`
export const ProfileCard = styled.div`
  flex:2
  height: 25vh;
  width: 400px;
  display: flex;
  padding: 25px;
  flex-direction: ${props => props.column ? 'column' : 'row'};
`

export const ProfilePicArea = styled.div`
  flex: 1;
`

export const ProfileInfoArea = styled.div`
  flex: 3;
  margin: 0px 0px 0px 20px;
`
export const Heading = styled.h1`
  font-size: ${props => props.secondary ? '15px' : '25px'};
  color: grey;
  margin: 0px;
  font-family: 'Playfair Display', serif;
`

export const ProfileWarning = styled.h2`
  font-size: 30px;
  color: grey;
  padding: 0px 20px;
  margin: 0px;
  font-family: 'Playfair Display', serif;
`
export const ProfilePic = styled.img`
  max-height: 80px;
  border-radius: 50%;
`

export const Recipes = styled.div`
  width: 80vw;
`

export const Message = styled.div`
  padding: 10px;
  color:  white;
  background: goldenrod;
  margin: 5px;
`

export const SearchInput = styled.input`
  display: inline;
  height: auto;
  border: 1px solid #db7d7d;
  color: black
`
export const TimeDisplay = styled.div`
display: flex;
flex-direction: column;
align-items: center;
padding: 10px;
`
