import React from 'react'
import Todos from './Todos.jsx'
import { connect } from 'react-redux'
import { fetchTodos } from '../actions/todoActions'

const mapStateToProps = (state) => {
  return {}
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

const TodosContainer = connect(mapStateToProps, mapDispatchToProps, mergeProps)(Todos)

export default TodosContainer

export function onEnter(dispatch) {
  return (nextRouterState) => {
    debugger;
    dispatch(fetchTodos())
  }
}
