import React, { useEffect, useRef, useState } from 'react';

import { Button, IconButton, Popover, TextField } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import * as yup from 'yup';

import { addOperation } from '../../../../data/actions';

export const AddJsonOperation = () => {
  const [showModal, setShowModal] = useState(false);
  const ref = useRef();
  return (
    <React.Fragment>
      <IconButton ref={ref} size="small" onClick={() => setShowModal(true)}>
        <AddIcon />
      </IconButton>
      <Popover
        open={showModal}
        onClose={() => setShowModal(false)}
        anchorEl={ref.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <JsonOperation onSubmit={() => setShowModal(false)} />
      </Popover>
    </React.Fragment>
  );
};

const traceSchema = yup.object().shape({
  from: yup.string(),
  query: yup.string(),
  date: yup.date(),
  tracing: yup.object().shape({
    duration: yup.number().required(),
    parsing: yup.object().shape({
      startOffset: yup.number(),
      duration: yup.number(),
    }),
    validation: yup.object().shape({
      startOffset: yup.number(),
      duration: yup.number(),
    }),
    execution: yup
      .object()
      .shape({
        resolvers: yup
          .array()
          .of(
            yup.object().shape({
              path: yup.array().required(),
              parentType: yup.string(),
              fieldName: yup.string(),
              returnType: yup.string(),
              startOffset: yup.number(),
              duration: yup.number(),
            })
          )
          .required(),
      })
      .required(),
  }),
});

const JsonContainer = styled.div`
  padding: 10px;
  min-width: 500px;
`;
const TextInput = styled(TextField)`
  width: 100%;
  textarea {
    font-size: xx-small;
  }
`;
const SubmitContainer = styled.div`
  margin-top: 5px;
  display: flex;
  justify-content: flex-end;
`;

const JsonOperation = ({ onSubmit }) => {
  const [api, setApi] = useState('manual');
  const [json, setJson] = useState('');
  const [jsonErr, setJsonErr] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!json) {
      return;
    }

    try {
      const parsed = JSON.parse(json);

      traceSchema
        .validate(parsed)
        .catch((err) => {
          setJsonErr({
            error: true,
            helperText: err.errors.join('\n'),
          });
        })
        .then((value) => {
          if (value) {
            setJsonErr(null);
          }
        });
    } catch (err) {
      setJsonErr({
        error: true,
        helperText: 'Could not parse json',
      });
    }
  }, [json]);

  return (
    <JsonContainer>
      <div>Add manual trace json</div>
      <div>
        <TextField
          label="Api"
          value={api}
          onChange={(e) => setApi(e.target.value)}
        />
      </div>
      <div>
        <TextInput
          label="JSON"
          value={json}
          onChange={(e) => setJson(e.target.value)}
          multiline
          {...jsonErr}
        />
      </div>
      <SubmitContainer>
        <Button
          disabled={!json || Boolean(jsonErr)}
          type="primary"
          onClick={() => {
            dispatch(
              addOperation({
                from: api,
                ...JSON.parse(json),
              })
            );
            onSubmit();
          }}
        >
          Add
        </Button>
      </SubmitContainer>
    </JsonContainer>
  );
};
