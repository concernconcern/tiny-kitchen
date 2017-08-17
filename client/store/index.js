import { createStore, combineReducers, applyMiddleware } from 'redux'
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import user from './user'
import recipe from './recipe'
import recipes from './recipes'
import ai from './ai'
import cooking from './cooking'
import currentStep from './currentStep'
import sayStep from './sayStep'
import userRecipes from './userRecipes'
import { composeWithDevTools } from 'redux-devtools-extension';

const reducer = combineReducers({ user, recipe, ai, cooking, currentStep, sayStep, recipes, userRecipes})
const middleware = applyMiddleware(thunkMiddleware, createLogger({ collapsed: true }))
const store = createStore(reducer, composeWithDevTools(middleware))

export default store
export * from './recipes'
export * from './recipe'
export * from './user'
export * from './ai'
export * from './cooking'
export * from './currentStep'
export * from './sayStep'
export * from './userRecipes'
