import * as yup from 'yup';

const fileSchema = yup.object().shape({
  fileUrl: yup.string().required(),
  fileName: yup.string().required(),
});

const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const resourceSchema = yup.object().shape({
  resourceType: yup.string().required(),
  label: yup.string().required(),
  description: yup.string().nullable(),
  clearance: yup.array().of(yup.string()).min(1).required(),
  uploadType: yup.string().required().oneOf(['website', 'file']),
  category: yup.string().when('resourceType', {
    is: 'resources',
    then: () => yup.string().required('Category is required').matches(uuidV4Regex, 'Category must be a valid UUID v4'),
    otherwise: () => yup.string().notRequired(),
  }),
  group: yup.string().when('resourceType', {
    is: 'resources',
    then: () => yup.string().required('Group is required').matches(uuidV4Regex, 'Group must be a valid UUID v4'),
    otherwise: () => yup.string().notRequired(),
  }),
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
