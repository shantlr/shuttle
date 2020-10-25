import React, { useMemo } from 'react';

import classnames from 'classnames';

import { formatGql } from '../../utils/formatter';
import './style.scss';

const cssMapping = {
  op: 'gql-node-operation',
  name: 'gql-node-name',
  variable: 'gql-node-variable',
  bool: 'gql-node-bool',
  string: 'gql-node-string',
  number: 'gql-node-number',
  type: 'glq-node-type',

  arg: 'gql-node-argument',
  fragment: 'gql-node-keyword',
  fragmentOn: 'gql-node-keyword',
  'args-start': 'gql-node-flow',
  'args-end': 'gql-node-flow',
  'selection-start': 'gql-node-flow',
  'selection-end': 'gql-node-flow',
  'variable-definition-start': 'gql-node-flow',
  'variable-definition-end': 'gql-node-flow',
};

export const GqlQuery = ({ query }) => {
  const queryNodes = useMemo(() => {
    if (!query) {
      return null;
    }
    const lines = formatGql(query);
    const res = [];

    lines.forEach((line, lineIndex) => {
      const spans = [];
      line.forEach(([type, value, modifiers], index) => {
        if (type === 'indent') {
          spans.push(
            <span key={index} style={{ paddingLeft: value * 8 }}></span>
          );
        } else {
          const classes = [];
          if (cssMapping[type]) {
            classes.push(cssMapping[type]);
          }
          Object.keys(modifiers).forEach((m) => {
            if (cssMapping[m]) {
              classes.push(cssMapping[m]);
            }
          });
          spans.push(
            <span key={index} className={classnames(classes)}>
              {value}
            </span>
          );
        }
      });

      res.push(<div key={lineIndex}>{spans}</div>);
    });

    return res;
  }, [query]);

  return <div className="gql-query">{queryNodes}</div>;
};
