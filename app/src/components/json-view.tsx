import Box from '@mui/material/Box';
import ReactJson from 'react-json-view';

export const sample_object = {
  x: 10,
  y: -20,
  booltrue: true,
  boolfalse: false,
  xstring: 'this is string',
  xdate: new Date(),
  xobject: {
    x: 5,
    y: -4,
    booltrue: true,
    boolfalse: false,
    xstring: 'this is obect string',
    xdate: new Date(),
    arrstring: ['tfirst', 'tsecond', 'tthird'],
    arrsnumber: [5, 4, 1],
  },
  arrstring: ['first', 'second', 'third'],
  arrsnumber: [5, 4, 1],
  arrObject: [
    {
      x: 10,
      y: -20,
      booltrue: true,
      boolfalse: false,
      xstring: 'this is first string',
      xdate: new Date(),
      arrstring: ['yfirst', 'ysecond', 'ythird'],
      arrsnumber: [5, 4, 1],
    },
    {
      x: -1,
      y: 20,
      booltrue: true,
      boolfalse: false,
      xstring: 'this is second string',
      xdate: new Date(),
      arrstring: ['xfirst', 'xsecond', 'xthird'],
      arrsnumber: [10, 30, 50],
    },
  ],
};

const JsonEditor = ({ src = sample_object }: { src?: any }) => {
  return (
    <Box border="1px solid lightgray" borderRadius={2} p={1}>
      <ReactJson src={src} />
    </Box>
  );
};

export default JsonEditor;
