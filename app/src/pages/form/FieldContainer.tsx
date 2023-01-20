/* eslint-disable array-callback-return */
import { FC } from 'react';

import {
  SchemaField,
  useField,
  SchemaFieldText,
  SchemaFieldDate,
  SchemaFieldFile,
  SchemaFieldCheckbox,
  SchemaFieldDropdown,
  SchemaFieldRadio
} from 'form-configurable';
import {
  FieldProps,
} from 'form-configurable/FormConfigurable';
import {
  FormSyncReactHookForm,
  resolverMiddleware,
} from 'form-configurable/useSubmitMiddleware';
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
  FormGroup,
} from '@mui/material';
import { Controller, useForm as useFormHook } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import InputCurrency from '../../components/input-currency';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import * as yup from 'yup';
import { DevTool } from '@hookform/devtools';

function guidGenerator() {
  var S4 =  () => {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (
    S4() +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    S4() +
    S4()
  );
}


const mockUploadFile = ({
  onProgress,
  onSuccess,
}: {
  onProgress: any;
  onSuccess: any;
}) => {
  let total = 0;

  const callback = setInterval(() => {
    total += 100;
    onProgress(total);

    if (total >= 1000) {
      onSuccess();
      clearInterval(callback);
    }
  }, 500);
};

const FieldFile: FC<{
  config: SchemaFieldFile;
}> = ({ config }) => {
  const {
    form,
    value,
    error,
    touched,
    fieldState: { show, editable },
    onChange,
  } = useField({
    config,
  });

  if (!show) return <></>;

  const uploadFile = (enqueFile: any) => {
    const { fileId } = enqueFile;
    try {
      mockUploadFile({
        onProgress: (progress: number) => {
          const pureValue = [...form.values[config.fieldName]];
          const foundIndex = pureValue.findIndex(
            (file) => file.fileId === fileId
          );
          pureValue[foundIndex] = { ...pureValue[foundIndex], progress };
          onChange(pureValue);
        },
        onSuccess: () => {
          const pureValue = [...form.values[config.fieldName]];
          const foundIndex = pureValue.findIndex(
            (file) => file.fileId === fileId
          );
          pureValue[foundIndex] = {
            fileId,
            fileName: `Has Uploaded ${fileId}`,
          };
          onChange(pureValue);
        },
      });
    } catch (error) {}
  };

  const onSelectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files as FileList;
    const registeredFiles = [];

    for (let index = 0; index < files.length; index++) {
      const file = files.item(index);
      registeredFiles.push({
        fileId: guidGenerator(),
        fileName: file?.name,
        file,
      });
    }

    onChange(registeredFiles);

    for (let index = 0; index < registeredFiles.length; index++) {
      const file = registeredFiles[index];
      uploadFile(file);
    }

    e.target.value = '';
  };

  return (
    <Grid item {...(config.style?.container as any)}>
      <FormControl error={touched && error}>
        <Typography>FILES</Typography>
        <Button disabled={!editable} variant="contained" component="label">
          Upload
          <input
            onChange={onSelectFiles}
            hidden
            accept="image/*"
            multiple
            type="file"
          />
        </Button>
        {value?.map((file: any) => {
          return (
            <div key={file?.fileId}>
              <Typography>{file?.fileId}</Typography>
              <Typography>{file?.progress}</Typography>
              <Typography>{file?.fileName}</Typography>
            </div>
          );
        })}
        <FormHelperText>{touched && error}</FormHelperText>
      </FormControl>
    </Grid>
  );
};

const schema = yup
  .object({
    firstname: yup.string().required(),
    lastname: yup.string().required(),
  })
  .required();

const FieldCustom: FC<{
  config: SchemaField;
}> = ({ config }) => {
  const { form, value } = useField({ config });
  const action = useFormHook({
    resolver: resolverMiddleware({
      resolver: yupResolver(schema),
      form,
    }),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: value,
    shouldFocusError: true,
  });

  const { control, handleSubmit } = action;

  return (
    <Grid item {...(config.style?.container as any)}>
      <FormSyncReactHookForm config={config} form={form} action={action} />
      <DevTool control={control} />
      <Box p={2} border="1px solid lightgray" borderRadius={2}>
        <Typography>
          Sub Form Complex{' '}
          <Button
            onClick={handleSubmit(
              (values) => {
                console.log('valid', values);
              },
              (values) => {
                console.log('invalid', values);
              }
            )}
          >
            Validate Local
          </Button>
        </Typography>
        <Box mt={1} display={'flex'} flexDirection={'column'} gap={2}>
          <Controller
            name={'firstname'}
            control={control}
            render={({ field, fieldState }) => {
              return (
                <TextField
                  fullWidth
                  size="small"
                  label="firstname"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  {...field}
                />
              );
            }}
          ></Controller>
          <Controller
            name={'lastname'}
            control={control}
            render={({ field, fieldState }) => {
              return (
                <TextField
                  fullWidth
                  size="small"
                  label="lastname"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  {...field}
                />
              );
            }}
          ></Controller>
        </Box>
      </Box>
    </Grid>
  );
};

