import * as Yup from 'yup';

Yup.addMethod(Yup.string, 'isValidDate', function (message) {
  return this.test('isValidDate', message, function (value) {
    const { path, createError } = this;
    const datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
    return value && datePattern.test(value) ? true : createError({ path, message });
  });
});

export const step1Schema = (isAdmin) => {
  return Yup.object().shape({
    hasLicense: Yup.boolean().required("Driver's license status is required"),
    identificationOne: Yup.string().required('Identification type is required'),
    licenseExpiration: Yup.string().when('hasLicense', {
      is: true,
      then: () =>
        isAdmin
          ? Yup.string().required('License expiration date is required').isValidDate('Date must be in MM/dd/yyyy format')
          : Yup.string().nullable(),
      otherwise: () => Yup.string().nullable(),
    }),
    file: Yup.mixed()
      .required('File is required')
      .test('fileExists', 'File is required', (value) => value !== null),
  });
};
export const step2Schema = Yup.object().shape({
  identificationTwo: Yup.string().required('Identification type is required'),
  file: Yup.mixed()
    .required('File is required')
    .test('fileExists', 'File is required', (value) => value !== null),
});
