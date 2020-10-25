import { compose, createStore } from 'redux';

import { reducer } from './reducer';

export * from './config';

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION__ || compose;

export const store = createStore(reducer, composeEnhancer());
