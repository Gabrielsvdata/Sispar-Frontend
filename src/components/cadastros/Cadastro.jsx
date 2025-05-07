import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Services/Api.jsx";
import Capa from "../../assets/Tela Login/imagem tela de login.png";
import Logo from "../../assets/Tela Login/logo-ws.png";
import styles from "./Cadastro.module.scss";

function Cadastro() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cargo, setCargo] = useState("");
  const [salario, setSalario] = useState("");

  const validarCampos = () => {
    if (!nome || !email || !senha || !cargo || !salario) {
      alert("Preencha todos os campos.");
      return false;
    }
    if (!email.includes("@") || !email.includes(".")) {
      alert("E-mail inválido.");
      return false;
    }
    if (senha.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres.");
      return false;
    }
    if (isNaN(salario) || Number(salario) <= 0) {
      alert("Salário inválido.");
      return false;
    }
    return true;
  };

  const fazerCadastro = async (e) => {
    e.preventDefault();

    if (!validarCampos()) return;

    try {
      const resposta = await api.post("/colaborador/cadastrar", {
        nome,
        email,
        senha,
        cargo,
        salario,
      });
      alert("Cadastro realizado com sucesso!");
      navigate("/"); // Volta pro login
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      alert("Erro ao cadastrar. Verifique os dados e tente novamente.");
    }
  };

  return (
    <main className={styles.mainCadastro}>
      <section className={styles.containerImagem}>
        <img src={Capa} alt="Navio com carregado de Container" />
      </section>

      <section className={styles.containerForms}>
        <img src={Logo} alt="Logo da Wilson Sons" />
        <h1>Crie sua conta no Portal SISPAR</h1>
        <p>Cadastro de colaboradores</p>

        <form className={styles.formCadastro} onSubmit={fazerCadastro}>
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <input
            type="text"
            placeholder="Cargo"
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
          />
          <input
            type="number"
            placeholder="Salário"
            step="0.01"
            value={salario}
            onChange={(e) => setSalario(e.target.value)}
          />

          <div>
            <button type="submit" className={styles.buttonCadastrar}>
              Cadastrar
            </button>
            <button
              type="button"
              className={styles.buttonVoltar}
              onClick={() => navigate("/")}
            >
              Voltar
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default Cadastro;
