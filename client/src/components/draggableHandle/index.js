import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
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

export const DraggableHandle = ({ onChangeDelta }) => {
  return (
    <Draggable
      axis="x"
      defaultPosition={{ x: 0, y: 0 }}
      position={{ x: 0, y: 0 }}
      onStop={(e, data) => {
        // console.log(data);
        onChangeDelta(data.x);
      }}
    >
      <Container>
        <DragIndicatorIcon style={{ fontSize: 10 }} />
      </Container>
    </Draggable>
  );
};
