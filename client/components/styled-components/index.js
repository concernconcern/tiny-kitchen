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
  width: 50vh;
  padding: 20px;
`
export const Title = styled.h1`
 font-size: 40px;
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
    padding: 10px;
`