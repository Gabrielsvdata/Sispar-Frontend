// src/App.jsx

import { HashRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login.jsx";
import RecuperarSenha from "./components/recuperar-senha/RecuperarSenha.jsx";
import Cadastro from "./components/cadastros/Cadastro.jsx";
import Reembolsos from "./components/reembolsos/Reembolsos.jsx";
import Solicitacao from "./components/solicitacao/Solicitacao.jsx";
import VerificarAnalise from "./components/analise/VerificarAnalises.jsx";
import Historico from "./components/historico/Historico.jsx";
import Graficos from "./components/graficos/Graficos.jsx";  // ← import do novo componente

import "./global.scss";
import BottomNav from "./components/navbar/BottomNav.jsx";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/reembolsos" element={<Reembolsos/>}/>
        <Route path="/solicitacao" element={<Solicitacao/>} />
        <Route path="/analise" element={<VerificarAnalise />} />
        <Route path="/historico" element={<Historico />} />
+       <Route path="/graficos" element={<Graficos />} />  {/* ← rota para o gráfico */}
      </Routes>
      <BottomNav/>
    </HashRouter>
  );
}

export default App;
