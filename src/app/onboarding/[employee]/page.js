import OnboardingEmployeeView from './components/View';

import getEmployees from 'src/utils/services/employees/getEmployees';
import { s3GetSignedUrl } from 'src/utils/services/sdk-config/aws/S3';
import { getServerSession } from 'next-auth';
import { authOptions } from 'src/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { publicPaths } from 'src/routes/paths';

export default async function page({ params }) {
  const employeePk = (params?.employee || '').match(/-(\d+)$/)?.[1] || null;
  const [employee, { user }] = await Promise.all([getEmployees(employeePk), getServerSession(authOptions)]);

  let hasApprovalRights = false;
  if (employeePk !== user.pk) {
    if (user.roles.includes('admin')) {
      hasApprovalRights = true;
    } else {
      redirect(publicPaths.unAuthorizedApplication(user.personalEmail));
    }
  }

  // Get signed urls for all onboarding documents
  const { onboarding } = employee;
  const updatePromises = Object.keys(onboarding).map(async (key) => {
    if (Object.prototype.hasOwnProperty.call(onboarding, key)) {
      const document = onboarding[key];
      const signedUrl = await s3GetSignedUrl({ bucket: 'newbuy-employee-documents', key: `${employeePk}/${document.sk}` });
      document.url = signedUrl;
    }
  });
  await Promise.all(updatePromises);

  return <OnboardingEmployeeView employee={employee} hasApprovalRights={hasApprovalRights} />;
}
