import React from 'react';

import { Redirect, Route, Switch } from 'react-router-dom';

import { BASE_URL } from '../../config';
import { ALL_API_KEY } from '../../data';

import { OperationTrace } from './content';
import { SideBar } from './sideBar';

import './style.scss';

export const OperationsView = () => {
  return (
    <Switch>
      <Route
        path={`${BASE_URL}/operations/:apiName/:op?`}
        render={({ match }) => (
          <OperationViewContent
            api={match.params.apiName}
            operationId={match.params.op}
          />
        )}
      />
      <Redirect to={`${BASE_URL}/operations/${ALL_API_KEY}`} />
    </Switch>
  );
};

const OperationViewContent = ({ api, operationId }) => {
  return (
    <div className="operation-view">
      <SideBar selectedApi={api} selectedOperationId={operationId} />
      {operationId && <OperationTrace operationId={operationId} />}
    </div>
  );
};
