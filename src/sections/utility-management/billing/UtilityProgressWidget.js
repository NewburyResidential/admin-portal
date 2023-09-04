'use client';
import { useState } from 'react';
import sumBy from 'lodash/sumBy';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';

import { _invoices } from 'src/_mock';

import Scrollbar from '@components/scrollbar';
import UtilityAnalytic from 'src/sections/utility-management/billing/UtilityAnalytic';



export default function UtilityProgressWidget({handleOpenDrawer}) {
  const theme = useTheme();
  const [tableData, setTableData] = useState(_invoices);
  return (
    <>
     <Card
          sx={{
            mb: { xs: 3, md: 4 },
          }}
        >
          <Scrollbar>
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 3 }}
            >
              <UtilityAnalytic
                title="Water & Sewer"
                total={15}
                percent={50}
                price={sumBy(tableData, 'totalAmount')}
                icon="ion:water-sharp"
                color={theme.palette.primary.light}
                handleOpenDrawer={handleOpenDrawer}
              />
               <UtilityAnalytic
                title="Electric"
                total={13}
                percent={20}
                price={sumBy(tableData, 'totalAmount')}
                icon="material-symbols:electric-bolt"
                color={theme.palette.primary.light}
                handleOpenDrawer={handleOpenDrawer}
              />
               <UtilityAnalytic
                title="Gas"
                total={5}
                percent={5}
                price={sumBy(tableData, 'totalAmount')}
                icon="mdi:gas"
                color={theme.palette.primary.light}
                handleOpenDrawer={handleOpenDrawer}
              />
            </Stack>
          </Scrollbar>
        </Card>
    </>
  )
}
