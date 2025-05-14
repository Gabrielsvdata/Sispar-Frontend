// RecuperarSenha.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../Services/Api";                // ← importe sua instância de axios/fetch
import styles from "./RecuperarSenha.module.scss";

function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");     // para mensagem de sucesso/erro
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validação básica
    if (!email.includes("@") || !email.includes(".")) {
      setFeedback("Por favor, digite um e-mail válido.");
      return;
    }

    try {

      // Chama seu endpoint Flask
      const resp = await Api.post("/auth/forgot-password", { email });
      // Exibe a mensagem que o servidor retornou
      setFeedback(resp.data.mensagem);
   
    } catch (error) {
      console.error("Erro ao enviar solicitação:", error);
      setFeedback("Ocorreu um erro. Tente novamente mais tarde.");
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
            onChange={(e) => {
              setEmail(e.target.value);
              setFeedback("");
            }}
            required
          />
          <button type="submit" className={styles.buttonEnviar}>
            Enviar
          </button>
        </form>

        {feedback && (
          <p className={styles.feedbackMessage}>
            {feedback}
          </p>
        )}

        <button onClick={() => navigate("/")} className={styles.buttonVoltar}>
          Voltar ao login
        </button>
      </section>
    </main>
  );
}

export default RecuperarSenha;
