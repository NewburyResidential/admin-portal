import TextField from '@mui/material/TextField';

export default function TextFieldPostDate({ postDate, setPostDate }) {
  const handleChange = (event) => {
    let { value } = event.target;
    value = value.replace(/[^0-9/]/g, '');
    if (value.length === 2 && !value.includes('/')) {
      value += '/';
    }
    if (value.length <= 7) {
      setPostDate(value);
    }
  };

  return (
    <TextField
      label={postDate ? 'Post Date' : 'MM/YYYY'}
      placeholder="MM/YYYY"
      value={postDate}
      onChange={handleChange}
      variant="outlined"
    />
  );
}
