import { useState } from 'react';

import Box from '@mui/material/Box';

import ResourceGroupCard from './GroupCard';
import ResourceGroupDialog from './editResourceGroup/Dialog';

export default function ResourceGroups({ editMode, userName, resourceObject }) {
  const [dialog, setDialog] = useState({ open: false, group: null });
  const resourceGroups = resourceObject.resourceGroups || [];

  const resources = resourceObject.resources || [];
  const uniqueGroupIds = new Set(resources.map((resource) => resource.group));
  const filteredGroups = editMode ? resourceGroups : resourceGroups.filter((group) => uniqueGroupIds.has(group.pk));

  return (
    <>
      <ResourceGroupDialog
        open={dialog.open}
        group={dialog.group}
        handleClose={() => setDialog({ ...dialog, open: false })}
        userName={userName}
        resourceObject={resourceObject}
      />

      <Box
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {filteredGroups.map((group, index) => (
          <ResourceGroupCard
            key={group.pk}
            label={group.label}
            icon={group.icon}
            editMode={editMode}
            openDialog={() => setDialog({ open: true, group })}
          />
        ))}
        {editMode && (
          <ResourceGroupCard
            label="Add New Group"
            icon="mdi:plus"
            isAddNew
            color="#F0FFF0"
            openDialog={() => setDialog({ open: true, group: null })}
          />
        )}
      </Box>
    </>
  );
}
