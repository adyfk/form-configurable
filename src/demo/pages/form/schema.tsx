import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import JsonEditor from '../../components/json-editor';
import { useState } from 'react';
import schema from './data-demo.json';
// import { FieldType, ValueType } from 'gateway';

function JsonSchema({ onLoad }: { onLoad: any }) {
  const [value, setValue] = useState({
    extraData: {},
    schema,
  });

  return (
    <>
      <Box
        display={'flex'}
        justifyContent="space-between"
        alignItems={'center'}
      >
        <Typography py={2}>Object Schema</Typography>
        <Button onClick={() => onLoad(value)} variant="outlined" size="small">
          Implement To Form
        </Button>
      </Box>
      <JsonEditor value={value} onChange={setValue} />
    </>
  );
}

export default JsonSchema;
