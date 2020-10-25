import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { MenuItem, Select } from '@material-ui/core';
import classnames from 'classnames';
import { get, map, reduce, sortBy } from 'lodash';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { BASE_URL } from '../../../config';
import { ALL_API_KEY } from '../../../data';
import { formatDuration } from '../../../utils';

import { AddJsonOperation } from './addJsonOperation';
import './style.scss';

const selectApis = (state) => state.operations.apis;

export const SideBar = ({ selectedApi, selectedOperationId }) => {
  const history = useHistory();
  const apis = Object.keys(useSelector(selectApis));

  const apiNames = useMemo(() => {
    return sortBy(apis, (name) => (name === ALL_API_KEY ? -1 : name));
  }, [apis]);

  const scrollRef = useRef();
  const isScrollBottomRef = useRef(true);

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
      history.replace(
        `${BASE_URL}/operations/${selectedApi}/${operations[0].id}`
      );
    }
    if (selectedOperationId && !operations.length) {
      history.replace(`${BASE_URL}/operations/${selectedApi}`);
    }
  }, [history, operations, selectedApi, selectedOperationId]);

  useEffect(() => {
    if (isScrollBottomRef.current && scrollRef.current) {
      scrollRef.current.scrollIntoView({});
    }
  }, [operations]);

  const [width, setWidth] = useState(230);

  return (
    <div className="side-bar" style={{ width, minWidth: width }}>
      <div className="side-bar-header">
        <Select
          className="side-bar-select-api"
          value={selectedApi}
          onChange={(e) => {
            history.push(`${BASE_URL}/operations/${e.target.value}`);
          }}
        >
          {apiNames.map((name) => (
            <MenuItem key={name} value={name}>
              {name === ALL_API_KEY && <span>All</span>}
              {name !== ALL_API_KEY && <span>{name}</span>}
            </MenuItem>
          ))}
        </Select>
        <AddJsonOperation />
      </div>

      <div
        className="side-bar-operation-list"
        onScroll={(e) => {
          const height = e.target.offsetHeight;
          const scrollTop = e.target.scrollTop;
          const totalHeight = e.target.scrollHeight;
          if (scrollTop + height === totalHeight) {
            isScrollBottomRef.current = true;
          } else {
            isScrollBottomRef.current = false;
          }
        }}
      >
        {map(operations, (op) => (
          <div
            key={op.id}
            className={classnames('side-bar-operation', {
              'side-bar-operation-active': selectedOperationId === op.id,
            })}
            onClick={() => {
              history.push(`${BASE_URL}/operations/${selectedApi}/${op.id}`);
            }}
          >
            <div className="side-bar-operation-from">[{op.from}]</div>
            <div
              className={classnames('side-bar-operation-name', {
                'side-bar-operation-name-missing': !op.operationName,
              })}
            >
              {op.operationName || 'Unknown'}
            </div>
            <div className="side-bar-operation-duration">
              <div>{formatDuration(op.tracing.duration)}</div>
            </div>
          </div>
        ))}

        <div ref={scrollRef} />
      </div>
    </div>
  );
};
