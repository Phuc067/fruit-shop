import http from 'src/utils/http'

const URL = 'api/public/products'

const productApi = {
  getProducts() {
    return http.get(URL, {})
  },
  getProductDetail(id) {
    return http.get(`${URL}/${id}`)
  },

}

export default productApi
