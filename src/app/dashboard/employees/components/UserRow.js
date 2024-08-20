import PropTypes from 'prop-types';
// @mui
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';
//
//import UserQuickEditForm from './user-quick-edit-form';

// ----------------------------------------------------------------------

export default function UserTableRow({ row, onSelectRow }) {
  const { firstName, lastName, avatar, hireDate, role, employeeStatus, personalEmail, workEmail, mobilePhone } = row;
  const fullName = `${firstName} ${lastName}`;
  console.log('row', row);
  return (
    <>
      <TableRow hover onClick={onSelectRow}>
        <TableCell sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <Avatar src={avatar} sx={{ mr: 2, ml: 2 }}>
            {firstName.charAt(0).toUpperCase()}
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

UserTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
