import React, { useEffect } from 'react';

import { Provider, useDispatch } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import io from 'socket.io-client';

import { API_URL } from '../config';
import { persistor, store } from '../data';
import { addOperation } from '../data/actions';
import { OperationsView } from '../views/operations';
import './style.scss';

export const RootApp = () => {
  return (
    <Router>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Connection>
            <div className="root-app">
              <OperationsView />
            </div>
          </Connection>
        </PersistGate>
      </Provider>
    </Router>
  );
};

const Connection = ({ children }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const socket = io(`${API_URL}/operations`, {
      path: '/api',
    });

    socket.on('connect', () => {
      console.log('Connected');
    });
    socket.on('disconnect', () => {
      console.log('Disconnected');
    });

    socket.on('operation', (op) => {
      dispatch(addOperation(op));
    });
    return () => {
      socket.close();
    };
  }, [dispatch]);
  return children;
};
