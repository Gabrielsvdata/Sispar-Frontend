import { HashRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login.jsx";
import RecuperarSenha from "./components/recuperar-senha/RecuperarSenha.jsx";
import Cadastro from "./components/cadastros/Cadastro.jsx";
import Reembolsos from "./components/reembolsos/Reembolsos.jsx";
import Solicitacao from "./components/solicitacao/Solicitacao.jsx";
import "./global.scss";
function App() {
  return (

    <HashRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/reembolsos" element={<Reembolsos/>}/>
        <Route path="/solicitacao" element={<Solicitacao/>} />
      </Routes>
    </HashRouter>
  );
}



export default App;