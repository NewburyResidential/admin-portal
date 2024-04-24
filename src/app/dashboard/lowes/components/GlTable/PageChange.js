import { useFormContext } from 'react-hook-form';
import TablePagination from '@mui/material/TablePagination';

export default function PageChange({ uncatalogedItems, page, rowsPerPage }) {
  const { setValue } = useFormContext();

  const handleChangePage = (event, newPage) => {
    setValue('pageSettings.page', newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setValue('pageSettings.rowsPerPage', parseInt(event.target.value, 10));
    setValue('pageSettings.page', 0);
  };

  return (
    <TablePagination
      sx={{ color: 'white' }}
      rowsPerPageOptions={[10, 25, 50]}
      component="div"
      count={uncatalogedItems.length}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  );
}
