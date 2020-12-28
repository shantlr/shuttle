import {
  branchAction,
  composable,
  composeReducer,
  initState,
  at,
  pushValue,
  setValue,
  branch,
  mapActions,
} from 'compose-reducer';

import { ADD_OPERATION, CLEAR_ALL_OPERATIONS } from '../actions';
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
    [CLEAR_ALL_OPERATIONS]: composable(
      setValue('ops', () => ({})),
      mapActions(
        (state) => Object.keys(state.apis),
        setValue(
          (state, action) => ['apis', action],
          () => ({ ops: [] })
        )
      )
    ),
  })
);

export const reducer = composeReducer(at('operations', operations));
