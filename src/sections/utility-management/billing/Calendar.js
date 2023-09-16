import React from 'react';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import CircleIcon from '@mui/icons-material/Circle';
import { Card } from '@mui/material';

const greenColor = '#4CAF50'; // Green for the checkmark
const redColor = '#FF5722'; // Red for the "X"
const greyColor = '#F0F0F0'; // Grey for the radio button

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Create custom icon components
const Check = () => <CheckIcon style={{ color: greenColor }} />;

const Missing = () => <ClearIcon style={{ color: redColor }} />;

const NA = () => <CircleIcon style={{ color: greyColor, fontSize: '12px' }} />;

const data = [
  {
    name: '3243873',
    Jan: <Check />,
    Feb: <Check />,
    Mar: <Check />,
    Apr: <Check />,
    May: <Check />,
    Jun: <Check />,
    Jul: <Check />,
    Aug: <Check />,
    Sep: <Check />,
    Oct: <NA />,
    Nov: <NA />,
    Dec: <NA />,
  },
  {
    name: '7375604',
    Jan: <Check />,
    Feb: <Check />,
    Mar: <Check />,
    Apr: <Check />,
    May: <Check />,
    Jun: <Check />,
    Jul: <Check />,
    Aug: <Check />,
    Sep: <Check />,
    Oct: <NA />,
    Nov: <NA />,
    Dec: <NA />,
  },
  {
    name: '6226435',
    Jan: <Check />,
    Feb: <Check />,
    Mar: <Check />,
    Apr: <Check />,
    May: <Check />,
    Jun: <Check />,
    Jul: <Check />,
    Aug: <Check />,
    Sep: <Missing />,
    Oct: <NA />,
    Nov: <NA />,
    Dec: <NA />,
  },
  {
    name: '4135423',
    Jan: <Check />,
    Feb: <Check />,
    Mar: <Check />,
    Apr: <Check />,
    May: <Check />,
    Jun: <Check />,
    Jul: <Check />,
    Aug: <Check />,
    Sep: <Missing />,
    Oct: <NA />,
    Nov: <NA />,
    Dec: <NA />,
  },
  {
    name: '3246173',
    Jan: <Check />,
    Feb: <Check />,
    Mar: <Check />,
    Apr: <Check />,
    May: <Check />,
    Jun: <Check />,
    Jul: <Check />,
    Aug: <Check />,
    Sep: <Check />,
    Oct: <NA />,
    Nov: <NA />,
    Dec: <NA />,
  },
  {
    name: '7375544',
    Jan: <Check />,
    Feb: <Check />,
    Mar: <Check />,
    Apr: <Check />,
    May: <Check />,
    Jun: <Check />,
    Jul: <Check />,
    Aug: <Check />,
    Sep: <Missing />,
    Oct: <NA />,
    Nov: <NA />,
    Dec: <NA />,
  },
  {
    name: '6256436',
    Jan: <Check />,
    Feb: <Check />,
    Mar: <Check />,
    Apr: <Check />,
    May: <Check />,
    Jun: <Check />,
    Jul: <Check />,
    Aug: <Check />,
    Sep: <Missing />,
    Oct: <NA />,
    Nov: <NA />,
    Dec: <NA />,
  },
  {
    name: '4535423',
    Jan: <Check />,
    Feb: <Check />,
    Mar: <Check />,
    Apr: <Check />,
    May: <Check />,
    Jun: <Check />,
    Jul: <Check />,
    Aug: <Check />,
    Sep: <Check />,
    Oct: <NA />,
    Nov: <NA />,
    Dec: <NA />,
  },
  {
    name: '3346873',
    Jan: <Check />,
    Feb: <Check />,
    Mar: <Check />,
    Apr: <Check />,
    May: <Check />,
    Jun: <Check />,
    Jul: <Check />,
    Aug: <Check />,
    Sep: <Check />,
    Oct: <NA />,
    Nov: <NA />,
    Dec: <NA />,
  },
  {
    name: '7378644',
    Jan: <Check />,
    Feb: <Check />,
    Mar: <Check />,
    Apr: <Check />,
    May: <Check />,
    Jun: <Check />,
    Jul: <Check />,
    Aug: <Check />,
    Sep: <Missing />,
    Oct: <NA />,
    Nov: <NA />,
    Dec: <NA />,
  },
  {
    name: '6256435',
    Jan: <Check />,
    Feb: <Check />,
    Mar: <Check />,
    Apr: <Check />,
    May: <Check />,
    Jun: <Check />,
    Jul: <Check />,
    Aug: <Check />,
    Sep: <Check />,
    Oct: <NA />,
    Nov: <NA />,
    Dec: <NA />,
  },

  // Add more data here for other individuals
];

export default function Calendar() {
  return (
    <Card sx={{ mt: 5 }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Meter</TableCell>
              {months.map((month) => (
                <TableCell align="center" key={month}>
                  {month}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.name}>
                <TableCell>{row.name}</TableCell>
                {months.map((month) => (
                  <TableCell align="center" key={month}>
                    {row[month]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
