import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import { createStore,applyMiddleware } from 'redux';
import { Provider } from "react-redux";
import ReduxThunk from 'redux-thunk';
import reducers from "./store/reducer/index";
import * as authActions from './store/action/auth';
import * as checkoutData from './store/action/checkout';

import { composeWithDevTools } from 'redux-devtools-extension';
import * as vendor from './store/action/vendor';


const store = createStore(reducers, composeWithDevTools(
  applyMiddleware(ReduxThunk),
));

if(localStorage.getItem('token') && localStorage.getItem('userId')){
  store.dispatch(authActions.authSet(localStorage.getItem('token'),localStorage.getItem('userId')));
}


if(localStorage.getItem('vendor')){
  store.dispatch(vendor.vendorAction(JSON.parse(localStorage.getItem("vendor"))));
}

if(localStorage.getItem('checkoutData')){
  store.dispatch(checkoutData.checkoutDataSet(JSON.parse(localStorage.getItem("checkoutData"))));
}

//JSON.parse(localStorage.getItem("savedData"))[0]

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
    <Provider store = {store} > <App/></Provider>    
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
