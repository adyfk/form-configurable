import { FieldArrayProps } from "form-configurable/FormContainer";
import { useField } from "form-configurable";
import { Grid } from "@mui/material";

export const FieldArray: FieldArrayProps = ({ child: Child, config }) => {
  const { value } = useField({ config });

  return (
    <Grid item {...(config.style?.container as any)}>
      FieldArray
      <Grid container spacing={2}>
        <Child
          value={value}
          container={(props: any) => {
            return (
              <Grid item container {...props} spacing={2}>
                {props.children}
              </Grid>
            );
          }}
        />
      </Grid>
    </Grid>
  );
};

export const FieldArrayContainer = () => <>Field Array Container</>;

export default FieldArrayContainer;
