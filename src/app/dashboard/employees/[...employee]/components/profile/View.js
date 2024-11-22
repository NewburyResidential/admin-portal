import Settings from './Settings';
import Information from './Information';
import Box from '@mui/material/Box';

export default function ProfileView({ employee, user }) {
  return (
    <>
      <Information employee={employee} />
      <Box mt={5}>
        {user?.roles.includes('admin') && <Settings employee={employee} user={user} />}
        {/* <Documents employee={employee} user={user} /> */}
      </Box>
    </>
  );
}
