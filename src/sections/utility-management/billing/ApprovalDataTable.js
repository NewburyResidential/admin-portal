import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import { DataGrid } from '@mui/x-data-grid';
import Iconify from 'src/components/iconify';
import { _mock } from 'src/_mock';
import { Box, Tooltip, Typography } from '@mui/material';

const data_sample = [
  {
    meterNumber: 222,
    billMonth: 'April',
    utilityType: 'gas',
    startReadDate: '6',
    endReadDate: '7',
    billImageLink: 'link',
    id: 2,
    confidence: {
      meterNumber: 1,
      billMonth: 1,
      utilityType: 1,
      startReadDate: 1,
      endReadDate: 1,
    },
  },
];

const cellStyles = (params) => {
  return {
    backgroundColor: params.row.endReadDate.confidence <= 0.9 ? 'yellow' : 'initial',
    width: '100%',
    height: '100%',
    paddingLeft: '10px',
    paddingRight: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };
};

// Define a custom cell renderer for the firstName column
const billLinkColumn = {
  field: 'billImageLink',
  headerName: 'Image',
  align: 'center',
  headerAlign: 'center',
  sortable: false,
  disableColumnMenu: true,
  renderCell: () => (
    <IconButton>
      <Iconify icon="solar:bill-list-linear" />
    </IconButton>
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
      const styles = cellStyles(params);
      console.log(params)
      return (
        <Box sx={styles}>
          <Typography>{params.value}</Typography>
          <Typography variant="caption" fontSize={'11px'} color={'#637381'}>
          {params.row.confidence[value]}
          </Typography>
        </Box>
      );
    },
  };
};

const columns = [
  editableColumn('Meter Number', 'meterNumber'),
  editableColumn('Utility', 'utilityType'),
  editableColumn('Bill Month', 'billMonth'),
  editableColumn('Start Service', 'startReadDate'),
  editableColumn('End Service', 'endReadDate'),
  billLinkColumn,
];

export default function ApprovalDataTable() {
  return (
    <DataGrid
      sx={{
        '& .MuiDataGrid-cell': {
          p: 0,
        },
      }}
      columns={columns}
      rows={data_sample}
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
