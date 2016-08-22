import React from 'react'
import App from './App.jsx'
import { connect } from 'react-redux'

const mapStateToProps = (state) => {
  return {
    isFetching : state.session.isFetching
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  // pass down the child component and the params from the url (provided by react-router)
  stateProps.children = ownProps.children
  stateProps.params = ownProps.params;
  return Object.assign({}, ownProps, stateProps, dispatchProps)
}

const AppContainer = connect(mapStateToProps, mapDispatchToProps, mergeProps)(App)

export default AppContainer
