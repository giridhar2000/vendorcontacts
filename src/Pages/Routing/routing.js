import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../Home/Home";
import Profile from "../Vendor_Profile/Profile";
import Profile_Id from "../Vendor_Profile/Profile_Id";
import Login from "../Login/Login";
import Listing from "../Listing/Listing";
import Chats from "../Chats/Chats";
import ProtectedRoute from "../Protected/Protected";
import Edit from "../Edit/Edit";

const Routing = () => {

  let routes = [
    {
      path: "/",
      element: <Home/>
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
          <Profile_Id/>
        </ProtectedRoute>
      ),
    },
    {
      path: "/chats",
      element: (
        <ProtectedRoute>
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
      element: <Login />,
    },
    {
      path: "/edit",
      element: (
        <ProtectedRoute>
          <Edit />
        </ProtectedRoute>
      ),
    },
  ];

  return (
    <Routes>
      {routes.map((route, i) => {
        return (
          <Route key={i} exact path={route.path} element={route.element} />
        );
      })}
    </Routes>
  );
};

export default Routing;
