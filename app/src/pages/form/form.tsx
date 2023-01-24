/* eslint-disable array-callback-return */
import { FC } from 'react';

import {
  Schema,
  useForm,
  FormContext,
} from 'form-configurable';
import FormContainer from 'form-configurable/FormContainer';
import {
  withSubmitMiddleware,
} from 'form-configurable/useSubmitMiddleware';
import {
  Box,
  Button,
  Grid,
} from '@mui/material';
import FormFieldContainer from './FieldContainer';
import { FieldGroup } from './GroupContainer';
import { FieldView } from './ViewContainer';

const FormExample: FC<{
  config: {
    schema: Schema[];
  };
}> = (props) => {
  const context = useForm(props.config);

  const { schema, form, handleSubmit } = context;
  return (
    <Box>
      <form onSubmit={handleSubmit(console.log, console.error)}>
        <FormContext.Provider value={context}>
          <Grid container spacing={2}>
            <FormContainer
              Group={FieldGroup}
              View={FieldView}
              Field={FormFieldContainer}
              schema={schema}
              form={form}
            />
            <Grid item xs={12}>
              <Button variant="contained" type="submit" fullWidth>
                Save
              </Button>
            </Grid>
          </Grid>
        </FormContext.Provider>
      </form>
    </Box>
  );
};

export default withSubmitMiddleware(FormExample, { order: 'before' });
