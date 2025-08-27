import { HashRouter, Routes, Route } from "react-router-dom";
import Header from "./Components/layout/Header";
import Lower from "./Components/layout/Lower";
import HomePage from "./Pages/HomePage";
import ShopPage from "./Pages/ShopPage";
import AdminPage from "./Pages/AdminPage";


const App = () => {
  return (
      <HashRouter>
          <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
              <Header />
              <Lower>
                  <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/shop" element={<ShopPage />} />
                      <Route path="/admin" element={<AdminPage />} />
                  </Routes>
              </Lower>
          </div>
      </HashRouter>
  );
}

export default App;