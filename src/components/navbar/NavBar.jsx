import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Api from "../../Services/Api.jsx"
import Home from "../../assets/Header/botão - Home.png"
import Historico from "../../assets/Header/Botão - Histórico.png"
import Pesquisa from "../../assets/Header/Botão - Pesquisa.png"
import Reembolso from "../../assets/Header/Botão - Reembolso.png"
import Sair from "../../assets/Header/Botão - Sair.png"
import People from "../../assets/Header/MePeople.jpeg"
import FecharHearder from "../../assets/Header/imagem-fechar-header.png"
import styles from "./NavBar.module.scss"

function NavBar() {
  const navigate = useNavigate()
  const [status, setStatus] = useState("fechado")

  const [nome, setNome] = useState("")
  const [cargo, setCargo] = useState("")
  const [cracha, setCracha] = useState("")
  const [avatar, setAvatar] = useState(null)

  // Função para (re)carregar dados diretamente do backend
  const updateUser = async () => {
    try {
      const { data } = await Api.get("/colaborador/me")
      setNome(data.nome)
      setCargo(data.cargo)
      setCracha(data.id)
    } catch (e) {
      console.error("Erro ao carregar usuário:", e)
    }
  }

  useEffect(() => {
    // Lê na montagem e em eventos de mudança de usuário
    updateUser()
    window.addEventListener("userChanged", updateUser)
    return () => window.removeEventListener("userChanged", updateUser)
  }, [])

  useEffect(() => {
    // Carrega o avatar salvo no localStorage, ou usa o default
    const saved = localStorage.getItem("usuarioAvatar")
    setAvatar(saved || People)
  }, [])

  function click() {
    setStatus(prev => (prev === "fechado" ? "aberto" : "fechado"))
  }

  const handleAvatarChange = e => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      localStorage.setItem("usuarioAvatar", reader.result)
      setAvatar(reader.result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <nav className={`${styles.navBarEstilo} ${styles[status]}`}>
      <button onClick={click}>
        <img src={FecharHearder} alt="Abrir/Fechar menu" />
      </button>

      <section>
        <div className={styles.navbarPeople}>
          {/* Label + input escondido para clicar na foto */}
          <label htmlFor="avatarInput">
            <img src={avatar} alt="Foto de perfil" className={styles.avatar}/>
          </label>
          <input
            id="avatarInput"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{ display: "none" }}
          />
          <h2>{nome}</h2>
          <p>{cargo}</p>
          <p>Crachá: {cracha}</p>
        </div>

        <div className={styles.containerNavbar}>
          {/* Início */}
          <div className={styles.buttonNav}>
            <button
              onClick={() => navigate("/reembolsos")}
              aria-label="Ir para Início"
            >
              <img src={Home} alt="Home" />
            </button>
            <p>Início</p>
          </div>

          {/* Solicitação de Reembolso */}
          <div className={styles.buttonNav}>
            <button
              onClick={() => navigate("/solicitacao")}
              aria-label="Ir para Solicitação de reembolso"
            >
              <img src={Reembolso} alt="Solicitar Reembolso" />
            </button>
            <p>Solicitação</p>
          </div>

          {/* Verificar Análises */}
          <div className={styles.buttonNav}>
            <button
              onClick={() => navigate("/analise")}
              aria-label="Ir para Verificar análises"
            >
              <img src={Pesquisa} alt="Verificar Análises" />
            </button>
            <p>Análises</p>
          </div>

          {/* Histórico */}
          <div className={styles.buttonNav}>
            <button
              onClick={() => navigate("/historico")}
              aria-label="Ir para Histórico"
            >
              <img src={Historico} alt="Histórico" />
            </button>
            <p>Histórico</p>
          </div>
        </div>
      </section>

      <button
        className={styles.buttonSair}
        onClick={() => navigate("/")}
        aria-label="Sair"
      >
        <img src={Sair} alt="Sair" />
      </button>
    </nav>
  )
}

export default NavBar;