const FieldText: FC<{
    config: SchemaFieldText;
  }> = ({ config }) => {
    const {
      value,
      error,
      touched,
      fieldState: { editable, show },
      onChange,
    } = useField({
      config,
    });
  
    if (!show) return <></>;
  
    if (config.valueType === 'NUMBER') {
      return (
        <Grid item {...(config.style?.container as any)}>
          <TextField
            fullWidth
            disabled={!editable}
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
      <Grid item {...(config.style?.container as any)}>
        <TextField
          fullWidth
          disabled={!editable}
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
    config: SchemaFieldDate;
  }> = ({ config }) => {
    const {
      value,
      error,
      touched,
      fieldState: { show, editable },
      onChange,
    } = useField({
      config,
    });
  
    if (!show) return <></>;
  
    return (
      <Grid item {...(config.style?.container as any)}>
        <DesktopDatePicker
          disabled={!editable}
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
    config: SchemaFieldDropdown;
  }> = ({ config }) => {
    const {
      value,
      error,
      touched,
      fieldState: { show, editable },
      onChange,
    } = useField({
      config,
    });
  
    if (!show) return <></>;
  
    return (
      <Grid item {...(config.style?.container as any)}>
        <FormControl fullWidth error={!!(touched && error)}>
          <Select
            size="small"
            disabled={!editable}
            value={value?.value}
            displayEmpty
            renderValue={(selected) => {
              if (!selected) {
                return <em>Placeholder</em>;
              }
              return selected;
            }}
          >
            {config.meta?.options.map((option:any) => {
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
          <FormHelperText>{touched && error}</FormHelperText>
        </FormControl>
      </Grid>
    );
  };
  
  interface IOption {
    label: any;
    value: any;
  }
  
  const FieldCheckbox: FC<{
    config: SchemaFieldCheckbox;
  }> = ({ config }) => {
    const {
      value,
      error,
      touched,
      fieldState: { show, editable },
      onChange,
    } = useField({
      config,
    });
  
    const onChangeCheckbox = (indexSelected: number, option: IOption) => {
      if (indexSelected >= 0) {
        const tempValue = [...value];
        tempValue.splice(indexSelected, 1);
        onChange(tempValue);
      } else {
        onChange([...value, option]);
      }
    };
  
    if (!show) return <></>;
  
    return (
      <Grid item {...(config.style?.container as any)}>
        <FormControl
          fullWidth
          error={!!(touched && error)}
          component="fieldset"
          variant="standard"
        >
          <FormLabel component="legend">{config.meta?.label}</FormLabel>
          <FormGroup>
            {config.meta?.options.map((option:any) => {
              const indexOfChecked = (value as any[])?.findIndex(
                (selectedOption: IOption) => selectedOption.value === option.value
              );
  
              const checked = indexOfChecked >= 0;
              return (
                <FormControlLabel
                  key={option.value}
                  disabled={!editable}
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
          </FormGroup>
          <FormHelperText>{touched && error}</FormHelperText>
        </FormControl>
      </Grid>
    );
  };
  
  const FieldRadio: FC<{
    config: SchemaFieldRadio;
  }> = ({ config }) => {
    const {
      value,
      error,
      touched,
      fieldState: { show, editable },
      onChange,
    } = useField({
      config,
    });
  
    if (!show) return <></>;
  
    return (
      <Grid item {...(config.style?.container as any)}>
        <FormControl error={!!(touched && error)} variant="standard">
          <FormLabel>{config.meta?.label}</FormLabel>
          <RadioGroup row={config.meta?.row}>
            {config.meta?.options.map((option: any) => {
              return (
                <FormControlLabel
                  key={option.value}
                  disabled={!editable}
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
  

  const FormFieldContainer: FieldProps = ({ config }) => {
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
      return <FieldFile config={config}></FieldFile>;
    } else if (config.fieldType === 'CUSTOM') {
      return <FieldCustom config={config} />;
    }
  
    return <></>;
  };

  export default FormFieldContainer;