import { get } from 'lodash';

export const selectViewOpListWidth = (state) =>
  get(state, 'view.opListWidth', 230);
