import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Chat from './components/Chat'



ReactDOM.render(
  <React.StrictMode>
    <App>
      <Chat/>
    </App>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA



