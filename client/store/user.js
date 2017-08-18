import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_USER = 'GET_USER'
const REMOVE_USER = 'REMOVE_USER'
const SET_USER = 'SET_USER'

/**
 * INITIAL STATE
 */
const defaultUser = {}

/**
 * ACTION CREATORS
 */
const getUser = user => ({ type: GET_USER, user })
const removeUser = () => ({ type: REMOVE_USER })
const setUser = user => ({type: SET_USER, user})

/**
 * THUNK CREATORS
 */
export const me = () =>
  dispatch =>
    axios.get('/auth/me')
      .then(res =>
        dispatch(getUser(res.data || defaultUser)))
      .catch(err => console.log(err))

export const auth = (email, password, method, first_name, last_name) =>
  dispatch => {
    axios.post(`/auth/${method}`, { email, password, first_name, last_name })
      .then(res => {
        dispatch(getUser(res.data))
        history.push('/home')
      })
      .catch(error =>
        dispatch(getUser({ error })))
      }
      

export const logout = () =>
  dispatch =>
    axios.post('/auth/logout')
      .then(res => {
        dispatch(removeUser())
        history.push('/login')
      })
      .catch(err => console.log(err))


export const updateUser = (info, type) => {
  let object = {};
  if (type === 'name') {
    let first_name = info.split(' ')[0];
    let last_name = info.split(' ')[1];
    object.first_name = first_name;
    object.last_name = last_name;
  } else {
    object[type] = info;
  }
  return (dispatch, getState) => {
    const id = getState().user.id;
    axios.put(`/api/users/${id}`, object)
      .then(res => {
        dispatch(getUser(res.data))
      })
      .catch(err => console.log(err))
    }
  }

/**
 * REDUCER
 */
export default function (state = defaultUser, action) {
  switch (action.type) {
    case GET_USER:
      return action.user
    case REMOVE_USER:
      return defaultUser
    case SET_USER:
      return action.user
    default:
      return state
  }
}
