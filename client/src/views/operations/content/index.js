import React, { useCallback, useMemo } from 'react';
import { initial, last, map } from 'lodash';
import { useSelector } from 'react-redux';
import { TraceNode } from '../../../components/traceNode';
import './style.scss';

const getNode = (tree, path) => {
  let current = tree;

  for (let i = 0; i < path.length; i += 1) {
    const key = path[i];
    if (!current.childs[key]) {
      current.childs[key] = {
        childs: {},
      };
    }
    current = current.childs[key];
  }

  return current;
};
const toTree = (execution) => {
  const root = { childs: {} };

  execution.resolvers.forEach((r) => {
    const parent = initial(r.path);
    const child = last(r.path);
    const node = getNode(root, parent);
    node.childs[child] = {
      meta: r,
      childs: {},
    };
  });
  return root;
};

export const OperationTrace = ({ operationId }) => {
  const operation = useSelector(
    useCallback(
      (state) => {
        return state.operations.ops[operationId];
      },
      [operationId]
    )
  );

  const tree = useMemo(() => {
    if (!operation) {
      return null;
    }
    const execution = operation.tracing.execution;
    return toTree(execution);
  }, [operation]);

  if (!operation) {
    return null;
  }

  const totalDuration = operation.tracing.duration;

  return (
    <div className="operation-trace">
      <TraceNode
        totalDuraton={totalDuration}
        meta={{
          fieldName: 'total',
          duration: totalDuration,
        }}
        childs={{}}
      />
      <TraceNode
        totalDuraton={totalDuration}
        meta={{ fieldName: 'parsing', ...operation.tracing.parsing }}
        childs={{}}
      />
      <TraceNode
        totalDuraton={totalDuration}
        meta={{ fieldName: 'validation', ...operation.tracing.validation }}
        childs={{}}
      />
      <div className="operation-trace-nodes">
        {map(tree.childs, ({ meta, childs }, key) => (
          <TraceNode
            key={key}
            totalDuraton={totalDuration}
            meta={meta}
            childs={childs}
          />
        ))}
      </div>
    </div>
  );
};
