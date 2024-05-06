'use client';

import { m } from 'framer-motion';
import { useState } from 'react';
import { useSettingsContext } from 'src/components/display-settings';

import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Iconify from 'src/components/iconify';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';

import ResourceCard from './ResourceCard';
import ResourceDialog from './editResource/Dialog';
import ResourceCategoryDialog from './editResourceCategory/Dialog';

export default function ResourceGroupView({ resourceGroup, user, categories, categoryOptions }) {
  const settings = useSettingsContext();
  const editMode = settings.editMode;

  const [categoryDialog, setCategoryDialog] = useState({ open: false, category: null });
  const [resourceDialog, setResourceDialog] = useState({
    open: false,
    resource: null,
    resourceType: 'resources',
    categoryId: null,
  });

  let filteredCategories = categories;
  if (!editMode) {
    filteredCategories = categories.filter((category) => category.resources.length > 0);
  }

  return (
    <>
      <ResourceDialog
        open={resourceDialog.open}
        resource={resourceDialog.resource}
        resourceType={resourceDialog.resourceType}
        handleClose={() => setResourceDialog({ ...resourceDialog, open: false })}
        userName={user.name}
        categoryId={resourceDialog.categoryId}
        groupId={resourceGroup.pk}
        categoryOptions={categoryOptions}
      />
      <ResourceCategoryDialog
        open={categoryDialog.open}
        category={categoryDialog.category}
        handleClose={() => setCategoryDialog({ ...categoryDialog, open: false })}
        userName={user.name}
        groupId={resourceGroup.pk}
      />
      <Container>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Iconify
              icon={resourceGroup.icon}
              sx={{
                width: 40,
                height: '100%',
                mr: 3,
              }}
            ></Iconify>
            <h1>{resourceGroup.label}</h1>
          </Box>

          {editMode && (
            <m.div whileHover={{ scale: 0.99, transition: { duration: 0.2 } }}>
              <Card
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  height: '78px',
                  py: 0,
                  px: 1.5,
                  backgroundColor: '#F0FFF0',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setCategoryDialog({ open: true, category: null });
                }}
              >
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Iconify
                    icon="mdi:plus"
                    sx={{
                      width: 48,
                      height: 48,
                      fontSize: '2rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#556B2F',
                    }}
                  />
                  <Typography variant="body1">Add New Category</Typography>
                </CardContent>
              </Card>
            </m.div>
          )}
        </Box>
        <Box sx={{ width: '100%' }}>
          {filteredCategories.map((category) => (
            <>
              <Box key={category.pk} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, mb: 3 }}>
                <Box>
                  <Typography variant="h5" sx={{ my: 1 }}>
                    {category.label}
                  </Typography>
                  <Typography variant="body1" sx={{ my: 1, color: 'grey', fontSize: '16px' }}>
                    {category.description}
                  </Typography>
                </Box>
                {editMode && (
                  <IconButton
                    onClick={() => {
                      setCategoryDialog({ open: true, category: category });
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                )}
              </Box>
              <Grid container spacing={editMode ? 2 : 0}>
                {category.resources.map((resource) => (
                  <Grid item xs={12}>
                    <ResourceCard
                      openDialog={() =>
                        setResourceDialog({
                          open: true,
                          resource: resource,
                          resourceType: 'resources',
                          categoryId: category.pk,
                        })
                      }
                      image="https://newbury-intranet.s3.amazonaws.com/zondicons--add-outline+(2).png"
                      label={resource.label}
                      description={resource.description}
                      editMode={editMode}
                      clearanceLevels={resource.clearance}
                      isResource={true}
                      uploadType={resource.uploadType}
                      url={resource.url || resource?.file?.fileUrl}
                      fileName={resource?.file?.fileName || null}
                      updatedOn={resource.updatedOn || null}
                      updatedBy={resource.updatedBy || null}
                    />
                  </Grid>
                ))}
                {editMode && (
                  <Grid item xs={12}>
                    <ResourceCard
                      openDialog={() =>
                        setResourceDialog({
                          open: true,
                          resource: null,
                          resourceType: 'resources',
                          categoryId: category.pk,
                        })
                      }
                      isAddNew={true}
                      isResource={true}
                      image="https://newbury-intranet.s3.amazonaws.com/zondicons--add-outline+(2).png"
                      label="Add New Resource"
                      editMode={editMode}
                      color="#F0FFF0"
                    />
                  </Grid>
                )}
              </Grid>
            </>
          ))}
        </Box>
      </Container>
    </>
  );
}
