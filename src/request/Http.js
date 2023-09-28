import axios from 'axios'
axios.defaults.baseURL=import.meta.env.VITE_BASE_URL
axios.interceptors.response.use(
    response=>{
        return response.data
    },
    error=>{
        return Promise.reject(error)
    }
)
function Http({
    url,
    method="get"
}){
    return axios({
        url,
        method
    })
}
export {Http}