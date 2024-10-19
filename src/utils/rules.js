import * as yup from 'yup';

export const getRules = (getValues) => ({
  username: {
    required: {
      value: true,
      message: 'required-field',
    },
    maxLength: {
      value: 50, 
      message: 'rule-length',
    },
    minLength: {
      value: 3, 
      message: 'rule-length',
    },
  },
  email: {
    required: {
      value: true,
      message: 'required-field',
    },
    pattern: {
      value: /^\S+@\S+\.\S+$/,
      message: 'rule-email',
    },
    maxLength: {
      value: 160,
      message: 'rule-length',
    },
    minLength: {
      value: 6,
      message: 'rule-length',
    },
  },
  password: {
    required: {
      value: true,
      message: 'required-field',
    },
    maxLength: {
      value: 160,
      message: 'rule-length',
    },
    minLength: {
      value: 6,
      message: 'rule-length',
    },
  },
  confirm_password: {
    required: {
      value: true,
      message: 'required-field',
    },
    maxLength: {
      value: 160,
      message: 'rule-length',
    },
    minLength: {
      value: 6,
      message: 'rule-length',
    },
    validate: getValues
      ? (value) => value === getValues('password') || 'rule-confirm-pass'
      : undefined,
  },
});


const handleConfirmPasswordYup = (refString) => {
  return yup
    .string()
    .required('required-field')
    .min(6, 'rule-length')
    .max(160, 'rule-length')
    .oneOf([yup.ref(refString)], 'rule-confirm-pass');
};


export const schema = yup.object({
  name: yup.string().required('required-field'),
  email: yup.string().required('required-field').email('rule-email').min(6, 'rule-length').max(160, 'rule-length'),
  phone: yup.string().required('required-field').max(20, 'phone-length'),
  otp: yup.string().required('required-field'),
  password: yup.string().required('required-field').min(6, 'rule-length').max(160, 'rule-length'),
  confirm_password: handleConfirmPasswordYup('password'),
  movie: yup.string().required(),
});

export const userSchema = yup.object({
  name: yup.string().required('required-field').max(160, 'name-length'),
  phone: yup.string().required('required-field').max(20, 'phone-length'),
  email: yup.string().required('required-field').email('rule-email').min(6, 'rule-length').max(160, 'rule-length'),
  address: yup.string().max(160, 'address-length'),
  avatar: yup.string().max(1000, 'avatar-length'),
  date_of_birth: yup.date().max(new Date(), 'rule-day-of-birth'),
  password: schema.fields['password'],
  new_password: schema.fields['password'],
  confirm_password: handleConfirmPasswordYup('new_password'),
  gender: yup.string(),
});
export const loginSchema = schema.omit(['confirm_password'])

