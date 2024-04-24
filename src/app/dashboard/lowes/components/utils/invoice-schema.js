import * as yup from 'yup';

const invoiceArraySchema = yup.object().shape({
  checked: yup.boolean(),
  property: yup.object().when('checked', {
    is: true,
    then: () =>
      yup
        .object()
        .required('Property is required when checked')
        .test(
          'is-not-empty',
          'Property cannot be blank',
          (value) => value !== null && value !== undefined && Object.keys(value).length !== 0
        ),
    otherwise: () => yup.object().nullable(),
  }),
});

export const invoiceSchema = yup.object().shape({
  invoices: yup.array().of(invoiceArraySchema).required(),
  pageSettings: yup
    .object()
    .shape({
      page: yup.number().required(),
      rowsPerPage: yup.number().required(),
    })
    .required(),
});
