import * as yup from 'yup';

export const settingsSchema = yup.object().shape({
  status: yup.string().required('Status is required'),
  hasAzureAccount: yup.boolean().required(),
  hasCreditCard: yup.boolean().required(),
  isOnboarding: yup.boolean().required(),

  //Has Credit Card
  
  creditCardDigits: yup.string().when('hasCreditCard', {
    is: true,
    then: () =>
      yup
        .string()
        .required('Credit card digits are required')
        .matches(/^\d{4}$/, 'Must be exactly 4 digits'),
    otherwise: () => yup.string().notRequired(),
  }),

  //Has Azure Account

  roles: yup
    .array()
    .of(yup.string())
    .when('hasAzureAccount', {
      is: true,
      then: () => yup.array().of(yup.string()).required('At least one role is required'),
      otherwise: () => yup.array().of(yup.string()).notRequired(),
    }),

  workEmail: yup.string().when('hasAzureAccount', {
    is: true,
    then: () => yup.string().email('Invalid email format').required('Work email is required'),
    otherwise: () => yup.string().email('Invalid email format').notRequired(),
  }),
});
