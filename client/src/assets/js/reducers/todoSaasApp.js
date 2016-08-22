import { combineReducers } from 'redux'
import {
  WILL_INITIALIZE_SESSION,
	DID_INITIALIZE_SESSION
} from "../actions/sessionActions"


const defaultSessionState = {
  user : null,
  isFetching : false
}
function session(state = defaultSessionState, action) {
  let result = Object.assign({}, state)
  switch (action.type) {
    case WILL_INITIALIZE_SESSION:
      result.isFetching = true;
      return result;
    case DID_INITIALIZE_SESSION:
      result.isFetching = false;
      result.user = action.user;
      return result;
    default:
      return state;
  }
}

/**
Application state
**/
const baselineApp = combineReducers({
	session
})

export default baselineApp
