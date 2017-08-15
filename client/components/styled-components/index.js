import React from 'react';
import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  width: 100vw;
  flex-direction: ${props => props.column ? 'column' : 'row'};
`
export const RecipeImg = styled.img`
  height: 90vh;
  width: 50vw;
  object-fit: cover;
`
export const RecipeText = styled.div`
  height: 90vh;
  width: 50vw;
  padding: 25px;
`
export const Title = styled.h1`
 font-size: ${props => props.secondary ? '25px' : '50px'};
 color: ${props => props.secondary ? 'grey' : 'black'};
 padding: ${props => props.secondary ? '20px' : '0 0 20px 0'};
 margin: 0;
 font-family: 'Playfair Display', serif;
`
export const Bar = styled.div`
  width: 100vw;
  height: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: ${props => props.column ? 'column' : 'row'};
  background: #db3434;
  color: white;
`
export const Logo = styled.h1`
 font-size: 40px;
 padding: 0 20px;
 font-family: 'Playfair Display', serif;
 color:white;
`
export const Links = styled.h1`
 font-size: 20px;
 display: flex;
 width: 30vw;
 justify-content: space-around;
`
export const List = styled.ul`
  color: grey;
  margin: 0 25px;
  list-style-type: ${props => props.directions ? 'decimal' : 'square'};
`
export const Input = styled.input`
  font-family: ${props => props.title ? 'Playfair Display, serif' : ''};
  font-size: ${props => props.title ? '50px' : '12px'};
  color: ${props => props.title ? 'black' : 'grey'};  
  width: ${props => props.title ? '100vh' : '300px'};
  height: auto;
  display: block;
  margin: 5px;
`
export const Box = styled.div`
  width:  40vw;
`
export const TextArea = styled.textarea`
    display: block;
  width: 30vw;
  margin: 5px;
  height: 100px;
`