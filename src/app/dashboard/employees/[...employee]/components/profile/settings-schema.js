import * as yup from 'yup';

export const settingsSchema = yup.object().shape({
  status: yup.string().required('Status is required'),
  roles: yup.array().of(yup.string()).required('At least one role is required'),
});
