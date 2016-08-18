# JS Web App
## Prologue
This is part one in a series of posts I'll write to show a way of building a modern webapp with React/Redux, Node, and Postgres/GraphQL.

This is as much an attempt to teach as it is to learn; I'd love to hear opinions and critiques on design choices, libraries used (or not used), code, anything really.  I'm always looking for ways to improve my skills and tool-chain.

We'll break the blogpost two parts: frontend & backend.  If you wan to see the final code, see: .

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
npm install isomorphic-fetch react react-dom react-redux redux redux-thunk --save-dev
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

At this point, we need to set up a static file server.  I like to use [node-static](https://github.com/cloudhead/node-static)
```bash
> npm install -g node-static
> static client/src/assets
$ serving "client/src/assets" at http://127.0.0.1:8080
```
Navigate to http://127.0.0.1:8080 in your browser.  Voila, you should see a ... black star.  Well that's a start.
