import axios from 'axios';
import parseIngredient from './ai';
// Action Types
const GET_GROCERIES = 'GET_GROCERIES';
const ADD_GROCERY = 'ADD_GROCERY';
const DELETE_GROCERY = 'DELETE_GROCERY';
//Initial State
const groceries = [];

// Action Creators
const getGroceries = (groceries) => ({type: GET_GROCERIES, groceries});
const addGrocery = (grocery) => ({type: ADD_GROCERY, grocery});
const deleteGrocery = (groceryId) => ({type: DELETE_GROCERY, groceryId});

//THUNK
//get all groceries from a user
export const fetchGroceries = (userId) =>
  dispatch => {
    console.log(userId)
    axios.get(`/api/groceries/${userId}`)
    .then(res => dispatch(getGroceries(res.data)))
    .catch(err => console.log(err))
  }

//without AI
export const reallyAddGrocery = (userId, ingredientText) =>
  dispatch => {
    console.log('ingredient:', ingredientText)
    axios.post(`/api/groceries/${userId}`, {title: ingredientText})
    .then(res => dispatch(addGrocery(res.data)))
    .catch(err => console.log(err))
  }
export const deleteGroceryFromUser = (userId, groceryId) =>
  dispatch => {
    axios.delete(`/api/groceries/${userId}/${groceryId}`)
    .then(dispatch(deleteGrocery(groceryId)))
    .catch(err => console.log(err))
  }

// Reducer
export default function(state = groceries, action){
  switch (action.type) {
    case GET_GROCERIES:
      return action.groceries;
    case ADD_GROCERY:
      return [...state, action.grocery];
    case DELETE_GROCERY:
      return state.filter(grocery => grocery.id !== action.groceryId)
    default: return state;
  }
}

//need to parse grocery first
    //parseIngredient(ingredientText)
