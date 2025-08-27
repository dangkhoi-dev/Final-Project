import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Components/layout/Header";
import Body from "./Components/layout/Body";
import HomePage from "./Pages/HomePage";
import ShopPage from "./Pages/ShopPage";
import AdminPage from "./Pages/AdminPage";


function App() {

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
        <Header />
        <Body>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </Body>
      </div>
    </BrowserRouter>
  );
}

export default App;
