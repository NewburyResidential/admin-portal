import { Button, ButtonGroup } from '@mui/material';
import React, { useState } from 'react';

export default function CalculationButtonGroup({ calculation, setCalculation }) {
  const handleCalculationChange = (method) => {
    setCalculation(method);
  };

  return (
    <>
      <ButtonGroup
        fullWidth
        variant="outlined"
        aria-label="text button group"
        sx={{
          height: '40px',
          '& .MuiButton-outlined': {
            borderColor: '#E4E9EC',
          },
        }}
      >
        <Button
          onClick={() => {
            handleCalculationChange('Amount');
          }}
          sx={{
            position: 'relative',
            color: calculation === 'Amount' ? 'white' : '#909EAB',
            backgroundColor: calculation === 'Amount' && '#666666',
            '&:hover': {
              zIndex: 1,
              backgroundColor: calculation === 'Amount' && '#666666',
            },
          }}
        >
          Amount
        </Button>
        <Button
          onClick={() => handleCalculationChange('Unit')}
          sx={{
            position: 'relative',
            color: calculation === 'Unit' ? 'white' : '#909EAB',
            backgroundColor: calculation === 'Unit' && '#666666',
            '&:hover': {
              zIndex: 1,
              backgroundColor: calculation === 'Unit' && '#666666',
            },
          }}
        >
          Unit
        </Button>
        {/* <Button
          onClick={() => handleCalculationChange('Percent')}
          sx={{
            position: 'relative',
            color: calculation === 'Percent' ? 'white' : '#909EAB',
            backgroundColor: calculation === 'Percent' && '#666666',
            '&:hover': {
              zIndex: 1,
              backgroundColor: calculation === 'Percent' && '#666666',
            },
          }}
        >
          Percent
        </Button> */}
      </ButtonGroup>
    </>
  );
}
