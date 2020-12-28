import React, { useMemo, useState } from 'react';

import { size } from 'lodash';

import { formatDuration } from '../../utils';
import { ProgressBar } from '../progressBar';
import './style.scss';

export const TraceNode = ({
  style,
  totalDuraton,
  onVisibilityChange,
  meta,
  progressWidth = 500,
}) => {
  const [showChilds, setShowChilds] = useState(true);

  let indent = [];
  for (let i = 0; i < size(meta.path) - 1; i += 1) {
    indent.push(<React.Fragment key={i}>&nbsp;&bull;</React.Fragment>);
  }

  return (
    <div className="trace-node" style={style}>
      {Boolean(meta) && (
        <div
          className="trace-node-line"
          onClick={() => onVisibilityChange({ path: meta.path })}
          // onClick={() => hasChilds && setShowChilds(!showChilds)}
        >
          <div className="trace-node-name-title">
            <span className="trace-node-indent">{indent}</span>
            <span className="trace-node-name" style={{ paddingLeft: 5 }}>
              {meta.fieldName}
            </span>
            <span className="trace-node-type">{meta.returnType}</span>
            {/* {hasChilds && !showChilds && (
              <span className="trace-node-more">&nbsp;...</span>
            )} */}
          </div>
          <div className="trace-node-progress">
            <ProgressBar
              width={progressWidth || 0}
              push={meta.startOffset / totalDuraton || 0}
              percent={meta.duration / totalDuraton || 0}
              label={formatDuration(meta.duration)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
