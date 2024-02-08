import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/authContext";
import { QueryClient, QueryClientProvider } from "react-query";
import Routing from "./Pages//Routing/routing";
import { UserProvider } from "./contexts/userContext";
import Footer from "./Components/Footer/Footer";

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <UserProvider>
            <div className="container">
              <Routing />
              <Footer />
            </div>
          </UserProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
