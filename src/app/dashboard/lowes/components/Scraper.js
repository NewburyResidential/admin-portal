import { useEffect } from 'react';
import { LoadingScreen } from 'src/components/loading-screen';

import Box from '@mui/material/Box';

import getUniqueInvoiceItems from './utils/get-unique-invoice-items';
import getCatalogedItems from 'src/utils/services/supply-stores/getCatalogedItems';
import getUncatalogedItems from 'src/utils/services/supply-stores/getUncatalogedItems';
import getMissingLowesItems from 'src/utils/services/supply-stores/getMissingLowesItems';
import lowesItemScraper from './utils/lowes-item-scraper';

export default function Scraper({ groupedInvoices, setUncatalogedItems, setCurrentStep, setCatalogedItems }) {
  useEffect(() => {
    const fetchUncatalogedItems = async (items) => {
      try {
        let missingLowesData = await getMissingLowesItems(items);
        console.log('missingLowesData', missingLowesData);

        while (missingLowesData.length > 0) {
          await lowesItemScraper(missingLowesData);
          missingLowesData = await getMissingLowesItems(items);
        }

        const uncatalogedItems = await getUncatalogedItems(items);
        console.log('uncatalogedItems', uncatalogedItems);

        if (uncatalogedItems?.length > 0) {
          setCurrentStep(2);
          setUncatalogedItems(uncatalogedItems);
          return;
        }

        const catalogedItems = await getCatalogedItems(items);
        console.log('catalogedItems', catalogedItems);

        if (catalogedItems !== null && Object.keys(catalogedItems).length > 0) {
          setCurrentStep(3);
          setCatalogedItems(catalogedItems);
        } else {
          setCurrentStep(0);
        }
      } catch (error) {
        console.log(error);
        setCurrentStep(0);
      }
    };

    fetchUncatalogedItems(getUniqueInvoiceItems(groupedInvoices));
  }, [groupedInvoices, setCatalogedItems, setCurrentStep, setUncatalogedItems]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
      <LoadingScreen />
    </Box>
  );
}
