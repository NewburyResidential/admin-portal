'use client';

import { useEffect, useState } from 'react';
import { useForm, useFieldArray, FormProvider, useWatch } from 'react-hook-form';
import { transactionsSchema } from './utils/transactions-schema';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import CardActions from '@mui/material/CardActions';
import TableContainer from '@mui/material/TableContainer';

import PageChange from './PageChange';
import RowItem from './rowItems/RowItem';
import ButtonApprove from './ButtonApprove';
import updateTransactions from 'src/utils/services/cc-expenses/updateTransactions';
import getUnapprovedTransactions from 'src/utils/services/cc-expenses/getUnapprovedTransactions';

import { LoadingScreen } from 'src/components/loading-screen';

export default function CustomTable({ user, vendors, chartOfAccounts }) {
  const [loading, setLoading] = useState(false);

  const methods = useForm({
    defaultValues: {
      transactions: [],
      pageSettings: { page: 0, rowsPerPage: 10 },
    },
    resolver: yupResolver(transactionsSchema),
  });

  const { control, handleSubmit, setValue } = methods;

  const { page, rowsPerPage } = useWatch({
    control,
    name: `pageSettings`,
  });

  const { fields: transactionFields, remove } = useFieldArray({
    control,
    name: `transactions`,
  });

  useEffect(() => {
    setLoading(true);
    const fetchTransactions = async () => {
      const response = await getUnapprovedTransactions();

      response.sort((a, b) => {
        return new Date(a.transactionDate) - new Date(b.transactionDate);
      });

      const unapprovedTransactions = response?.map((transaction) => ({
        ...transaction,
        checked: false,
      }));
      setValue('transactions', unapprovedTransactions);
      setLoading(false);
    };

    fetchTransactions();
  }, [setValue]);

  const currentPageTransactions = transactionFields.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const onSubmit = async (data) => {
    const transactionIndexData = data.transactions
      .map((transaction, index) => (transaction.checked ? { index, id: transaction.id } : null))
      .filter((item) => item !== null);

    const validTransactions = data.transactions
      .filter((transaction) => transaction.checked)
      .map((transaction) => ({
        ...transaction,
        status: 'reviewed',
        approvedBy: user.name,
      }));

    const response = await updateTransactions(validTransactions);
    if (response && response.ids) {
      const updatedTransactionIds = response.ids;
      const indicesToRemove = transactionIndexData.filter((item) => updatedTransactionIds.includes(item.id)).map((item) => item.index);
      remove(indicesToRemove);
    }
  };

  return (
    <FormProvider {...methods}>
      <form action={handleSubmit(onSubmit)}>
        <Card sx={{ borderRadius: '10px' }}>
          <CardActions
            sx={{ backgroundColor: (theme) => (theme.palette.mode === 'light' ? 'primary.darker' : theme.palette.common.black) }}
          >
            <ButtonApprove transactions={transactionFields} />
            <PageChange transactions={transactionFields} page={page} rowsPerPage={rowsPerPage} />
          </CardActions>
          <TableContainer component={Paper} sx={{ borderRadius: '0px', overflowX: 'hidden', maxHeight: '74vh', height: '74vh' }}>
            <Box sx={{ height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              {loading ? (
                <LoadingScreen />
              ) : (
                <>
                  {currentPageTransactions.map((transaction, transactionIndex) => (
                    <Box key={transaction.id} sx={{ display: 'flex', flexDirection: 'column' }}>
                      <RowItem
                        transaction={transaction}
                        transactionIndex={page * rowsPerPage + transactionIndex}
                        vendors={vendors}
                        chartOfAccounts={chartOfAccounts}
                      />
                    </Box>
                  ))}
                </>
              )}
            </Box>
          </TableContainer>
        </Card>
      </form>
    </FormProvider>
  );
}
