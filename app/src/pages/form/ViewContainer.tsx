import { Grid, Typography } from "@mui/material";
import { ViewProps } from "form-configurable/FormContainer";
import { useView } from "form-configurable";

export const FieldView: ViewProps = ({ config, form }) => {
  const { viewState } = useView({ config, form });

  if (!viewState.show) return <></>;

  return (
    <Grid item {...(config.style?.container as any)}>
      <Typography variant="h6">
        {config?.meta?.title}
        <Typography variant="caption">{config?.meta?.subtitle}</Typography>
      </Typography>
    </Grid>
  );
};

export const ViewContainer = () => {};

export default ViewContainer;
