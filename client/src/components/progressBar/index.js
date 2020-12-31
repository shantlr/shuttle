import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
`;
const Push = styled.div``;
const Thumb = styled.div`
  height: 3px;
  border-radius: 4px;
  background-color: #4e67eb;
  transition: width 0.6s cubic-bezier(0, 0.55, 0.45, 1);
`;
const Label = styled.div`
  margin-left: 5px;
  font-size: x-small;
  color: rgba(0, 0, 0, 0.75);
`;

export const ProgressBar = ({ width, push = 0, percent = 1, label }) => {
  const [w, setWidth] = useState(0);

  // keep some space for label
  const actualWidth = width - 100;

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setWidth(actualWidth);
    });
    return () => cancelAnimationFrame(id);
  }, [actualWidth]);

  return (
    <Container style={{ width: width }}>
      <Push style={{ width: w * push }} />
      <Thumb style={{ width: w * percent }} />
      <Label>{label}</Label>
    </Container>
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
