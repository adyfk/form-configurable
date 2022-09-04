import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { useField } from '../../client';
import useFormTest from '../useFormTest';
import { FieldProps } from '../../client';
import { FieldType } from '../../gateway/field';
import { transform } from '../../client/transform';

function Field({ name, control, field }: FieldProps) {
  const { meta, fieldName, fieldType, valueType } = field;

  const { value, touched, error, disabled, hidden, onChange, onBlur } =
    useField({
      control,
      name,
    });

  if (hidden) return <></>;

  if (fieldType === FieldType.TEXT) {
    const onChangeField = (value: any) => {
      const result = transform[valueType](value);
      onChange(result);
    };

    return (
      <Box key={fieldName}>
        <TextField
          fullWidth
          disabled={disabled}
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
function FormDemo() {
  const { control, fields, formState, handleSubmit } = useFormTest();

  const onSubmit = (...args: any) => console.log('submit', ...args);
  const onSubmitInvalid = (...args: any) => console.log('invalid', ...args);

  return (
    <Box display={'flex'} justifyContent="center">
      <form onSubmit={handleSubmit(onSubmit, onSubmitInvalid)}>
        <Typography py={2}>Demo Form Schema</Typography>
        <Grid container gap={2} width={500}>
          <Grid item xs={12} textAlign="center">
            <Button
              disabled={formState.isSubmitting}
              type="submit"
              variant="outlined"
            >
              Submit
            </Button>
          </Grid>
          {fields.map((field) => {
            return (
              <Grid key={field.fieldName} item lg={12} md={12}>
                <Field control={control} name={field.fieldName} field={field} />
              </Grid>
            );
          })}
        </Grid>
      </form>
    </Box>
  );
}

export default FormDemo;
