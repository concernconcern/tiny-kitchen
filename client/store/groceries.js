import axios from 'axios';
import parseIngredient from './ai';
import history from '../history'
// Action Types
const GET_GROCERIES = 'GET_GROCERIES';
const ADD_GROCERY = 'ADD_GROCERY';
const DELETE_GROCERY = 'DELETE_GROCERY';
const UPDATE_GROCERY_MULTIPLE = 'UPDATE_GROCERY_MULTIPLE';
const ADD_GROCERY_MULTIPLE = 'ADD_GROCERY_MULTIPLE';

//Initial State
const groceries = [];

// Action Creators
const getGroceries = (groceries) => ({type: GET_GROCERIES, groceries});
const addGrocery = (grocery) => ({type: ADD_GROCERY, grocery});
//const updateGrocery = (grocery) => ({type: UPDATE_GROCERY, grocery})
const addMultipleGroceries = (addedGroceries) => ({type: ADD_GROCERY_MULTIPLE, groceries: addedGroceries})
const deleteGrocery = (groceryId) => ({type: DELETE_GROCERY, groceryId});
const updateMultipleGroceries = (updatedGroceries) => ({type: UPDATE_GROCERY_MULTIPLE, groceries: updatedGroceries})


//THUNK
//get all groceries from a user
export const fetchGroceries = (userId) =>
  dispatch => {
    axios.get(`/api/groceries/${userId}`)
    .then(res => dispatch(getGroceries(res.data)))
    .catch(err => console.log(err))
  }

//without AI
export const reallyAddGrocery = (userId, ingredient) =>
  dispatch => {
    axios.post(`/api/groceries/${userId}`, {title: ingredient, userId: userId})
    .then(res => dispatch(addGrocery(res.data)))
    .catch(err => console.log(err))
  }

export const bulkAddGroceries = (userId, groceryContents) =>
  dispatch => {
    let groceryObjects = groceryContents.map(content => {
      return {
        title: content,
        userId: userId
      }
    })
    axios.post(`/api/groceries/${userId}/bulk`, groceryObjects)
    .then(res => {
      console.log('res.data from bulk add: ', res.data)
      dispatch(addMultipleGroceries(res.data))
    })
    .catch(err => console.log(err))
  }

export const bulkUpdateGroceries = (userId, editedGroceries) =>
  dispatch => {
    console.log('edited groceries in reducer: ', editedGroceries)
    axios.put(`/api/groceries/${userId}/bulk`, editedGroceries)
    .then(res => {
      console.log('bulk updated groceries back from reducer: ', res.data)
      dispatch(updateMultipleGroceries(res.data))
    })
    .catch(err => console.log(err))
  }

export const reallyDeleteGrocery = (groceryId) =>
  dispatch => {
    axios.delete(`/api/groceries/${groceryId}`)
    .then(dispatch(deleteGrocery(groceryId)))
    .catch(err => console.log(err))
  }

const updateMultipleHelper = (updatedGroceries, stateGroceries) => {
  let originalGroceries = [...stateGroceries]
  for (var i = 0; i < originalGroceries.length; i++) {
    for (var j = 0; j < updatedGroceries.length; j++){
      if (originalGroceries[i].id === updatedGroceries[j].id){
        originalGroceries[i] = updatedGroceries[j]
      }
    }
  }
  console.log('originalGroceries: ', originalGroceries)
  return originalGroceries;
}

// Reducer
export default function(state = groceries, action){
  switch (action.type) {
    case GET_GROCERIES:
      return action.groceries;
    case ADD_GROCERY:
      return [...state, action.grocery];
    case DELETE_GROCERY:
      return state.filter(grocery => grocery.id !== action.groceryId);
    case UPDATE_GROCERY_MULTIPLE:
      return updateMultipleHelper(action.groceries, state);
    case ADD_GROCERY_MULTIPLE:
      return [...state, ...action.groceries]
    default: return state;
  }
}

//need to parse grocery first
    //parseIngredient(ingredientText)
