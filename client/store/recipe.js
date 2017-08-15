import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_RECIPE_SUCCESS = 'GET_RECIPE_SUCCESS'
/**
 * INITIAL STATE
 */
const recipe = {}

/**
 * ACTION CREATORS
 */
export const getRecipeSuccess = (recipe) => ({ type: GET_RECIPE_SUCCESS, recipe })

/**
 * THUNK CREATORS
 */
export const getRecipe = (id) =>
  dispatch =>
    axios.get(`/api/recipes/${id}`)
      .then(res =>
        dispatch(getRecipeSuccess(res.data)))
      .catch(err => console.log(err))

export const chromeRecipe = (url) =>
  dispatch =>
    axios.post(`/api/recipe-sources`, { url })
      .then(res =>
        dispatch(getRecipeSuccess(res.data)))
      .catch(err => console.log(err))

/**
 * REDUCER
 */
export default function (state = recipe, action) {
  switch (action.type) {
    case GET_RECIPE_SUCCESS:
      return action.recipe;
    default:
      return state
  }
}
