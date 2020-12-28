import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';

import { branch, composeReducer, setValue, unsetValue } from 'compose-reducer';
import { forEach, get } from 'lodash';
import { useSelector } from 'react-redux';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';
import styled from 'styled-components';

import { TraceNode } from '../../../components/traceNode';
import { DefaultContent } from '../default';

import { TraceSideInfo } from './sideInfo';
import { useResolveTree } from './useResolveTree';

const computeProgressWidth = () => {
  const winWidth = window.innerWidth;
  if (winWidth < 1100) {
    return 300;
  }
  return Math.min(650, winWidth - 800);
};
const useProgressWidth = () => {
  const [width, setWidth] = useState(() => computeProgressWidth());
  useEffect(() => {
    const listener = () => {
      setWidth(computeProgressWidth());
    };
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, []);
  return width;
};

const visibilityReducer = composeReducer(
  branch(
    (state, { path }) => state[path],
    unsetValue((state, { path }) => [path]),
    setValue((state, { path }) => [path], true)
  )
);

const Container = styled.div`
  padding: 10px 0 5px 5px;
  display: flex;
`;

const NodesContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const NodeListContainer = styled.div`
  height: 100%;
  overflow: auto;
`;
const NodeList = styled(List)`
  overflow-x: hidden !important;
`;

export const OperationTrace = ({ operationId }) => {
  const progressWidth = useProgressWidth();
  const operation = useSelector(
    useCallback(
      (state) => {
        return state.operations.ops[operationId];
      },
      [operationId]
    )
  );

  const [hiddenNodes, dispatchVisiblity] = useReducer(
    visibilityReducer,
    null,
    () => ({})
  );
  const onVisibilityChange = useCallback(({ path }) => {
    dispatchVisiblity({
      path: path.join('.'),
    });
  }, []);

  const resolvers = get(operation, 'tracing.execution.resolvers');

  const tree = useResolveTree(resolvers);

  const traces = useMemo(() => {
    const res = [];
    const addNode = (nodes, parent) => {
      forEach(nodes, (node) => {
        if (node.node) {
          res.push({
            key: node.key,
            node: node.node,
            hasChilds: Object.keys(node.childs).length > 0,
          });

          // Hidden node => do not render childs
          if (hiddenNodes[node.key]) {
            return;
          }
        }

        if (node.childs) {
          addNode(node.childs, node);
        }
      });
    };
    addNode(tree.childs, tree);
    return res;
  }, [hiddenNodes, tree]);

  const itemKey = useCallback(
    (index) => {
      return traces[index].key;
    },
    [traces]
  );

  if (!operation) {
    return <DefaultContent />;
  }

  const totalDuration = operation.tracing.duration;

  return (
    <Container>
      <NodesContainer>
        <TraceNode
          totalDuraton={totalDuration}
          meta={{
            fieldName: 'total',
            duration: totalDuration,
          }}
          childs={{}}
          progressWidth={progressWidth}
        />
        <TraceNode
          totalDuraton={totalDuration}
          meta={{ fieldName: 'parsing', ...operation.tracing.parsing }}
          childs={{}}
          progressWidth={progressWidth}
        />
        <TraceNode
          totalDuraton={totalDuration}
          meta={{ fieldName: 'validation', ...operation.tracing.validation }}
          childs={{}}
          progressWidth={progressWidth}
        />
        <NodeListContainer>
          <AutoSizer>
            {({ height, width }) => (
              <NodeList
                itemCount={traces.length}
                height={height}
                width={width}
                itemSize={20}
                itemKey={itemKey}
              >
                {({ index, style }) => (
                  <TraceNode
                    key={traces[index].key}
                    style={style}
                    totalDuraton={totalDuration}
                    meta={traces[index].node}
                    hasChilds={traces[index].hasChilds}
                    childHidden={Boolean(hiddenNodes[traces[index].key])}
                    onVisibilityChange={onVisibilityChange}
                    progressWidth={progressWidth}
                  />
                )}
              </NodeList>
            )}
          </AutoSizer>
        </NodeListContainer>
      </NodesContainer>

      <TraceSideInfo query={operation.query} />
    </Container>
  );
};
