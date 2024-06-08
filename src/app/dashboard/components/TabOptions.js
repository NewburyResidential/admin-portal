'use client';

import { useState } from 'react';
import { useSettingsContext } from 'src/components/display-settings';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import Shortcuts from './Information/Shortcuts';
import ResourceGroups from './Information/Groups';
import SearchResources from './Information/SearchResources';
//import UserList from './Employees/UserList';

export default function TabOptions({ resourcesObject, session }) {
  const settings = useSettingsContext();

  const [value, setValue] = useState(2);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Resources" sx={{ fontSize: '16px' }} />
          <Tab label="Properties" sx={{ fontSize: '16px' }} />
          {/* <Tab label="Employees" sx={{ fontSize: '16px' }} /> */}
        </Tabs>
      </Box>
      <br />
      <br />
      <Container maxWidth="lg">
        {value === 0 ? (
          <>
            <Shortcuts editMode={settings.editMode} shortcuts={resourcesObject.shortcuts || []} userName={session.user.name} />
            <SearchResources resources={resourcesObject.resources} />
            <ResourceGroups editMode={settings.editMode} userName={session.user.name} resourceObject={resourcesObject} />
          </>
        ) : value === 1 ? (
          <h1>Properties</h1>
        ) : (
          <h1>Employees</h1>
          // <UserList employees={employees} />
        )}
      </Container>
    </>
  );
}
