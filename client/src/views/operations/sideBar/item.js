import styled from 'styled-components';

import { formatDuration } from '../../../utils';

const Origin = styled.div`
  color: rgba(0, 0, 0, 0.5);
  margin-right: 5px;
  font-size: smaller;
`;
const OperationName = styled.div`
  margin-right: 5px;
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const Container = styled.div`
  padding: 6px;
  cursor: pointer;
  display: flex;
  font-size: small;
  background-color: ${(props) => (props.active ? `#4e67eb` : 'transparent')};
  color: ${(props) => (props.active ? 'white' : 'inherit')};

  :hover {
    background-color: ${(props) => (props.active ? '#4e67eb' : '#f0f4ff')};
  }
`;

const MissingOperationName = styled(OperationName)`
  color: rgba(0, 0, 0, 0.8);
`;
const Duration = styled.div`
  color: rgba(0, 0, 0, 0.5);
  font-size: smaller;
`;

export const SideBarItem = ({ active, origin, name, onClick, duration }) => {
  return (
    <Container onClick={onClick} active={active}>
      <Origin>[{origin}]</Origin>
      {name ? (
        <OperationName>{name}</OperationName>
      ) : (
        <MissingOperationName>Unkown</MissingOperationName>
      )}
      <Duration>{formatDuration(duration)}</Duration>
    </Container>
  );
};
