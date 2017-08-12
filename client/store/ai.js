import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */

const GET_OUTPUT = 'GET_OUTPUT'//get output string from api.ai

/**
 * INITIAL STATE
 */
const ai = '';

/**
 * ACTION CREATORS
 */
const getOutput = output => ({type: GET_OUTPUT, output})


/**
 * THUNK CREATORS
 *The query endpoint is used to process natural language in the form of text. The query requests *return structured data in JSON format with an action and parameters for that action
 */
const token = '32a6925a368448038ed4e3899b5422ca'
const auth = {
  Headers: {
    Authorization: 'Bearer ' + token,
    'Content-Type': 'application/json; charset=utf-8'
  }
}
const makeReqBody = (userInput) => {
  return {
    query: userInput,
    timezone: "America/New_York",
    lang: "en",
    sessionId: "8c434103-e94e-47d8-b06f-3886fa2e5541"
  }
}

export const fetchOutput = (userInput) =>
  dispatch =>
    axios.post('https://api.api.ai/v1/query?v=20150910', auth, makeReqBody(userInput))
      .then(res => {
        console.log('response from post apiai: ', res)
        dispatch(getOutput(res.fulfillment.displayText))
      })
      .catch(err => console.log(err))



/**
 * REDUCER
 */
export default function (state = ai, action) {
  switch (action.type) {
    case GET_OUTPUT:
      return action.output
    default:
      return state
  }
}
