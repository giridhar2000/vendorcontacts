import "./App.css";
import { BrowserRouter,Routes,Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Footer from "./Components/Footer/Footer";

function App() {
  return (
    <BrowserRouter>
      <div className="container">
      <Routes>
      <Route path="/" element={<Home />} />
      </Routes>
      <Footer />
      </div>
        
    </BrowserRouter>
  );
}

export default App;
