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

import {
  ADD_OPERATION,
  CLEAR_ALL_OPERATIONS,
  UPDATE_VIEW_OPERATION_LIST_WIDTH_DELTA,
} from '../actions';
import { ALL_API_KEY } from '../config';

const initialState = composable(
  initState({
    apis: {
      [ALL_API_KEY]: {
        ops: [],
      },
    },
    ops: {},
  })
);

const operations = composable(
  initialState,
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

const views = composable(
  initState({
    opListWidth: 230,
  }),
  branchAction({
    [UPDATE_VIEW_OPERATION_LIST_WIDTH_DELTA]: setValue(
      'opListWidth',
      (state, action) =>
        Math.max((state.opListWidth || 230) + action.delta, 200)
    ),
  })
);

export const reducer = composeReducer(
  at('operations', operations),
  at('view', views)
);
