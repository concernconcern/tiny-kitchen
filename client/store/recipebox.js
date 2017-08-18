import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_RECIPEBOX = 'GET_RECIPEBOX'

/**
 * INITIAL STATE
 */
const recipebox = {};

/**
 * ACTION CREATORS
 */
export const getRecipeBoxSuccess = (recipebox) => ({ type: GET_RECIPEBOX, recipebox })
/**
 * THUNK CREATORS
 */
export const getRecipeBox = (userId, recipeId) =>
  dispatch =>
    axios.get(`/api/users/${userId}/recipebox/${recipeId}`)
      .then(res =>
        dispatch(getRecipeBoxSuccess(res.data)))
      .catch(err => console.log(err))

export const editRecipeBox = (userId, recipeId, notes) =>
  dispatch =>
    axios.put(`/api/users/${userId}/recipebox/${recipeId}`, notes)
      .then(res => dispatch(getRecipeBoxSuccess(res.data)))
      .catch(err => console.log(err))

export const addRecipeBox = (userId, recipeId) =>
  dispatch =>
    axios.post(`/api/users/${userId}/recipebox`, { recipeId })
      .then(res => dispatch(getRecipeBoxSuccess(res.data)))
      .catch(err => console.log(err))
/**
 * REDUCER
 */
export default function (state = recipebox, action) {
  switch (action.type) {
    case GET_RECIPEBOX:
      return action.recipebox;
    default:
      return state
  }
}
