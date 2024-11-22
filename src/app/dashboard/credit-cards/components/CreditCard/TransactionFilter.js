import { useCallback, useState } from 'react';
// @mui
import Stack from '@mui/material/Stack';

import TextField from '@mui/material/TextField';

import InputAdornment from '@mui/material/InputAdornment';
// components
import Iconify from 'src/components/iconify';
import AutocompleteSelectEmployees from 'src/components/form-inputs/common/AutocompleteSelectEmployees';
import BetweenDatePicker from 'src/components/form-inputs/BetweenDatePicker';
import BetweenAmounts from 'src/components/form-inputs/BetweenAmounts';
import { Box, IconButton } from '@mui/material';
import ExactAmount from 'src/components/form-inputs/ExactAmount';
import ExactDatePicker from 'src/components/form-inputs/ExactDatePicker';

// ----------------------------------------------------------------------

export default function EmployeeFilter({ filters, onFilters, employees }) {
  const [isExactFilter, setIsExactFilter] = useState(false);

  const handleFilterVendorOptions = useCallback(
    (event) => {
      onFilters('vendorOptions', event.target.value);
    },
    [onFilters]
  );

  const handleFilterEmployees = useCallback(
    (employeeOptions) => {
      onFilters('employeeOptions', employeeOptions);
    },
    [onFilters]
  );

  const handleFilterDateOptions = useCallback(
    (dateOptions) => {
      onFilters('dateOptions', dateOptions);
    },
    [onFilters]
  );

  const handleFilterAmountOptions = useCallback(
    (amountOptions) => {
      onFilters('amountOptions', amountOptions);
    },
    [onFilters]
  );

  const handleExactDateFilter = useCallback(
    (date) => {
      onFilters('exactDate', date);
    },
    [onFilters]
  );

  const handleExactAmountFilter = useCallback(
    (amount) => {
      onFilters('exactAmount', amount);
    },
    [onFilters]
  );

  const handleToggleFilterType = useCallback(() => {
    setIsExactFilter((prev) => !prev);
    // Clear existing filters
    if (!isExactFilter) {
      // Switching to exact filters
      onFilters('dateOptions', { from: null, to: null });
      onFilters('amountOptions', { from: '', to: '' });
      onFilters('exactDate', null);
      onFilters('exactAmount', '');
    } else {
      // Switching to between filters
      onFilters('dateOptions', { from: null, to: null });
      onFilters('amountOptions', { from: '', to: '' });
      onFilters('exactDate', null);
      onFilters('exactAmount', '');
    }
  }, [isExactFilter, onFilters]);

  return (
    <Stack
      spacing={2}
      sx={{
        p: 2.5,
        pr: { xs: 2.5, md: 1 },
      }}
    >
      <Stack
        direction={{
          xs: 'column',
          md: 'row',
        }}
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
      >
        <AutocompleteSelectEmployees
          employees={employees}
          currentValue={filters.employeeOptions}
          onChange={handleFilterEmployees}
          multiple
          label="Search By Employee, Property or Position"
        />
        <TextField
          fullWidth
          value={filters.vendorOptions}
          onChange={handleFilterVendorOptions}
          placeholder="Search By Vendor..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack
        direction={{
          xs: 'column',
          md: 'row',
        }}
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        sx={{ width: '100%' }}
      >
        <Box sx={{ width: '50%' }}>
          {isExactFilter ? (
            <ExactDatePicker 
              label="Exact Date" 
              value={filters.exactDate} 
              onChange={handleExactDateFilter} 
            />
          ) : (
            <BetweenDatePicker 
              label="Date" 
              value={filters.dateOptions} 
              onChange={handleFilterDateOptions} 
            />
          )}
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleToggleFilterType}>
            <Iconify
              icon="icon-park-outline:switch"
              sx={{
                color: 'text.disabled',
                width: 24,
                height: 24
              }}
            />
          </IconButton>
        </Box>

        <Box sx={{ width: '50%' }}>
          {isExactFilter ? (
            <ExactAmount 
              label="Exact Amount" 
              value={filters.exactAmount} 
              onChange={handleExactAmountFilter} 
            />
          ) : (
            <BetweenAmounts 
              label="Amount" 
              value={filters.amountOptions} 
              onChange={handleFilterAmountOptions} 
            />
          )}
        </Box>
      </Stack>
    </Stack>
  );
}
