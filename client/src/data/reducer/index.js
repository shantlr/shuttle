import {
  branchAction,
  composable,
  composeReducer,
  initState,
  at,
  pushValue,
  setValue,
  branch,
} from 'compose-reducer';
import { ADD_OPERATION } from '../actions';
import { ALL_API_KEY } from '../config';

const operations = composable(
  initState({
    apis: {
      [ALL_API_KEY]: {
        ops: [],
      },
    },
    ops: {},
  }),
  branchAction({
    [ADD_OPERATION]: composable(
      setValue(
        (state, action) => ['ops', action.operation.id],
        (state, action) => action.operation
      ),
      pushValue(
        ['apis', ALL_API_KEY, 'ops'],
        (state, action) => action.operation.id
      ),
      branch(
        (state, action) => action.operation.from,
        pushValue(
          (state, action) => ['apis', action.operation.from, 'ops'],
          (state, action) => action.operation.id
        )
      )
    ),
  })
);

export const reducer = composeReducer(at('operations', operations));
