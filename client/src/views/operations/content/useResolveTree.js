import { useMemo } from 'react';

const createTreeNode = (path, { isArray = false } = {}) => ({
  key: path.join('.'),
  childs: {},
  isArray,
});

const resolveNodesToTree = (resolvers) => {
  const res = createTreeNode([]);

  if (!resolvers) {
    return res;
  }

  resolvers.forEach((node) => {
    let p = res;

    const { path } = node;

    for (let i = 0; i < path.length; i += 1) {
      const childKey = path[i];

      if (!p.childs[childKey]) {
        // Create node
        const n = createTreeNode(path.slice(0, i + 1));

        if (!p.isArray && typeof k === 'number') {
          // path elem is array => parent is an array
          p.isArray = true;
          if (!p.node) {
            p.node = {
              path: path.slice(0, i),
              fieldName: path[i - 1],
            };
          }
        }

        // add node to parent
        p.childs[childKey] = n;
      }

      if (typeof childKey === 'number' && !p.childs[childKey].node) {
        // path elem is array => add array elem node info if missing
        p.childs[childKey].node = {
          parent: p,
          path: path.slice(0, i + 1),
          fieldName: `${path[i - 1]}:${childKey}`,
        };
      }
      p = p.childs[childKey];
    }

    // Detect field of array elem
    // => set type to parent nodes
    if (
      node.path.length >= 2 &&
      typeof node.path[node.path.length - 2] === 'number'
    ) {
      if (p.parent && p.parent.node && !p.parent.node.returnType) {
        // Set type to array elem (e.g: 'items:0')
        p.parent.node.returnType = node.parentType;
        const parent = p.parent;

        // Set type to array (e.g: 'items')
        if (parent.parent && parent.parent.node) {
          parent.parent.node.returnType = `[${node.parentType}]`;
        }
      }
    }

    p.node = node;
  });

  return res;
};

export const useResolveTree = (resolves) => {
  return useMemo(() => {
    return resolveNodesToTree(resolves);
  }, [resolves]);
};
