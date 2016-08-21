import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import baselineApp from './reducers/baselineApp'
import App from './components/App.jsx'
import { initSession, whoami, routeChange } from './actions/actions'
import { IndexRoute } from 'react-router'


let reset = (initialState) => {
  if (!initialState) return;
  initialState.views.addressPanel.mode = AddressSubviews.Default
  initialState.addresses.forEach(a => {
    a.isVisible = true;
  })
  initialState.views.addressPanel.filterText = ''
}

// build our store from stored state
// always start on the default view, even if the last state was another view
const initialState = LocalStorage.getSavedState();
reset(initialState);
const store = createStore(baselineApp, initialState, applyMiddleware(thunkMiddleware))

// store any needed state to local storage
store.subscribe((e) => {
  var state = store.getState();
  LocalStorage.set('appState', JSON.stringify(state));
});

// initialize the app
render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('content')
)




import React from 'react'
import { render } from 'react-dom'
import { Router, Route, Link } from 'react-router'

const App = React.createClass({
  render() {
    return (
      <div>
        <h1>App</h1>
        <ul>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/inbox">Inbox</Link></li>
        </ul>
        {this.props.children}
      </div>
    )
  }
})

const TodoContainer = React.createClass({
  render() {
    return <h3>About</h3>
  }
})

const Inbox = React.createClass({
  render() {
    return (
      <div>
        <h2>Inbox</h2>
        {this.props.children || "Welcome to your Inbox"}
      </div>
    )
  }
})

const Message = React.createClass({
  render() {
    return <h3>Message {this.props.params.id}</h3>
  }
})

render((
  <Router>
    <Route path="/" component={App} onEnter={App.onEnter}>
      <IndexRoute component={Welcome} />
      <Route path="todos/:id" component={TodosContainer}>
        <Route path=":id" component={TodoDetailsContainer} onEnter= />
      </Route>
      <Route path="account" component={Inbox}>
        <Route path="messages/:id" component={Message} />
      </Route>
    </Route>
  </Router>
), document.body)
