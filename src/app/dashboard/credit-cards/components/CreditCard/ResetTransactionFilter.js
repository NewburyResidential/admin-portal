import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function ResetTransactionFilter({ employees, filters, onFilters, onResetFilters, results, ...other }) {
  const handleRemoveStatus = () => {
    onFilters('status', 'all');
  };
  const handleRemoveVendorOptions = () => {
    onFilters('vendorOptions', '');
  };

  const handleRemoveEmployee = () => {
    onFilters('employeeOptions', []);
  };

  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          results found
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        {filters.status !== 'all' && (
          <Block label="Status:">
            <Chip size="small" label={filters.status.charAt(0).toUpperCase() + filters.status.slice(1)} onDelete={handleRemoveStatus} />
          </Block>
        )}

        {filters.employeeOptions.length > 0 && (
          <Block label="Employees:">
            <Chip
              label={`${filters.employeeOptions.length} ${filters.employeeOptions.length === 1 ? 'Employee' : 'Employees'}`}
              size="small"
              onDelete={handleRemoveEmployee}
            />
          </Block>
        )}

        {filters.dateOptions?.from || filters.dateOptions?.to ? (
          <Block label="Date:">
            <Chip
              size="small"
              label={
                filters.dateOptions.from && filters.dateOptions.to
                  ? `${filters.dateOptions.from} - ${filters.dateOptions.to}`
                  : filters.dateOptions.from
                    ? `After ${filters.dateOptions.from}`
                    : `Before ${filters.dateOptions.to}`
              }
              onDelete={() => onFilters('dateOptions', { from: null, to: null })}
            />
          </Block>
        ) : null}

        {filters.amountOptions?.from || filters.amountOptions?.to ? (
          <Block label="Amount:">
            <Chip
              size="small"
              label={
                filters.amountOptions.from && filters.amountOptions.to
                  ? `$${filters.amountOptions.from} - $${filters.amountOptions.to}`
                  : filters.amountOptions.from
                    ? `Above $${filters.amountOptions.from}`
                    : `Below $${filters.amountOptions.to}`
              }
              onDelete={() => onFilters('amountOptions', { from: '', to: '' })}
            />
          </Block>
        ) : null}

        {filters.exactAmount !== '' && (
          <Block label="Amount:">
            <Chip size="small" label={`$${filters.exactAmount}`} onDelete={() => onFilters('exactAmount', '')} />
          </Block>
        )}

        {filters.exactDate !== null && (
          <Block label="Date:">
            <Chip size="small" label={filters.exactDate} onDelete={() => onFilters('exactDate', null)} />
          </Block>
        )}

        {filters.vendorOptions !== '' && (
          <Block label="Vendor:">
            <Chip size="small" label={filters.vendorOptions} onDelete={handleRemoveVendorOptions} />
          </Block>
        )}

        <Button color="error" onClick={onResetFilters} startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}>
          Clear
        </Button>
      </Stack>
    </Stack>
  );
}

// ----------------------------------------------------------------------

function Block({ label, children, sx, ...other }) {
  return (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={1}
      direction="row"
      sx={{
        p: 1,
        borderRadius: 1,
        overflow: 'hidden',
        borderStyle: 'dashed',
        ...sx,
      }}
      {...other}
    >
      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {label}
      </Box>

      <Stack spacing={1} direction="row" flexWrap="wrap">
        {children}
      </Stack>
    </Stack>
  );
}

Block.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string,
  sx: PropTypes.object,
};
