import Draggable from 'react-draggable';
import styled from 'styled-components';

const Container = styled.div`
  cursor: col-resize;
  /* margin: 0px 0px; */
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.1);
`;
const Handle = styled.div`
  height: 20px;
  width: 3px;
  margin: 0 2px;
  border-radius: 35px;
  background-color: black;
`;

export const DraggableHandle = ({ style, onChange, onChangeDelta }) => {
  return (
    <Draggable
      axis="x"
      defaultPosition={{ x: 0, y: 0 }}
      position={{ x: 0, y: 0 }}
      onStop={(e, data) => {
        if (onChange) {
          onChange(data.x);
        }
        if (onChangeDelta) {
          onChangeDelta(data.x);
        }
      }}
    >
      <Container style={style}>
        <Handle />
      </Container>
    </Draggable>
  );
};
