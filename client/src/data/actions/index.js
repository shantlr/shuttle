import shortid from 'shortid';

export const ADD_OPERATION = 'ADD_OPERATION';
export const addOperation = (operation) => ({
  type: ADD_OPERATION,
  operation: {
    id: shortid(),
    ...operation,
  },
});

export const CLEAR_ALL_OPERATIONS = 'CLEAR_ALL_OPERATIONS';
export const clearAllOperations = () => ({
  type: CLEAR_ALL_OPERATIONS,
});
