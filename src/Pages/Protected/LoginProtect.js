import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import AuthContext from "../../contexts/authContext";

const ProtectedLoginRoute = ({ children }) => {
  const [isAuth,setIsAuth] = useContext(AuthContext);
  let location = useLocation();
  if ( isAuth) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedLoginRoute;
