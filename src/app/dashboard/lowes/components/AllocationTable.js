'use client';

import { useEffect, useState } from 'react';
import { useForm, useFieldArray, FormProvider, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import TableContainer from '@mui/material/TableContainer';

import PageChange from './PageChange';
import ButtonApprove from './ButtonApprove';
import RowItem from './RowItem';
import ButtonApplyGl from './ButtonApplyGl';
import DropDownGl from './DropDownGl';
import DropDownGlHeader from './DropDownGlHeader';
import { itemsSchema } from './utils/items-schema';

export default function AllocationTable({ uncatalogedItems, chartOfAccounts }) {
  const [loading, setLoading] = useState(false);

  const updatedUncatalogedItems = uncatalogedItems.map((item) => ({ ...item, checked: false }));

  const methods = useForm({
    defaultValues: {
      uncatalogedItems: updatedUncatalogedItems,
      pageSettings: { page: 0, rowsPerPage: 10 },
    },
    resolver: yupResolver(itemsSchema),
  });

  const { control, handleSubmit, setValue, formState } = methods;

  const { fields: uncatalogedItemFields } = useFieldArray({
    control,
    name: `uncatalogedItems`,
  });

  const { page, rowsPerPage } = useWatch({
    control,
    name: `pageSettings`,
  });
  const currentPageUncatalogedItems = uncatalogedItemFields.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const onItemSubmit = async (data) => {
    const catalogedItems = data.uncatalogedItems.filter((item) => item.checked);
    console.log('cat', catalogedItems);
    console.log('itemSubmit', data);
  };
  const onGlSubmit = async (data) => {
    console.log('GlSubmit', data);
  };

  console.log(formState);

  return (
    <FormProvider {...methods}>
      <form>
        <Card sx={{ borderRadius: '10px' }}>
          <CardActions
            sx={{ backgroundColor: (theme) => (theme.palette.mode === 'light' ? 'primary.darker' : theme.palette.common.black) }}
          >
            <ButtonApprove handleSubmit={handleSubmit(onItemSubmit)} uncatalogedItems={uncatalogedItems} />
            <ButtonApplyGl handleSubmit={handleSubmit(onGlSubmit)} uncatalogedItems={uncatalogedItems} />
            <Box sx={{ width: '360px', mb: 2 }}>
              <DropDownGlHeader chartOfAccounts={chartOfAccounts} />
            </Box>
            <PageChange uncatalogedItems={uncatalogedItemFields} page={page} rowsPerPage={rowsPerPage} />
          </CardActions>
          <TableContainer component={Paper} sx={{ borderRadius: '0px', overflowX: 'hidden', maxHeight: '74vh', height: '74vh' }}>
            <Box sx={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              <>
                {currentPageUncatalogedItems.map((uncatalogedItem, itemIndex) => (
                  <Box key={uncatalogedItem.id} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <RowItem
                      chartOfAccounts={chartOfAccounts}
                      uncatalogedItem={uncatalogedItem}
                      itemIndex={page * rowsPerPage + itemIndex}
                    />
                  </Box>
                ))}
              </>
            </Box>
          </TableContainer>
        </Card>
      </form>
    </FormProvider>
  );
}
