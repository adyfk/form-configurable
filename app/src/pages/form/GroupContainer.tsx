import { Grid, Typography } from "@mui/material";
import { GroupProps } from "form-configurable/FormContainer";
import { useView } from "form-configurable";

export const FieldGroup: GroupProps = ({ config, form, child: Child }) => {
  const { viewState } = useView({ config, form });

  if (!viewState.show) return <></>;

  return (
    <Grid item {...(config.style?.container as any)}>
      <Typography mb={2} variant="h6" fontWeight={700}>
        {config.meta.title}
        <Typography variant="caption">{config.meta.subtitle}</Typography>
      </Typography>
      <Child />
    </Grid>
  );
};

const GroupContainer = () => {
  return <div>GroupContainer</div>;
};

export default GroupContainer;
