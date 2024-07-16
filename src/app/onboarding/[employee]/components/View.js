'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Fab from '@mui/material/Fab';
import ProfileCover from './ProfileCover';
import TaskCard from './TaskCard';
import WelcomeVideo from './WelcomeVideo';
import BenefitsDialog from './Benefits';
import SupportDrawer from './SupportDrawer';
import ChatIcon from '@mui/icons-material/Chat';

import { fakeRevalidation } from 'src/utils/services/employees/fakeRevalidation';
import { SplashScreen } from 'src/components/loading-screen';
import useDialog from 'src/components/custom-dialog/use-dialog';
import I9StepperDialog from './i9/I9StepperDialog';
import PendingApproval from './PendingApproval';

export default function OnboardingEmployeeView({ employee, hasApprovalRights }) {
  const [tempLoading, setTempLoading] = useState(true); // TO DO fix this
  useEffect(() => {
    fakeRevalidation();
    setTimeout(() => {
      setTempLoading(false);
    }, 2000);
  }, []);

  const router = useRouter();

  const i9Dialog = useDialog();
  const benefitsDialog = useDialog();
  const supportDrawer = useDialog();

  const openPandaSession = (doc) => {
    const parts = doc?.sk?.split('#');
    const id = parts[2];
    router.push(`pandadoc/${id}_${doc.pandaSession}`);
  };

  const functions = {
    i9: () => i9Dialog.handleOpen(),
    benefits: () => benefitsDialog.handleOpen(),
    other: (doc) => {
      if (doc) {
        openPandaSession(doc);
      }
    },
  };

  const tasks = employee.requiredDocuments.map((doc) => {
    const taskFunction = functions[doc.documentType] || functions.other;
    return {
      ...doc,
      function: () => taskFunction(doc),
    };
  });

  tasks.push({ ...employee.onboarding['#ONBOARDING#BENEFITSENROLLMENT'], function: functions.benefits });

  const statusOrder = {
    '#INCOMPLETE': 1,
    '#PENDING': 2,
    '#COMPLETE': 3,
  };

  tasks.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);

  const taskProgress = (tasks.filter(({ status }) => status === '#COMPLETE' || status === '#PENDING').length / tasks.length) * 100;
  const i9Task = tasks.find((task) => task.documentType === 'i9');
  const tasksComplete = Number(taskProgress) >= 99;

  if (tempLoading) {
    return <SplashScreen />;
  }

  // if (tasksComplete) {
  //   return <PendingApproval />;
  // }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SupportDrawer open={supportDrawer.open} handleClose={supportDrawer.handleClose} email={employee.personalEmail} />
      <I9StepperDialog
        employeePk={employee.pk}
        openPandaSession={() => openPandaSession(i9Task)}
        employee={employee}
        hasApprovalRights={hasApprovalRights}
        open={i9Dialog.open}
        handleClose={() => {
          i9Dialog.handleClose();
        }}
      />
      <BenefitsDialog
        employeePk={employee.pk}
        hasApprovalRights={hasApprovalRights}
        open={benefitsDialog.open}
        handleClose={() => {
          benefitsDialog.handleClose();
        }}
      />
      <Container maxWidth="lg" sx={{ pt: 4 }}>
        <ProfileCover employee={employee} progress={taskProgress} />
      </Container>
      <Box sx={{ position: 'relative', flex: 1 }}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#F4F6F8',
            zIndex: -1,
            clipPath: 'polygon(0 35%, 100% 26%, 100% 100%, 0 100%)',
          }}
        />
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            pb: 8,
            pt: 1,
          }}
        >
          <Container maxWidth="lg">
            <WelcomeVideo />
            <Box sx={{ mt: 6 }}>
              {tasks.map((task, index) => (
                <TaskCard
                  task={task}
                  key={index}
                  handleClick={() => {
                    if (task.function) {
                      task.function();
                    } else {
                      console.log('clicked');
                    }
                  }}
                  hasApprovalRights={hasApprovalRights}
                />
              ))}
            </Box>
          </Container>
        </Box>
      </Box>
      <Fab sx={{ position: 'fixed', bottom: 24, right: 24 }} onClick={() => supportDrawer.handleOpen()}>
        <ChatIcon />
      </Fab>
    </Box>
  );
}
