import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../Services/Api";
import styles from "./RecuperarSenha.module.scss";

function RecuperarSenha() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [cracha, setCracha] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [carregando, setCarregando] = useState(false);

  const validarCampos = () => {
    if (!email || !cracha || !novaSenha || !confirmarNovaSenha) {
      setFeedback({ message: "Preencha todos os campos, por favor.", type: "error" });
      return false;
    }
    if (!email.includes("@") || !email.includes(".")) {
      setFeedback({ message: "Formato de e-mail inválido.", type: "error" });
      return false;
    }
    if (novaSenha.length < 6) {
      setFeedback({ message: "A nova senha deve ter pelo menos 6 caracteres.", type: "error" });
      return false;
    }
    if (novaSenha !== confirmarNovaSenha) {
      setFeedback({ message: "As senhas digitadas não coincidem.", type: "error" });
      return false;
    }
    if (isNaN(parseInt(cracha, 10))) {
      setFeedback({ message: "Número do crachá deve ser um valor numérico.", type: "error" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ message: "", type: "" });
    
    if (!validarCampos()) {
      return;
    }

    setCarregando(true);

    try {
      const resposta = await Api.put(`/colaborador/atualizar/${cracha}`, { 
        email: email,
        senha: novaSenha
      });

      setFeedback({ message: resposta.data.mensagem || "Senha alterada com sucesso! Redirecionando...", type: "success" });
      
      setTimeout(() => {
        navigate("/"); 
      }, 3000);

    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      setFeedback({ message: error.response?.data?.mensagem || "Erro ao alterar a senha. Verifique os dados e tente novamente.", type: "error" });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <main className={styles.mainRecuperar}>
      <section className={styles.containerForms}>
        <h1>Alterar Senha</h1>
        <p>Confirme seu e-mail, número do crachá, e defina sua nova senha.</p>

        <form onSubmit={handleSubmit} className={styles.formRecuperar}>
          <input
            type="email"
            placeholder="Digite seu e-mail cadastrado"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Digite seu número de crachá (ID)"
            value={cracha}
            onChange={(e) => setCracha(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Digite sua nova senha"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirme sua nova senha"
            value={confirmarNovaSenha}
            onChange={(e) => setConfirmarNovaSenha(e.target.value)}
            required
          />
          <button type="submit" className={styles.buttonEnviar} disabled={carregando}>
            {carregando ? "Alterando..." : "Alterar Senha"}
          </button>
        </form>

        {feedback.message && (
          <p className={`${styles.feedbackMessage} ${styles[feedback.type]}`}>
            {feedback.message}
          </p>
        )}

        <button 
          onClick={() => navigate("/")} 
          className={styles.buttonVoltar}
          disabled={carregando}
        >
          Voltar ao login
        </button>
      </section>
    </main>
  );
}

export default RecuperarSenha;