import * as yup from 'yup';

export const vendorSchema = yup.object().shape({
  vendor: yup
    .string()
    .matches(/^[A-Za-z0-9]*$/, 'Vendor can only contain letters or numbers')
    .required('Vendor name is required'),
  entityType: yup.string().required('Entity type is required'),
});
