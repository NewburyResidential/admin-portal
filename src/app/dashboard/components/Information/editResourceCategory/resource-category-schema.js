import * as yup from 'yup';

export const resourceCategorySchema = yup.object().shape({
  pk: yup.string().required(),
  resourceType: yup.string().required(),
  group: yup.string().required(),
  label: yup.string().required(),
  description: yup.string().required(),
});
