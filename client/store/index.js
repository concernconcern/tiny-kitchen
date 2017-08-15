import { createStore, combineReducers, applyMiddleware } from 'redux'
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import user from './user'
import recipe from './recipe'
import ai from './ai'
import navbar from './navbar'
const reducer = combineReducers({ user, recipe, navbar, ai})
const middleware = applyMiddleware(thunkMiddleware, createLogger({ collapsed: true }))
const store = createStore(reducer, middleware)

export default store
export * from './recipe'
export * from './user'
export * from './ai'
export * from './navbar'
