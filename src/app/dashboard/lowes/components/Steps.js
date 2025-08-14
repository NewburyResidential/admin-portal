'use client';

import {  useState } from 'react';
import AllocationTable from './GlTable/AllocationTable';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Box from '@mui/material/Box';
import InvoiceTable from './InvoiceTable/InvoiceTable';
import Scraper from './Scraper';
import Upload from './Upload';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

export default function Steps({ chartOfAccounts, newburyAssets }) {
  const assets = newburyAssets.filter((item) => item.accountingSoftware === 'entrata');


  const [groupedInvoices, setGroupedInvoices] = useState({});
  const [uncatalogedItems, setUncatalogedItems] = useState([]);
  const [catalogedItems, setCatalogedItems] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [property, setProperty] = useState('');

  const handleChange = (event) => {
    setProperty(event.target.value);
  };

  const steps = ['Upload CSV', 'Scrape Items', 'Assign GL Codes', 'Pay Invoices'];
  return (
    <div>
      <Box sx={{ width: '100%', marginTop: 3 }}>
        <Stepper activeStep={currentStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {currentStep === 0 && (
        <>
          <Box sx={{ mt: 8, mx: 12 }}>
            <FormControl fullWidth>
              <InputLabel id="account-select-label">Select Property</InputLabel>
              <Select labelId="account-select-label" id="account-select" value={property} onChange={handleChange} label="Select Property">
                {assets.map((account) => (
                  <MenuItem key={account.id} value={account}>
                    {account.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Upload setGroupedInvoices={setGroupedInvoices} setCurrentStep={setCurrentStep} />
        </>
      )}
      {currentStep === 1 && (
        <Scraper
          groupedInvoices={groupedInvoices}
          setUncatalogedItems={setUncatalogedItems}
          setCatalogedItems={setCatalogedItems}
          setCurrentStep={setCurrentStep}
        />
      )}
      <br />
      {currentStep === 2 && (
        <AllocationTable
          uncatalogedItems={uncatalogedItems}
          chartOfAccounts={chartOfAccounts}
          setCatalogedItems={setCatalogedItems}
          setCurrentStep={setCurrentStep}
          groupedInvoices={groupedInvoices}
        />
      )}
      {currentStep === 3 && (
        <InvoiceTable
          groupedInvoices={groupedInvoices}
          catalogedItems={catalogedItems}
          setCurrentStep={setCurrentStep}
          property={property}
          newburyAssets={newburyAssets}
        />
      )}
    </div>
  );
}
