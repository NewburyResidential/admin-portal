'use client';
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import { Autocomplete, TextField, ListSubheader } from '@mui/material';
import AutocompleteGroup from 'src/components/form-inputs/AutocompleteGroup';

export default function ItemCard() {
  const AutocompleteCell = (params) => {
    const label = 'Select';
    const id = 'grouped-auto-complete';
    const optionLabel = 'label';
    const optionId = 'id';

    const options = [
      { id: '001', label: 'Cash', category: 'Assets' },
      { id: '002', label: 'Accounts Receivable', category: 'Assets' },
      { id: '003', label: 'Inventory', category: 'Assets' },
      { id: '004', label: 'Prepaid Expenses', category: 'Assets' },
      { id: '005', label: 'Property, Plant, and Equipment', category: 'Assets' },
      { id: '006', label: 'Accounts Payable', category: 'Liabilities' },
      { id: '007', label: 'Accrued Expenses', category: 'Liabilities' },
      { id: '008', label: 'Deferred Revenue', category: 'Liabilities' },
      { id: '009', label: 'Notes Payable', category: 'Liabilities' },
      { id: '010', label: 'Common Stock', category: 'Equity' },
      { id: '011', label: 'Retained Earnings', category: 'Equity' },
      { id: '012', label: 'Dividends Paid', category: 'Equity' },
      { id: '013', label: 'Sales Revenue', category: 'Revenue' },
      { id: '014', label: 'Service Revenue', category: 'Revenue' },
      { id: '015', label: 'Interest Income', category: 'Revenue' },
      { id: '016', label: 'Cost of Goods Sold', category: 'Expenses' },
      { id: '017', label: 'Rent Expense', category: 'Expenses' },
      { id: '018', label: 'Salaries Expense', category: 'Expenses' },
      { id: '019', label: 'Utilities Expense', category: 'Expenses' },
      { id: '020', label: 'Depreciation Expense', category: 'Expenses' },
    ];

    const handleMouseDown = (event) => {
      event.stopPropagation();
    };

    return (
      <Autocomplete
        onClick={handleMouseDown}
        sx={{ width: '100%' }}
        defaultValue={null}
        onChange={(event, newValue) => {
          field.onChange(newValue);
          handleChange(newValue);
        }}
        id={id}
        options={options.sort((a, b) => b.category.localeCompare(a.category))}
        groupBy={(option) => option.category}
        getOptionLabel={(option) => option[optionLabel]}
        renderInput={(params) => <TextField {...params} label={label} onClick={handleMouseDown} />}
        isOptionEqualToValue={(option, selected) => option[optionId] === selected[optionId]}
        renderOption={(props, option) => (
          <li {...props} key={option[optionId]}>
            {option[optionLabel]}
          </li>
        )}
        renderGroup={(params) => (
          <div key={params.key}>
            <ListSubheader
              sx={{ fontWeight: 'bold', color: (theme) => (theme.palette.mode === 'light' ? 'primary.darker' : theme.palette.grey[500]) }}
            >
              {params.group}
            </ListSubheader>
            {params.children}
          </div>
        )}
      />
    );
  };

  const items = [
    {
      sku: '36943',
      price: '$7.98',
      category: 'Outdoors',
      subCategory: 'Outdoor Tools & Equipment',
      title: 'Project Source 0.396-Gallons Plastic Sprayer',
      imageUrl: 'https://mobileimages.lowes.com/productimages/20f38d16-d685-407e-989b-c73950f3a16e/01188991.jpg?size=pdhism',
    },
    {
      sku: '12881',
      price: '$15.49',
      category: 'Lighting',
      subCategory: 'Bulbs & Lamps',
      title: 'EcoSmart 60-Watt Equivalent A19 Non-Dimmable LED Light Bulb Soft White (4-Pack)',
      imageUrl: 'https://mobileimages.lowes.com/productimages/66275b94-05f4-4c66-adfd-1cd9d75b106a/05466196.jpg?size=xl',
    },
    {
      sku: '49216',
      price: '$24.99',
      category: 'Hardware',
      subCategory: 'Door Knobs & Handles',
      title: 'Kwikset Polo Satin Nickel Passage Door Knob',
      imageUrl: 'https://mobileimages.lowes.com/product/converted/014045/014045324779.jpg?size=xl',
    },
  ];

  const columns = [
    {
      field: 'title',
      headerName: 'Title',
      flex: 2,
      renderCell: (params) => (
        <div
          style={{
            fontWeight: 'bold',
            whiteSpace: 'normal', // Allows text to wrap
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: 'normal',
          }}
        >
          {params.value}
        </div>
      ),
    },

    { field: 'category', headerName: 'Category', flex: 1, align: 'center' },
    // { field: 'subCategory', headerName: 'Subcategory', flex: 1 },
    { field: 'price', headerName: 'Price', flex: 1, align: 'center' },

    {
      field: 'image',
      headerName: 'Image',
      flex: 1,
      align: 'center',
      renderCell: (params) => (
        <Box
          component="img"
          sx={{
            height: '88%',
            width: 'auto',
            cover: 'contain',
          }}
          alt={params.row.title}
          src={params.row.imageUrl}
        />
      ),
    },
    {
      field: 'autocomplete',
      headerName: 'Dropdown',
      flex: 1,
      editable: true,
      align: 'center',
      renderCell: AutocompleteCell,
    },
  ];

  const rows = items.map((item, index) => ({
    id: index, // or any unique identifier
    ...item,
  }));

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rowHeight={90} // Set the row height to 70 pixels
        rows={rows}
        columns={columns}
        pagination={false}
        checkboxSelection
        sx={{
          '& .MuiDataGrid-columnHeaderTitleContainer': {
            justifyContent: 'center', // Center align the container
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            flex: 1,
            textAlign: 'center', // Ensure the text itself is centered
          },
        }}
      />
    </div>
  );
}
