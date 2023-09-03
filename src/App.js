import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Profile from "./Pages/Vendor_Profile/Profile";
import Login from "./Pages/Login/Login";
import Listing from "./Pages/Listing/Listing";

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/listing" element={<Listing/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
