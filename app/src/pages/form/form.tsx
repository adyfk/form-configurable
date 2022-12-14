/* eslint-disable array-callback-return */
import { FC } from 'react';

import {
  Schema,
  useForm,
  SchemaFieldType,
  useField,
  useView,
  FormContext,
} from 'form-configurable';
import FormConfigurable, {
  GroupType,
  ViewType,
  FieldType,
} from 'form-configurable/FormConfigurable';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { transformToNumber } from '../../utils/number';

const FormGroup: GroupType = ({ config, form, child: Child }) => {
  const { show } = useView({ config, form });

  if (!show) return <></>;

  return (
    <Grid
      item
      xs={12}
      sx={{ border: '1px solid lightgray', borderRadius: 5, px: 2, py: 1 }}
    >
      <Typography mb={2} variant="h6" fontWeight={700}>
        {config.meta.title}
        <Typography variant="caption">{config.meta.subtitle}</Typography>
      </Typography>
      <Child />
    </Grid>
  );
};

const FormView: ViewType = ({ config, form }) => {
  const { show } = useView({ config, form });

  if (!show) return <></>;

  return (
    <Grid item xs={12}>
      <Typography variant="h6">
        {config.meta.title}
        <Typography variant="caption">{config.meta.subtitle}</Typography>
      </Typography>
    </Grid>
  );
};

const FieldText: FC<{
  config: SchemaFieldType;
}> = ({ config }) => {
  const { value, error, onChange } = useField({ config });

  if (config.variant !== 'FIELD' || config.fieldType !== 'TEXT') return null;

  return (
    <Grid item xs={12}>
      <TextField
        fullWidth
        size="small"
        label={config.meta?.label}
        value={value}
        onChange={(e) => {
          if (config.valueType === 'NUMBER') {
            onChange(transformToNumber(e.target.value));
          } else {
            onChange(e.target.value);
          }
        }}
        error={!!error}
        helperText={error}
      ></TextField>
    </Grid>
  );
};

const FormFieldContainer: FieldType = ({ config }) => {
  if (config.fieldType === 'TEXT') {
    return <FieldText config={config} />;
  }

  if (config.fieldType === 'CHECKBOX') return <>x</>;

  return <></>;
};

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
          <FormConfigurable
            Group={FormGroup}
            View={FormView}
            Field={FormFieldContainer}
            schema={schema}
            form={form}
          />
          <Box display={'flex'} justifyContent="center" mt={2}>
            <Button variant="contained" type="submit">
              Save
            </Button>
          </Box>
        </FormContext.Provider>
      </form>
    </Box>
  );
};

export default FormExample;
