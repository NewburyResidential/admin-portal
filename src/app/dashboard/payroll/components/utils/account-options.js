export const waveNewburyBusinessId = 'QnVzaW5lc3M6Nzk5ODY1YTYtOWYwYS00ODA1LWJlODQtMmQwODI5MTkxZWFj';
export const waveNewburyOperatingId =
  'QWNjb3VudDoxNjc4NzIyNzkyOTY0NTM1MjI2O0J1c2luZXNzOjc5OTg2NWE2LTlmMGEtNDgwNS1iZTg0LTJkMDgyOTE5MWVhYw==';
export const waveNewburyPayrollId = 'QWNjb3VudDoxNjc4NzIyNzkyNzk2NzYzMDYyO0J1c2luZXNzOjc5OTg2NWE2LTlmMGEtNDgwNS1iZTg0LTJkMDgyOTE5MWVhYw==';
export const wavepayrollServicesGl = 'QWNjb3VudDoxNjc5MzAxNTg3MjI4NDcyMDkzO0J1c2luZXNzOjc5OTg2NWE2LTlmMGEtNDgwNS1iZTg0LTJkMDgyOTE5MWVhYw==';

export const entrataGlConversion = {
  624100: 222277, // pyrl wages maintenance
  624200: 222278, // pyrl handling maintenance
  623100: 222285, // pyrl wages office
  623200: 222286, // pyrl handling office
  623300: 222287, // pyrl wages supervisor
  623400: 222288, // pyrl handling supervisor
  625100: 'n/a', // Payroll Wages - General Home Office no gl exists in Entrata
  625200: 'n/a', // Payroll Handling - General Home Office no gl exists in Entrata
};

export const waveGlConversion = {
  624100: 'QWNjb3VudDoxNjc4NzIxMjgxNzY1MTkyNDk4O0J1c2luZXNzOjc5OTg2NWE2LTlmMGEtNDgwNS1iZTg0LTJkMDgyOTE5MWVhYw==', // pyrl wages maintenance
  624200: 'QWNjb3VudDoxNjc5MzAwOTA5NTU0Nzc0NTgwO0J1c2luZXNzOjc5OTg2NWE2LTlmMGEtNDgwNS1iZTg0LTJkMDgyOTE5MWVhYw==', // pyrl handling maintenance
  623100: 'QWNjb3VudDoxNjc4NzIxMjgxNjU2MTQwNTkwO0J1c2luZXNzOjc5OTg2NWE2LTlmMGEtNDgwNS1iZTg0LTJkMDgyOTE5MWVhYw==', // pyrl wages office
  623200: 'QWNjb3VudDoxNjc4NzIxMjgxNzA2NDcyMjQwO0J1c2luZXNzOjc5OTg2NWE2LTlmMGEtNDgwNS1iZTg0LTJkMDgyOTE5MWVhYw==', // pyrl handling office
  623300: 'QWNjb3VudDoxNjc5MzAxMTkwNjczODA1OTM1O0J1c2luZXNzOjc5OTg2NWE2LTlmMGEtNDgwNS1iZTg0LTJkMDgyOTE5MWVhYw==', // pyrl wages supervisor
  623400: 'QWNjb3VudDoxNjc5OTA5NTI4MzQ4NDM4OTExO0J1c2luZXNzOjc5OTg2NWE2LTlmMGEtNDgwNS1iZTg0LTJkMDgyOTE5MWVhYw==', // pyrl handling supervisor
  625100: 'QWNjb3VudDoxODU1MzU0MDM3MTg1MDY1MDk5O0J1c2luZXNzOjc5OTg2NWE2LTlmMGEtNDgwNS1iZTg0LTJkMDgyOTE5MWVhYw==', // Payroll Wages - General Home Office no gl exists in Entrata
  625200: 'QWNjb3VudDoxODU1MzU0MjU1MDAzNjYwNDM3O0J1c2luZXNzOjc5OTg2NWE2LTlmMGEtNDgwNS1iZTg0LTJkMDgyOTE5MWVhYw==', // Payroll Handling - General Home Office no gl exists in Entrata
};

