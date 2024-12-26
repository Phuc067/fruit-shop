import http from "src/utils/http";

const URL = "/api/users";

const userApi = {
  updateUserProfile: (id, body)=> http.put(`${URL}/${id}`, body),
  checkPhoneNumber: (id, body) => http.post(`${URL}/check-phone`, body), 
}
export default userApi;