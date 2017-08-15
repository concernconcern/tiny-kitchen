import axios from 'axios'
import history from '../history'
import convert from 'convert-units';


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
 const token = require('../../secrets')


const makeRequestConfig = (userInput) => {
  return {
    // `url` is the server URL that will be used for the request
    url: 'https://api.api.ai/v1/query',
    // `headers` are custom headers to be sent
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json; charset=utf-8'
    },
    // `params` are the URL parameters to be sent with the request
    // Must be a plain object or a URLSearchParams object
    params: {
      v: 20150910,
      query: userInput,
      lang: 'en',
      sessionId: "8c434103-e94e-47d8-b06f-3886fa2e5541",
      timezone: 'America/New_York'
    }
  }
}

export const fetchOutput = (userInput) =>
  dispatch => {
    axios(makeRequestConfig(userInput))
    .then(res => {
      const output = res.data.result.fulfillment.displayText
      console.log(output)
      dispatch(getOutput(output));
      if (res.data.result.action === 'setTimer'){
        const {amount, unit} = res.data.result.parameters.duration
        const timeInMs = convert(amount).from(unit).to('ms')

        setTimeout(function(){
          dispatch(getOutput('times up'))
        }, timeInMs)
      }
    })
    .catch(err => console.log(err))
}


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
