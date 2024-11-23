import http from "src/utils/http";

const URL = "/api/users";

const userApi = {
  updateUserProfile: (id, body)=> http.put(`${URL}/${id}`, body),
} 

export default userApi;