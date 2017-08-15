
// Action type
const NAVBAR_TOGGLE = 'NAVBAR_TOGGLE';



// Initital State
const navbar = false;

//Reducer
export default function(state = navbar, action) {
  if (action.type === NAVBAR_TOGGLE) return !state;
  else return state;
}
