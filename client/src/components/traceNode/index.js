import React, { useMemo, useState } from 'react';

import { map } from 'lodash';

import { formatDuration } from '../../utils';
import { ProgressBar } from '../progressBar';
import './style.scss';

export const TraceNode = ({
  totalDuraton,
  meta,
  childs,
  progressWidth = 500,
  depth = 0,
}) => {
  const [showChilds, setShowChilds] = useState(true);

  let indent = [];
  for (let i = 0; i < depth; i += 1) {
    indent.push(<React.Fragment key={i}>&nbsp;&bull;</React.Fragment>);
  }

  const hasChilds = useMemo(() => Object.keys(childs).length > 0, [childs]);

  return (
    <div className="trace-node">
      {Boolean(meta) && (
        <div
          className="trace-node-line"
          onClick={() => hasChilds && setShowChilds(!showChilds)}
        >
          <div className="trace-node-name-title">
            <span className="trace-node-indent">{indent}</span>
            <span className="trace-node-name" style={{ paddingLeft: 5 }}>
              {meta.fieldName}
            </span>
            <span className="trace-node-type">{meta.returnType}</span>
            {hasChilds && !showChilds && (
              <span className="trace-node-more">&nbsp;...</span>
            )}
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
      {showChilds && (
        <div className="trace-node-childs">
          {map(childs, (child, key) => (
            <TraceNode
              totalDuraton={totalDuraton}
              depth={depth + (Boolean(meta) ? 1 : 0)}
              key={key}
              meta={child.meta}
              childs={child.childs}
              progressWidth={progressWidth}
            />
          ))}
        </div>
      )}
    </div>
  );
};
