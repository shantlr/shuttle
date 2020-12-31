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

export const UPDATE_VIEW_OPERATION_LIST_WIDTH_DELTA =
  'UPDATE_VIEW_OPERATION_LIST_WIDTH_DELTA';
export const updateViewOperationListWidthDelta = (delta) => ({
  type: UPDATE_VIEW_OPERATION_LIST_WIDTH_DELTA,
  delta,
});

export const UPDATE_VIEW_QUERY_SIDE_WIDTH = 'UPDATE_VIEW_QUERY_SIDE_WIDTH';
