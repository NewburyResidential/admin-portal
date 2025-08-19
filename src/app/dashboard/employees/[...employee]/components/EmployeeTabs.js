'use client';

import { useState, useCallback, useMemo } from 'react';
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
import AccessChecklist from './onboarding/AccessChecklist';

// ----------------------------------------------------------------------

const DEFAULT_TABS = [
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

const ONBOARDING_TABS = [
  {
    value: 'onboarding',
    label: 'Onboarding',
    icon: <Iconify icon="solar:user-plus-bold" width={24} />,
  },
];

// ----------------------------------------------------------------------

export default function EmployeeTabs({ employee, user, newburyAssets, employees }) {
  const settings = useSettingsContext();

  // Determine which tabs to show based on employee status
  const tabs = useMemo(() => {
    return employee?.status === '#ONBOARDING' ? ONBOARDING_TABS : DEFAULT_TABS;
  }, [employee?.status]);

  // Set initial tab based on available tabs
  const [currentTab, setCurrentTab] = useState(() => {
    return employee?.status === '#ONBOARDING' ? 'onboarding' : 'profile';
  });

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Profile"
        links={[{ name: 'Employees', href: '/dashboard/employees' }, { name: employee?.fullName }]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Card
        sx={{
          mb: 3,
          height: 240, // Change this value - currently 290
        }}
      >
        <ProfileCover
          jobRole="Foreman"
          name={`${employee?.fullName}`}
          avatarUrl={employee?.avatar ? _mock.image.avatar(11) : null}
          coverUrl={_mock.image.cover(3)}
          employeeStatus={employee?.employeeStatus}
          status={employee?.status}
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
          {tabs.map((tab) => (
            <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
          ))}
        </Tabs>
      </Card>

      {currentTab === 'profile' && <ProfileView employee={employee} user={user} />}
      {currentTab === 'performance' && <>Coming Soon!</>}
      {currentTab === 'onboarding' && <AccessChecklist newburyAssets={newburyAssets} employee={employee} employees={employees} />}

      {/* <RequiredDocuments userName={user.fullName} fileInputRef={fileInputRef} employee={employee} setEditDialog={setEditDialog} /> */}

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
