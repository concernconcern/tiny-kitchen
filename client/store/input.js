
// Action Types
const NEW_INPUT = 'NEW_INPUT';

//Initial State
const input = '';

// Action Creators
export const newInput = (input) => ({type: NEW_INPUT, input});


// Reducer
export default function(state = input, action){
  switch (action.type) {
    case NEW_INPUT:
      return action.input;
    default: return state;
  }
}
