import { useState } from 'react';

import Grid from '@mui/material/Grid';
import ItemDialog from './editResource/Dialog';
import Typography from '@mui/material/Typography';

import ResourceCard from './ResourceCard';


function prioritizeItem(items, targetLabel) {
  const targetItem = items.find((item) => item.label === targetLabel);
  const otherItems = items.filter((item) => item.label !== targetLabel);
  return targetItem ? [targetItem, ...otherItems] : [...otherItems];
}

export default function Shortcuts({ editMode, shortcuts, userName }) {
  const [dialog, setDialog] = useState({ open: false, resource: null, resourceType: 'shortcuts' });

  const prioritizedShortcuts = prioritizeItem(shortcuts, 'Create A Support Ticket');

  const renderCards = prioritizedShortcuts.map((shortcut, index) => (
    <Grid item xs={12} sm={index === 0 ? 12 : 6} key={shortcut.pk}>
      <ResourceCard
        label={shortcut.label}
        logo={
          shortcut?.logo?.fileUrl
            ? shortcut?.logo?.fileUrl
            : shortcut.uploadType === 'website'
              ? 'https://admin-portal-intranet.s3.amazonaws.com/df25043f-c9ad-4fc4-a9ef-ad8902a1abac'
              : 'https://admin-portal-intranet.s3.amazonaws.com/ecce7443-7bfb-4b71-ab72-e40f5cc91037'
        }
        description={shortcut.description}
        image={shortcut?.logo?.fileUrl}
        url={shortcut.url || shortcut?.file?.fileUrl}
        editMode={editMode}
        openDialog={() => setDialog({ open: true, resource: shortcut, resourceType: 'shortcuts' })}
        color={index === 0 && '#FFFEE8'}
        isSupportTicket={index === 0}
        clearanceLevels={shortcut.clearance}
        updatedBy={shortcut.updatedBy || null}
        updatedOn={shortcut.updatedOn || null}
      />
    </Grid>
  ));

  return (
    <>
      <ItemDialog
        open={dialog.open}
        resource={dialog.resource}
        resourceType={dialog.resourceType}
        handleClose={() => setDialog({ ...dialog, open: false })}
        userName={userName}
      />
      <Typography variant="h5" color="" sx={{ mb: 2 }}>
        Shortcuts
      </Typography>
      <Grid container spacing={2}>
        {renderCards}
        {editMode && (
          <Grid item xs={6}>
            <ResourceCard
              openDialog={() => setDialog({ open: true, resource: null, resourceType: 'shortcuts' })}
              isAddNew
              image="https://newbury-intranet.s3.amazonaws.com/zondicons--add-outline+(2).png"
              label="Add New Shortcut"
              editMode={editMode}
              color="#F0FFF0"
            />
          </Grid>
        )}
      </Grid>
    </>
  );
}
