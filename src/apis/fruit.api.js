import axios from "axios";
import config from "../constants/config";

const URL = `${config.fruitClassificationUrl}api/products/search`

const fruitApi = {
  searchProduct: (page, amount, file , sortType ) => {
    const formData = new FormData();
    formData.append("page", page);
    formData.append("amount", amount);
    formData.append("file", file); 
    formData.append("sortType", sortType);

    return axios.post(URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}

export default fruitApi;