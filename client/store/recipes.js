import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_RECIPES_SUCCESS = 'GET_RECIPES_SUCCESS';
/**
 * INITIAL STATE
 */
const recipes = []

/**
 * ACTION CREATORS
 */
export const getRecipesSuccess = (recipes) => ({ type: GET_RECIPES_SUCCESS, recipes })

/**
 * THUNK CREATORS
 */
export const getRecipes = () =>
  dispatch =>
    axios.get(`/api/recipes/`)
      .then(res => 
        dispatch(getRecipesSuccess(res.data)))
      .catch(err => console.log(err))


export const getRecipesBatch = (offset) =>
  dispatch =>
    axios.get(`/api/recipes/batch/${offset}`)
      .then(res =>
        dispatch(getRecipesSuccess(res.data)))
      .catch(err => console.log(err));

/**
 * REDUCER
 */
export default function (state = recipes, action) {
  switch (action.type) {
    case GET_RECIPES_SUCCESS:
      return action.recipes;
    default:
      return state
  }
}
