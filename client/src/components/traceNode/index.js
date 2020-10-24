import { map } from 'lodash';
import React, { useState } from 'react';
import { formatDuration } from '../../utils';
import { ProgressBar } from '../progressBar';
import './style.scss';

export const TraceNode = ({ totalDuraton, meta, childs, depth = 0 }) => {
  const [showChilds, setShowChilds] = useState(true);

  return (
    <div className="trace-node">
      {Boolean(meta) && (
        <div
          className="trace-node-line"
          onClick={() => setShowChilds(!showChilds)}
        >
          <div
            className="trace-node-name-title"
            style={{ paddingLeft: depth * 8 }}
          >
            <span className="trace-node-name">{meta.fieldName}</span>
            <span className="trace-node-type">{meta.returnType}</span>
          </div>
          <div className="trace-node-progress">
            <ProgressBar
              width={700}
              push={meta.startOffset / totalDuraton || 0}
              percent={meta.duration / totalDuraton}
              label={formatDuration(meta.duration)}
            />
          </div>
        </div>
      )}
      {showChilds && (
        <div className="trace-node-childs">
          {map(childs, (child, key) => (
            <TraceNode
              totalDuraton={totalDuraton}
              depth={depth + (Boolean(meta) ? 1 : 0)}
              key={key}
              meta={child.meta}
              childs={child.childs}
            />
          ))}
        </div>
      )}
    </div>
  );
};
