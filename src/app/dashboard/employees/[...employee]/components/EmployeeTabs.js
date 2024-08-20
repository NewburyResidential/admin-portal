'use client';

import { useState, useCallback } from 'react';
// @mui
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
// routes

// components
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/display-settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//

import ProfileCover from './ProfileCover';
import { _mock } from 'src/_mock';

import ProfileView from './profile/View';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'profile',
    label: 'Profile',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  {
    value: 'performance',
    label: 'Performance',
    icon: <Iconify icon="mingcute:performance-fill" width={24} />,
  },
];

// ----------------------------------------------------------------------

export default function EmployeeTabs({ employee, user }) {
  const settings = useSettingsContext();

  const [currentTab, setCurrentTab] = useState('profile');
  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Profile"
        links={[{ name: 'Employees', href: '/dashboard/employees' }, { name: `${employee.firstName  } ${  employee.lastName}` }]}
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
          jobRole="Foreman"
          name={`${employee?.firstName} ${employee?.lastName}`}
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


      {currentTab === 'profile' && <ProfileView employee={employee} user={user} />}
      {currentTab === 'performance' && <>Coming Soon!</>}


      {/* <RequiredDocuments userName={user.name} fileInputRef={fileInputRef} employee={employee} setEditDialog={setEditDialog} /> */}

      {/* <OtherDocuments
        fileInputRef={fileInputRef}
        employee={employee}
        editDialog={editDialog}
        setEditDialog={setEditDialog}
        employeePk={employee.pk}
      /> */}
    </Container>
  );
}
