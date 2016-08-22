import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import todoSaasApp from './reducers/todoSaasApp'
import App from './components/App.jsx'
import { initializeSession } from './actions/sessionActions'
import Dashboard from './components/Dashboard.jsx'
import { Router, Route, Link, IndexRoute, browserHistory } from 'react-router'
import TodosContainer, { onEnter as onEnterTodosContainer } from './components/TodosContainer.jsx'


// build our store from stored state
// always start on the default view, even if the last state was another view
//const initialState = LocalStorage.getSavedState();

const store = createStore(todoSaasApp, applyMiddleware(thunkMiddleware))

// // store any needed state to local storage
// store.subscribe((e) => {
//   var state = store.getState();
//   LocalStorage.set('appState', JSON.stringify(state));
// });

render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Dashboard} />
      <Route path="todos" component={TodosContainer} onEnter={onEnterTodosContainer(store.dispatch)}>
        {/* <Route path="/:id" component={TodoDetailsContainer} /> */}
      </Route>
    </Route>
  </Router>
), document.getElementById('content'))

setTimeout(() => browserHistory.push('/todos'), 1000);
