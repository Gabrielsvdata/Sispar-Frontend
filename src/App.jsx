import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login.jsx"
import Reembolsos from "./components/Reembolsos/Reembolsos.jsx"
import Solicitacao from "./components/solicitacao/Solicitacao.jsx"
import "./global.scss"
function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/Reembolsos" element={<Reembolsos/>}/>
        <Route path="/solicitacao" element={<Solicitacao/>} />
      </Routes>
    </BrowserRouter>
  );
}



export default App;