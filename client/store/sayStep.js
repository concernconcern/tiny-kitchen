

const SAY_STEP = 'SAY_STEP'//get output string from api.ai

/**
 * INITIAL STATE
 */
const stepToSay = ''

/**
 * ACTION CREATORS
 */
export const sayStep = (step, directions) => ({type: SAY_STEP, step: directions[step]})


/**
 * REDUCER
 */
export default function (state = stepToSay, action) {
  switch (action.type) {
    case SAY_STEP:
      return action.step
    default:
      return state
  }
}

