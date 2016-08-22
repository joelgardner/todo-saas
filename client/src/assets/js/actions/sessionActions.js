import fetch from 'isomorphic-fetch'

/**
Synchronous action fired BEFORE bootstrapping our session.
**/
export const WILL_INITIALIZE_SESSION = 'WILL_INITIALIZE_SESSION'
export function willInitializeSession() {
  return { type : WILL_INITIALIZE_SESSION }
}

/**
Synchronous action fired AFTER bootstrapping our session.
**/
export const DID_INITIALIZE_SESSION = 'DID_INITIALIZE_SESSION'
export function didInitializeSession(user) {
  return { type : DID_INITIALIZE_SESSION, user : user }
}

/**
Asynchronous action that
(a) queries LocalStorage for a session token, and
(b) sends API call (if necessary) to initialize our session.
**/
export const INITIALIZE_SESSION = 'INITIALIZE_SESSION'
export function initializeSession() {

  return function(dispatch) {
    dispatch(willInitializeSession());

    const sessionTokenKey = '__SESSION_TOKEN__'
    let token = localStorage.get(sessionTokenKey)
    if (!token) {
      return dispatch(didInitializeSession())
    }

    return fetch('/token', {
			//credentials: 'same-origin',
      method: 'post',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'JWT ' + token
			}
		})
		.then((res) => {
      debugger;
      localStorage.set(sessionTokenKey, res.token);
      dispatch(didInitializeSession(res.user));
    });
  }

}
