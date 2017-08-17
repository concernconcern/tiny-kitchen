import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_RECIPE_SUCCESS = 'GET_RECIPE_SUCCESS'
const GET_RECIPE_FAIL = 'GET_RECIPE_FAIL'
/**
 * INITIAL STATE
 */
const recipe = {
  title: '',
  source_url: '',
  picture_url: '',
  selected_pic: '',
  ingredients: [],
  directions: [],
  error: false,
  rating: 0.0
}

/**
 * ACTION CREATORS
 */
export const getRecipeSuccess = (recipe) => ({ type: GET_RECIPE_SUCCESS, recipe })
export const getRecipeFail = () => ({ type: GET_RECIPE_FAIL })

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
      .then(res => {
        res.data.selected_pic = ''
        dispatch(getRecipeSuccess(res.data))
      })
      .catch(err => console.log(err))

export const submitRecipe = (recipe) =>
  dispatch =>
    axios.post(`/api/recipes`, recipe)
      .then(res => {
        history.push(`/recipe/${res.data.id}`)
        dispatch(getRecipeSuccess(res.data))
      })
      .catch(err => { dispatch(getRecipeFail()) })

/**
 * REDUCER
 */
export default function (state = recipe, action) {
  switch (action.type) {
    case GET_RECIPE_SUCCESS:
      return action.recipe;
    case GET_RECIPE_FAIL:
      return Object.assign({}, state, { error: true });
    default:
      return state
  }
}
