import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Profile from "./Pages/Vendor_Profile/Profile";
import Login from "./Pages/Login/Login";
import Listing from "./Pages/Listing/Listing";
import Chats from "./Pages/Chats/Chats";
import { AuthProvider } from "./contexts/authContext";
import ProtectedRoute from "./Pages/Protected/Protected";
import Edit from "./Pages/Edit/Edit";

let routes = [
  {
    path: "/",
    element: <Home />,
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

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="container">
          <Routes>
            {routes.map((route, i) => {
              return (
                <Route
                  key={i}
                  exact
                  path={route.path}
                  element={route.element}
                />
              );
            })}
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
