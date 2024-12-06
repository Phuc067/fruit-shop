import http from 'src/utils/http'
import { composeQueryUrl } from '../utils/utils'

const URL = 'api/public/products'

const productApi = {

  getPageProducts(page, amount) {
    return http.get(composeQueryUrl(URL, {page, amount}))
  },
  getProductDetail(id) {
    return http.get(`${URL}/${id}`)
  },

}

export default productApi
