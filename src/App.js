import "antd/dist/antd.css";
import Main from "./Main";
import Admin from "./Admin";
import Login from "./Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
