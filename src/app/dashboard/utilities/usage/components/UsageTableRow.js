import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { Icon } from '@iconify/react';

export default function UsageTableRow({ row, onEdit, isSelected, onSelect }) {
  return (
    <TableRow style={isSelected ? { opacity: 1, cursor: 'pointer' } : { opacity: 0.5, cursor: 'pointer' }} onClick={onSelect}>
      <TableCell padding="checkbox">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      </TableCell>
      <TableCell>{row.meter}</TableCell>
      <TableCell align="right">{typeof row.totalUsage === 'number' ? row.totalUsage.toLocaleString() : row.totalUsage}</TableCell>
      <TableCell align="right">{typeof row.dailyAvg === 'number' ? row.dailyAvg.toLocaleString() : row.dailyAvg}</TableCell>
      <TableCell align="right">-</TableCell>
      <TableCell align="right">-</TableCell>
      <TableCell align="right">
        <IconButton
          size="small"
          sx={{ ml: 1 }}
          onClick={(e) => {
            e.stopPropagation();
            onEdit(row);
          }}
          aria-label="Edit Meter"
        >
          <Icon icon="mdi:pencil" width={18} height={18} />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
