import * as yup from 'yup';

const uncatalogedItemsSchema = yup.object().shape({
  checked: yup.boolean(),
  glAccount: yup.object().when('checked', {
    is: true,
    then: () =>
      yup
        .object()
        .required('GL Account is required when checked')
        .test(
          'is-not-empty',
          'GL Account cannot be blank',
          (value) => value !== null && value !== undefined && Object.keys(value).length !== 0
        ),
    otherwise: () => yup.object().nullable(),
  }),
});

export const itemsSchema = yup.object().shape({
  uncatalogedItems: yup.array().of(uncatalogedItemsSchema).required(),
  pageSettings: yup
    .object()
    .shape({
      page: yup.number().required(),
      rowsPerPage: yup.number().required(),
    })
    .required(),
});
