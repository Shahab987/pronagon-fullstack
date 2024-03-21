import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import EnglishDic from "./components/EnglishDic";
import Layout from "./pages/Layout";
import Auth from "./pages/Auth";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import UpdateDb from "./components/UpdateDb";
import ActivationSuccess from "./pages/ActivationSuccess";
import ActivationFailed from "./pages/ActivationFailed";

function App() {
  return (
    <div className="">
      <Toaster />

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="auth" element={<Auth />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
          <Route path="words" element={<EnglishDic />} />
          <Route path="update" element={<UpdateDb />} />
          <Route path="activation-success" element={<ActivationSuccess />} />
          <Route path="activation-failed" element={<ActivationFailed />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
