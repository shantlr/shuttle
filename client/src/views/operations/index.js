import React from 'react';

import { Redirect, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';

import { BASE_URL } from '../../config';
import { ALL_API_KEY } from '../../data';

import { OperationTrace } from './content';
import { DefaultContent } from './default';
import { SideBar } from './sideBar';

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

const Container = styled.div`
  display: flex;
  overflow: hidden;
`;

const OperationViewContent = ({ api, operationId }) => {
  return (
    <Container>
      <SideBar selectedApi={api} selectedOperationId={operationId} />
      {operationId && <OperationTrace operationId={operationId} />}
      {!operationId && <DefaultContent />}
    </Container>
  );
};
