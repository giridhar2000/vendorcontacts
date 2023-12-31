import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import AuthContext from "../../contexts/authContext";
import UserContext from "../../contexts/userContext";

const ProtectedRoute = ({ children }) => {
  const [isAuth,setIsAuth] = useContext(AuthContext);
  let location = useLocation();
  if ( !isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
