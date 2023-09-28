import { Http} from "./Http";
const getClientHttp=()=>{
    return Http({
        url:"/api/login"
    })
}
export {getClientHttp}