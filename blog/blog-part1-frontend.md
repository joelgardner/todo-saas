# JS Web App
## Preface
This is part one in a series of posts I'll write to show a way of building a modern webapp with React/Redux, Node, and Postgres/GraphQL.

This is as much an attempt to teach as it is to learn; I'd love to hear opinions and critiques on design choices, libraries used (or not used), code, anything really.  I'm always looking for ways to improve my skills and tool-chain.

We'll break the blogpost into two parts: frontend & backend.  If you want to see the final code, see: [https://github.com/joelgardner/todo-saas](https://github.com/joelgardner/todo-saas).

## Front end
We're going to build a modern single-page application (SPA), which will talk to our backend using a combination of REST verbs and [GraphQL](http://graphql.org/docs/getting-started/) queries: `PUT`, `POST`, `PATCH`, and `DELETE`s will mutate our data, but `GET`s and searching will be done by querying a GraphQL server.  Some might rather use pure REST by making traditional `GET`s, by proxying that request to GraphQL (i.e., sending the GraphQL request from the server, rather than the client), which we will also show.

### Technologies
We will build [React](https://facebook.github.io/react/) components using [ECMAScript 2015](http://es6-features.org/) and tie them together with [Redux](https://github.com/reactjs/redux).  Redux makes it easy to reason about your application's state and facilitates a nice unidirectional data flow, which helps with rendering to the DOM as a function of state -- something React excels at.  So while Redux could be used with any UI framework, it pairs very nicely with React

For styling, our application will use [Sass](http://sass-lang.com/guide).  Other options could be [Less](http://lesscss.org/), [Stylus](https://github.com/stylus/stylus).  We will try to follow [BEM](http://getbem.com/introduction/) style naming guidelines

[Webpack](https://webpack.github.io/) will bundle everything together and [WebpackDevServer](https://webpack.github.io/docs/webpack-dev-server.html) will watch our javascript/Sass files, instantaneously updating our bundle when we make changes.

Of course we can't forget to write unit tests, and we will use [Mocha](https://mochajs.org/) to run them.

### Setup

Let's start from the very beginning.  Create an empty directory to hold our project.  Inside this one, create two more to separate our client and server code.  

```bash
mkdir todo-saas && cd todo-saas && mkdir -p server/src client/src server/test client/test
```
Since this part of the blog is the frontend part, we'll be working inside `client`.  We're using [Node.js](https://nodejs.org/) on the backend, so it makes sense to use [npm](https://www.npmjs.com/) as our package manager.

```bash
cd client && npm init
```

Go through the initialization process.  When done, your `package.json` should look something like this:

```js
{
  "name": "todo-saas",
  "version": "1.0.0",
  "description": "A todo-mvc style example of how to build a SaaS webapp from front to back.",
  "main": "index.js",
  "scripts": {
    "test": "mocha"
  },
  "keywords": [
    "todo-saas",
    "saas",
    "todo"
  ],
  "author": "Bill Gardner",
  "license": "MIT"
}  
```


Now it's time to install some dependencies:

```bash
npm install webpack webpack-dev-server extract-text-webpack-plugin --save-dev
npm install babel-core babel-loader babel-preset-es2015 babel-preset-react --save-dev

```
[Babel](https://babeljs.io/) is used by Webpack to compile our assets.  WebpackDevServer will watch for changes during our development and seamlessly update our bundle: no waiting for compilation to finish every time we save!

```bash
npm install css-loader node-sass sass-loader style-loader --save-dev
```
These dependencies are required to compile our Sass files to CSS.

```bash
npm install isomorphic-fetch react react-dom react-router react-redux redux redux-thunk --save-dev
```

These are the core libraries we'll be using on the frontend.  React, Redux, and [isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch).


```bash
npm install blaze material-design-icons --save
```

These are [BlazeCSS](http://blazecss.com/) and Google's [Material Design Icons](https://design.google.com/icons/).  They will make things look pretty.

In the end, your `package.json` should look something like the following:

```js
"devDependencies": {
  "babel-core": "^6.13.2",
  "babel-loader": "^6.2.5",
  "babel-preset-es2015": "^6.13.2",
  "babel-preset-react": "^6.11.1",
  "css-loader": "^0.23.1",
  "extract-text-webpack-plugin": "^1.0.1",
  "isomorphic-fetch": "^2.2.1",
  "node-sass": "^3.8.0",
  "react": "^15.3.0",
  "react-dom": "^15.3.0",
  "react-redux": "^4.4.5",
  "react-router": "^2.6.1",
  "redux": "^3.5.2",
  "redux-thunk": "^2.1.0",
  "sass-loader": "^4.0.0",
  "style-loader": "^0.13.1",
  "webpack": "^1.13.2",
  "webpack-dev-server": "^1.14.1"
},
"dependencies": {
  "blaze": "^2.12.0",
  "material-design-icons": "^2.2.3"
}
```

>*Rather than use `npm install` one-by-one, we could've directly edited our `package.json`, then a single `npm install` would download everything at once.*

Now, copy over our icon and style framework files:

```bash
mkdir -p client/src/assets/style/fonts/materialdesignicons
cp -R client/node_modules/material-design-icons/iconfont/* client/src/assets/style/fonts/materialdesignicons
cp client/node_modules/blaze/dist/blaze.min.css client/src/assets/style
```

#### Webpack and [Make](https://www.gnu.org/software/make/)
The last bit of setup we'll do for now is get Webpack up and running.  We'll also use a makefile to make it nice and simple to get up and running with Webpack and WebpackDevServer.

Let's add a couple files for webpack: `webpack.config.js` and `webpack-dev-server.js`:

```bash
touch client/src/webpack.config.js
touch client/src/webpack-dev-server.js
```
`webpack.config.js`:
```js
var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
    entry: ['./assets/js/init.js', './assets/style/sass/todosaas.scss'],
    output: {
        path: __dirname + "/assets/",
        filename: 'js/bundle.js'
    },
    module: {
        loaders: [{
          test: __dirname,
            loader: 'babel-loader',
            exclude: /(node_modules|bower_components)/,
            query: {
        presets: ['react', 'es2015']
      }
        },
        {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader")
        }]
    },
    plugins: [
        new ExtractTextPlugin("style/baseline.css", { allChunks: true })
    ]
};
```

This is a configuration file required by webpack.  We're specifying two things:
 - build `bundle.js` from entry point `init.js`
 - build `todosaas.css` from entry point `todosaas.scss`

`webpack-dev-server.js`:
```js
var webpack = require('webpack'),
    WebpackDevServer = require('webpack-dev-server'),
    extractTextPlugin = require('extract-text-webpack-plugin'),
    webpackConfig = require('./webpack.config'),
    compiler = webpack(webpackConfig);

var devServer = new WebpackDevServer(compiler, {
  contentBase : './assets',
  publicPath : '/',
  stats : {
    colors : true
  }
});

devServer.listen(9002);
console.log("The Webpack Dev Server is running.")
```
This is the script that fires up WebpackDevServer.  It uses the webpack config file to instantaneously build our bundle.js or todosaas.css by keeping the files in memory and updating it when we save changes.  No waiting!


Now for make, our root directory, create a `makefile`:
```bash
touch makefile
```
And add the following:

```make
install 					: install-server install-client

install-server 		: server/package.json
										cd server;		\
										npm install;  \
										cd ..;				\

install-client		:	client/package.json
										cd client;		\
										npm install;	\
										cd ..;				\

build-client	:	client/src/webpack.config.js
								cd client/src;			\
								webpack;

run-webpack-dev-server 	: client/src/webpack-dev-server.js
													cd client/src;											\
													node webpack-dev-server.js;

```
Note, the alignment here is wonky due to make's preferences for tabs over spaces.

Now, we just need to run `make run-webpack-dev-server` so we can starting building our application!


### Enough already, show me something!

Lots of boilerplate thus far.  Let's get something on the screen.

Create our `index.html` inside our `assets` folder:
```html
<!DOCTYPE html>
<html>
  <head>
    <title>A todo-mvc style app for SaaS</title>
    <link rel="stylesheet" href="/style/blaze.min.css" type="text/css">
    <link rel="stylesheet" href="/style/fonts/materialdesignicons/material-icons.css" type="text/css">
  </head>
  <body>
    <div id="content">
      <i class="material-icons">star_rate</i>
    </div>
  </body>
</html>
```

At this point, we need to set up a static file server.  I like to use [node-static](https://github.com/cloudhead/node-static):
```bash
> npm install -g node-static
> static client/src/assets
$ serving "client/src/assets" at http://127.0.0.1:8080
```
Navigate to http://127.0.0.1:8080 in your browser.  Voila, you should see a... black star.  Well, that's a start.

#### Now the fun begins

Let's build our React app.  Add a `js` folder that will hold all our application's javascript code.  Inside of it, create `init.js`, which will bootstrap our application using [react-router](https://github.com/reactjs/react-router).

```bash
mkdir -p client/src/assets/js
touch client/src/assets/js/init.js
```

TODO: add stuff about building init.js

Let's create our first React view inside a directory called `components`.

```bash
mkdir -p client/src/assets/js/components
touch client/src/assets/js/components/App.jsx
```

TODO: add stuff about building App.jsx:

Our `App.jsx` will look like this:

```js

```

You might ask, *what's initializeSession?*  It's a Redux [action creator](http://redux.js.org/docs/basics/Actions.html).  We'll use it to bootstrap our application's session by checking for an existing authentication-token in LocalStorage.  If we find one, we'll ask the server to refresh it.  If we don't find one or if the token is expired (and thus the server refuses to refresh it for us), we can simply display the Login view.

Let's build our first action and action creator.  Create a folder under `js` called `actions` and create a file named `sessionActions.js`:

```bash
mkdir -p client/src/assets/js/actions
touch client/src/assets/js/actions/sessionActions.js
```

In `sessionActions.js`, we'll define our actions and action creators:

```js
export const WILL_INITIALIZE_SESSION = 'WILL_INITIALIZE_SESSION'
export function willInitializeSession() {
  return { type : WILL_INITIALIZE_SESSION}
}

export const DID_INITIALIZE_SESSION = 'DID_INITIALIZE_SESSION'
export function didInitializeSession(user) {
  return { type : DID_INITIALIZE_SESSION, user : user  }
}

export const INITIALIZE_SESSION = 'INITIALIZE_SESSION'
export function initializeSession() {

  return function(dispatch) {
    dispatch(willInitializeSession());

    const sessionTokenKey = '__SESSION_TOKEN__'
    let token = localStorage.get(sessionTokenKey)
    if (!token) {
      return dispatch(didInitializeSession())
    }

    return fetch(url, {
			credentials: 'same-origin',
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
```

Here we have an asynchronous action creator that fires `willInitializeSession` and `didInitializeSession`.  

We'll use the former to show a user-friendly loading screen and the latter to display either the login screen or the dashboard, depending on whether or not a user is returned by the server (i.e., the token is valid).

How do we do that?  By adding a [reducer](http://redux.js.org/docs/basics/Reducers.html)!  Let's create a `reducers` folder and in it, `todoSaasApp.js`:

```bash
mkdir -p client/src/assets/js/reducers
touch client/src/assets/js/reducers/todoSaasApp.js
```
