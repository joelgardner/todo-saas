import fetch from 'isomorphic-fetch'

/**
Synchronous action fired BEFORE bootstrapping our session.
**/
// export const WILL_FETCH_TODOS = 'WILL_FETCH_TODOS'
// export function willFetchTodos() {
//   return { type : WILL_FETCH_TODOS }
// }

/**
Synchronous action fired AFTER bootstrapping our session.
**/
export const DID_FETCH_TODOS = 'DID_FETCH_TODOS'
export function didFetchTodos(todos) {
  return { type : DID_FETCH_TODOS, todos : todos }
}

/**
Asynchronous action that
(a) queries LocalStorage for a session token, and
(b) sends API call (if necessary) to initialize our session.
**/
export const FETCH_TODOS = 'FETCH_TODOS'
export function fetchTodos() {

  return function(dispatch) {
    //dispatch(willFetchTodos());

    return fetch('/todos', {
			//credentials: 'same-origin',
      method: 'get',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'JWT ' + token
			}
		})
		.then((res) => {
      debugger;
      localStorage.set(sessionTokenKey, res.token);
      dispatch(didFetchTodos(res.user));
    });
  }

}
