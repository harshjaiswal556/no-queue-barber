import Cookies from 'js-cookie';

export const isLoggedIn = ()=>{
    
    const token = Cookies.get("token");
    const role = Cookies.get("role");
    if(!token || !role) return null
    return {token, role}

}