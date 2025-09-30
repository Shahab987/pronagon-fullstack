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
import Reader from "./pages/Reader";
import AddEssay from "./components/reader/AddEssay";
import EssayList from "./components/reader/EssayList";
import Typing from "./pages/Typing";
import EasyType from "./components/EasyType/EasyType";
import DirectionType from "./components/EasyType/DirectionType";
import Spinner from "./components/games/Spinner";
import MaleTo from "./components/games/MaleTo";
import GameRoom from "./components/games/GameRoom";
import Mine from "./components/games/mine/Mine";
import MineCreate from "./components/games/mine/MineCreate";
import HeartBeat from "./components/HeartBeat/HeartBeat";

function App() {
  return (
    <div className="pb-15">
      <Toaster />

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DirectionType />} />
          <Route path="auth" element={<Auth />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
          <Route path="words" element={<EnglishDic />} />
          <Route path="reader" element={<Reader />}>
            <Route path="list" element={<EssayList />} />
            <Route path="add-essay" element={<AddEssay />} />
          </Route>
          <Route path="update" element={<UpdateDb />} />
          <Route path="typing" element={<Typing />} />
          <Route path="dare" element={<Spinner />} />
          <Route path="yours" element={<MaleTo />} />
          <Route path="mine" element={<MineCreate />} />
          <Route path="hr" element={<HeartBeat />} />
          <Route path="activation-success" element={<ActivationSuccess />} />
          <Route path="activation-failed" element={<ActivationFailed />} />
          <Route path="game/:gameCode" element={<GameRoom />} />
        </Route>
        <Route path="/mine/:code" element={<Mine />} />
      </Routes>
    </div>
  );
}

export default App;
