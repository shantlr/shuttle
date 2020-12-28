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

import { GqlQuery } from '../../../components/gqlQuery';
import { TraceNode } from '../../../components/traceNode';
import './style.scss';
import { DefaultContent } from '../default';

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

  const tree = useMemo(() => {
    const res = {
      isRoot: true,
      childs: {},
    };

    if (resolvers) {
      resolvers.forEach((node) => {
        let p = res;
        const { path } = node;
        for (let i = 0; i < path.length; i += 1) {
          const k = path[i];
          if (!p.childs[k]) {
            const n = {
              parent: p,
              childs: {},
            };

            if (!p.isArray && typeof k === 'number') {
              p.isArray = true;
              p.node = {
                path: path.slice(0, i),
                fieldName: path[i - 1],
              };
              // Add array elem node
            }

            p.childs[k] = n;
          }

          if (typeof k === 'number' && !p.childs[k].node) {
            p.childs[k].node = {
              parent: p,
              path: path.slice(0, i + 1),
              fieldName: `${path[i - 1]}:${k}`,
            };
          }
          p = p.childs[k];
        }
        if (
          node.path.length >= 2 &&
          typeof node.path[node.path.length - 2] === 'number'
        ) {
          if (p.parent && p.parent.node && !p.parent.node.returnType) {
            p.parent.node.returnType = node.parentType;
            const parent = p.parent;
            if (parent.parent && parent.parent.node) {
              parent.parent.node.returnType = `[${node.parentType}]`;
            }
          }
        }

        p.node = node;
      });
    }
    return res;
  }, [resolvers]);

  const traces = useMemo(() => {
    const res = [];
    const addNode = (nodes, parent) => {
      forEach(nodes, (node) => {
        if (node.node) {
          res.push(node.node);

          // Hidden node => do not render childs
          const key = node.node.path.join('.');
          if (hiddenNodes[key]) {
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

  if (!operation) {
    return <DefaultContent />;
  }

  const totalDuration = operation.tracing.duration;

  return (
    <div className="operation-trace">
      <div className="operation-trace-nodes">
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
        <div className="operation-trace-nodes">
          <AutoSizer>
            {({ height, width }) => (
              <List
                className="operation-trace-nodes-list"
                itemCount={traces.length}
                height={height}
                width={width}
                itemSize={20}
              >
                {({ index, style }) => (
                  <TraceNode
                    style={style}
                    totalDuraton={totalDuration}
                    meta={traces[index]}
                    onVisibilityChange={onVisibilityChange}
                    childs={{}}
                    progressWidth={progressWidth}
                  />
                )}
              </List>
            )}
          </AutoSizer>
        </div>
      </div>
      <div className="operation-side-info">
        <div className="operation-side-info-section">Query</div>
        <div className="operation-side-info-query">
          <GqlQuery query={operation.query} />
        </div>
      </div>
    </div>
  );
};
