// src/components/navbar/BottomNav.jsx

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Home      from "../../assets/Header/botão - Home.png";
import Historico from "../../assets/Header/Botão - Histórico.png";
import Pesquisa  from "../../assets/Header/Botão - Pesquisa.png";
import Reembolso from "../../assets/Header/Botão - Reembolso.png";
import Sair      from "../../assets/Header/Botão - Sair.png";
import People    from "../../assets/Header/MePeople.jpg"; // avatar padrão

import styles    from "./BottomNav.module.scss";

export default function BottomNav() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [cracha, setCracha] = useState("");
  const [avatar, setAvatar] = useState(People);

  // Carrega nome e id
  const updateUser = () => {
    const storedNome = localStorage.getItem("usuarioNome");
    const storedId   = localStorage.getItem("usuarioId");
    setNome(storedNome || "");
    setCracha(storedId || "");
  };

  // Sempre que mudar o cracha, tenta carregar avatar salvo
  useEffect(() => {
    updateUser();
    window.addEventListener("userChanged", updateUser);
    return () => window.removeEventListener("userChanged", updateUser);
  }, []);

  useEffect(() => {
    if (cracha) {
      const key = `usuarioAvatar_${cracha}`;
      const saved = localStorage.getItem(key);
      setAvatar(saved || People);
    } else {
      setAvatar(People);
    }
  }, [cracha]);

  return (
    <footer className={styles.bottomNav}>
      {/* Avatar / Perfil */}
      <button
        className={styles.avatarBtn}
        onClick={() => navigate("/reembolsos")}
        aria-label="Perfil"
      >
        <img src={avatar} alt="Perfil" />
        <span>{nome || "Perfil"}</span>
      </button>

      {/* Início */}
      <button onClick={() => navigate("/reembolsos")} aria-label="Início">
        <img src={Home} alt="Início" />
        <span>Início</span>
      </button>

      {/* Solicitação */}
      <button
        onClick={() => navigate("/solicitacao")}
        aria-label="Solicitação"
      >
        <img src={Reembolso} alt="Solicitação" />
        <span>Solicitar</span>
      </button>

      {/* Análises */}
      <button onClick={() => navigate("/analise")} aria-label="Análises">
        <img src={Pesquisa} alt="Análises" />
        <span>Análises</span>
      </button>

      {/* Histórico */}
      <button onClick={() => navigate("/historico")} aria-label="Histórico">
        <img src={Historico} alt="Histórico" />
        <span>Histórico</span>
      </button>

      {/* Sair */}
      <button
        onClick={() => {
          localStorage.removeItem("usuarioNome");
          localStorage.removeItem("usuarioCargo");
          localStorage.removeItem("usuarioId");
          // não removemos o avatar do localStorage para persistir entre logins, mas poderia se desejar
          window.dispatchEvent(new Event("userChanged"));
          navigate("/");
        }}
        aria-label="Sair"
      >
        <img src={Sair} alt="Sair" />
        <span>Sair</span>
      </button>
    </footer>
  );
}
