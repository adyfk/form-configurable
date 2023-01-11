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
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  Checkbox,
  Radio,
  RadioGroup,
} from '@mui/material';
import InputCurrency from '../../components/input-currency';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

const FieldGroup: GroupType = ({ config, form, child: Child }) => {
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

const FieldView: ViewType = ({ config, form }) => {
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
  const { value, error, touched, onChange } = useField({ config });
  if (config.fieldType !== 'TEXT') return null;

  if (config.valueType === 'NUMBER') {
    return (
      <Grid item xs={12}>
        <TextField
          fullWidth
          size="small"
          label={config.meta?.label}
          value={value}
          onChange={onChange}
          InputProps={{
            inputComponent: InputCurrency as any,
          }}
          error={touched && !!error}
          helperText={touched && error}
        ></TextField>
      </Grid>
    );
  }

  return (
    <Grid item xs={12}>
      <TextField
        fullWidth
        size="small"
        label={config.meta?.label}
        value={value || null}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        error={touched && !!error}
        helperText={touched && error}
      ></TextField>
    </Grid>
  );
};

const FieldDate: FC<{
  config: SchemaFieldType;
}> = ({ config }) => {
  const { value, error, touched, onChange } = useField({ config });
  if (config.fieldType !== 'DATE') return null;

  return (
    <Grid item xs={12}>
      <DesktopDatePicker
        label={config.meta?.label}
        inputFormat={config.meta?.format}
        value={value || null}
        onChange={(date) => {
          if (date && date?.isValid()) {
            onChange(date.toISOString());
          } else {
            onChange('');
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
            fullWidth
            error={touched && !!error}
            helperText={touched && error}
          />
        )}
      />
    </Grid>
  );
};

const FieldDropdown: FC<{
  config: SchemaFieldType;
}> = ({ config }) => {
  const { value, error, touched, onChange } = useField({ config });
  if (config.fieldType !== 'DROPDOWN') return null;

  return (
    <Grid item xs={12}>
      <FormControl fullWidth error={!!(touched && error)}>
        <Select
          size="small"
          value={value?.value}
          displayEmpty
          renderValue={(selected) => {
            if (!selected) {
              return <em>Placeholder</em>;
            }
            return selected;
          }}
        >
          {config.meta?.options.map((option) => {
            return (
              <MenuItem
                key={option.value}
                value={option.value}
                onClick={() => onChange(option)}
              >
                {option.label}
              </MenuItem>
            );
          })}
        </Select>
        <FormHelperText>{error}</FormHelperText>
      </FormControl>
    </Grid>
  );
};

interface IOption {
  label: any;
  value: any;
}

const FieldCheckbox: FC<{
  config: SchemaFieldType;
}> = ({ config }) => {
  const { value, error, touched, onChange } = useField({ config });
  if (config.fieldType !== 'CHECKBOX') return null;

  const onChangeCheckbox = (indexSelected: number, option: IOption) => {
    if (indexSelected >= 0) {
      const tempValue = [...value];
      tempValue.splice(indexSelected, 1);
      onChange(tempValue);
    } else {
      onChange([...value, option]);
    }
  };

  return (
    <Grid item xs={12}>
      <FormControl
        fullWidth
        error={!!(touched && error)}
        component="fieldset"
        variant="standard"
      >
        <FormLabel component="legend">{config.meta?.label}</FormLabel>

        {config.meta?.options.map((option) => {
          const indexOfChecked = (value as any[])?.findIndex(
            (selectedOption: IOption) => selectedOption.value === option.value
          );

          const checked = indexOfChecked >= 0;
          return (
            <FormControlLabel
              key={option.value}
              control={
                <Checkbox
                  size="small"
                  checked={checked}
                  onChange={() => onChangeCheckbox(indexOfChecked, option)}
                  name={`${option.value}`}
                />
              }
              label={config.meta?.label}
            />
          );
        })}
        <FormHelperText>{error}</FormHelperText>
      </FormControl>
    </Grid>
  );
};

const FieldRadio: FC<{
  config: SchemaFieldType;
}> = ({ config }) => {
  const { value, error, touched, onChange } = useField({ config });
  if (config.fieldType !== 'RADIO') return null;

  return (
    <Grid item xs={12}>
      <FormControl error={!!(touched && error)} variant="standard">
        <FormLabel>{config.meta?.label}</FormLabel>
        <RadioGroup row={config.meta?.row}>
          {config.meta?.options.map((option) => {
            return (
              <FormControlLabel
                key={option.value}
                onChange={() => onChange(option)}
                control={<Radio size="small" />}
                checked={option.value === value?.value}
                label={option.label}
              />
            );
          })}
        </RadioGroup>
        <FormHelperText>{touched && error}</FormHelperText>
      </FormControl>
    </Grid>
  );
};

const FormFieldContainer: FieldType = ({ config }) => {
  if (config.fieldType === 'TEXT') {
    return <FieldText config={config} />;
  } else if (config.fieldType === 'DATE') {
    return <FieldDate config={config} />;
  } else if (config.fieldType === 'DROPDOWN') {
    return <FieldDropdown config={config} />;
  } else if (config.fieldType === 'CHECKBOX') {
    return <FieldCheckbox config={config} />;
  } else if (config.fieldType === 'RADIO') {
    return <FieldRadio config={config} />;
  } else if (config.fieldType === 'TEXTAREA') {
    return <></>;
  } else if (config.fieldType === 'WYSWYG') {
    return <></>;
  } else if (config.fieldType === 'FILE') {
    return <></>;
  } else if (config.fieldType === 'CUSTOM') {
    return <></>;
  }

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
        <Grid container spacing={2}>
          <FormContext.Provider value={context}>
            <FormConfigurable
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
          </FormContext.Provider>
        </Grid>
      </form>
    </Box>
  );
};

export default FormExample;
