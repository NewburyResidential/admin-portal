'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { LoadingScreen } from 'src/components/loading-screen';
import { FormProvider } from 'react-hook-form';
import RHFTextField from 'src/components/hook-form/rhf-text-field';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';

import getUniqueInvoiceItems from './utils/get-unique-invoice-items';
import getCatalogedItems from 'src/utils/services/supply-stores/getCatalogedItems';
import getUncatalogedItems from 'src/utils/services/supply-stores/getUncatalogedItems';
import getMissingLowesItems from 'src/utils/services/supply-stores/getMissingLowesItems';
import scrapeLowesItemBySku from 'src/utils/services/supply-stores/scrapeLowesItemBySku';
import updateCatalogItem from 'src/utils/services/supply-stores/updateCatalogItem';

export default function Scraper({ groupedInvoices, setUncatalogedItems, setCurrentStep, setCatalogedItems }) {
  const [isScraping, setIsScraping] = useState(false);
  const [missingItems, setMissingItems] = useState([]);
  const [currentMissingItem, setCurrentMissingItem] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scrapingProgress, setScrapingProgress] = useState('');

  const methods = useForm({
    defaultValues: {
      sku: '',
      skuDescription: '',
      label: '',
      price: '',
      category: '',
      subCategory: '',
      imageUrl: '',
    },
  });

  const { reset, handleSubmit } = methods;

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const formatDate = () => {
    const today = new Date();
    return ('0' + (today.getMonth() + 1)).slice(-2) + '/' + ('0' + today.getDate()).slice(-2) + '/' + today.getFullYear();
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const itemData = {
        pk: data.sku,
        skuDescription: data.skuDescription,
        label: data.label,
        price: data.price,
        category: data.category,
        subCategory: data.subCategory,
        imageUrl: data.imageUrl,
        dateScraped: formatDate(),
      };

      await updateCatalogItem(itemData);

      // Remove the item from missing items list
      const updatedMissingItems = missingItems.filter((item) => item.sku !== data.sku);
      setMissingItems(updatedMissingItems);

      // If this was the current item being edited, close dialog
      if (currentMissingItem && currentMissingItem.sku === data.sku) {
        setDialogOpen(false);
        setCurrentMissingItem(null);
        reset();
      }

      // If no more missing items, continue with the process
      if (updatedMissingItems.length === 0) {
        setScrapingProgress('All items processed. Continuing...');
        await continueWithProcess();
      }
    } catch (error) {
      console.error('Error updating catalog item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const continueWithProcess = async () => {
    try {
      const items = getUniqueInvoiceItems(groupedInvoices);
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

  const handleEditItem = (item) => {
    setCurrentMissingItem(item);
    reset({
      sku: item.sku,
      skuDescription: item.skuDescription,
      label: '',
      price: item.cost || '',
      category: '',
      subCategory: '',
      imageUrl: '',
    });
    setDialogOpen(true);
  };

  const handleSkipItem = () => {
    if (currentMissingItem) {
      const updatedMissingItems = missingItems.filter((item) => item.sku !== currentMissingItem.sku);
      setMissingItems(updatedMissingItems);
      setDialogOpen(false);
      setCurrentMissingItem(null);
      reset();

      if (updatedMissingItems.length === 0) {
        setScrapingProgress('All items processed. Continuing...');
        continueWithProcess();
      }
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCurrentMissingItem(null);
    reset();
  };

  useEffect(() => {
    const fetchUncatalogedItems = async (items) => {
      try {
        setIsScraping(true);
        setScrapingProgress('Checking for missing items...');

        let missingLowesData = await getMissingLowesItems(items);
        console.log('missingLowesData', missingLowesData);
        setMissingItems(missingLowesData);

        if (missingLowesData.length === 0) {
          setScrapingProgress('No missing items found. Continuing...');
          await continueWithProcess();
          return;
        }

        setScrapingProgress(`Found ${missingLowesData.length} missing items. Starting automated scraping...`);

        while (missingLowesData.length > 0) {
          setScrapingProgress(`Scraping ${missingLowesData.length} items...`);

          await Promise.all(
            missingLowesData.map((item) => scrapeLowesItemBySku({ productId: item.sku, skuDescription: item.skuDescription }))
          );

          setScrapingProgress('Waiting 4 minutes before checking again...');
          await sleep(240000);

          missingLowesData = await getMissingLowesItems(items);
          console.log('missingLowesData2', missingLowesData);
          setMissingItems(missingLowesData);
        }

        await continueWithProcess();
      } catch (error) {
        console.log(error);
        setCurrentStep(0);
      } finally {
        setIsScraping(false);
      }
    };

    fetchUncatalogedItems(getUniqueInvoiceItems(groupedInvoices));
  }, [groupedInvoices, setCatalogedItems, setCurrentStep, setUncatalogedItems]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '70vh', pt: 4 }}>
      <LoadingScreen />

      {isScraping && (
        <Box sx={{ mt: 2, textAlign: 'center', maxWidth: 600 }}>
          <Typography variant="h6" gutterBottom>
            {scrapingProgress}
          </Typography>

          {missingItems.length > 0 && (
            <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
              <Typography variant="body2">
                {missingItems.length} items still need data. You can manually add data for any item while scraping continues.
              </Typography>
            </Alert>
          )}

          {missingItems.length > 0 && (
            <Box sx={{ mt: 2, mb: 8 }}>
              <Typography variant="subtitle2" gutterBottom>
                Missing Items:
              </Typography>
              <Box sx={{ maxHeight: 200, overflow: 'auto', border: 1, borderColor: 'divider', borderRadius: 1, p: 1 }}>
                {missingItems.map((item, index) => (
                  <Box
                    key={item.sku}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 0.5,
                      borderBottom: index < missingItems.length - 1 ? 1 : 0,
                      borderColor: 'divider',
                    }}
                  >
                    <Typography variant="body2">
                      {item.sku} - {item.skuDescription}
                    </Typography>
                    <Button size="small" variant="outlined" onClick={() => handleEditItem(item)}>
                      Add Data
                    </Button>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      )}

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Add Manual Data for Item: {currentMissingItem?.sku}</DialogTitle>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <RHFTextField name="sku" label="SKU" disabled />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <RHFTextField name="skuDescription" label="SKU Description" disabled />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Search on Lowes:
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      href={`https://www.lowes.com/search?searchTerm=${currentMissingItem?.sku}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Item
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <RHFTextField name="label" label="Product Label" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <RHFTextField name="price" label="Price" placeholder="e.g., $9.98" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <RHFTextField name="category" label="Category" placeholder="e.g., Paint" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <RHFTextField name="subCategory" label="Sub Category" placeholder="e.g., Paint Supplies" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <RHFTextField name="imageUrl" label="Image URL" placeholder="https://..." />
                </Grid>
              </Grid>
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  You only need to fill in the fields you have data for. The system will continue processing once you save or skip this
                  item.
                </Typography>
              </Alert>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleSkipItem} color="inherit">
                Skip Item
              </Button>
              <Button onClick={handleCloseDialog} color="inherit">
                Cancel
              </Button>
              <LoadingButton loading={isSubmitting} type="submit" variant="contained">
                Save Data
              </LoadingButton>
            </DialogActions>
          </form>
        </FormProvider>
      </Dialog>
    </Box>
  );
}
