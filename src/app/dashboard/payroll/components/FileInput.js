'use client';

import React, { useEffect, useState } from 'react';
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
  TextField,
  Divider,
  Card,
  Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { assetItems } from 'src/assets/data/assets';
import Big from 'big.js';
import enterTransactions from 'src/utils/services/payroll/enterTransactions';

const taxAccountOptions = {
  222405: 'Federal Taxes (941/944)',
  222406: 'Federal Unemployment (940)',
  222412: 'MI Unemployment Tax',
  222411: 'MI Local Tax',
  222410: 'MI Income Tax',
  222407: 'MA Income Tax',
  222408: 'MA Paid Family and Medical Leave',
  222409: 'MA Unemployment Tax',
};

export default function FileInput({ waveChartOfAccounts }) {
  const [payrollByProperty, setPayrollByProperty] = useState({});
  const [totalAccounts, setTotalAccounts] = useState([]);
  const [benefitsByProperty, setBenefitsByProperty] = useState({});
  console.log(totalAccounts, 'totalAccounts');

  const handleSubmit = async () => {
    const taxAccounts = [];
    totalAccounts.forEach((account) => {
      if (taxAccountOptions[account.accountNumber]) {
        taxAccounts.push({ ...account, waveId: waveChartOfAccounts[account.accountNumber] });
      }
    });
    const response = await enterTransactions({ taxAccounts, benefitsByProperty, payrollByProperty });
    console.log(response);
  };

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

            if (acc[item.Name].find((account) => account.uniqueId === `${item['Account Number']}-${item.Class}`)) {
              const currentItem = acc[item.Name].find((account) => account.uniqueId === `${item['Account Number']}-${item.Class}`);
              currentItem.amount = currentItem.amount.plus(item.Amount);
            } else {
              acc[item.Name].push({
                accountName: item['Account Name'],
                accountNumber: item['Account Number'],
                amount: new Big(item.Amount || 0),
                class: item.Class,
                category: item['Payroll Category'],
                uniqueId: `${item['Account Number']}-${item.Class}`,
              });
            }
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
          console.log('Grouped Data', groupedData);
          const accountsByEmployee = {};
          const payrollByProperty = {};

          Object.keys(groupedData).forEach((key) => {
            console.log('----------------------------');
            console.log(key);

            const accumulativeAccounts = [];
            const data = groupedData[key];

            data.forEach((item) => {
              accumulativeAccounts.find((account) => account.uniqueId === item.uniqueId) ||
                accumulativeAccounts.push({ uniqueId: item.uniqueId, amount: new Big(0) });
            });

            const { total, byProperty } = calculateEarnings(data);

            if (!accountsByEmployee[key]) {
              accountsByEmployee[key] = {};
            }
            //accountsByEmployee[key].totals = groupedData[key];

            const propertyKeys = Object.keys(byProperty);
            propertyKeys.forEach((property, index) => {
              const percent = byProperty[property].div(total);
              console.log('Percent', percent.toString());

              if (!accountsByEmployee[key][property]) {
                //const asset = assetItems.find((asset) => asset.id === property);
                accountsByEmployee[key][property] = [];
              }

              data.forEach((item) => {
                const proportionalAmount = item.amount.times(percent).round(2);
                const account = accumulativeAccounts.find((account) => account.uniqueId === item.uniqueId);
                account.amount = account.amount.plus(proportionalAmount);
                console.log(`${item.accountName}:`, proportionalAmount.toString());
                if (index === propertyKeys.length - 1) {
                  const accumulativeAmount = accumulativeAccounts.find((account) => account.uniqueId === item.uniqueId).amount;
                  const originalAmount = data.find((account) => account.uniqueId === item.uniqueId).amount;
                  const roundingError = accumulativeAmount.minus(originalAmount);

                  if (roundingError.gt(0)) {
                    console.log('Rounding error', roundingError.toString());
                  }
                }

                const existingAccount = accountsByEmployee[key][property].find((dataItem) => dataItem.uniqueId === item.uniqueId);
                if (existingAccount) {
                  existingAccount.amount = new Big(existingAccount.amount.plus(proportionalAmount)).toString();
                } else {
                  accountsByEmployee[key][property].push({ ...item, amount: proportionalAmount.toString() });
                }
              });
            });
          });

          const result = {};

          Object.keys(accountsByEmployee).forEach((employee) => {
            const properties = accountsByEmployee[employee];

            Object.keys(properties).forEach((property) => {
              const accounts = properties[property];
              if (!result[property]) {
                result[property] = { data: [], asset: assetItems.find((asset) => asset.id === property) };
              }
              accounts.forEach((account) => {
                const existingAccount = result[property].data.find((dataItem) => dataItem.accountNumber === account.accountNumber);
                if (existingAccount) {
                  existingAccount.amount = new Big(existingAccount.amount).plus(new Big(account.amount)).toString();
                } else {
                  result[property].data.push({
                    accountName: account.accountName,
                    accountNumber: account.accountNumber,
                    amount: account.amount,
                    waveId: waveChartOfAccounts[account.accountNumber],
                  });
                }
              });
            });
          });

          return result;
        }

        const groupedDataByName = groupDataByEmployee(data);
        Object.keys(groupedDataByName).forEach((key) => {
          const accounts = groupedDataByName[key];
          let category = '';
          accounts.forEach((account) => {
            if (account.accountNumber === '623100') category = 'office';
            if (account.accountNumber === '623300') category = 'supervisor';
            if (account.accountNumber === '624100') category = 'maint';
          });
          accounts.forEach((account) => {
            if (account.accountNumber === '222401' || account.accountNumber === '222403' || account.accountNumber === '222402') {
              const employeeAmount = account.amount;
              const employeePercentage = new Big(0.4);
              const companyPercentage = new Big(0.6);
              const companyAmount = employeeAmount.mul(companyPercentage.div(employeePercentage));
              accounts.push({
                accountName: account.accountNumber === '222401' ? 'dental' : account.accountNumber === '222403' ? 'vision' : 'health',
                amount: companyAmount.round(2).abs(),
                accountNumber: `N-${category}-${account.accountNumber}`,
                uniqueId: `N-${category}-${account.accountNumber}`,
              });
            }
          });
        });
        setPayrollByProperty(calculateProportions(groupedDataByName, assetItems));
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

  const totalUniquePayrollByProperty = getTotalUniquePayrollByProperty(payrollByProperty);

  const rawBenefitTotals = [];
  const calculatedBenefitTotals = {};

  totalAccounts.forEach((account) => {
    if (account.accountNumber !== '222401' && account.accountNumber !== '222403' && account.accountNumber !== '222402') return;
    const employeeAmount = new Big(account.amount);
    const employeePercentage = new Big(0.4);
    const companyPercentage = new Big(0.6);
    const combinedCompanyBenefitTotal = employeeAmount.mul(companyPercentage.div(employeePercentage)).round(2).abs();
    rawBenefitTotals.push({ ...account, amount: combinedCompanyBenefitTotal.toString() });
  });
  Object.entries(totalUniquePayrollByProperty).forEach(([key, { amount }]) => {
    if (key.startsWith('N-')) {
      const accountNumber = key.slice(-6);
      if (calculatedBenefitTotals[accountNumber]) {
        calculatedBenefitTotals[accountNumber] = Big(calculatedBenefitTotals[accountNumber]).plus(amount).toString();
      } else {
        calculatedBenefitTotals[accountNumber] = Big(amount).toString();
      }
    }
  });

  const combinedBenefitTotal = totalAccounts.reduce(
    (acc, { accountNumber, amount }) => (['222403', '222401', '222402'].includes(accountNumber) ? acc.plus(amount) : acc),
    Big(0)
  );
  const employeeAmount = combinedBenefitTotal;
  const employeePercentage = new Big(0.4);
  const companyPercentage = new Big(0.6);
  const combinedCompanyBenefitTotal = employeeAmount.mul(companyPercentage.div(employeePercentage));
  const combinedCompanyBenefitTotalByProperty = Object.entries(totalUniquePayrollByProperty).reduce((acc, [key, { amount }]) => {
    if (key.startsWith('N-')) {
      return acc.plus(new Big(amount));
    }
    return acc;
  }, Big(0));
  const handleAmountChange = (propertyId, accountId, newValue) => {
    const newAmount = new Big(newValue);
    setPayrollByProperty((prevState) => {
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
  console.log('payrollByProperty', payrollByProperty);

  useEffect(() => {
    const benefits = {};
    Object.keys(payrollByProperty).forEach((key) => {
      const accounts = payrollByProperty[key].data || [];
      const benefitAccounts = accounts.filter((account) => account.accountNumber.startsWith('N-'));
      const benefitsByEmployeeType = [];

      const addAccountDetails = (payrollAccountNumber, amount, benefitAccountNumber, label) => {
        benefitsByEmployeeType.push({
          benefitAccountNumber,
          payrollAccountNumber,
          waveBenefitId: waveChartOfAccounts[benefitAccountNumber],
          wavePayrollId: waveChartOfAccounts[payrollAccountNumber],
          amount,
          label: label.charAt(0).toUpperCase() + label.slice(1),
        });
      };

      benefitAccounts.forEach((account) => {
        const employeeTypeChar = account.accountNumber.slice(2, 3);
        const benefitAccountNumber = account.accountNumber.slice(-6);
        const payrollAccountNumber =
          employeeTypeChar === 'o' ? '623200' : employeeTypeChar === 's' ? '623400' : employeeTypeChar === 'm' ? '624200' : 'issue';
        if (['dental', 'vision', 'health'].includes(account.accountName)) {
          addAccountDetails(payrollAccountNumber, account.amount, benefitAccountNumber, account.accountName);
        }
      });
      benefits[key] = {
        asset: assetItems.find((asset) => asset.id === key),
        data: benefitsByEmployeeType,
      };
    });

    setBenefitsByProperty({ ...benefits });
  }, [payrollByProperty]);
  console.log('benefitsByProperty', benefitsByProperty);

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {Object.keys(payrollByProperty).map((key) => {
        const label = payrollByProperty[key].asset?.label || 'No Asset';
        const accounts = payrollByProperty[key].data || [];
        const payrollAccounts = accounts.filter((account) => !account.accountNumber.startsWith('N-'));
        const benefitAccounts = accounts.filter((account) => account.accountNumber.startsWith('N-'));
        const sortedAccounts = payrollAccounts.sort((a, b) => b.amount - a.amount);
        const benefitsByEmployeeType = [];
        const positiveTotal = sortedAccounts.reduce((sum, item) => {
          if (new Big(item.amount).gt(0)) {
            return sum.plus(item.amount);
          }
          return sum;
        }, new Big(0));

        const negativeTotal = sortedAccounts.reduce((sum, item) => {
          if (new Big(item.amount).lt(0)) {
            return sum.plus(item.amount);
          }
          return sum;
        }, new Big(0));

        const propertyDifference = positiveTotal.plus(negativeTotal);

        const benefits = {};

        const addAccountDetails = (accountType, employeeType, amount, accountNumber) => {
          if (!benefits[accountType]) {
            benefits[accountType] = {
              total: new Big(0),
              data: [],
              accountName:
                accountType === 'dental' ? 'Newbury Paid Dental' : accountType === 'vision' ? 'Newbury Paid Vision' : 'Newbury Paid Health',
            };
          }
          benefits[accountType].total = benefits[accountType].total.plus(new Big(amount));
          benefits[accountType].data.push({
            glName:
              employeeType === 'office'
                ? 'Pyrl Handling - Office'
                : employeeType === 'maint'
                  ? 'Pyrl Handling - Maintenance'
                  : employeeType === 'supervisor'
                    ? 'Pyrl Handling - Supervisor'
                    : 'issue',
            amount: new Big(amount),
            accountNumber: accountNumber,
          });
        };

        benefitAccounts.forEach((account) => {
          const employeeTypeChar = account.accountNumber.slice(2, 3);
          const employeeType =
            employeeTypeChar === 'o' ? 'office' : employeeTypeChar === 's' ? 'supervisor' : employeeTypeChar === 'm' ? 'maint' : 'issue';

          if (['dental', 'vision', 'health'].includes(account.accountName)) {
            addAccountDetails(account.accountName, employeeType, account.amount, account.accountNumber);
          }
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
                    {Object.entries(benefits).map(([key, benefit]) => (
                      <Card sx={{ m: 2, p: 2, borderRadius: '2px' }}>
                        <ListItem key={`${benefit.accountName}`}>
                          <ListItemText primary={benefit.accountName} />
                          <Typography sx={{ marginLeft: 'auto' }}>${benefit.total.toString()}</Typography>
                        </ListItem>
                        {benefit.data.map((item, index) => (
                          <ListItem key={`${item.glName}-${index}`} sx={{ pl: 4 }}>
                            <ListItemText
                              primary={
                                <Typography variant="body2" sx={{ color: 'grey.600' }}>
                                  {item.glName}
                                </Typography>
                              }
                            />
                            <Typography sx={{ marginLeft: 'auto', color: 'grey.600', fontSize: '0.875rem' }}>
                              ${item.amount.toString()}
                            </Typography>
                          </ListItem>
                        ))}
                      </Card>
                    ))}
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
                  const otherAmount = new Big(totalUniquePayrollByProperty[account.accountNumber]?.amount || 0);
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
                          {totalUniquePayrollByProperty[account.accountNumber]?.amount}
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
                  const otherAmount = new Big(totalUniquePayrollByProperty[account.accountNumber]?.amount || 0);
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
                          {totalUniquePayrollByProperty[account.accountNumber]?.amount}
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
              {rawBenefitTotals.map((account, index) => {
                const accountAmount = new Big(account.amount);
                const otherAmount = new Big(calculatedBenefitTotals[account.accountNumber] || 0);
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
                        {otherAmount.toString()}
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
      <Button onClick={handleSubmit}>this is a test</Button>
    </div>
  );
}

function getTotalUniquePayrollByProperty(input) {
  const result = {};

  Object.keys(input).forEach((key) => {
    const entries = input[key].data;

    entries.forEach((entry) => {
      const { accountName, accountNumber, amount } = entry;
      if (result[accountNumber]) {
        result[accountNumber].amount = result[accountNumber].amount.plus(new Big(amount));
      } else {
        result[accountNumber] = {
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
