'use client';

import React, { useState } from 'react';
import { Grid } from '@mui/material';
import PayrollFileUpload from './PayrollFileUpload';
import TrakpayFileUpload from './TrakpayFileUpload';
import ManualAmountInput from './ManualAmountInput';
import AmountByPropertyList from './AmountByPropertyList';

const PayrollView = ({ assets }) => {
  const normalDate = getNormalDate();
  const weirdDate = getWeirdDate();

  const assetObject = assets.reduce(
    (acc, asset) => ({
      ...acc,
      [asset.pk]: {
        id: asset.accountId,
        label: asset.label,
        accountingSoftware: asset.accountingSoftware,
      },
    }),
    {}
  );

  const [view, setView] = useState(null);
  const [propertyPercentages, setPropertyPercentages] = useState(null);
  const [payrollFile, setPayrollFile] = useState(null);
  const [trakpayFile, setTrakpayFile] = useState(null);
  const [manualDistribution, setManualDistribution] = useState({});
  const [payrollDistribution, setPayrollDistribution] = useState({});
  const [trakpayDistribution, setTrakpayDistribution] = useState({});
  const [propertiesByEmployee, setPropertiesByEmployee] = useState({});

  const handlePropertyPercentages = (percentages) => {
    setPropertyPercentages(percentages);
  };

  const handleReset = () => {
    setView(null);
    setManualDistribution({});
    setPayrollDistribution({});
    setPayrollFile(null);
    setTrakpayFile(null);
  };

  const showTrakpay = payrollFile && propertyPercentages;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={showTrakpay ? 6 : 12}>
        <PayrollFileUpload
          assetObject={assetObject}
          onPropertyPercentages={handlePropertyPercentages}
          payrollFile={payrollFile}
          setPayrollFile={setPayrollFile}
          setTrakpayFile={setTrakpayFile}
          payrollDistribution={payrollDistribution}
          setPayrollDistribution={setPayrollDistribution}
          view={view}
          setView={setView}
          handleReset={handleReset}
          setPropertiesByEmployee={setPropertiesByEmployee}
          normalDate={normalDate}
          weirdDate={weirdDate}
        />
      </Grid>

      {showTrakpay && (
        <Grid item xs={12} md={6}>
          <TrakpayFileUpload
            propertyPercentages={propertyPercentages}
            trakpayFile={trakpayFile}
            setTrakpayFile={setTrakpayFile}
            view={view}
            setView={setView}
            handleReset={handleReset}
            propertiesByEmployee={propertiesByEmployee}
            trakpayDistribution={trakpayDistribution}
            setTrakpayDistribution={setTrakpayDistribution}
            normalDate={normalDate}
            weirdDate={weirdDate}
            assets={assets}
          />
        </Grid>
      )}

      {payrollFile && (
        <Grid item xs={12}>
          <ManualAmountInput
            propertyPercentages={propertyPercentages}
            assets={assets}
            setManualDistribution={setManualDistribution}
            manualDistribution={manualDistribution}
            setView={setView}
            view={view}
            normalDate={normalDate}
            weirdDate={weirdDate}
          />
        </Grid>
      )}

      {(Object.keys(manualDistribution).length > 0 ||
        Object.keys(payrollDistribution).length > 0 ||
        Object.keys(trakpayDistribution).length > 0) &&
        view !== null && (
          <Grid item xs={12}>
            <AmountByPropertyList
              normalDate={normalDate}
              distributionData={
                view === 'payrollAmounts' ? payrollDistribution : view === 'trakpayAmounts' ? trakpayDistribution : manualDistribution
              }
              view={view}
              assetObject={assetObject}
            />
          </Grid>
        )}
    </Grid>
  );
};

export default PayrollView;

function getNormalDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${month}/${day}/${year}`;
}

function getWeirdDate() {
  const date = new Date();
  return date.toISOString().substring(0, 10);
}
