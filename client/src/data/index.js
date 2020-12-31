import { compose, createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { reducer } from './reducer';

export * from './actions';
export * from './selectors';
export * from './config';

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION__ || compose;

const persistedReducer = persistReducer(
  {
    key: '@shuttle/state',
    storage,
  },
  reducer
);

export const store = createStore(persistedReducer, composeEnhancer());
export const persistor = persistStore(store);
