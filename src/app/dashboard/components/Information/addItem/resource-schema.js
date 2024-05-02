import * as yup from 'yup';

const fileSchema = yup.object().shape({
  fileUrl: yup.string().required(),
  fileName: yup.string().required(),
});

export const resourceSchema = yup.object().shape({
  category: yup.string().required(),
  label: yup.string().required(),
  description: yup.string().nullable(),
  clearance: yup.array().of(yup.string()).min(1).required(),
  uploadType: yup.string().required().oneOf(['website', 'file']),
  logo: yup
    .mixed()
    .nullable()
    .test('is-object-or-null', 'Logo must be either a valid file object or null', (value) => {
      if (value === null || value === '') return true;
      if (typeof value === 'object' && value !== null) {
        return fileSchema.isValidSync(value);
      }
      return typeof value === 'string';
    }),
  url: yup.string().when('uploadType', {
    is: 'website',
    then: () => yup.string().url('include a vaild url such as: "https://google.com"').required(),
    otherwise: () => yup.string().nullable(),
  }),
  file: yup.object().when('uploadType', {
    is: 'file',
    then: () => fileSchema.typeError('file is a required field').required(),
    otherwise: () => yup.string().nullable(),
  }),
});
