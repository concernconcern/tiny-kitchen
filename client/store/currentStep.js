
// Action Types
const GET_STEP = 'GET_STEP';

//Initial State
const currentStep = 0;

// Action Creators
export const getStep = (step) => ({type: GET_STEP, step});

// Reducer
export default function(state = currentStep, action){
  switch (action.type) {
    case GET_STEP:
      return action.step;
    default: return state;
  }
}
