import { map } from 'lodash';
import React from 'react';
import classnames from 'classnames';

import { formatDuration } from '../utils';

import './style.scss';

export const SideBar = ({ operations }) => {
  return (
    <div className="side-bar">
      {map(operations, op => (
        <div key={op.operationName} className={classnames("side-bar-operation", "side-bar-operation-active")}>
          <div className="side-bar-operation-name">
            {op.operationName || 'Unknown'}
          </div>
          <div className="side-bar-operation-duration">
            {formatDuration(op.extensions.tracing.duration)}
          </div>
        </div>
      ))}
    </div>
  );
}