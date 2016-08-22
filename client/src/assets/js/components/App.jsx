import React from 'react'

import { initializeSession } from '../actions/sessionActions'

let App = ({ store, children, isFetching }) => {
  return (
    <main className="o-grid o-grid--no-gutter o-panel">
      { isFetching
        ? "loading..."
        : children }
    </main>
  )
}

/*
  Upon landing at "/", we must do two things:
  (1) Check LocalStorage for an active session token, and
  (2) If one exists, validate the token on the server
*/
App.onEnter = (store) => {
  store.dispatch(initializeSession())
}

export default App
