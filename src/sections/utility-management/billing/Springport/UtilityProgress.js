'use client';
import { useState } from 'react';
import sumBy from 'lodash/sumBy';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';

import { _invoices } from 'src/_mock';

import Scrollbar from 'src/components/scrollbar';
import InvoiceAnalytic from '../../../../components/cards/Analytic';

export default function UtilityProgress() {
  const theme = useTheme();
  const [tableData, setTableData] = useState(_invoices);
  return (
    <>
     <Card
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          <Scrollbar>
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 3 }}
            >
              <InvoiceAnalytic
                title="Water & Sewer"
                total={tableData.length}
                percent={50}
                price={sumBy(tableData, 'totalAmount')}
                icon="ion:water-sharp"
                color={theme.palette.primary.light}
              />
               <InvoiceAnalytic
                title="Electric"
                total={tableData.length}
                percent={100}
                price={sumBy(tableData, 'totalAmount')}
                icon="material-symbols:electric-bolt"
                color={theme.palette.primary.light}
              />
               <InvoiceAnalytic
                title="Gas"
                total={tableData.length}
                percent={100}
                price={sumBy(tableData, 'totalAmount')}
                icon="mdi:gas"
                color={theme.palette.primary.light}
              />

             
            </Stack>
          </Scrollbar>
        </Card>
    </>
  )
}
