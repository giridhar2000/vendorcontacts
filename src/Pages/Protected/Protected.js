import React, { useContext } from 'react'
import {Navigate, useLocation} from "react-router-dom"
import UserContext from '../../contexts/authContext';

const ProtectedRoute = ({children}) => {
    const [isAuth,setIsAuth]=useContext(UserContext)
    let location = useLocation();

    if(!isAuth) {
        return <Navigate to="/login" state={{ from: location}} replace />
    }
 return children

};

export default ProtectedRoute;