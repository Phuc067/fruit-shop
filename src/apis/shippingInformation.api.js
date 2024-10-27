import http from 'src/utils/http'

const URL = 'api/shipping-information'

const shippingInformationApi = {

  getShippingInformations(userId) {
    return http.get(`${URL}/${userId}`)
  },

  getPrimaryShippingInformation(userId) {
    return http.get(`${URL}/${userId}?isPrimary=true`)
  },
 
}

export default shippingInformationApi
