import React from 'react';

import { size } from 'lodash';
import styled from 'styled-components';

import { formatDuration } from '../../utils';
import { ProgressBar } from '../progressBar';

const Container = styled.div``;

const Title = styled.div`
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  width: 250px;
  min-width: 250px;
  overflow: hidden;
  padding-bottom: 2px;
  margin-right: 5px;
`;

const Line = styled.div`
  display: flex;
  background-color: ${(props) => (props.hidden ? '#f5f5f5' : 'transparent')};
  :hover {
    cursor: pointer;
    background-color: #f0f4ff;
    ${Title} {
      overflow: visible;
    }
  }
`;

const TitleIdent = styled.span`
  color: rgba(0, 0, 0, 0.1);
`;
const TitleName = styled.span`
  font-size: small;
  margin-right: 5px;
  padding-left: 5px;
`;
const NodeType = styled.span`
  color: rgba(0, 0, 0, 0.5);
  font-size: x-small;
`;

const ProgressContainer = styled.div``;

export const TraceNode = ({
  style,
  totalDuraton,
  onVisibilityChange,
  meta,
  hasChilds,
  childHidden,
  progressWidth = 500,
}) => {
  let indent = [];
  for (let i = 0; i < size(meta.path) - 1; i += 1) {
    indent.push(<React.Fragment key={i}>&nbsp;&bull;</React.Fragment>);
  }

  return (
    <Container style={style}>
      {Boolean(meta) && (
        <Line
          hidden={childHidden}
          onClick={() =>
            onVisibilityChange &&
            hasChilds &&
            onVisibilityChange({ path: meta.path })
          }
        >
          <Title>
            <TitleIdent>{indent}</TitleIdent>
            <TitleName>{meta.fieldName}</TitleName>
            <NodeType>{meta.returnType}</NodeType>
          </Title>
          <ProgressContainer>
            {typeof meta.duration === 'number' && (
              <ProgressBar
                width={progressWidth || 0}
                push={meta.startOffset / totalDuraton || 0}
                percent={meta.duration / totalDuraton || 0}
                label={formatDuration(meta.duration)}
              />
            )}
          </ProgressContainer>
        </Line>
      )}
    </Container>
  );
};
