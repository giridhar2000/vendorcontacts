import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/authContext";
import { QueryClient, QueryClientProvider } from "react-query";
import Routing from "./Pages//Routing/routing";
import { UserProvider } from "./contexts/userContext";
import Footer from "./Components/Footer/Footer";
import { useEffect } from "react";

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    vercelfunc();
  })
  async function vercelfunc() {
    await fetch("https://api.vercel.com/v1/projects/prj_tskgsDLnhwyDwdmSesd5akL4a5tB/pause", {
      "headers": {
        "Authorization": "NlEpSLv0ODejKZPq2dn08SqZ"
      },
      "method": "post"
    })
  }

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
