import React from 'react';

// import { GqlQuery } from '../../../components/gqlQuery';

export const DefaultContent = () => {
  return (
    <div>
      {/* <GqlQuery
        query={`
query getItems($ids: [ID]) { items(ids: $ids) { ...ItemDetails __typename } } fragment ItemDetails on Item { id name type level description iconId setId isFavorite effects { id type operator range __typename } ingredients { id price { accuracy value __typename } available __typename } __typename }
`}
      /> */}
    </div>
  );
};
