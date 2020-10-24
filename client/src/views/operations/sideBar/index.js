import { get, map, reduce, sortBy } from 'lodash';
import React, { useCallback, useEffect, useMemo } from 'react';
import classnames from 'classnames';

import { formatDuration } from '../../../utils';

import './style.scss';
import { useSelector } from 'react-redux';
import { MenuItem, Select } from '@material-ui/core';
import { ALL_API_KEY } from '../../../data';
import { useHistory } from 'react-router-dom';

const selectApis = (state) => state.operations.apis;

export const SideBar = ({ selectedApi, selectedOperationId }) => {
  const history = useHistory();
  const apis = Object.keys(useSelector(selectApis));

  const apiNames = useMemo(() => {
    return sortBy(apis, (name) => (name === ALL_API_KEY ? -1 : name));
  }, [apis]);

  const operations = useSelector(
    useCallback(
      (state) => {
        const ids = get(state.operations.apis, [selectedApi, 'ops']);
        return reduce(
          ids,
          (ops, id) => {
            const op = state.operations.ops[id];
            if (op) {
              ops.push(op);
            }
            return ops;
          },
          []
        );
      },
      [selectedApi]
    )
  );

  useEffect(() => {
    if (!selectedOperationId && operations.length) {
      history.replace(`/operations/${selectedApi}/${operations[0].id}`);
    }
    if (selectedOperationId && !operations.length) {
      history.replace(`/operations/${selectedApi}`);
    }
  }, [history, operations, selectedApi, selectedOperationId]);

  return (
    <div className="side-bar">
      <div className="side-bar-header">
        <Select
          className="side-bar-select-api"
          value={selectedApi}
          onChange={(e) => {
            history.push(`/operations/${e.target.value}`);
          }}
        >
          {apiNames.map((name) => (
            <MenuItem key={name} value={name}>
              {name === ALL_API_KEY && <span>All</span>}
              {name !== ALL_API_KEY && <span>{name}</span>}
            </MenuItem>
          ))}
        </Select>
      </div>

      <div className="side-bar-operation-list">
        {map(operations, (op) => (
          <div
            key={op.id}
            className={classnames('side-bar-operation', {
              'side-bar-operation-active': selectedOperationId === op.id,
            })}
            onClick={() => {
              history.push(`/operations/${selectedApi}/${op.id}`);
            }}
          >
            <div
              className={classnames('side-bar-operation-name', {
                'side-bar-operation-name-missing': !op.operationName,
              })}
            >
              {op.operationName || 'Unknown'}
            </div>
            <div className="side-bar-operation-duration">
              {formatDuration(op.tracing.duration)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
