import styled from 'styled-components';

import { GqlQuery } from '../../../../components/gqlQuery';

const Container = styled.div`
  padding-left: 5px;
  overflow: auto;
`;

const Title = styled.div`
  font-weight: bold;
`;

const Query = styled.div`
  color: rgba(0, 0, 0, 0.5);
  font-size: x-small;
`;

export const TraceSideInfo = ({ width, query }) => {
  return (
    <Container style={{ width }}>
      <Title>Query</Title>
      <Query>
        <GqlQuery query={query} />
      </Query>
    </Container>
  );
};
