'use client';

import { useState, useCallback, useRef } from 'react';
// @mui
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Button from '@mui/material/Button';
// routes

// components
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/display-settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//

import ProfileCover from './ProfileCover';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { _mock } from 'src/_mock';
import ProfileDetails from './ProfileDetails';
import UpdateProfileAvatar from './UpdateProfileAvatar';
import sendDocumentWithUrl from 'src/utils/services/pandadoc/send-document-with-url';
import { useRouter } from 'next/navigation';
import linkToDocument from 'src/utils/services/pandadoc/link-to-document';
import createLiveLink from 'src/utils/services/pandadoc/link-to-iframe';
import Documents from './DocumentCard';
import { Box, Grid, IconButton, Typography } from '@mui/material';
import DocumentCard from './DocumentCard';
import OtherDocuments from './Information/OtherDocuments';
import EditFileDialog from './editFile/Dialog';

// ----------------------------------------------------------------------

const TABS = [
  // {
  //   value: 'profile',
  //   label: 'Profile',
  //   icon: <Iconify icon="solar:user-id-bold" width={24} />,
  // },
  // {
  //   value: 'review',
  //   label: 'Performance',
  //   icon: <Iconify icon="mingcute:performance-fill" width={24} />,
  // },
  // {
  //   value: 'documents',
  //   label: 'Documents',
  //   icon: <Iconify icon="mdi:files" width={24} />,
  // },
];

// ----------------------------------------------------------------------

export default function UserProfileView({ employee }) {
  console.log(employee);
  const [editDialog, setEditDialog] = useState({ open: false });

  const fileInputRef = useRef(null);

  const settings = useSettingsContext();
  const { user } = useMockedUser();
  const router = useRouter();

  const [currentTab, setCurrentTab] = useState('profile');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const pandaSendDocumentWithUrl = async () => {
    console.log('launch panda doc');
    const response = await sendDocumentWithUrl();
    console.log(response);
  };

  const pandaCreateLiveLink = async () => {
    console.log('launch panda doc');
    const response = await createLiveLink();
    const cleanedData = JSON.parse(response);
    if (cleanedData.id) {
      router.push(`/dashboard/panda/?session=${cleanedData.id}`);
    }

    console.log(response);
    console.log(cleanedData);
  };
  const pandaLinkToDocument = async () => {
    console.log('launch panda doc');
    const response = await linkToDocument();
    console.log(response);
    window.open(response, '_blank');
    return `Opened document link: ${response}`;
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <EditFileDialog
        open={editDialog.open}
        documentData={editDialog.documentData}
        handleClose={() => {
          setEditDialog({ ...editDialog, open: false });
          fileInputRef.current.value = '';
        }}
        userName={'test'}
      />
      <CustomBreadcrumbs
        heading="Profile"
        links={[{ name: 'Employees', href: 'test' }, { name: user?.displayName }]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Card
        sx={{
          mb: 3,
          height: 290,
        }}
      >
        <ProfileCover
          role={'Foreman'}
          name={employee?.firstName + ' ' + employee?.lastName}
          avatarUrl={employee?.avatar ? _mock.image.avatar(11) : null}
          coverUrl={_mock.image.cover(3)}
        />

        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            width: 1,
            bottom: 0,
            zIndex: 9,
            position: 'absolute',
            bgcolor: 'background.paper',
            [`& .${tabsClasses.flexContainer}`]: {
              pr: { md: 3 },
              justifyContent: {
                sm: 'center',
                md: 'flex-end',
              },
            },
          }}
        >
          {TABS.map((tab) => (
            <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
          ))}
        </Tabs>
      </Card>

      {currentTab === 'profile' && <ProfileDetails user={user} />}
      <Typography variant="h6" mb={2} mt={6}>
        Required Forms
      </Typography>

      <Grid container spacing={3}>
        {employee.requiredDocuments.map((document) => (
          <Grid item xs={6}>
            <DocumentCard document={document} pandaLinkToDocument={pandaLinkToDocument} />
          </Grid>
        ))}
      </Grid>
      <OtherDocuments
        fileInputRef={fileInputRef}
        employee={employee}
        editDialog={editDialog}
        setEditDialog={setEditDialog}
        employeePk={employee.pk}
      />
    </Container>
  );
}
