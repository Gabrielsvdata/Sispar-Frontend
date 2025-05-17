// src/components/Login/Login.jsx

import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Services/Api.jsx";
import Capa from "../../assets/Tela Login/imagem tela de login.png";
import Logo from "../../assets/Tela Login/logo-ws.png";
import styles from "./Login.module.scss";
import { AuthContext } from "../../contexts/AuthContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const { data } = await api.post("/colaborador/login", { email, senha });
      setUser(data);
      navigate("/reembolsos");
    } catch (err) {
      alert(err.response?.data?.mensagem || "Erro ao efetuar login");
    }
  }

  return (
    <main className={styles.mainLogin}>
      <section className={styles.containerImagem}>
        <img src={Capa} alt="Navio carregado de containers" />
      </section>

      <section className={styles.containerForms}>
        <img src={Logo} alt="Logo da Wilson Sons" />
        <h1>Boas-vindas ao Novo Portal SISPAR</h1>
        <p>Sistema de Emissão de Boletos e Parcelamentos</p>

        <form onSubmit={handleSubmit} className={styles.formLogin}>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            name="senha"
            id="senha"
            placeholder="Senha"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            required
          />

          <a
            href="#"
            className={styles.linkRecuperar}
            onClick={e => {
              e.preventDefault();
              navigate("/recuperar-senha");
            }}
          >
            Esqueci minha senha
          </a>

          <div className={styles.buttons}>
            <button type="submit" className={styles.buttonEntrar}>
              Entrar
            </button>
            <button
              type="button"
              className={styles.buttonCriar}
              onClick={() => navigate("/cadastro")}
            >
              Criar conta
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
