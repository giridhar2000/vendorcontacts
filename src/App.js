import "./App.css";
import { BrowserRouter } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Footer from "./Components/Footer/Footer";

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <Home />
        <Footer />
      </div>
        
    </BrowserRouter>
  );
}

export default App;
