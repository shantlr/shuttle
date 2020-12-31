import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import styled from 'styled-components';

import { DraggableHandle } from '../../components/draggableHandle';
import { BASE_URL } from '../../config';
import { ALL_API_KEY, selectViewOpListWidth } from '../../data';
import { selectViewSideInfoWidthPercent } from '../../data/selectors';

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

const useWidth = () => {
  const [width, setWidth] = useState(() => window.innerWidth);
  useEffect(() => {
    const handler = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return width;
};

const OperationViewContent = ({ api, operationId }) => {
  const width = useWidth();
  const sideWidth = useSelector(selectViewOpListWidth);
  const infoPercent = useSelector(selectViewSideInfoWidthPercent);

  const remainWidth = width - (sideWidth + 10);
  const infoWidth = remainWidth * infoPercent;
  const tracesWidth = remainWidth - infoWidth;

  return (
    <Container>
      <SideBar
        width={sideWidth}
        selectedApi={api}
        selectedOperationId={operationId}
      />
      {operationId && (
        <OperationTrace
          operationId={operationId}
          traceWidth={tracesWidth}
          infoWidth={infoWidth}
        />
      )}
      {!operationId && <DefaultContent />}
    </Container>
  );
};
