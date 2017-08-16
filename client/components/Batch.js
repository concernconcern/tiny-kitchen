import React from 'react';
import { Tiles } from './styled-components'
import Tile from './Tile'
import * as action from '../store'

export default function Batch(props){
  const recipes = props.recipes;
  return (
    <Tiles>
      {recipes.length && recipes.map((recipe, i) => <Tile key={i} recipe={recipe}/>)}
    </Tiles>
  )
}