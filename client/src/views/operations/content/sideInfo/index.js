import styled from 'styled-components';

import { GqlQuery } from '../../../../components/gqlQuery';

const Container = styled.div`
  overflow: auto;
  display: flex;
`;

const InfoContainer = styled.div`
  padding: 5px;
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
      <InfoContainer>
        <Title>Query</Title>
        <Query>
          <GqlQuery query={query} />
        </Query>
      </InfoContainer>
    </Container>
  );
};
