'use client';

import { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Shortcuts from './Information/Shortcuts';
import { useSettingsContext } from 'src/components/display-settings';

export default function TabOptions() {
  const settings = useSettingsContext();

  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Tabs value={value} onChange={handleChange} >
          <Tab label="Resources" />
          <Tab label="Properties" />
        </Tabs>
      </Box>
      < br />
      < br />
      <Shortcuts editMode={settings.editMode} />
    </>
  );
}
