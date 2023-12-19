import { TextField } from '@mui/material';

export default function TextFieldNote({ id, allocation, handleNoteChange }) {
  const handleChange = (event) => {
    handleNoteChange(id, allocation.id, event.target.value);
  };

  return <TextField autoComplete="off" fullWidth label="Notes" variant="outlined" value={allocation.note ? allocation.note : ''} onChange={handleChange} />;
}
