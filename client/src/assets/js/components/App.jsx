import React from 'react'
import AddressPanelContainer from './AddressPanelContainer.jsx'
import MapPanelContainer from './MapPanelContainer.jsx'
import { initializeSession } from '../actions/sessionActions'

let App = ({ store }) => {
  return (
    <main className="o-grid o-grid--no-gutter o-panel">
      <AddressPanelContainer />
      <MapPanelContainer />
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
