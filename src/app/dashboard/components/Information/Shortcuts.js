import { useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import ShortcutCard from './ShortcutCard';
import ItemDialog from './addItem/Dialog';

const viewMode = 'edit';

const shortcuts = [
  {
    label: 'Create A Support Ticket',
    description: 'Click and fill out the form to create a support ticket',
    image: 'https://cdn.theorg.com/7b1a68d0-10e8-4719-8395-333affa9b537_medium.jpg',
    url: 'http://localhost:3034/dashboard/',
  },
  {
    label: 'example 2',
    description: 'example 2 description',
    image: 'https://cdn.theorg.com/7b1a68d0-10e8-4719-8395-333affa9b537_medium.jpg',
    url: 'http://localhost:3034/dashboard/',
  },
  {
    label: 'example 3',
    description: 'example 3 description',
    image: 'https://cdn.theorg.com/7b1a68d0-10e8-4719-8395-333affa9b537_medium.jpg',
    url: 'http://localhost:3034/dashboard/',
  },
  {
    label: 'example 4',
    description: 'example 4 description',
    image: 'https://cdn.theorg.com/7b1a68d0-10e8-4719-8395-333affa9b537_medium.jpg',
    url: 'http://localhost:3034/dashboard/',
  },
];

export default function Shortcuts({ editMode }) {
  const [openDialog, setOpenDialog] = useState(false);

  const renderCards = shortcuts.map((shortcut, index) => (
    <Grid item xs={12} sm={index === 0 ? 12 : 6} key={shortcut.label}>
      <ShortcutCard
        label={shortcut.label}
        description={shortcut.description}
        image={shortcut.image}
        url={shortcut.url}
        editMode={editMode}
        openDialog={() => setOpenDialog(true)}
      />
    </Grid>
  ));

  return (
    <Container maxWidth="lg">
      <ItemDialog open={openDialog} handleClose={() => setOpenDialog(false)} />
      <Grid container spacing={2}>
        {renderCards}
        {editMode && (
          <Grid item xs={6}>
            <ShortcutCard
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
