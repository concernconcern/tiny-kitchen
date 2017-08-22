
// Action type
const IS_COOKING = 'IS_COOKING';

export const getCooking = (cooking) => ({ type: IS_COOKING, cooking })

// Initital State
const isCooking = false;

//Reducer
export default function(state = isCooking, action) {
  if (action.type === IS_COOKING) return action.cooking;
  else return state;
}