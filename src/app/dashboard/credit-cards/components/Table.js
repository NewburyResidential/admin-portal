'use client'
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
  Button,
  TextField,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import GLDropDown from './GLDropDown';
import AssetDropDown from './AssetDropDown';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import AltRouteIcon from '@mui/icons-material/AltRoute';

import AddIcon from '@mui/icons-material/Add';
import Iconify from 'src/components/iconify/iconify';

// Example data
const rows = [
  { id: 1, date: '11/29', description: 'Starbucks', cardAccount: 'Brian', glAccount: '5678', amount: 100 },
  { id: 2, date: '11/22', description: 'Priceline', cardAccount: 'Brian', glAccount: '6789', amount: 200 },
  { id: 3, date: '09/11', description: 'Amazon', cardAccount: 'Tom', glAccount: '7890', amount: 300 },
  { id: 4, date: '08/10', description: 'Logan Parking', cardAccount: 'Mike', glAccount: '8901', amount: 400 },
];

export default function CustomTable({vendors, chartOfAccounts}) {
  console.log(chartOfAccounts)
  console.log(vendors)
  //console.log(vendors.response.result.Locations.Location)
  //const objectWithLocations = vendors.response.result.Locations.Location
  //console.log(Object.keys(objectWithLocations).length); 

  // Function to render edit button
  const renderEditButton = () => <Button variant="outlined">Split</Button>;

  return (
    <TableContainer component={Paper}>
      <Table aria-label="customized table">
      <TableBody>
  {rows.map((row, index) => (
    <React.Fragment key={row.id}>
         <TableRow style={{ backgroundColor: index % 2 !== 342 ? '#f0f0f0' : '#f0f0f0' }}>
        <TableCell padding="checkbox">
          <Checkbox />
        </TableCell>
        <TableCell align="center">{row.date}</TableCell>
        <TableCell align="center">{row.cardAccount}</TableCell>
        <TableCell align="center">{row.description}</TableCell>

        <TableCell align="center"></TableCell> 
        <TableCell align="center">
      <IconButton>
        <AddAPhotoIcon />
      </IconButton>
        </TableCell>
      </TableRow>
      <TableRow style={{ backgroundColor: index % 2 === 0 ? '#FAFBFC' : '#FAFBFC' }}>
        {/* Indent this cell to the right */}
        <TableCell padding="checkbox" style={{ paddingLeft: '32px' }}>
          <IconButton>
          <Iconify icon="material-symbols:arrow-split-rounded" />
          </IconButton>
        </TableCell>
        <TableCell colSpan={2} sx={{ width: '30%' }}>
          <TextField fullWidth id="notes-input" label="Notes" variant="outlined" />
        </TableCell>
        <TableCell sx={{ width: '30%' }}>
          <AssetDropDown />
        </TableCell>
        <TableCell sx={{ width: '30%' }}>
          <GLDropDown />
        </TableCell>
        <TableCell sx={{ width: '10%' }}>
          <TextField
            value={`$${row.amount}`}
            disabled
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
          />
        </TableCell>
      </TableRow>
    </React.Fragment>
  ))}
</TableBody>


       
      </Table>
    </TableContainer>
  );
}
