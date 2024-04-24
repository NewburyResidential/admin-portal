'use client';

import { useState } from 'react';
import AllocationTable from './GlTable/AllocationTable';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Box from '@mui/material/Box';
import InvoiceTable from './InvoiceTable/InvoiceTable';
import Scraper from './Scraper';
import Upload from './Upload';

export default function Steps({ chartOfAccounts }) {
  const [groupedInvoices, setGroupedInvoices] = useState({});
  const [uncatalogedItems, setUncatalogedItems] = useState([]);
  const [catalogedItems, setCatalogedItems] = useState({});
  const [currentStep, setCurrentStep] = useState(0);

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

      {currentStep === 0 && <Upload setGroupedInvoices={setGroupedInvoices} setCurrentStep={setCurrentStep} />}
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
        <InvoiceTable groupedInvoices={groupedInvoices} catalogedItems={catalogedItems} setCurrentStep={setCurrentStep} />
      )}
    </div>
  );
}
