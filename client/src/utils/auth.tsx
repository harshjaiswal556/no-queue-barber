import Cookies from 'js-cookie';

export const isLoggedIn = ()=>{
    
    const token = Cookies.get("token");
    const role = Cookies.get("role");
    const id = Cookies.get("_id");

    if(!token || !role || !id) return null;
    return {token, role, id}

}