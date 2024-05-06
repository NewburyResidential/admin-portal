import * as yup from 'yup';

export const resourceGroupSchema = yup.object().shape({
  pk: yup.string().required(),
  resourceType: yup.string().required(),
  group: yup.string().required(),
  label: yup
    .string()
    .matches(/^[a-zA-Z\s]+$/, 'Label should only contain letters and spaces')
    .required(),
  icon: yup
    .string()
    .test('is-iconify-icon', 'Icon should be from Iconify ex: "fluent:money-24-regular"', (value) => {
      const iconifyRegex = /^[\w-]+:[\w-]+$/;
      return iconifyRegex.test(value);
    })
    .required(),
});
