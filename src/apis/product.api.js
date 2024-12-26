import http from 'src/utils/http'
import { composeQueryUrl } from '../utils/utils'

const URL = 'api/public/products'

const productApi = {

  getPageProducts: (page, amount, keyword, sortType)=> http.get(composeQueryUrl(URL, {page, amount, keyword, sortType})),
  getProductDetail(id) {
    return http.get(`${URL}/${id}`)
  },

}

export default productApi
