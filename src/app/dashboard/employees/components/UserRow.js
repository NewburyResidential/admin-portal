import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
// hooks
// components
import Label from 'src/components/label';

//
//import UserQuickEditForm from './user-quick-edit-form';

// ----------------------------------------------------------------------

export default function UserTableRow({ row, onSelectRow }) {
  const { fullName, avatar, employeeStatus, personalEmail, mobilePhone } = row;
  return (
    <>
      <TableRow hover onClick={onSelectRow}>
        <TableCell sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <Avatar src={avatar} sx={{ mr: 2, ml: 2 }}>
            {fullName?.charAt(0).toUpperCase()}
          </Avatar>

          <ListItemText
            primary={fullName}
            secondary={personalEmail}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>

        {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>{workEmail ? workEmail : personalEmail}</TableCell> */}

        <TableCell align='center' sx={{ whiteSpace: 'nowrap' }}>{mobilePhone}</TableCell>

        <TableCell align='center' >
          <Label
            variant="soft"
            color={(employeeStatus === 'Active' && 'success') || (employeeStatus === 'Terminated' && 'error') || 'default'}
          >
            {employeeStatus}
          </Label>
        </TableCell>
        {/* 
        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <Tooltip title="Quick Edit" placement="top" arrow>
            <IconButton color={quickEdit.value ? 'inherit' : 'default'} onClick={quickEdit.onTrue}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>

          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell> */}
      </TableRow>

      {/* <UserQuickEditForm currentUser={row} open={quickEdit.value} onClose={quickEdit.onFalse} /> */}
    </>
  );
}


