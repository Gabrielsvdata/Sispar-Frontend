import { HashRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login.jsx";
import Reembolsos from "./components/reembolsos/Reembolsos.jsx";
import Solicitacao from "./components/solicitacao/Solicitacao.jsx";
import "./global.scss";
function App() {
  return (

    <HashRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/reembolsos" element={<Reembolsos/>}/>
        <Route path="/solicitacao" element={<Solicitacao/>} />
      </Routes>
    </HashRouter>
  );
}



export default App;