import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import './style.scss';

export const ProgressBar = ({ width, push = 0, percent = 1, label }) => {
  const [w, setWidth] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setWidth(width);
    });
    return () => cancelAnimationFrame(id);
  }, [width]);

  return (
    <div className="progress-bar" style={{ width: width + 100 }}>
      <div className="progress-bar-push" style={{ width: width * push }} />
      <div className="progress-bar-thumb" style={{ width: w * percent }} />
      <div className="progress-bar-label">{label}</div>
    </div>
  );
};
ProgressBar.propTypes = {
  width: PropTypes.number,
  push: PropTypes.number,
  percent: PropTypes.number,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.element,
  ]),
};
