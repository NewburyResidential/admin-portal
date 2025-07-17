import PropTypes from 'prop-types';
import { useState } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import SearchIcon from '@mui/icons-material/Search';
import getEntrataLeases from 'src/utils/services/utilities/get-entrata-leases';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'approved', label: 'Approved' },
  { value: 'unapproved', label: 'Unapproved' },
];

export default function UtilityFilter({ assetItems, onSearch, setLeases }) {
  const [isLoading, setIsLoading] = useState(false);
  // Flatten and structure options
  const options = assetItems
    .filter(item => item.utilities && item.utilities.length > 0)
    .reduce((acc, property) => {
      const propertyUtilities = property.utilities.map(utility => ({
        propertyId: property.pk,
        utilityId: utility.id,
        propertyName: property.label,
        utilityName: utility.label
      }));
      return [...acc, ...propertyUtilities];
    }, []);

  const getCurrentAndPast3Months = () => {
    const months = [];
    const today = new Date();
    
    for (let i = 0; i < 4; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      months.push(`${month}/${year}`);
    }
    
    return months;
  };

  const periods = getCurrentAndPast3Months();
  const [selectedPeriod, setSelectedPeriod] = useState(periods[0]); // Default to the current month

  const [selectedUtility, setSelectedUtility] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all'); // Default to unapproved

  const handleSearch = async () => {
    if (selectedUtility && selectedPeriod) {
      setIsLoading(true);
      try {
        const currentPropertyId = selectedUtility.propertyId;

        // Find the corresponding asset to get the accountId
        const asset = assetItems.find(item => item.pk === currentPropertyId);
        const currentAccountId = asset ? asset.accountId : null;

        if (!currentAccountId) {
           console.warn(`accountId not found for propertyId: ${currentPropertyId}`);
           // Decide if you want to proceed without accountId or stop
        }

        // Perform the initial search for utility bills
        await onSearch({
          propertyId: currentPropertyId,
          utilityId: selectedUtility.utilityId,
          period: selectedPeriod,
          status: selectedStatus 
        });

        // After successfully searching bills, fetch and log Entrata leases
        try {
          const leases = await getEntrataLeases(currentAccountId); 
          setLeases(leases);
        } catch (leaseError) {
          console.error(`Error fetching Entrata leases for property ${currentPropertyId}:`, leaseError);
        }

      } catch (searchError) {
        console.error('Error during utility bill search:', searchError);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2}>
          <Autocomplete
            fullWidth
            options={options}
            groupBy={(option) => option.propertyName}
            getOptionLabel={(option) => option.utilityName}
            value={selectedUtility}
            onChange={(_, newValue) => setSelectedUtility(newValue)}
            isOptionEqualToValue={(option, value) => 
              option?.propertyId === value?.propertyId && 
              option?.utilityId === value?.utilityId
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Property and Utility"
              />
            )}
          />

          <Autocomplete
            sx={{ minWidth: 200 }}
            options={periods}
            value={selectedPeriod}
            onChange={(_, newValue) => setSelectedPeriod(newValue)}
            isOptionEqualToValue={(option, value) => option === value}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Period"
              />
            )}
          />

          <TextField
            select
            label="Status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            {STATUS_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <LoadingButton
            loading={isLoading}
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
            disabled={!selectedUtility || !selectedPeriod}
            sx={{
              height: 56,
              px: 3,
              whiteSpace: 'nowrap',
              minWidth: 'auto'
            }}
          >
            Search Bills
          </LoadingButton>
        </Stack>
      </Stack>
    </Box>
  );
}

UtilityFilter.propTypes = {
  assetItems: PropTypes.array,
  onSearch: PropTypes.func,
}; 