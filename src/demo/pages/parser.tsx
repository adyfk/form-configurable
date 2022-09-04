import { expressionToValue } from 'gateway';
import { useEffect, useState } from 'react';
import JsonView, { sample_object } from '../components/json-view';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Divider from '@mui/material/Divider';
import formuleDesc from '../data/formula-desc.json';

function ParserDescribe() {
  const [groupList, setGroupList] = useState<Record<string, any[]>>({});

  useEffect(() => {
    setGroupList(
      formuleDesc.reduce(function (acc, item) {
        if (!acc[item.fix]) {
          acc[item.fix] = [item];
        } else {
          acc[item.fix].push(item);
        }

        return acc;
      }, {} as Record<string, any[]>)
    );
  }, []);

  return (
    <>
      {Object.keys(groupList).map((group) => {
        return (
          <Box
            key={group}
            mb={2}
            sx={{ border: '1px solid lightgray', p: 1, borderRadius: 2 }}
          >
            <Typography
              sx={{ textTransform: 'capitalize' }}
              variant="h6"
              fontWeight={500}
              mb={1}
            >
              {group}
            </Typography>
            {groupList[group]?.map((item) => {
              return (
                <Accordion key={item.op}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>{item.op}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography mb={1} variant="caption" color="gray">
                      {item.sig.join(', ')}
                    </Typography>
                    <Typography>{item.text}</Typography>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Box>
        );
      })}
    </>
  );
}

const ParserTester = () => {
  const [value, setValue] = useState('');
  const [result, setResult] = useState<any>();

  const actionParser = () => {
    try {
      const result = expressionToValue(value, sample_object);
      setResult(result);
    } catch (error) {
      setResult('error-parser');
    }
  };

  useEffect(() => {
    actionParser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const renderType = () => {
    if (result instanceof Date) {
      return result.toISOString();
    } else if (typeof result === 'object') {
      return JSON.stringify(result);
    } else if (typeof result === 'boolean') {
      return `${result}`;
    }
    return result;
  };

  return (
    <>
      <Typography variant="h5" fontWeight={600} mb={2}>
        Expression & Result
      </Typography>
      <TextField
        fullWidth
        label="Expression"
        onChange={(e) => setValue(e.target.value)}
        value={value}
      />
      <Box mt={2} border="1px solid lightgray" p={2}>
        <Typography mb={2}>DataType Result : {typeof result}</Typography>
        <Typography mb={2}>Result :</Typography>
        {renderType()}
      </Box>
    </>
  );
};

const ParserDemo = () => {
  return (
    <Box height={'calc(100vh - 100vh)'}>
      <Grid container spacing={2}>
        <Grid item lg md sm xs>
          <Typography variant="h5" fontWeight={600} mb={2}>
            Object Data
          </Typography>
          <JsonView />
        </Grid>
        <Grid item lg md sm xs>
          <ParserTester />
          <Box my={5}>
            <Divider />
          </Box>
          <Typography variant="h5" fontWeight={600} mb={2}>
            Documentation
          </Typography>
          <ParserDescribe />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ParserDemo;
