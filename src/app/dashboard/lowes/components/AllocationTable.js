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

export default function AllocationTable({ uncatalogedItems }) {
  const [loading, setLoading] = useState(false);

  const methods = useForm({
    defaultValues: {
      uncatalogedItems: uncatalogedItems,
      pageSettings: { page: 0, rowsPerPage: 10 },
    },
    // resolver: yupResolver(transactionsSchema),
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

  console.log(uncatalogedItemFields)

  const onSubmit = async (data) => {
    console.log(data);
  };

  console.log(uncatalogedItems);

  return (
    <FormProvider {...methods}>
      <form action={handleSubmit(onSubmit)}>
        <Card sx={{ borderRadius: '10px' }}>
          <CardActions
            sx={{ backgroundColor: (theme) => (theme.palette.mode === 'light' ? 'primary.darker' : theme.palette.common.black) }}
          >
            <ButtonApprove uncatalogedItems={uncatalogedItems} />
            <PageChange uncatalogedItems={uncatalogedItemFields} page={page} rowsPerPage={rowsPerPage} />
          </CardActions>
          <TableContainer component={Paper} sx={{ borderRadius: '0px', overflowX: 'hidden', maxHeight: '74vh', height: '74vh' }}>
            <Box sx={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              <>
                {currentPageUncatalogedItems.map((uncatalogedItem, itemIndex) => (
                  <Box key={uncatalogedItem.id} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <RowItem uncatalogedItem={uncatalogedItem} itemIndex={page * rowsPerPage + itemIndex} />
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
