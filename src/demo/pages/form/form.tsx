import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { FieldProps, useField, useForm } from 'client';
import { transform } from 'client/transform';
import { FieldType } from 'gateway';

function Field({ name, control, field }: FieldProps) {
  const { meta, fieldName, fieldType, valueType } = field;

  const { value, touched, error, editable, show, onChange, onBlur } = useField({
    control,
    name,
  });
  if (!show) return <></>;

  if (fieldType === FieldType.TEXT) {
    const onChangeField = (value: any) => {
      const result = transform[valueType](value);
      onChange(result);
    };

    return (
      <Box key={fieldName}>
        <TextField
          fullWidth
          disabled={!editable}
          onBlur={onBlur}
          onChange={(e) => onChangeField(e.target.value)}
          label={meta.label}
          value={value}
          helperText={touched && error}
        />
      </Box>
    );
  }
  return <>Custom Field Field</>;
}

function Form({ config }: any) {
  const { control, fields, formState, handleSubmit } = useForm({
    schema: config.schema,
    extraData: config.extraData,
  });

  const onSubmit = (...args: any) => console.log('submit', ...args);
  const onSubmitInvalid = (...args: any) => console.log('invalid', ...args);

  return (
    <form onSubmit={handleSubmit(onSubmit, onSubmitInvalid)}>
      <Typography py={2}>Form Schema</Typography>
      <Grid container gap={2} width={500}>
        {fields.map((field) => {
          return (
            <Grid key={field.fieldName} item lg={12} md={12}>
              <Field control={control} name={field.fieldName} field={field} />
            </Grid>
          );
        })}
        <Grid item xs={12} textAlign="center">
          <Button
            disabled={formState.isSubmitting}
            type="submit"
            variant="outlined"
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default Form;
