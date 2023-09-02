import "./App.css";
import { BrowserRouter,Routes,Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Footer from "./Components/Footer/Footer";
import Header from "./Components/Header/Header";
import Profile from "./Pages/Vendor_Profile/Profile";


function App() {
  return (
    <BrowserRouter>
      <div className="container">
      <Header />
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      </Routes>
      <Footer />
      </div>
        
    </BrowserRouter>
  );
}

export default App;
