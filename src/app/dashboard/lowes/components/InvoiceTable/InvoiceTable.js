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

import PageChange from './PageChange';
import ButtonApprove from './ButtonApprove';
import RowItem from './RowItem';

import SubRowItems from './SubRowItems';
import { assetItems } from 'src/assets/data/assets';
import { invoiceSchema } from '../utils/invoice-schema';
import addInvoice from 'src/utils/services/entrata/addInvoice';
import batchUpdateCatalogPurchases from 'src/utils/services/supply-stores/batchUpdateCatalogPurchases';

export default function InvoiceTable({ groupedInvoices, chartOfAccounts, catalogedItems, setCurrentStep }) {
  const [loading, setLoading] = useState(false);
  const [expandedStates, setExpandedStates] = useState({});

  const toggleExpanded = (index) => {
    setExpandedStates((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const updatedGroupedInvoices = Object.entries(groupedInvoices).map(([invoiceNumber, item]) => {
    const lowesNumber = item.store;
    const matchingAsset = assetItems.find((asset) => asset?.supplyStores?.lowes.includes(lowesNumber));

    return {
      ...item,
      invoiceNumber,
      checked: false,
      property: matchingAsset || null,
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
      pageSettings: { page: 0, rowsPerPage: 10 },
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
    console.log(data.invoices);
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

    selectedItems.forEach((item) => {
      const propertyId = item.property.accountId;
      noteArray.push(item.invoiceNumber);
      totalTax = totalTax.plus(parseCurrency(item.tax));
      totalShipping = totalShipping.plus(parseCurrency(item.shipping));
      totalAmount = totalAmount.plus(parseCurrency(item.totalInvoice));

      item.lineItems.forEach((lineItem) => {
        const itemLabel = catalogedItems[lineItem?.sku]?.label ? catalogedItems[lineItem?.sku]?.label : lineItem.skuDescription;
        const accountNumber = catalogedItems[lineItem.sku].glAccountNumber;
        const rate = parseCurrency(lineItem.totalCost);
        totalLineItemAmount = totalLineItemAmount.plus(rate);
        apDetails.push({
          propertyId,
          glAccountId: accountNumber,
          description: itemLabel,
          rate: rate.toString(),
        });
        itemsPurchased.push({
          pk: uuidv4(),
          store: 'Lowes',
          propertyId,
          glAccountId: accountNumber,
          glAccountName: catalogedItems[lineItem.sku].glAccountName,
          category: catalogedItems[lineItem.sku]?.category || null,
          subCategory: catalogedItems[lineItem.sku]?.subCategory || null,
          label: catalogedItems[lineItem.sku]?.label || null,
          imageUrl: catalogedItems[lineItem.sku]?.imageUrl || null,
          sku: lineItem.sku,
          skuDescription: lineItem.skuDescription,
          qty: lineItem.qty,
          cost: parseCurrency(lineItem.cost).toString(),
          totalCost: rate.toString(),
        });
      });
    });

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
      console.log(itemsPurchased);

      //const success = await addInvoice(invoice);
      const success = true;
      let updatedInvoices;

      if (success) {
        //await batchUpdateCatalogPurchases(itemsPurchased);
        updatedInvoices = data.invoices.filter((item) => !item.checked);
        setValue('invoices', updatedInvoices);
      }
      if (updatedInvoices.length === 0) {
        setCurrentStep(0);
      }
    }

    setLoading(false);
  };

  function parseCurrency(value) {
    if (typeof value === 'string') {
      value = value.replace('$', '').trim();
    }
    return isValidNumber(value) ? new Big(value) : Big(0);
  }

  function isValidNumber(value) {
    return Number.isNaN(Number.parseFloat(value)) === false && Number.isFinite(value);
  }

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
      </form>
    </FormProvider>
  );
}
