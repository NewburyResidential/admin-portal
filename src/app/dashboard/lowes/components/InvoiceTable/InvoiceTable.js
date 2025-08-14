'use client';

import { useState } from 'react';
import { useForm, useFieldArray, FormProvider, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AnimatePresence, m } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import Big from 'big.js';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import CardActions from '@mui/material/CardActions';
import TableContainer from '@mui/material/TableContainer';
import { CardContent } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useSnackbar } from 'src/utils/providers/SnackbarProvider';

import PageChange from './PageChange';
import ButtonApprove from './ButtonApprove';
import RowItem from './RowItem';

import SubRowItems from './SubRowItems';
import parseCurrency from '../utils/parse-currency';
import { invoiceSchema } from '../utils/invoice-schema';
import { postEntrataInvoice } from 'src/utils/services/entrata/postEntrataInvoice';
import { getPostMonth } from 'src/utils/format-time';

export default function InvoiceTable({ groupedInvoices, chartOfAccounts, catalogedItems, setCurrentStep, property, newburyAssets }) {
  //console.log('groupedInvoices', groupedInvoices);
  const [loading, setLoading] = useState(false);
  const [expandedStates, setExpandedStates] = useState({});
  const { showResponseSnackbar } = useSnackbar();

  const toggleExpanded = (index) => {
    setExpandedStates((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const updatedGroupedInvoices = Object.entries(groupedInvoices).map(([invoiceNumber, item]) => {
    return {
      ...item,
      invoiceNumber,
      checked: true,
      property: property || null,
    };
  });

  updatedGroupedInvoices.sort((a, b) => {
    if (!a.asset?.label) return 1;
    if (!b.asset?.label) return -1;
    return a.asset.label.localeCompare(b.asset.label);
  });

  const methods = useForm({
    defaultValues: {
      invoices: updatedGroupedInvoices,
      pageSettings: { page: 0, rowsPerPage: 50 },
    },
    resolver: yupResolver(invoiceSchema),
  });

  const { control, handleSubmit, setValue } = methods;

  const { fields: invoiceFields } = useFieldArray({
    control,
    name: `invoices`,
  });

  const { page, rowsPerPage } = useWatch({
    control,
    name: `pageSettings`,
  });
  const currentPageInvoices = invoiceFields.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const onSubmit = async (data) => {
    console.log('group', data.invoices);
    setLoading(true);
    const selectedItems = data.invoices.filter((item) => item.checked);
    const today = new Date();
    const formattedDate = format(today, 'MM/dd/yyyy');

    let totalTax = Big(0);
    let totalShipping = Big(0);
    let totalAmount = Big(0);
    let totalLineItemAmount = Big(0);
    const noteArray = [];
    const apDetails = [];
    const itemsPurchased = [];

    // Generate a unique payment ID for this batch
    const paymentId = 123456789;

    selectedItems.forEach((item) => {
      const propertyId = item.property.accountId;
      noteArray.push(item.invoiceNumber);

      const itemTax = parseCurrency(item.tax);
      const itemShipping = parseCurrency(item.shipping);
      const itemTotalInvoice = parseCurrency(item.totalInvoice);
      let itemLineItemTotal = Big(0);

      totalTax = totalTax.plus(itemTax);
      totalShipping = totalShipping.plus(itemShipping);
      totalAmount = totalAmount.plus(itemTotalInvoice);

      item.lineItems.forEach((lineItem) => {
        const rate = parseCurrency(lineItem.totalCost);
        itemLineItemTotal = itemLineItemTotal.plus(rate);
        totalLineItemAmount = totalLineItemAmount.plus(rate);

        if (rate.eq(0)) return;

        const itemLabel = catalogedItems[lineItem?.sku]?.label ? catalogedItems[lineItem?.sku]?.label : lineItem.skuDescription;
        const accountNumber = catalogedItems[lineItem.sku].glAccountNumber;

        apDetails.push({
          propertyId,
          glAccountId: accountNumber,
          description: itemLabel,
          rate: rate.toString(),
          invoicePayment: {
            invoicePaymentId: '1234', 
            paymentAmount: rate.toString(), 
          },
        });
      });

      // Calculate expected total for this invoice
      const expectedTotal = itemLineItemTotal.plus(itemTax).plus(itemShipping);

      // Compare with actual invoice total
      if (!expectedTotal.eq(itemTotalInvoice)) {
        console.log(`Mismatch found in invoice ${item.invoiceNumber}:`);
        console.log(`Expected total: ${expectedTotal.toString()}`);
        console.log(`Actual total: ${itemTotalInvoice.toString()}`);
        console.log(`Difference: ${expectedTotal.minus(itemTotalInvoice).toString()}`);
        console.log(`Line items total: ${itemLineItemTotal.toString()}`);
        console.log(`Tax: ${itemTax.toString()}`);
        console.log(`Shipping: ${itemShipping.toString()}`);
        console.log('-------------------');
      }
    });

    console.log('Final Totals:');
    console.log('Total Amount:', totalAmount.toString());
    console.log('Total Line Items:', totalLineItemAmount.toString());
    console.log('Total Tax:', totalTax.toString());
    console.log('Total Shipping:', totalShipping.toString());

    const expectedGrandTotal = totalLineItemAmount.plus(totalTax).plus(totalShipping);
    if (!expectedGrandTotal.eq(totalAmount)) {
      console.log('WARNING: Grand total mismatch!');
      console.log(`Expected grand total: ${expectedGrandTotal.toString()}`);
      console.log(`Actual grand total: ${totalAmount.toString()}`);
      console.log(`Difference: ${expectedGrandTotal.minus(totalAmount).toString()}`);
    }
    const postMonth = getPostMonth();

    if (totalAmount.eq(totalLineItemAmount.plus(totalTax).plus(totalShipping))) {
      const invoice = {
        apPayeeId: '71068',
        apPayeeLocationId: '41792',
        invoiceNumber: `Lowes - ${uuidv4()}`,
        invoiceDate: formattedDate,
        dueDate: formattedDate,
        invoiceTotal: totalAmount.toString(),
        salesTax: totalTax.eq(0) ? null : totalTax.toString(),
        shipping: totalShipping.eq(0) ? null : totalShipping.toString(),
        note: noteArray.join(', '),
        isOnHold: '0',
        isConsolidated: '0',
        apDetails: {
          apDetail: apDetails,
        },
      };

      const payload = {
        auth: {
          type: 'apikey',
        },
        requestId: '15',
        method: {
          name: 'sendInvoices',
          version: 'r2',
          params: {
            apBatch: {
              isPaused: '0',
              isPosted: '1',
              apHeaders: {
                apHeader: invoice,
              },
              invoicePayments: {
                invoicePayment: {
                  invoicePaymentId: '1234',
                  paymentTypeId: 1,
                  paymentNumber: `API Payment - ${formattedDate}`,
                  paymentDate: formattedDate,
                  postMonth: postMonth,
                  paymentMemo: `Lowes Payment`,
                },
              },
            },
          },
        },
      };
      console.log(itemsPurchased);

      const response = await postEntrataInvoice({ payload });
      showResponseSnackbar(response);
      console.log('response', response);
      let updatedInvoices;

      if (response.severity === 'success') {
        //  await batchUpdateCatalogPurchases(itemsPurchased);
        updatedInvoices = data.invoices.filter((item) => !item.checked);
        setValue('invoices', updatedInvoices);
      }
      if (updatedInvoices.length === 0) {
        setCurrentStep(0);
      }
    }

    setLoading(false);
  };

  // Watch all 'checked' states for dynamic updates
  const watchedInvoices = useWatch({
    control,
    name: `invoices`, // Watch all invoices
  });
  // return the total sum amount of all the selected invoices
  const totalSelectedAmount = watchedInvoices.reduce((acc, curr) => {
    if (curr.checked) {
      return acc.plus(parseCurrency(curr.totalInvoice));
    }
    return acc;
  }, Big(0));

  return (
    <FormProvider {...methods}>
      <form>
        <Card sx={{ borderRadius: '10px', mt: 2 }}>
          <CardActions
            sx={{ backgroundColor: (theme) => (theme.palette.mode === 'light' ? 'primary.darker' : theme.palette.common.black) }}
          >
            <ButtonApprove loading={loading} handleSubmit={handleSubmit(onSubmit)} invoices={invoiceFields} />

            <PageChange invoices={invoiceFields} page={page} rowsPerPage={rowsPerPage} />
          </CardActions>
          <TableContainer component={Paper} sx={{ borderRadius: '0px', overflowX: 'hidden', maxHeight: '74vh', height: '74vh' }}>
            <Box sx={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              <>
                {currentPageInvoices.map((invoice, itemIndex) => {
                  return (
                    <Box key={invoice.invoiceNumber} sx={{ display: 'flex', flexDirection: 'column' }}>
                      <RowItem
                        chartOfAccounts={chartOfAccounts}
                        invoice={invoice}
                        itemIndex={page * rowsPerPage + itemIndex}
                        expanded={expandedStates[page * rowsPerPage + itemIndex]}
                        toggleExpanded={toggleExpanded}
                        newburyAssets={newburyAssets}
                      />
                      <AnimatePresence>
                        {expandedStates[page * rowsPerPage + itemIndex] && (
                          <m.div
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {invoice.lineItems.map((lineItem, index) => (
                              <SubRowItems
                                catalogedItems={catalogedItems}
                                key={index}
                                lineItem={lineItem}
                                itemIndex={page * rowsPerPage + itemIndex}
                              />
                            ))}
                          </m.div>
                        )}
                      </AnimatePresence>
                    </Box>
                  );
                })}
              </>
            </Box>
          </TableContainer>
        </Card>
        <br />
        <Card sx={{ mt: 10, mb: 2, width: '100%', maxWidth: 400, margin: '0 auto' }}>
          <CardContent>
            <Typography variant="h6" align="center" color="inherit">
              Total Selected Amount
            </Typography>
            <Typography variant="h4" align="center" color="textPrimary">
              {totalSelectedAmount.toString()}
            </Typography>
          </CardContent>
        </Card>
      </form>
    </FormProvider>
  );
}
