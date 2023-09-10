import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import { DataGrid } from '@mui/x-data-grid';
import Iconify from 'src/components/iconify';
import { _mock } from 'src/_mock';
import { Box, Tooltip, Typography } from '@mui/material';
import Link from 'next/link';

const cellStyles = (params) => {
  return;
};

// Define a custom cell renderer for the firstName column
const billLinkColumn = {
  field: 'billImageLink',
  headerName: 'Image',
  align: 'center',
  headerAlign: 'center',
  sortable: false,
  disableColumnMenu: true,
  renderCell: (params) => (
    <Link href={`${params.value}`} target="_blank">
      <IconButton>
        <Iconify icon="solar:bill-list-linear" />
      </IconButton>
    </Link>
  ),
};

const editableColumn = (headerName, value) => {
  return {
    field: value,
    headerName,
    align: 'center',
    headerAlign: 'center',
    editable: true,
    disableColumnMenu: true,
    flex: 1,
    renderCell: (params) => {
      const confidence = params.row.confidence[value];
      return (
        <Box
          sx={{
            backgroundColor: confidence < 1 ? '#FFCCCB' : 'initial',
            width: '100%',
            height: '100%',
            paddingLeft: '10px',
            paddingRight: '10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography>{params.value}</Typography>
          {confidence < 1 && (
            <Typography variant="caption" fontSize={'11px'} color={'#637381'}>
              {Number(confidence).toFixed(2).replace(/^0/, '')}
            </Typography>
          )}
        </Box>
      );
    },
  };
};

const columns = [
  editableColumn('Utility', 'utilityType'),
  editableColumn('Meter Number', 'meterNumber'),
  editableColumn('Bill Month', 'billMonth'),
  editableColumn('Start Service', 'startReadDate'),
  editableColumn('End Service', 'endReadDate'),
  editableColumn('Amount', 'amount'),
  billLinkColumn,
];

export default function ApprovalDataTable({ data }) {
  return (
    <DataGrid
      sx={{
        '& .MuiDataGrid-cell': {
          p: 0,
        },
      }}
      columns={columns}
      rows={data}
      checkboxSelection
      disableRowSelectionOnClick
      density={'comfortable'}
      pageSizeOptions={[]}
    />
  );
}

ApprovalDataTable.propTypes = {
  data: PropTypes.array,
};
