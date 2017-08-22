import axios from 'axios';
import parseIngredient from './ai';
import history from '../history'
// Action Types
const GET_GROCERIES = 'GET_GROCERIES';
const ADD_GROCERY = 'ADD_GROCERY';
const DELETE_GROCERY = 'DELETE_GROCERY';
const UPDATE_GROCERIES = 'UPDATE_GROCERIES';
//Initial State
const groceries = [];

// Action Creators
const getGroceries = (groceries) => ({type: GET_GROCERIES, groceries});
const addGrocery = (grocery) => ({type: ADD_GROCERY, grocery});
const deleteGrocery = (groceryId) => ({type: DELETE_GROCERY, groceryId});
const updateGroceries = (groceries) => ({type: UPDATE_GROCERIES, groceries});


//THUNK
//get all groceries from a user
export const fetchGroceries = (userId) =>
  dispatch => {
    axios.get(`/api/groceries/${userId}`)
    .then(res => dispatch(getGroceries(res.data)))
    .catch(err => console.log(err))
  }

//without AI
export const reallyAddGrocery = (userId, ingredientText) =>
  dispatch => {
    axios.post(`/api/groceries/${userId}`, {title: ingredientText})
    .then(res => dispatch(addGrocery(res.data)))
    .catch(err => console.log(err))
  }

  export const submitGroceryList = (userId, updatedGroceries) =>
  dispatch => {
    return axios.put(`/api/groceries/${userId}/list`, {updatedGroceries})    
    .then(res => dispatch(updateGroceries(res.data)))
    .catch(err => console.log(err))
  }

export const deleteGroceryFromUser = (userId, groceryId) =>
  (dispatch, getState) => {
    axios.delete(`/api/groceries/${userId}/${groceryId}`)
    .then(res => {
      let groceries = getState().groceries
      groceries = groceries.filter(el => el.id !== parseInt(groceryId));
      dispatch(getGroceries(groceries))
    })
    .catch(err => console.log(err))
  }

// reducer helper
function replace(updated, newList){
  return newList.map(el1 => {
    let update = updated.find(el2 => el1.id === el2.id);
    if (update) el1.title = update.title;
    return el1;
  })
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
    case UPDATE_GROCERIES:
      return replace(action.groceries, state)
    default: return state;
  }
}

//need to parse grocery first
    //parseIngredient(ingredientText)
