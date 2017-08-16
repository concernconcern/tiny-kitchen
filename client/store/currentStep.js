
// Action Types
const FORWARD = 'FORWARD';
const BACKWARD = 'BACKWARD';

//Initial State
const currentStep = 0;

// Action Creators
export const forward = () => ({type: FORWARD});
export const backward = () => ({type: BACKWARD});

// Reducer
export default function(state = currentStep, action){
  console.log('step reducer');
  switch (action.type) {
    case FORWARD:
      return state + 1;
    case BACKWARD: return state - 1;
    default: return state;
  }
}
