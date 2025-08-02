import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/auth/authSlice";

const ProtectedRoute = ({ children, allowedRoles }: any) => {

  const dispatch = useDispatch();

  const user = isLoggedIn();
  if (!user) {
    return <Navigate to="/" replace />;
  }else{
    const formattedUserData = {
      _id: user.id,
      role: user.role,
      name: '',
      email: '',
      phone: ''
    }
    dispatch(setUser(formattedUserData))
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