export const wageAccountOptions = {
  623100: {
    label: 'Payroll Wages - Office',
    handlingGl: 623200,
  },
  623300: {
    label: 'Payroll Wages - Supervisor',
    handlingGl: 623400,
  },
  625100: {
    label: 'Payroll Wages - General Home Office',
    handlingGl: 625200,
  },
  624100: {
    label: 'Payroll Wages - Maintenance',
    handlingGl: 624200,
  },
};

export const operatingAccountOptions = {
  625100: {
    label: 'Payroll Wages - General Home Office',
    waveId: 'QWNjb3VudDoxODU1MzU0MDM3MTg1MDY1MDk5O0J1c2luZXNzOjc5OTg2NWE2LTlmMGEtNDgwNS1iZTg0LTJkMDgyOTE5MWVhYw==',
  },
  625200: {
    label: 'Payroll Handling - General Home Office',
    waveId: 'QWNjb3VudDoxODU1MzU0MjU1MDAzNjYwNDM3O0J1c2luZXNzOjc5OTg2NWE2LTlmMGEtNDgwNS1iZTg0LTJkMDgyOTE5MWVhYw==',
  },
  623300: {
    label: 'Payroll Wages - Supervisor',
    waveId: 'QWNjb3VudDoxNjc5MzAxMTkwNjczODA1OTM1O0J1c2luZXNzOjc5OTg2NWE2LTlmMGEtNDgwNS1iZTg0LTJkMDgyOTE5MWVhYw==',
  },
  623400: {
    label: 'Payroll Handling - Supervisor',
    waveId: 'QWNjb3VudDoxNjc5OTA5NTI4MzQ4NDM4OTExO0J1c2luZXNzOjc5OTg2NWE2LTlmMGEtNDgwNS1iZTg0LTJkMDgyOTE5MWVhYw==',
  },
};

export const taxAccountOptions = {
  222405: {
    label: 'Federal Taxes (941/944)',
    waveId: 'QWNjb3VudDoxNjc5Mjk1ODcxNjgzOTY1NjE5O0J1c2luZXNzOjc5OTg2NWE2LTlmMGEtNDgwNS1iZTg0LTJkMDgyOTE5MWVhYw==',
  },
  222406: {
    label: 'Federal Unemployment (940)',
    waveId: 'QWNjb3VudDoxNjc5Mjk2MDQ5NDQ2OTU3NzYwO0J1c2luZXNzOjc5OTg2NWE2LTlmMGEtNDgwNS1iZTg0LTJkMDgyOTE5MWVhYw==',
  },
  222412: {
    label: 'MI Unemployment Tax',
    waveId: 'QWNjb3VudDoxNjc5Mjk2ODU5ODAzMjY3OTMyO0J1c2luZXNzOjc5OTg2NWE2LTlmMGEtNDgwNS1iZTg0LTJkMDgyOTE5MWVhYw==',
  },
  222411: {
    label: 'MI Local Tax',
    waveId: 'QWNjb3VudDoxNjc5Mjk2NzM0MDQxMjU2Nzk0O0J1c2luZXNzOjc5OTg2NWE2LTlmMGEtNDgwNS1iZTg0LTJkMDgyOTE5MWVhYw==',
  },
  222410: {
    label: 'MI Income Tax',
    waveId: 'QWNjb3VudDoxNjc5Mjk2NjI5MzA5NDg1OTAyO0J1c2luZXNzOjc5OTg2NWE2LTlmMGEtNDgwNS1iZTg0LTJkMDgyOTE5MWVhYw==',
  },
  222407: {
    label: 'MA Income Tax',
    waveId: 'QWNjb3VudDoxNjc5Mjk2MjAyNDcxOTQ0OTMxO0J1c2luZXNzOjc5OTg2NWE2LTlmMGEtNDgwNS1iZTg0LTJkMDgyOTE5MWVhYw==',
  },
  222408: {
    label: 'MA Paid Family and Medical Leave',
    waveId: 'QWNjb3VudDoxNjc5Mjk2MzM0OTc4Mzk2OTExO0J1c2luZXNzOjc5OTg2NWE2LTlmMGEtNDgwNS1iZTg0LTJkMDgyOTE5MWVhYw==',
  },
  222409: {
    label: 'MA Unemployment Tax',
    waveId: 'QWNjb3VudDoxNjc5Mjk2NDcwODU3MDY5MzcyO0J1c2luZXNzOjc5OTg2NWE2LTlmMGEtNDgwNS1iZTg0LTJkMDgyOTE5MWVhYw==',
  },
  222415: {
    label: 'TN Unemployment Tax',
    waveId: 'QWNjb3VudDoyMDE0MDc1MjA5Mjg3NTEyNDEyO0J1c2luZXNzOjc5OTg2NWE2LTlmMGEtNDgwNS1iZTg0LTJkMDgyOTE5MWVhYw==',
  },
  222416: {
    label: 'AR Unemployment Tax',
    waveId: 'QWNjb3VudDoyMDMzNDY1MDc1NzI5MjE1NzY5O0J1c2luZXNzOjc5OTg2NWE2LTlmMGEtNDgwNS1iZTg0LTJkMDgyOTE5MWVhYw==',
  },
  222417: {
    label: 'AR Income Tax',
    waveId: 'QWNjb3VudDoyMDMzNDY1MjAxNDU3NjcyNDg3O0J1c2luZXNzOjc5OTg2NWE2LTlmMGEtNDgwNS1iZTg0LTJkMDgyOTE5MWVhYw==',
  },
};

