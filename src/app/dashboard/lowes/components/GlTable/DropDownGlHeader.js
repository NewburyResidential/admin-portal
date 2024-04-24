import AutocompleteGroup from 'src/components/form-inputs/AutocompleteGroup';

export default function DropDownGlHeader({ chartOfAccounts }) {
  const fieldName = `masterGlAccount`;

  return (
    <AutocompleteGroup
      options={chartOfAccounts}
      fieldName={fieldName}
      label="GL Account"
      id="grouped-gl-accounts"
      optionLabel="accountName"
      optionId="accountNumber"
      variant="standard"
      sx={{
        pb: '6px',
        borderRadius: '10px',
        '& .MuiAutocomplete-input': {
          color: 'white',
        },
        '& .MuiFormLabel-root': {
          color: '#DCDCDC',
          '&.Mui-focused': {
            color: '#DCDCDC',
          },
        },
      }}
    />
  );
}
