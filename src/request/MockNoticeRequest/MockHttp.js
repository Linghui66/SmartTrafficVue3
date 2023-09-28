import axios from "axios";
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
function Http({ url, method = "get", data = null }) {
  return axios({
    url,
    method,
    data,
  });
}
export { Http };
