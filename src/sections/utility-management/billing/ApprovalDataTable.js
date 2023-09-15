import { useState, useMemo } from 'react';
import Link from 'next/link';

import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import Toolbar from '@mui/material/Toolbar';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import Iconify from 'src/components/iconify';

function stableSort(array) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  return stabilizedThis.map((el) => el[0]);
}

function HeadLabels({ cellWidth }) {
  const headCells = [
    { id: 'utilityType', label: 'Utility Type' },
    { id: 'meterNumber', label: 'Meter Number' },
    { id: 'serviceStart', label: 'Service Start' },
    { id: 'serviceEnd', label: 'Service End' },
    { id: 'amount', label: 'Amount' },
    { id: 'tax', label: 'Tax' },
    // { id: 'totalAmount', label: 'Total Amount' },
  ];

  return (
    <Table sx={{ width: '100%' }}>
      <TableRow
        sx={{
          bgcolor: (theme) => {
            return theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[700];
          },
        }}
      >
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} sx={{ width: `${cellWidth}%` }} align="center">
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </Table>
  );
}

function TableToolbar(props) {
  const { numSelected, rowCount, onSelectAllClick, onRemoveAllClick } = props;
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      <Checkbox
        color="primary"
        indeterminate={numSelected > 0 && numSelected < rowCount}
        checked={rowCount > 0 && numSelected === rowCount}
        onChange={onSelectAllClick}
        inputProps={{ 'aria-label': 'select all invoices' }}
        sx={{ marginRight: 1 }}
      />
      <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
        {numSelected} selected
      </Typography>
    </Toolbar>
  );
}

export default function ApprovalDataTable({ rows }) {
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const cellWidth = 100 / 6;

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((r) => r.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };
  const onRemoveAllClick = () => {
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const isSelected = (name) => selected.indexOf(name) !== -1;

  const visibleRows = useMemo(
    () => stableSort(rows).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [page, rowsPerPage]
  );

  return (
    <Box>
      <TableToolbar
        numSelected={selected.length}
        onSelectAllClick={handleSelectAllClick}
        rowCount={rows.length}
        onRemoveAllClick={onRemoveAllClick}
      />
      <HeadLabels cellWidth={cellWidth} />
      <TableContainer sx={{ maxHeight: '52vh', overflow: 'auto' }}>
        <Table aria-labelledby="tableTitle">
          <TableBody>
            {visibleRows.map((invoice, index) => {
              const isItemSelected = isSelected(invoice.id);
              const labelId = `table-checkbox-${invoice.id}`;
              return (
                <>
                  <TableRow key={invoice.id} selected={isItemSelected}>
                    <TableCell padding="checkbox" style={{ padding: '16px 8px' }}>
                      <Checkbox
                        color="primary"
                        onClick={(event) => handleClick(event, invoice.id)}
                        checked={isItemSelected}
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell id={labelId} align="center">
                      <Typography variant="body2" fontWeight={600}>
                        ID: {invoice.id}
                      </Typography>
                    </TableCell>
                    <TableCell id={labelId} align="center">
                      <Typography variant="body2" fontWeight={300}>
                        Due: September 30, 2021
                      </Typography>
                    </TableCell>
                    <TableCell id={labelId}>
                      <Typography variant="body2" fontWeight={300} align="center">
                        Address: 4 Cranberry Lane Lynnfiled
                      </Typography>
                    </TableCell>
                    <TableCell id={labelId}>
                      <Typography variant="body2" fontWeight={300} align="center">
                        Code: 2100 SpringPort Apartments
                      </Typography>
                    </TableCell>

                    <TableCell id={labelId} align="right">
                      <Link href={`fjdals`} target="_blank">
                        <IconButton>
                          <Iconify icon="solar:bill-list-linear" />
                        </IconButton>
                      </Link>
                    </TableCell>
                  </TableRow>
                  {invoice.bills.map((bill) => (
                    <TableRow selected={isItemSelected}>
                      <TableCell colSpan={6} style={{ padding: '4px 0px' }}>
                        <Table size="small" aria-label="utility">
                          <TableBody>
                            <TableRow key={'4'}>
                              <TableCell sx={{ width: `${cellWidth}%` }} align="center">
                                {bill.utilityType}
                              </TableCell>
                              <TableCell sx={{ width: `${cellWidth}%` }} align="center">
                                {bill.meterNumber}
                              </TableCell>
                              <TableCell sx={{ width: `${cellWidth}%` }} align="center">
                                {bill.serviceStart}
                              </TableCell>
                              <TableCell sx={{ width: `${cellWidth}%` }} align="center">
                                {bill.serviceEnd}
                              </TableCell>
                              <TableCell sx={{ width: `${cellWidth}%` }} align="center">
                                {bill.amount}
                              </TableCell>
                              <TableCell sx={{ width: `${cellWidth}%` }} align="center">
                                {bill.tax}
                              </TableCell>
                              {/* <TableCell align="center">{bill.totalAmount}</TableCell> */}
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
      />
    </Box>
  );
}
