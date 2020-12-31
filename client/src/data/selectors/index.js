import { get } from 'lodash';

export const selectViewOpListWidth = (state) =>
  get(state, 'view.opListWidth', 230);

export const selectViewSideInfoWidthPercent = (state) =>
  get(state, 'view.sideInfoPercent', 0.25);
