'use client';

import { useSettingsContext } from 'src/components/display-settings';

import Shortcuts from './Shortcuts';
import ResourceGroups from './Groups';
import SearchResources from './SearchResources';

import Container from '@mui/material/Container';

export default function View({ resourcesObject, session }) {
  console.log('resourcesObject', resourcesObject);

  const settings = useSettingsContext();

  return (
    <Container maxWidth="xl" sx={{ mt: 3 }}>
      <Shortcuts editMode={settings.editMode} shortcuts={resourcesObject.shortcuts || []} userName={session.user.fullName} />
      <SearchResources resources={resourcesObject.resources} />
      <ResourceGroups editMode={settings.editMode} userName={session.user.fullName} resourceObject={resourcesObject} />
    </Container>
  );
}

/* <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Resources" sx={{ fontSize: '16px' }} />
          <Tab label="Properties" sx={{ fontSize: '16px' }} />
          <Tab label="Employees" sx={{ fontSize: '16px' }} />
        </Tabs>
      </Box> */
