// src/App.jsx

import { Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login.jsx";
import RecuperarSenha from "./components/recuperar-senha/RecuperarSenha.jsx";
import Cadastro from "./components/cadastros/Cadastro.jsx";
import Reembolsos from "./components/reembolsos/Reembolsos.jsx";
import Solicitacao from "./components/solicitacao/Solicitacao.jsx";
import VerificarAnalise from "./components/analise/VerificarAnalises.jsx";
import AnaliseIA from "./components/analise-ia/AnaliseIA.jsx";
import Historico from "./components/historico/Historico.jsx";
import Graficos from "./components/graficos/Graficos.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import Chatbot from "./components/chatbot/Chatbot.jsx";
import { useAuth } from "./hooks/useAuth";

import "./global.scss";

function App() {
  const { userId } = useAuth();

  return (
    <>
      <Routes>
      <Route path="/" element={<Login/>} />
      <Route path="/recuperar-senha" element={<RecuperarSenha />} />
      <Route path="/cadastro" element={<Cadastro />} />
      
      {/* Rotas protegidas - requerem autenticação */}
      <Route path="/reembolsos" element={
        <ProtectedRoute>
          <Reembolsos/>
        </ProtectedRoute>
      }/>
      
      <Route path="/solicitacao" element={
        <ProtectedRoute>
          <Solicitacao/>
        </ProtectedRoute>
      } />
      
      {/* Rota apenas para admin */}
      <Route path="/analise" element={
        <ProtectedRoute adminOnly>
          <VerificarAnalise />
        </ProtectedRoute>
      } />
      
      {/* Rota de análise IA - apenas admin */}
      <Route path="/analise-ia/:id" element={
        <ProtectedRoute adminOnly>
          <AnaliseIA />
        </ProtectedRoute>
      } />
      
      <Route path="/historico" element={
        <ProtectedRoute>
          <Historico />
        </ProtectedRoute>
      } />
      
      <Route path="/graficos" element={
        <ProtectedRoute>
          <Graficos />
        </ProtectedRoute>
      } />
    </Routes>
    
    {/* Chatbot global - aparece em todas as páginas quando logado */}
    {userId && <Chatbot userId={userId} />}
    </>
  );
}

export default App;
