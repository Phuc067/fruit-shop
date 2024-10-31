import http from 'src/utils/http'

const URL = 'api/shipping-informations'

const shippingInformationApi = {

  getShippingInformations(userId) {
    return http.get(`${URL}/${userId}`)
  },

  getPrimaryShippingInformation(userId) {
    return http.get(`${URL}/${userId}?isPrimary=true`)
  },

  createShippingInformation(body){
    return http.post(URL, body);
  },
 
  updateShippingInformation(id, body) {
    return http.put(`${URL}/${id}`, body)
  },

  deleteShippingInformation(id) {
    return http.delete(`${URL}/${id}`)
  }
}

export default shippingInformationApi
