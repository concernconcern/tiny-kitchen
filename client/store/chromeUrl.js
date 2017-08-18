import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const SAVE_URL = 'SAVE_URL';
/**
 * INITIAL STATE
 */
const chromeUrl = ''

/**
 * ACTION CREATORS
 */
export const saveChromeUrl = (url) => ({ type: SAVE_URL, url })

/**
 * REDUCER
 */
export default function (state = chromeUrl, action) {
  switch (action.type) {
    case SAVE_URL:
      return action.url;
    default:
      return state
  }
}
