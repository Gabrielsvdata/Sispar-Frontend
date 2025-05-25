import Home from "../../assets/Header/botão - Home.png";
import Historico from "../../assets/Header/Botão - Histórico.png";
import Pesquisa from "../../assets/Header/Botão - Pesquisa.png";
import Reembolso from "../../assets/Header/Botão - Reembolso.png";
import Sair from "../../assets/Header/Botão - Sair.png";
import People from "../../assets/Header/MePeople.jpg"; // Minha foto de perfil padrão
import FecharHearder from "../../assets/Header/imagem-fechar-header.png";
import styles from "./NavBar.module.scss";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function NavBar() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("fechado");
  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState("");
  const [cracha, setCracha] = useState("");
  const [avatar, setAvatar] = useState(People);

  const updateUser = () => {
    const n = localStorage.getItem("usuarioNome");
    const c = localStorage.getItem("usuarioCargo");
    const i = localStorage.getItem("usuarioId");
    if (n && c && i) {
      setNome(n);
      setCargo(c);
      setCracha(i);
    } else {
      setNome("");
      setCargo("");
      setCracha("");
    }
  };

  useEffect(() => {
    updateUser();
    window.addEventListener("userChanged", updateUser);
    return () => window.removeEventListener("userChanged", updateUser);
  }, []);

  function click() {
    setStatus(prev => (prev === "fechado" ? "aberto" : "fechado"));
  }

  useEffect(() => {
    if (cracha) {
      const avatarKey = `usuarioAvatar_${cracha}`;
      const saved = localStorage.getItem(avatarKey);
      setAvatar(saved || People);
    } else {
      setAvatar(People);
    }
  }, [cracha]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file || !cracha) {
      if (!cracha) alert("Faça login para alterar o avatar.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      localStorage.setItem(`usuarioAvatar_${cracha}`, base64);
      setAvatar(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    localStorage.removeItem("usuarioNome");
    localStorage.removeItem("usuarioCargo");
    localStorage.removeItem("usuarioId");
    window.dispatchEvent(new Event("userChanged"));
    setNome("");
    setCargo("");
    setCracha("");
    setAvatar(People);
    navigate("/");
  };

  return (
    <nav className={`${styles.navBarEstilo} ${styles[status]}`}>
      <button onClick={click}>
        <img src={FecharHearder} alt="Abrir/Fechar menu" />
      </button>

      <section>
        <div className={styles.navbarPeople}>
          <label htmlFor="avatarInput">
            <img src={avatar} alt="Foto de perfil" className={styles.avatar} />
          </label>
          <input
            id="avatarInput"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{ display: "none" }}
          />
          {/* Novo texto clicável */}
          <label htmlFor="avatarInput" className={styles.alterarFoto}>
            Alterar foto
          </label>

          <h2>{nome || "Visitante"}</h2>
          <p>{cargo || "Cargo não definido"}</p>
          <p>Crachá: {cracha || "N/A"}</p>
        </div>

        <div className={styles.containerNavbar}>
          <div className={styles.buttonNav}>
            <button onClick={() => navigate("/reembolsos")} aria-label="Início">
              <img src={Home} alt="Home" />
            </button>
            <p>Início</p>
          </div>
          <div className={styles.buttonNav}>
            <button onClick={() => navigate("/solicitacao")} aria-label="Solicitação">
              <img src={Reembolso} alt="Solicitar Reembolso" />
            </button>
            <p>Solicitação</p>
          </div>
          <div className={styles.buttonNav}>
            <button onClick={() => navigate("/analise")} aria-label="Análises">
              <img src={Pesquisa} alt="Verificar Análises" />
            </button>
            <p>Análises</p>
          </div>
          <div className={styles.buttonNav}>
            <button onClick={() => navigate("/historico")} aria-label="Histórico">
              <img src={Historico} alt="Histórico" />
            </button>
            <p>Histórico</p>
          </div>
        </div>
      </section>

      <button className={styles.buttonSair} onClick={handleLogout} aria-label="Sair">
        <img src={Sair} alt="Sair" />
      </button>
    </nav>
  );
}

export default NavBar;
