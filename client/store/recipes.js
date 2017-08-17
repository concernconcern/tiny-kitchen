import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_RECIPES_SUCCESS = 'GET_RECIPES_SUCCESS';
const NEW_INPUT = 'NEW_INPUT';
const FILTER_RECIPES = 'FILTER_RECIPES'
/**
 * INITIAL STATE
 */
const initialState = {
  recipes: [],
  filteredRecipes: [],
  input: ''
}

/**
 * ACTION CREATORS
 */
export const getRecipesSuccess = (recipes) => ({ type: GET_RECIPES_SUCCESS, recipes })
// export const filterRecipes = (recipes) => ({type: FILTER_RECIPES, recipes})
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


// export const searchDb = (input) =>
//   dispatch =>
//     axios.get(`/api/recipes/search?search=${input}`)
//     .then(res => {
//       console.log('filtered recipes', res.data)
//       dispatch(filterRecipes(res.data))
//     })
//     .catch(err => console.log(err));

// REDUCER HELPER FUNCTION:
function filterRecipes(recipes, input){  
  input = input.toLowerCase();
  return recipes.filter(recipe => {
    return recipe.title.toLowerCase().includes(input) ||
      recipe.directions.join().toLowerCase().includes(input) ||
      recipe.ingredients.join().toLowerCase().includes(input)
  })
}

/**
 * REDUCER
 */
export default function (state = initialState, action) {
  switch (action.type) {
    case GET_RECIPES_SUCCESS:
      return Object.assign({}, state, {recipes: action.recipes}, {filteredRecipes: action.recipes});
    // case FILTER_RECIPES:
    //   return Object.assign({}, state, {recipes: action.recipes});
    case NEW_INPUT:
      return Object.assign({}, state, {input: action.input}, {filteredRecipes: filterRecipes(state.recipes, action.input)});
    default:
      return state
  }
}
