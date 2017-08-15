import React from 'react';
import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  width: 100vw;
  flex-direction: ${props => props.column ? 'column' : 'row'};
`
export const RecipeImg = styled.img`
  height: ${props => props.secondary ? '300px' : '90vh'};
  width: ${props => props.secondary ? '760px' : '50vw'};
  margin: ${props => props.secondary ? '30px 0 00' : ''};
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
 padding: ${props => props.secondary ? '12px' : '0 0 20px 0'};
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
  width: ${props => props.title ? '775px' : '300px'};
  height: auto;
  display: block;
  margin: 5px;
`
export const Box = styled.div`
  padding: 10px;
`
export const TextArea = styled.textarea`
  display: block;
  font-size: 12px;
  width: 400px;
  margin: 5px;
  height: 100px;
`
<<<<<<< HEAD
export const Form = styled.form`
padding: 20px;
display:flex;
align-items: center;
flex-direction: column;
`
export const SecondaryWrap = styled.form`
padding: 20px;
display: flex;
justify-content: center;
`
export const Button = styled.button`
color: white;
font-size: 24px;
background: #db3434;
border-radius: 5px;
outline: none;
height: 50px;
 font-family: 'Playfair Display', serif;
width: 400px;
`
=======
//Ingredients on the CookRecipe Component
export const IngredientsView = styled.div`
  height: 80vh;
  flex: 1;
  display: flex;
  padding: 25px;
  flex-direction: ${props => props.column ? 'column' : 'row'};
`
export const CurrentStep = styled.div`
  height: 80vh;
  flex: 2;
  padding: 25px;
  display: flex;
  flex-direction: ${props => props.column ? 'column' : 'row'};
`
export const NextStep = styled.div`
  padding: 25px;
`
export const ControlPanel = styled.div`
  padding: 25px;
`
>>>>>>> 92f3b83cbc19b8aece6fcc18940964c6448555c8
