import React, { useCallback, useEffect, useMemo, useState } from 'react';
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

const computeProgressWidth = () => {
  const winWidth = window.innerWidth;
  if (winWidth < 1100) {
    return 400;
  }
  return Math.min(650, winWidth - 700);
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
        {map(tree.childs, ({ meta, childs }, key) => (
          <TraceNode
            key={key}
            totalDuraton={totalDuration}
            meta={meta}
            childs={childs}
            progressWidth={progressWidth}
          />
        ))}
      </div>
    </div>
  );
};
