import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../Home/Home";
import Profile from "../Vendor_Profile/Profile";
import Profile_Id from "../Vendor_Profile/Profile_Id";
import Login from "../Login/Login";
import Listing from "../Listing/Listing";
import Chats from "../Chats/Chats";
import ProtectedRoute from "../Protected/Protected";
import Edit from "../Edit/Edit";
import AuthContext from "../../contexts/authContext";
import { getUser } from "../../utils/profile_helper";
import { useQuery } from "react-query";
import ProtectedLoginRoute from "../Protected/LoginProtect";
import Header from "../../Components/Header/Header";
import Notifications from "../Notifications/Notifications";
import Footer from "../../Components/Footer/Footer";
import { Spin } from "antd";

const Routing = () => {
  const [isAuth, setIsAuth] = useContext(AuthContext);

  const { data: profile, isLoading } = useQuery("profile", getUser, {
    enabled: isAuth !== undefined,
  });
  let routes = [
    {
      path: "/",
      element:
        isAuth && profile && profile?.type === "vendor" ? (
          <Profile />
        ) : isAuth && profile && profile?.type === "architect" ? (
          <Listing />
        ) : (
          <>
            <Home />
          </>
        ),
    },
    {
      path: "/profile",
      element: (
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      ),
    },
    {
      path: "/profile/:id",
      element: (
        <ProtectedRoute>
          <Profile_Id />
        </ProtectedRoute>
      ),
    },
    {
      path: "/chats",
      element: (
        <ProtectedRoute>
          <Header />
          <Chats />

        </ProtectedRoute>
      ),
    },
    {
      path: "/listing",
      element: (
        <ProtectedRoute>
          <Listing />
        </ProtectedRoute>
      ),
    },
    {
      path: "/login",
      element: (
        <ProtectedLoginRoute>
          <Login />
        </ProtectedLoginRoute>
      ),
    },
    {
      path: "/edit",
      element: (
        <ProtectedRoute>
          <Header />
          <Edit />
        </ProtectedRoute>
      ),
    },
    {
      path: "/notifications",
      element: (
        <ProtectedRoute>
          <Header />
          <Notifications />
        </ProtectedRoute>
      ),
    },
  ];

  return (
    <Router>
      {!isLoading ?
        <>
          <Routes>
            {routes.map((route, i) => (
              <Route key={i} exact path={route.path} element={route.element} />
            ))}
          </Routes>
          <Footer />
        </>
        :
        <div>
          <Spin /> &nbsp; Loading....
        </div>
      }
    </Router>
  );
};

export default Routing;
