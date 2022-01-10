import React from 'react';
import ReactDOM from 'react-dom';
import Root from './client/Root';
import { createStore, applyMiddleware, compose } from 'redux';
import allReducers from "./services/Redux/reducers";
import {Provider} from "react-redux";
import thunk from 'redux-thunk';
// import registerServiceWorker from './registerServiceWorker';
// import './index.css';

const composeEnhancers = (window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
const enhancer = composeEnhancers(
    applyMiddleware(thunk),
    // other store enhancers if any
);
const store = createStore(allReducers, enhancer);

ReactDOM.render(
    <Provider store={store}>
        <Root />

    </Provider>,
    document.getElementById('root')
);
// registerServiceWorker();