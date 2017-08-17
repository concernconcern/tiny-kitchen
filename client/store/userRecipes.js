import axios from 'axios'

const GET_USER_RECIPES = 'GET_USER_RECIPES';

const userRecipes = [];

const getUserRecipes = (recipes) => ({type: GET_USER_RECIPES, recipes})

//THUNK
export const fetchUserRecipes = (userId) => dispatch =>
  axios.get(`/api/users/${userId}/recipebox`)
    .then(res => {
      console.log('response from axios: ', res.data)
      dispatch(getUserRecipes(res.data))
    })
    .catch(err => console.log(err))

export default function (state=userRecipes, action){
  switch(action.type){
    case GET_USER_RECIPES:
      return action.recipes
    default:
      return state
  }
}
