/**
 * `components/index.js` exists simply as a 'central export' for our components.
 * This way, we can import all of our components from the same place, rather than
 * having to figure out which file they belong to!
 */
export { default as Main } from './main'
export { default as UserHome } from './UserHome'
export { default as ViewRecipe } from './ViewRecipe'
export { default as Navbar } from './Navbar'
export { default as AddRecipe } from './AddRecipe'
export { Login, Signup } from './auth-form'
export { default as AllRecipes } from './AllRecipes'
export { default as Tile } from './Tile'
export { default as CookRecipe } from './CookRecipe'
export { default as ImgUpload } from './ImgUpload'
export { default as UserGroceries } from './UserGroceries'

