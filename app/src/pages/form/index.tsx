import Box from "@mui/material/Box";
import type { Schema } from "form-configurable";
import { useState } from "react";
import Form from "./FormContainer";
import JsonSchema from "./schema";

function FormDemo() {
  const [config, setConfig] = useState<{
    schema: Schema[];
  }>({
    schema: [],
  });

  return (
    <Box display={"flex"} gap={2}>
      <Box flexGrow={1} width="50%">
        <JsonSchema onLoad={setConfig} />
      </Box>
      <Box flexGrow={1} width="50%">
        <Form config={config} />
      </Box>
    </Box>
  );
}

export default FormDemo;
