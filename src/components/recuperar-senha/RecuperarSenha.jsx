// RecuperarSenha.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
//import api from "../../Services/Api.jsx";
import styles from "./RecuperarSenha.module.scss";

function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.includes("@") || !email.includes(".")) {
      alert("Digite um e-mail válido.");
      return;
    }

    try {
      // Aqui no futuro você pode integrar com o backend
      alert("Se o e-mail existir, enviaremos instruções para recuperação.");
      navigate("/"); // Redireciona automaticamente após exibir a mensagem
    } catch (error) {
      console.error("Erro ao enviar solicitação:", error);
      alert("Erro ao tentar recuperar senha.");
    }
  };

  return (
    <main className={styles.mainRecuperar}>
      <section className={styles.containerForms}>
        <h1>Recuperar Senha</h1>
        <p>Digite seu e-mail cadastrado e enviaremos instruções para redefinir sua senha.</p>

        <form onSubmit={handleSubmit} className={styles.formRecuperar}>
          <input
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className={styles.buttonEnviar}>
            Enviar
          </button>
        </form>

        <button onClick={() => navigate("/")} className={styles.buttonVoltar}>
          Voltar ao login
        </button>
      </section>
    </main>
  );
}

export default RecuperarSenha;
