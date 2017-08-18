import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_GROCERIES = 'GET_GROCERIES'
const ADD_TO_LIST = 'ADD_TO_LIST'
/**
 * INITIAL STATE
 */
 //grocery: {type: food, amount: unit}
//array of grocery objects
const groceries = []

/**
 * ACTION CREATORS
 */
const getGroceries = (groceries) => ({typr: GET_GROCERIES, groceries})
const addToList = (grocery) => ({ type: ADD_TO_LIST, grocery })

/*
THUNK
*/
const fetchGroceries = () =>
  dispatch => axios.get()

export default function (state=groceries, action){
  switch(action.type){
    case GET_GROCERIES:
      return action.groceries
    case ADD_TO_LIST:
      return [...state, action.grocery]
  }
}