export const depositAccountOptions = {
  ...taxAccountOptions,
  222401: {
    label: 'Dental Insurance',
    waveId: 'QWNjb3VudDoxNjc5Mjk3Mjc4MjI3MDM1MDE1O0J1c2luZXNzOjc5OTg2NWE2LTlmMGEtNDgwNS1iZTg0LTJkMDgyOTE5MWVhYw==',
  },
  222402: {
    label: 'Medical Insurance',
    waveId: 'QWNjb3VudDoxNjc5Mjk3MzQ5NzE0NzUyNDQ2O0J1c2luZXNzOjc5OTg2NWE2LTlmMGEtNDgwNS1iZTg0LTJkMDgyOTE5MWVhYw==',
  },
  222403: {
    label: 'Vision Insurance',
    waveId: 'QWNjb3VudDoxNjc5Mjk3NDM2Njk2MjI4ODI4O0J1c2luZXNzOjc5OTg2NWE2LTlmMGEtNDgwNS1iZTg0LTJkMDgyOTE5MWVhYw==',
  },
  222404: {
    label: 'Direct Deposit Payable',
    waveId: 'QWNjb3VudDoxNjc5ODcyMjc1MTY5NDU2NjMxO0J1c2luZXNzOjc5OTg2NWE2LTlmMGEtNDgwNS1iZTg0LTJkMDgyOTE5MWVhYw==',
  },
  222413: {
    label: 'Retirement Plan Liability',
    waveId: 'QWNjb3VudDoxNzI4NTA4OTI2NzY2Mzk1ODM5O0J1c2luZXNzOjc5OTg2NWE2LTlmMGEtNDgwNS1iZTg0LTJkMDgyOTE5MWVhYw==',
  },
  222414: {
    label: 'Child Support Garnishments',
    waveId: 'QWNjb3VudDoxOTI2MjEwMTYwNDk0MTYyNTExO0J1c2luZXNzOjc5OTg2NWE2LTlmMGEtNDgwNS1iZTg0LTJkMDgyOTE5MWVhYw==',
  },
  222415: {
    label: 'Child Support Garnishments',
    waveId: 'QWNjb3VudDoxOTI2MjEwMTYwNDk0MTYyNTExO0J1c2luZXNzOjc5OTg2NWE2LTlmMGEtNDgwNS1iZTg0LTJkMDgyOTE5MWVhYw==',
  },
};
