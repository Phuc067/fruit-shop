import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().min(3).max(10).required('Password is required'),
});

