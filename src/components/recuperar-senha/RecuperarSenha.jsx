import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../Services/Api"; // Sua instância de axios/fetch
import styles from "./RecuperarSenha.module.scss"; // Mantenha seus estilos

// Vou renomear a função do componente para algo mais genérico internamente,
// ou manter 'RecuperarSenha' se o nome do arquivo não mudar.
// Para este exemplo, manterei 'RecuperarSenha' para consistência com seu arquivo.
function RecuperarSenha() {
  const navigate = useNavigate();

  // Novos estados que vou precisar:
  const [email, setEmail] = useState("");         // Email para verificação
  const [cracha, setCracha] = useState("");       // Crachá (ID do colaborador) para verificação e URL
  const [novaSenha, setNovaSenha] = useState(""); // Nova senha
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState(""); // Confirmação da nova senha
  const [feedback, setFeedback] = useState("");   // Para mensagens de sucesso/erro
  const [carregando, setCarregando] = useState(false); // Para feedback visual no botão

  // Minha nova função de validação dos campos
  const validarCampos = () => {
    if (!email || !cracha || !novaSenha || !confirmarNovaSenha) {
      setFeedback("Preencha todos os campos, por favor.");
      return false;
    }
    if (!email.includes("@") || !email.includes(".")) {
      setFeedback("Formato de e-mail inválido.");
      return false;
    }
    if (novaSenha.length < 6) { // Mantendo sua validação de tamanho de senha
      setFeedback("A nova senha deve ter pelo menos 6 caracteres.");
      return false;
    }
    if (novaSenha !== confirmarNovaSenha) {
      setFeedback("As senhas digitadas não coincidem.");
      return false;
    }
    // Validação simples para o crachá (se é um número)
    if (isNaN(parseInt(cracha, 10))) {
        setFeedback("Número do crachá deve ser um valor numérico.");
        return false;
    }
    return true;
  };

  // Minha função para lidar com o envio do formulário (agora para alterar a senha)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(""); // Limpo o feedback anterior
    
    if (!validarCampos()) {
      return; // Se a validação falhar, não continuo
    }

    setCarregando(true); // Mostro que está carregando

    try {
      // Chamo meu endpoint Flask de ATUALIZAR, passando o crachá na URL
      // e o email (para verificação) e a nova senha no corpo.
      const resposta = await Api.put(`/colaborador/atualizar/${cracha}`, { 
        email: email,         // Email para o backend verificar se bate com o do crachá
        senha: novaSenha      // A nova senha a ser definida
      });

      setFeedback(resposta.data.mensagem || "Senha alterada com sucesso! Você será redirecionado para o login.");
      // Dou um tempo para o usuário ler a mensagem e depois o levo para o login
      setTimeout(() => {
        navigate("/"); 
      }, 3000); // Redireciona após 3 segundos

    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      // Se o backend mandar uma mensagem específica, uso ela, senão uma genérica.
      setFeedback(error.response?.data?.mensagem || "Ocorreu um erro ao tentar alterar a senha. Tente novamente.");
    } finally {
      setCarregando(false); // Paro de mostrar que está carregando
    }
  };

  return (
    <main className={styles.mainRecuperar}> {/* Você pode querer renomear o estilo se mudar o propósito */}
      <section className={styles.containerForms}>
        <h1>Alterar Senha</h1> {/* Mudei o título */}
        <p>Para alterar sua senha, por favor, confirme seu e-mail e número do crachá, e defina sua nova senha.</p> {/* Mudei a instrução */}

        <form onSubmit={handleSubmit} className={styles.formRecuperar}>
          <input
            type="email"
            placeholder="Digite seu e-mail cadastrado"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text" // Crachá pode ter letras/números, mas o backend espera <int:id_colaborador>
                      // A validação isNaN(parseInt(cracha)) já ajuda.
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

        {feedback && (
          <p 
            className={styles.feedbackMessage}
            // Adiciono um estilo inline para diferenciar sucesso de erro, se quiser
            // style={{ color: feedback.includes("sucesso") ? "green" : "red" }}
          >
            {feedback}
          </p>
        )}

        <button 
          onClick={() => navigate("/")} 
          className={styles.buttonVoltar}
          disabled={carregando} // Desabilito enquanto carrega
        >
          Voltar ao login
        </button>
      </section>
    </main>
  );
}

export default RecuperarSenha;