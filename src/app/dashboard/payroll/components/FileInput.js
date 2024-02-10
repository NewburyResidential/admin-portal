'use client';

import React, { useState } from 'react';
import Papa from 'papaparse';
import {
  Dialog,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Box,
  Stack,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { assetItems } from 'src/assets/data/assets';
import UploadMultiFiles from 'src/components/upload-files/UploadMultiFiles';
import UploadIllustration from 'src/assets/illustrations/upload-illustration';
import Big from 'big.js';

const taxAccounts = [
  { number: '222405', waveGl: '', amount: 0, name: 'Federal Taxes (941/944)' },
  { number: '222406', waveGl: '', amount: 0, name: 'Federal Unemployment (940)' },
  { number: '222412', waveGl: '', amount: 0, name: 'MI Unemployment Tax' },
  { number: '222411', waveGl: '', amount: 0, name: 'MI Local Tax' },
  { number: '222407', waveGl: '', amount: 0, name: 'MA Income Tax' },
  { number: '222408', waveGl: '', amount: 0, name: 'MA Paid Family and Medical Leave' },
  { number: '222409', waveGl: '', amount: 0, name: 'MA Unemployment Tax' },
];

export default function FileInput() {
  const [accountsByProperty, setAccountsByProperty] = useState({});

  function processPayrollData(data) {
    let positiveTotal = 0;
    let negativeTotal = 0;

    data.forEach((item) => {
      const amount = parseFloat(item.Amount);
      if (!isNaN(amount)) {
        if (amount > 0) {
          positiveTotal += amount;
        } else {
          negativeTotal += amount;
        }

        taxAccounts.forEach((account) => {
          if (account.number === item['Account Number']) {
            account.amount += amount;
          }
        });
      }
    });

    positiveTotal = parseFloat(positiveTotal.toFixed(2));
    negativeTotal = parseFloat(negativeTotal.toFixed(2));
    taxAccounts.forEach((account) => {
      account.amount = parseFloat(account.amount.toFixed(2));
    });



    return { positiveTotal, negativeTotal, updatedTaxAccounts: taxAccounts };
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    Papa.parse(file, {
      header: true,
      complete: (result) => {

        const {data} = result;
        console.log(data);

        processPayrollData(data);

        function groupDataByEmployee(data) {
          return data.reduce((acc, item) => {
            if (!item.Name) return acc;
            if (!acc[item.Name]) acc[item.Name] = [];

            acc[item.Name].push({
              accountName: item['Account Name'],
              account: item['Account Number'],
              amount: new Big(item.Amount || 0),
              class: item.Class,
              category: item['Payroll Category'],
            });
            return acc;
          }, {});
        }

        function calculateEarnings(data) {
          return data.reduce(
            (acc, item) => {
              if (item.category === 'Employee Earnings') {
                acc.total = acc.total.plus(item.amount);
                acc.byProperty[item.class] = (acc.byProperty[item.class] || new Big(0)).plus(item.amount);
              }
              return acc;
            },
            { total: new Big(0), byProperty: {} }
          );
        }

        function calculateProportions(groupedData, assetItems) {
          const accountsByProperty = {};

          Object.keys(groupedData).forEach((key) => {
            const data = groupedData[key];
            const { total, byProperty } = calculateEarnings(data);

            console.log('total:', total.toString());
            console.log('byProperty:', byProperty);

            Object.keys(byProperty).forEach((property) => {
              const percent = byProperty[property].div(total);
              console.log(property)
              console.log(percent.toString());
              if (!accountsByProperty[property]) {
                const asset = assetItems.find((asset) => asset.id === property);
                accountsByProperty[property] = { asset, data: [], positiveTotal: new Big(0), negativeTotal: new Big(0) };
              }

              let positiveRoundingError = new Big(0);
              let negativeRoundingError = new Big(0);
              data.forEach((item) => {
                const proportionalAmount = item.amount.times(percent).round(2);
                if (proportionalAmount.gt(0)) {
                  positiveRoundingError = positiveRoundingError.plus(item.amount.times(percent).minus(proportionalAmount));
                } else {
                  negativeRoundingError = negativeRoundingError.plus(item.amount.times(percent).minus(proportionalAmount));
                }

                const existingItem = accountsByProperty[property].data.find((dataItem) => dataItem.account === item.account);

                if (existingItem) {
                  existingItem.amount = existingItem.amount.plus(proportionalAmount);
                } else {
                  accountsByProperty[property].data.push({ ...item, amount: proportionalAmount });
                }
              });

              if (!negativeRoundingError.eq(0)) {
                adjustForNegativeRoundingError(accountsByProperty[property].data, negativeRoundingError, '222404');
              }
              if (!positiveRoundingError.eq(0)) {
                adjustForPositiveRoundingError(accountsByProperty[property].data, positiveRoundingError);
              }

              accountsByProperty[property].positiveTotal = accountsByProperty[property].data.reduce((sum, item) => {
                return item.amount.gt(0) ? sum.plus(item.amount) : sum;
              }, new Big(0));

              accountsByProperty[property].negativeTotal = accountsByProperty[property].data.reduce((sum, item) => {
                return item.amount.lt(0) ? sum.plus(item.amount) : sum;
              }, new Big(0));
            });
          });

          return accountsByProperty;
        }

        function adjustForNegativeRoundingError(dataArray, roundingError, account) {
          const accountToAdjust = dataArray.find((item) => item.account === account);
          if (accountToAdjust) {
            accountToAdjust.amount = accountToAdjust.amount.plus(roundingError).round(2);
          }
        }
        function adjustForPositiveRoundingError(dataArray, roundingError) {
          const accountToAdjust = dataArray.find((item) => item.amount.gt(0));

          if (accountToAdjust) {
            accountToAdjust.amount = accountToAdjust.amount.plus(roundingError).round(2);
          }
        }

        const groupedDataByName = groupDataByEmployee(data);
        setAccountsByProperty(calculateProportions(groupedDataByName, assetItems));
      },
    });
  };
  console.log('accountsByProperty:', accountsByProperty);
  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {Object.keys(accountsByProperty).map((key) => {
        const label = accountsByProperty[key].asset?.label || 'No Asset';
        const {positiveTotal} = accountsByProperty[key];
        console.log('positivetotal:', positiveTotal.round(2).toString());
        const {negativeTotal} = accountsByProperty[key];
        console.log('negativeTotal:', negativeTotal.round(2).toString());
        const accounts = accountsByProperty[key].data || [];
        const sortedAccounts = accounts.sort((a, b) => b.amount - a.amount);

        return (
          <Box sx={{ mx: 3, p: 2 }}>
            <Typography variant="h6" gutterBottom style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{label}</span>
              <span>${positiveTotal.round(2).toString()}</span>
            </Typography>

            {/* Accordion for Positive Amounts */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Earnings</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {sortedAccounts
                    .filter((account) => account.amount > 0)
                    .map((account, index) => (
                      <ListItem key={`${account.account  }-positive`}>
                        <ListItemText primary={account.accountName} />
                        <Typography style={{ marginLeft: 'auto' }}>{account.amount.toString()}</Typography>
                      </ListItem>
                    ))}
                </List>
              </AccordionDetails>
            </Accordion>

            {/* Accordion for Negative Amounts */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Break Out</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {sortedAccounts
                    .filter((account) => account.amount < 0)
                    .map((account, index) => (
                      <ListItem key={`${account.account  }-negative`}>
                        <ListItemText primary={account.accountName} />
                        <Typography style={{ marginLeft: 'auto' }}>{account.amount.toString()}</Typography>
                      </ListItem>
                    ))}
                </List>
              </AccordionDetails>
            </Accordion>
          </Box>
        );
      })}
    </div>
  );
}
