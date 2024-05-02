import { useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import ShortcutCard from './ShortcutCard';
import ItemDialog from './addItem/Dialog';

function prioritizeItem(items, targetLabel) {
  const targetItem = items.find((item) => item.label === targetLabel);
  const otherItems = items.filter((item) => item.label !== targetLabel);
  return targetItem ? [targetItem, ...otherItems] : [...otherItems];
}

export default function Shortcuts({ editMode, shortcuts, userName }) {
  const [dialog, setDialog] = useState({ open: false, resource: null });

  const prioritizedShortcuts = prioritizeItem(shortcuts, 'Create A Support Ticket');

  const renderCards = prioritizedShortcuts.map((shortcut, index) => (
    <Grid item xs={12} sm={index === 0 ? 12 : 6} key={shortcut.pk}>
      <ShortcutCard
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
        openDialog={() => setDialog({ open: true, resource: shortcut })}
        color={index === 0 && '#FFFEE8'}
        isSupportTicket={index === 0}
        clearanceLevels={shortcut.clearance}
        updatedBy={shortcut.updatedBy || null}
        updatedOn={shortcut.updatedOn || null}
      />
    </Grid>
  ));

  return (
    <Container maxWidth="lg">
      <ItemDialog open={dialog.open} resource={dialog.resource} handleClose={() => setDialog({ ...dialog, open: false })} userName={userName} />
      <Grid container spacing={2}>
        {renderCards}
        {editMode && (
          <Grid item xs={6}>
            <ShortcutCard
              openDialog={() => setDialog({ open: true, resource: null })}
              isAddNew={true}
              image="https://newbury-intranet.s3.amazonaws.com/zondicons--add-outline+(2).png"
              label="Add New Shortcut"
              editMode={editMode}
              color="#F0FFF0"
            />
          </Grid>
        )}
      </Grid>
    </Container>
  );
}
