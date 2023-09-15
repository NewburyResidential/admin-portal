import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';

function stableSort(array) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  console.log(stabilizedThis);
  return stabilizedThis.map((el) => el[0]);
}

// const headCells = [
//   { id: 'utilityType', label: 'Utility Type' },
//   { id: 'meterNumber', label: 'Meter Number' },
//   { id: 'serviceStart', label: 'Service Start' },
//   { id: 'serviceEnd', label: 'Service End' },
//   { id: 'amount', label: 'Amount' },
//   { id: 'tax', label: 'Tax' },
//   { id: 'totalAmount', label: 'Total Amount' },
// ];

function EnhancedTableToolbar(props) {
  const { numSelected, rowCount, onSelectAllClick } = props;

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
        inputProps={{
          'aria-label': 'select all desserts',
        }}
        sx={{ marginRight: 1 }}
      />
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
          Approval
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : null}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable({ rows }) {
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((r) => r.id);
      setSelected(newSelected);
      return;
    }
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

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () => stableSort(rows).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [page, rowsPerPage]
  );

  console.log(visibleRows);

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          onSelectAllClick={handleSelectAllClick}
          rowCount={rows.length}
        />
        {/* <EnhancedTableHead
              numSelected={selected.length}
              onSelectAllClick={handleSelectAllClick}
              rowCount={rows.length}
            /> */}
        <TableContainer sx={{ maxHeight: 600, overflow: 'auto' }}>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <TableBody>
              {visibleRows.map((invoice, index) => {
                const isItemSelected = isSelected(invoice.id);
                const labelId = `enhanced-table-checkbox-${index}`;

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
                      <TableCell id={labelId} scope="row">
                        {invoice.id}
                      </TableCell>
                    </TableRow>

                    <TableRow selected={isItemSelected}>
                      <TableCell colSpan={10} style={{ padding: '4px 6px' }}>
                        <Table size="small" aria-label="utility">
                          {invoice.bills.map((bill) => (
                            <TableBody>
                              <TableRow key={'4'}>
                                <TableCell align="center">{bill.utilityType}</TableCell>
                                <TableCell align="center">{bill.meterNumber}</TableCell>
                                <TableCell align="center">{bill.serviceStart}</TableCell>
                                <TableCell align="center">{bill.serviceEnd}</TableCell>
                                <TableCell align="center">{bill.amount}</TableCell>
                                <TableCell align="center">{bill.tax}</TableCell>
                                <TableCell align="center">{bill.totalAmount}</TableCell>
                              </TableRow>
                            </TableBody>
                          ))}
                        </Table>
                      </TableCell>
                    </TableRow>
                  </>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
        />
      </Paper>
    </Box>
  );
}
