import * as yup from 'yup';

export const shippingInformationSchema = yup.object().shape({
      recipientName: yup.string().required('Recipient name is required'),
      phone: yup.string().required('Phone is required'),
      shippingAdress: yup.string().max(12).min(10).required('Shipping address is required')
})