'use client';

import { useState } from 'react';
import { useForm, useFieldArray, FormProvider, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { itemsSchema } from '../utils/items-schema';
import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import CardActions from '@mui/material/CardActions';
import TableContainer from '@mui/material/TableContainer';

import PageChange from './PageChange';
import ButtonApprove from './ButtonApprove';
import RowItem from './RowItem';
import ButtonApplyGl from './ButtonApplyGl';
import DropDownGlHeader from './DropDownGlHeader';

import batchUpdateCatalogItems from 'src/utils/services/supply-stores/batchUpdateCatalogItems';
import getCatalogedItems from 'src/utils/services/supply-stores/getCatalogedItems';
import getUniqueInvoiceItems from '../utils/get-unique-invoice-items';

export default function AllocationTable({ uncatalogedItems, chartOfAccounts, setCatalogedItems, setCurrentStep, groupedInvoices }) {
  const [loading, setLoading] = useState(false);

  const updatedUncatalogedItems = uncatalogedItems.map((item) => ({ ...item, checked: false, glAccount: null }));
  updatedUncatalogedItems.sort((a, b) => {
    if (a.category == null) return 1;
    if (b.category == null) return -1;

    return a.category.localeCompare(b.category);
  });

  const methods = useForm({
    defaultValues: {
      uncatalogedItems: updatedUncatalogedItems,
      pageSettings: { page: 0, rowsPerPage: 10 },
    },
    resolver: yupResolver(itemsSchema),
  });

  const { control, handleSubmit, setValue } = methods;

  const { fields: uncatalogedItemFields } = useFieldArray({
    control,
    name: `uncatalogedItems`,
  });

  const { page, rowsPerPage } = useWatch({
    control,
    name: `pageSettings`,
  });
  const currentPageUncatalogedItems = uncatalogedItemFields.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const onSubmit = async (data) => {
    setLoading(true);
    const selectedItems = data.uncatalogedItems.filter((item) => item.checked);
    const batchItems = selectedItems.map((item) => ({ pk: item.sku, ...item }));
    await batchUpdateCatalogItems(batchItems);
    const remainingUncatalogedItems = data.uncatalogedItems.filter((item) => !item.checked);
    if (remainingUncatalogedItems.length === 0) {
      const catalogedItems = await getCatalogedItems(getUniqueInvoiceItems(groupedInvoices));
      setCatalogedItems(catalogedItems);
      setCurrentStep(3);
    }

    setValue('uncatalogedItems', remainingUncatalogedItems);
    setLoading(false);
  };

  return (
    <FormProvider {...methods}>
      <form>
        <Card sx={{ borderRadius: '10px', mt: 2 }}>
          <CardActions
            sx={{ backgroundColor: (theme) => (theme.palette.mode === 'light' ? 'primary.darker' : theme.palette.common.black) }}
          >
            <ButtonApprove loading={loading} handleSubmit={handleSubmit(onSubmit)} uncatalogedItems={uncatalogedItemFields} />
            <ButtonApplyGl
              loading={loading}
              setLoading={setLoading}
              handleSubmit={handleSubmit(onSubmit)}
              uncatalogedItems={uncatalogedItemFields}
            />
            <Box
              sx={{
                width: '360px',
                borderRadius: '8px',
              }}
            >
              <DropDownGlHeader chartOfAccounts={chartOfAccounts} />
            </Box>
            <PageChange uncatalogedItems={uncatalogedItemFields} page={page} rowsPerPage={rowsPerPage} />
          </CardActions>
          <TableContainer component={Paper} sx={{ borderRadius: '0px', overflowX: 'hidden', maxHeight: '74vh', height: '74vh' }}>
            <Box sx={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              <>
                {currentPageUncatalogedItems.map((uncatalogedItem, itemIndex) => (
                  <m.div key={uncatalogedItem.sku} layout transition={{ duration: 0.5, type: 'tween' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <RowItem
                        chartOfAccounts={chartOfAccounts}
                        uncatalogedItem={uncatalogedItem}
                        itemIndex={page * rowsPerPage + itemIndex}
                      />
                    </Box>
                  </m.div>
                ))}
              </>
            </Box>
          </TableContainer>
        </Card>
      </form>
    </FormProvider>
  );
}
