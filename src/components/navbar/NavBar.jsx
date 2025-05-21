import Home from "../../assets/Header/botão - Home.png";
import Historico from "../../assets/Header/Botão - Histórico.png";
import Pesquisa from "../../assets/Header/Botão - Pesquisa.png";
import Reembolso from "../../assets/Header/Botão - Reembolso.png";
import Sair from "../../assets/Header/Botão - Sair.png";
import People from "../../assets/Header/MePeople.jpeg"; // Minha foto de perfil padrão
import FecharHearder from "../../assets/Header/imagem-fechar-header.png";
import styles from "./NavBar.module.scss";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function NavBar() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("fechado"); // Estado para controlar se o menu está aberto ou fechado

  // Estados para guardar as informações do usuário
  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState("");
  const [cracha, setCracha] = useState(""); // Vou usar o 'cracha' (ID do usuário) para a chave do avatar

  // Estado para o avatar (foto de perfil)
  const [avatar, setAvatar] = useState(People); // Começo com a foto padrão

  // Função para carregar ou recarregar os dados do usuário do localStorage
  const updateUser = () => {
    // Pego nome, cargo e ID (cracha) do localStorage
    const n = localStorage.getItem("usuarioNome");
    const c = localStorage.getItem("usuarioCargo");
    const i = localStorage.getItem("usuarioId"); // Este é o meu ID de usuário (crachá)
    console.log("NavBar lendo dados do usuário:", { n, c, i }); // Um log para me ajudar a ver o que está sendo lido

    // Se todos existirem, atualizo meus estados
    if (n && c && i) {
      setNome(n);
      setCargo(c);
      setCracha(i); // Guardo o ID do usuário no estado 'cracha'
    } else {
      // Se não encontrar os dados, limpo os estados para não mostrar info antiga
      setNome("");
      setCargo("");
      setCracha("");
    }
  };

  // Este useEffect roda uma vez quando o componente é montado e também escuta por mudanças de usuário
  useEffect(() => {
    updateUser(); // Chamo para carregar os dados do usuário assim que o NavBar aparecer
    window.addEventListener("userChanged", updateUser); // Se outro lugar do app disparar "userChanged", atualizo os dados
    // Limpo o event listener quando o componente for desmontado para evitar vazamento de memória
    return () => window.removeEventListener("userChanged", updateUser);
  }, []); // O array vazio [] significa que a parte de adicionar/remover listener só roda na montagem/desmontagem

  // Função para abrir/fechar o menu da NavBar
  function click() {
    setStatus(status === "fechado" ? "aberto" : "fechado");
  }

  // CORREÇÃO E MELHORIA AQUI: Este useEffect agora carrega o avatar específico do usuário
  // Ele vai rodar quando o componente montar E TODA VEZ QUE O 'cracha' (ID do usuário) MUDAR.
  useEffect(() => {
    if (cracha) {
      // Se eu tenho um ID de usuário (cracha)...
      // Crio uma chave única para o avatar deste usuário no localStorage
      const avatarKey = `usuarioAvatar_${cracha}`;
      const savedAvatar = localStorage.getItem(avatarKey); // Tento carregar o avatar salvo para ESTE usuário
      setAvatar(savedAvatar || People); // Se tiver um salvo, uso ele; senão, uso a foto padrão 'People'
      console.log(`Carreguei avatar para cracha ${cracha}:`, savedAvatar ? "Salvo" : "Padrão");
    } else {
      // Se não tenho 'cracha' (usuário não logado ou dados não carregados), uso a foto padrão
      setAvatar(People);
      console.log("Nenhum cracha, usando avatar padrão.");
    }
  }, [cracha]); // A DEPENDÊNCIA [cracha] É IMPORTANTE! Faz este efeito rodar de novo se o usuário mudar.

  // Função para quando o usuário escolhe uma nova foto de perfil
  const handleAvatarChange = (e) => {
    const file = e.target.files[0]; // Pego o arquivo que o usuário selecionou
    if (!file || !cracha) {
      // Se não tem arquivo ou se não sei qual usuário é (sem cracha), não faço nada
      if (!cracha) alert("Faça login para alterar o avatar.");
      return;
    }

    const reader = new FileReader(); // Crio um leitor de arquivos
    reader.onload = () => {
      // Quando o arquivo for lido, reader.result terá a imagem em base64
      const avatarBase64 = reader.result;
      // CORREÇÃO AQUI: Salvo o avatar usando uma chave ÚNICA para este usuário
      const avatarKey = `usuarioAvatar_${cracha}`;
      localStorage.setItem(avatarKey, avatarBase64); // Salvo no localStorage com a chave específica do usuário
      setAvatar(avatarBase64); // Atualizo o estado para mostrar a nova foto imediatamente
      console.log(`Avatar salvo para cracha ${cracha}`);
    };
    reader.readAsDataURL(file); // Leio o arquivo como uma string base64
  };

  // Função para lidar com o logout
  const handleLogout = () => {
    // Limpo os dados do usuário do localStorage que são relevantes para a NavBar
    localStorage.removeItem("usuarioNome");
    localStorage.removeItem("usuarioCargo");
    localStorage.removeItem("usuarioId");
    // Para o avatar, eu poderia remover o específico do usuário, mas se ele logar de novo,
    // é legal manter. Se quiser remover:
    // if (cracha) {
    //   localStorage.removeItem(`usuarioAvatar_${cracha}`);
    // }

    // Disparo o evento para que outros componentes saibam que o usuário mudou (saiu)
    window.dispatchEvent(new Event("userChanged"));
    // Reseto os estados locais da NavBar para o padrão
    setNome("");
    setCargo("");
    setCracha("");
    setAvatar(People); // Volta para o avatar padrão
    navigate("/"); // Levo para a tela de login
    console.log("Usuário deslogado, dados limpos.");
  };

  return (
    <nav className={`${styles.navBarEstilo} ${styles[status]}`}>
      <button onClick={click}>
        <img src={FecharHearder} alt="Abrir/Fechar menu" />
      </button>

      <section>
        <div className={styles.navbarPeople}>
          {/* Clicar na imagem vai acionar o input de arquivo escondido */}
          <label htmlFor="avatarInput">
            <img src={avatar} alt="Foto de perfil" className={styles.avatar} />
          </label>
          <input
            id="avatarInput" // ID para o label funcionar
            type="file"
            accept="image/*" // Aceito só arquivos de imagem
            onChange={handleAvatarChange} // Chamo minha função quando uma imagem for escolhida
            style={{ display: "none" }} // O input fica escondido, a imagem que é clicável
          />
          <h2>{nome || "Visitante"}</h2> {/* Mostro 'Visitante' se o nome não estiver carregado */}
          <p>{cargo || "Cargo não definido"}</p>
          <p>Crachá: {cracha || "N/A"}</p>
        </div>

        <div className={styles.containerNavbar}>
          {/* Início */}
          <div className={styles.buttonNav}>
            <button onClick={() => navigate("/reembolsos")} aria-label="Ir para Início">
              <img src={Home} alt="Home" />
            </button>
            <p>Início</p>
          </div>

          {/* Solicitação de Reembolso */}
          <div className={styles.buttonNav}>
            <button onClick={() => navigate("/solicitacao")} aria-label="Ir para Solicitação de reembolso">
              <img src={Reembolso} alt="Solicitar Reembolso" />
            </button>
            <p>Solicitação</p>
          </div>

          {/* Verificar Análises */}
          <div className={styles.buttonNav}>
            <button onClick={() => navigate("/analise")} aria-label="Ir para Verificar análises">
              <img src={Pesquisa} alt="Verificar Análises" />
            </button>
            <p>Análises</p>
          </div>

          {/* Histórico */}
          <div className={styles.buttonNav}>
            <button onClick={() => navigate("/historico")} aria-label="Ir para Histórico">
              <img src={Historico} alt="Histórico" />
            </button>
            <p>Histórico</p>
          </div>
        </div>
      </section>

      {/* Botão Sair agora chama handleLogout */}
      <button className={styles.buttonSair} onClick={handleLogout} aria-label="Sair">
        <img src={Sair} alt="Sair" />
      </button>
    </nav>
  );
}

export default NavBar;