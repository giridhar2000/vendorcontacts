import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/authContext";
import { QueryClient, QueryClientProvider } from "react-query";
import Routing from "./Pages//Routing/routing";
import { UserProvider } from "./contexts/userContext";

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <UserProvider>
            <div className="container">
              <Routing />
            </div>
          </UserProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
