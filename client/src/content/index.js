import { initial, last, map } from 'lodash';
import React, { useMemo } from 'react';
import { TraceNode } from '../components/traceNode';
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

export const Content = ({ operation }) => {
  const tracing = operation.extensions.tracing;
  const tree = useMemo(() => {
    const execution = tracing.execution;
    return toTree(execution);
  }, [tracing.execution]);
  console.log(tree);
  console.log(operation.extensions.tracing);

  return (
    <div className="content">
      <TraceNode
        totalDuraton={operation.extensions.tracing.duration}
        meta={{ fieldName: 'parsing', ...tracing.parsing }}
        childs={{}}
      />
      <TraceNode
        totalDuraton={operation.extensions.tracing.duration}
        meta={{ fieldName: 'validation', ...tracing.validation }}
        childs={{}}
      />
      {map(tree.childs, ({ meta, childs }, key) => (
        <TraceNode
          key={key}
          totalDuraton={operation.extensions.tracing.duration}
          meta={meta}
          childs={childs}
        />
      ))}
    </div>
  );
};
