import http from 'src/utils/http'

const URL = 'api/carts'

const cartApi = {
  getCart(id) {
    return http.get(`${URL}/${id}`)
  },
  addToCart(body) {
    return http.post(URL, body)
  },
  updateProductQuantity(id, body) {
    return http.put(`${URL}/${id}`, body)
  },
  deleteProduct(productId) {
    return http.delete(`${URL}/${productId}`)
  },
  deleteProducts(listCartId) {
    return http.post(`${URL}/delete-multiple`, listCartId ); 
  }
  
}

export default cartApi
