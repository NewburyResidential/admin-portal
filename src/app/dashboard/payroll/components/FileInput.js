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
  TextField,
  Divider,
  Card,
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
  const [totalAccounts, setTotalAccounts] = useState([]);

  function getTotalUniqueAccounts(data) {
    const uniqueItems = {};

    data.forEach((item) => {
      if (!item['Account Number']) return;
      const amount = new Big(item.Amount);
      if (uniqueItems[item['Account Number']]) {
        uniqueItems[item['Account Number']].Amount = uniqueItems[item['Account Number']].Amount.plus(amount);
      } else {
        uniqueItems[item['Account Number']] = {
          'Account Number': item['Account Number'],
          'Account Name': item['Account Name'],
          Amount: amount,
        };
      }
    });

    const accountTotals = Object.values(uniqueItems).map((item) => ({
      accountNumber: item['Account Number'],
      accountName: item['Account Name'],
      amount: item.Amount.toString(),
    }));
    const sortedAccountsTotal = accountTotals.sort((a, b) => b.amount - a.amount);
    return sortedAccountsTotal;
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    Papa.parse(file, {
      header: true,
      complete: (result) => {
        const { data } = result;

        const totalUniqueAccounts = getTotalUniqueAccounts(data);
        setTotalAccounts(totalUniqueAccounts);

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
          const accountsByEmployee = {};
          const accountsByProperty = {};

          console.log('groupedData', groupedData);

          Object.keys(groupedData).forEach((key) => {
            console.log('----------------------------');

            const accumulativeAccounts = [];
            const data = groupedData[key];
            console.log(data);
            data.forEach((item) => {
              accumulativeAccounts.push({ accountNumber: item.account, amount: new Big(0) });
            });

            const { total, byProperty } = calculateEarnings(data);

            if (!accountsByEmployee[key]) {
              accountsByEmployee[key] = {};
            }
            accountsByEmployee[key].totals = groupedData[key];

            console.log('byProperty', byProperty);

            const propertyKeys = Object.keys(byProperty);
            propertyKeys.forEach((property, index) => {
              const percent = byProperty[property].div(total);

              if (!accountsByEmployee[key][property]) {
                //const asset = assetItems.find((asset) => asset.id === property);
                accountsByEmployee[key][property] = [];
              }

              data.forEach((item) => {
                const proportionalAmount = item.amount.times(percent).round(2);
                const account = accumulativeAccounts.find((account) => account.accountNumber === item.account);
                account.amount = account.amount.plus(proportionalAmount);

                if (index === propertyKeys.length - 1) {
                  const accumulativeAmount = account.amount
                  const originalAmount = data.find((account) => account.account === item.account).amount;
                  const roundingError = accumulativeAmount.minus(originalAmount);
                  if (roundingError.gt(0)) {
                    console.log('Rounding error', roundingError.toString());
                    console.log(accumulativeAccounts);
                    console.log('item', item);
                  }
                  //console.log('accumulativeAmount', accumulativeAmount.toString());
                 // console.log('originalAmount', originalAmount.toString());
                }

                const existingAccount = accountsByEmployee[key][property].find((dataItem) => dataItem.account === item.account);
                if (existingAccount) {
                  existingAccount.amount = existingAccount.amount.plus(proportionalAmount);
                } else {
                  accountsByEmployee[key][property].push({ ...item, amount: proportionalAmount });
                }
              });
            });
          });

          console.log('accountsByEmployee', accountsByEmployee);
          return accountsByEmployee;
        }

        function adjustForNegativeRoundingError(dataArray, roundingError, account) {
          const accountToAdjust = dataArray.find((item) => item.account === account);
          console.log(roundingError.toString());
          if (accountToAdjust) {
            accountToAdjust.amount = accountToAdjust.amount.plus(roundingError).round(2);
          }
        }
        function adjustForPositiveRoundingError(dataArray, roundingError) {
          const accountToAdjust = dataArray.find((item) => item.amount.gt(0));
          console.log(roundingError.toString());
          if (accountToAdjust) {
            accountToAdjust.amount = accountToAdjust.amount.plus(roundingError).round(2);
          }
        }

        const groupedDataByName = groupDataByEmployee(data);
        setAccountsByProperty(calculateProportions(groupedDataByName, assetItems));
      },
    });
  };

  function sumPositiveNumbers(data) {
    let totalPositive = Big(0);
    data.forEach((item) => {
      let amount = Big(item.amount);
      if (amount.gt(0)) {
        totalPositive = totalPositive.plus(amount);
      }
    });
    return totalPositive.toString();
  }
  const positiveTotal = sumPositiveNumbers(totalAccounts);

  const totalUniqueAccountsByProperty = getTotalUniqueAccountsByProperty(accountsByProperty);

  const handleAmountChange = (propertyId, accountId, newValue) => {
    const newAmount = new Big(newValue);
    setAccountsByProperty((prevState) => {
      const newState = { ...prevState };

      if (newState[propertyId]) {
        newState[propertyId].data = newState[propertyId].data.map((account) => {
          if (account.account === accountId) {
            return { ...account, amount: newAmount };
          }
          return account;
        });
      }
      return newState;
    });
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {Object.keys(accountsByProperty).map((key) => {
        const label = accountsByProperty[key].asset?.label || 'No Asset';
        const accounts = accountsByProperty[key].data || [];
        const sortedAccounts = accounts.sort((a, b) => b.amount - a.amount);
        const positiveTotal = sortedAccounts.reduce((sum, item) => {
          if (item.amount.gt(0)) {
            return sum.plus(item.amount);
          }
          return sum;
        }, new Big(0));

        const negativeTotal = sortedAccounts.reduce((sum, item) => {
          if (item.amount.lt(0)) {
            return sum.plus(item.amount);
          }
          return sum;
        }, new Big(0));

        const propertyDifference = positiveTotal.plus(negativeTotal);
        const benefitAccounts = sortedAccounts
          .filter((account) => account.account === '222401' || account.account === '222403' || account.account === '222402')
          .map((account) => {
            const employeeAmount = account.amount;
            const employeePercentage = new Big(0.4);
            const companyPercentage = new Big(0.6);
            const companyAmount = employeeAmount.mul(companyPercentage.div(employeePercentage));

            return {
              accountName:
                account.account === '222401'
                  ? 'Newbury Paid Dental Insurance'
                  : account.account === '222403'
                    ? 'Newbury Paid Vision Insurance'
                    : 'Newbury Paid Health Insurance',
              amount: companyAmount.round(2).abs(),
            };
          });

        const bigBenefitTotal = benefitAccounts.reduce((sum, item) => {
          return sum.plus(item.amount);
        }, new Big(0));

        return (
          <>
            <Box sx={{ mx: 1, p: 1 }}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography flex={1}>{label}</Typography>
                  <Box display="flex" justifyContent="flex-end" flex={1}>
                    <Typography sx={{ mr: 2 }}>
                      Diff: ${propertyDifference.toString()} | Payroll: ${positiveTotal.round(2).toString()} | Benefits: $
                      {bigBenefitTotal.toString()}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {sortedAccounts
                      .filter((account) => account.amount > 0)
                      .map((account, index) => (
                        <ListItem key={`${account.account}-positive`}>
                          <ListItemText primary={account.accountName} />
                          <TextField
                            variant="standard"
                            style={{ marginLeft: 'auto' }}
                            value={account.amount.toString()}
                            onChange={(e) => {
                              handleAmountChange(key, account.account, e.target.value);
                            }}
                          />
                        </ListItem>
                      ))}
                  </List>
                  <Divider sx={{ mt: 1, mb: 1 }} />
                  <List>
                    {sortedAccounts
                      .filter((account) => account.amount < 0)
                      .map((account, index) => (
                        <ListItem key={`${account.account}-negative`}>
                          <ListItemText primary={account.accountName} />
                          <TextField
                            variant="standard"
                            sx={{ marginLeft: 'auto' }}
                            value={account.amount.toString()}
                            onChange={(e) => {
                              handleAmountChange(key, account.account, e.target.value);
                            }}
                          />
                        </ListItem>
                      ))}
                  </List>
                  <List>
                    {benefitAccounts.map((account, index) => {
                      return (
                        <Card sx={{ m: 2, p: 2, borderRadius: '2px' }}>
                          <ListItem key={`${account.account}`}>
                            <ListItemText primary={account.accountName} />
                            <Typography sx={{ marginLeft: 'auto' }}>${account.amount.toString()}</Typography>
                          </ListItem>
                        </Card>
                      );
                    })}
                  </List>
                </AccordionDetails>
              </Accordion>
              <Divider />
            </Box>
          </>
        );
      })}
      <Box sx={{ mx: 1, p: 1 }}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ fontWeight: 'bold' }} flex={1}>
              Total Amounts
            </Typography>
            <Box display="flex" justifyContent="flex-end" flex={1}>
              <Typography sx={{ fontWeight: 'bold', mr: 2 }}>${positiveTotal}</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              <ListItem
                key={`total`}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <ListItemText />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="standard" sx={{ mx: 1, width: '80px', textAlign: 'center' }}>
                    Raw
                  </Typography>
                  <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                  <Typography variant="standard" sx={{ mx: 1, width: '80px', textAlign: 'center' }}>
                    Calculated
                  </Typography>
                  <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                  <Typography variant="standard" sx={{ mx: 1, width: '80px', textAlign: 'center' }}>
                    Difference
                  </Typography>
                </div>
              </ListItem>
              {totalAccounts
                .filter((account) => account.amount > 0)
                .map((account, index) => {
                  const accountAmount = new Big(account.amount);
                  const otherAmount = new Big(totalUniqueAccountsByProperty[account.accountNumber]?.amount || 0);
                  const difference = accountAmount.minus(otherAmount);

                  const displayDifference = difference.eq(0) ? '$0' : difference.toString();
                  return (
                    <ListItem
                      key={`${account.accountNumber}-negative`}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: !difference.eq(0) && '#FFCCCC',
                      }}
                    >
                      <ListItemText primary={account.accountName} />
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="standard" sx={{ mx: 1, width: '80px', textAlign: 'center' }}>
                          {account.amount.toString()}
                        </Typography>
                        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                        <Typography variant="standard" sx={{ mx: 1, width: '80px', textAlign: 'center' }}>
                          {totalUniqueAccountsByProperty[account.accountNumber]?.amount}
                        </Typography>
                        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                        <Typography variant="standard" sx={{ mx: 1, width: '80px', textAlign: 'center' }}>
                          {displayDifference}
                        </Typography>
                      </div>
                    </ListItem>
                  );
                })}
            </List>
            <Divider sx={{ mt: 2, mb: 2 }} />
            <List>
              {totalAccounts
                .filter((account) => account.amount < 0)
                .map((account, index) => {
                  const accountAmount = new Big(account.amount);
                  const otherAmount = new Big(totalUniqueAccountsByProperty[account.accountNumber]?.amount || 0);
                  const difference = accountAmount.minus(otherAmount);

                  const displayDifference = difference.eq(0) ? '$0' : difference.toString();
                  return (
                    <ListItem
                      key={`${account.accountNumber}-negative`}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: !difference.eq(0) && '#FFCCCC',
                      }}
                    >
                      <ListItemText primary={account.accountName} />
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="standard" sx={{ mx: 1, width: '80px', textAlign: 'center' }}>
                          {account.amount.toString()}
                        </Typography>
                        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                        <Typography variant="standard" sx={{ mx: 1, width: '80px', textAlign: 'center' }}>
                          {totalUniqueAccountsByProperty[account.accountNumber]?.amount}
                        </Typography>
                        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                        <Typography variant="standard" sx={{ mx: 1, width: '80px', textAlign: 'center' }}>
                          {displayDifference}
                        </Typography>
                      </div>
                    </ListItem>
                  );
                })}
            </List>
          </AccordionDetails>
        </Accordion>
        <Divider />
      </Box>
    </div>
  );
}

function getTotalUniqueAccountsByProperty(input) {
  const result = {};

  Object.keys(input).forEach((key) => {
    const entries = input[key].data;

    entries.forEach((entry) => {
      const { accountName, account, amount } = entry;
      if (result[account]) {
        result[account].amount = result[account].amount.plus(new Big(amount));
      } else {
        result[account] = {
          accountName: accountName,
          amount: new Big(amount),
        };
      }
    });
  });

  Object.keys(result).forEach((account) => {
    result[account].amount = result[account].amount.toString();
  });

  return result;
}
