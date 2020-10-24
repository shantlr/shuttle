import shortid from 'shortid';

export const ADD_OPERATION = 'ADD_OPERATION';
export const addOperation = (operation) => ({
  type: ADD_OPERATION,
  operation: {
    id: shortid(),
    ...operation,
  },
});
