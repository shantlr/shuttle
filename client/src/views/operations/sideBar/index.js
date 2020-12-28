import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { IconButton, MenuItem, Select } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Delete';
import { get, map, reduce, sortBy } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { BASE_URL } from '../../../config';
import { ALL_API_KEY } from '../../../data';
import { clearAllOperations } from '../../../data/actions';

import { AddJsonOperation } from './addJsonOperation';
import { SideBarItem } from './item';

const selectApis = (state) => state.operations.apis;

const Container = styled.div`
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;
const Header = styled.div`
  padding: 10px 0 10px 5px;
  display: flex;
`;

const SelectApi = styled(Select)`
  width: 100%;
  margin-left: 2px;
`;

const ListContainer = styled.div`
  height: 100%;
  overflow: auto;
`;

export const SideBar = ({ selectedApi, selectedOperationId }) => {
  const history = useHistory();
  const apis = Object.keys(useSelector(selectApis));
  const dispatch = useDispatch();

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
    <Container style={{ width, minWidth: width }}>
      <Header>
        <IconButton size="small" onClick={() => dispatch(clearAllOperations())}>
          <ClearIcon />
        </IconButton>
        <SelectApi
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
        </SelectApi>
        <AddJsonOperation />
      </Header>

      <ListContainer
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
          <SideBarItem
            key={op.id}
            active={selectedOperationId === op.id}
            origin={op.from}
            name={op.operationName}
            onClick={() => {
              history.push(`${BASE_URL}/operations/${selectedApi}/${op.id}`);
            }}
            duration={op.duration}
          />
        ))}

        <div ref={scrollRef} />
      </ListContainer>
    </Container>
  );
};
