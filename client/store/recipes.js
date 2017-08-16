import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_RECIPES_SUCCESS = 'GET_RECIPES_SUCCESS';
const NEW_INPUT = 'NEW_INPUT';
/**
 * INITIAL STATE
 */
const initialState = {
  recipes: [],
  input: ''
}

/**
 * ACTION CREATORS
 */
export const getRecipesSuccess = (recipes) => ({ type: GET_RECIPES_SUCCESS, recipes })
export const newInput = (input) => ({type: NEW_INPUT, input});

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


export const searchDb = () =>
  (dispatch, getState) =>
    axios.get(`/api/recipes?${getState()}`)
    .then(res => 
      console.log(res.data)
    )
    .catch(err => console.log(err));
/**
 * REDUCER
 */
export default function (state = initialState, action) {
  switch (action.type) {
    case GET_RECIPES_SUCCESS:
      return Object.assign({}, state, {recipes: state.recipes.concat(action.recipes)});
    case NEW_INPUT:
      return Object.assign({}, state, {input: action.input});
    default:
      return state
  }
}
