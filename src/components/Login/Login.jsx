import{useState} from "react"
import{useNavigate} from "react-router-dom"
import api from "../../Services/Api.jsx"
import { useAuth } from "../../hooks/useAuth.js"
import Capa from "../../assets/Tela Login/imagem tela de login.png"
import Logo from "../../assets/Tela Login/logo-ws.png"
import ModalConfirmacao from "../modal/ModalConfirmacao.jsx"
import styles from "./Login.module.scss"
function Login() {
  // Hook de autenticação
  const { login } = useAuth();
  
  // Declaração dos estados necessários para o componente
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);
  
  // Estado para controlar o modal de feedback
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success", // 'success' ou 'error'
  });

  // Hook para navegação
  const navigate = useNavigate();

  // Função assíncrona para lidar com o processo de login
  const fazerLogin = async (e) => {
    e.preventDefault(); // Previne o comportamento padrão de submissão do formulário
    setErro(null); // Limpa erros anteriores
    setCarregando(true); // Ativa o indicador de carregamento

    // --- ADIÇÃO SUGERIDA PARA DEBUG ---
    // Para ter 100% de certeza do que está sendo enviado:
    console.log("Dados enviados para o login:", { email, senha });
    // --- FIM DA ADIÇÃO ---

    try {
      // Faz a requisição POST para o endpoint de login no backend
      const resposta = await api.post("/colaborador/login", { email, senha });

      // Log da resposta para depuração (opcional em produção)
      console.log("Resposta do login:", resposta.data);

      // Desestrutura os dados esperados da resposta do backend
      const { usuario, token } = resposta.data;

      // Usa o contexto de autenticação para fazer login
      console.log("🔐 Chamando login com dados:", {
        id: String(usuario.id),
        nome: usuario.nome,
        cargo: usuario.cargo,
        tipo: usuario.tipo || "usuario"
      });
      
      await login({
        id: String(usuario.id),
        nome: usuario.nome,
        cargo: usuario.cargo,
        tipo: usuario.tipo || "usuario",
        token: token || null,
      });

      console.log("✅ Login executado e aguardado, tentando navegar para /reembolsos");
      
      // Pequeno delay para garantir que o estado foi atualizado
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Redireciona imediatamente para a tela de reembolsos
      navigate("/reembolsos", { replace: true });
      
      console.log("🚀 Navigate chamado");

    } catch (error) {
      // Log do erro para depuração
      console.error("Erro ao fazer login:", error);

      // Trata diferentes tipos de erro e exibe no modal
      let mensagemErro = "";
      if (error.response && error.response.data && error.response.data.mensagem) {
        mensagemErro = error.response.data.mensagem;
      } else if (error.request) {
        mensagemErro = "Não foi possível conectar ao servidor. Verifique sua conexão ou as configurações.";
      } else {
        mensagemErro = "Ocorreu um erro inesperado ao tentar fazer login. Tente novamente.";
      }
      
      setErro(mensagemErro);
      setModalState({
        isOpen: true,
        title: "Erro ao fazer login",
        message: mensagemErro,
        type: "error",
      });
    } finally {
      // Independentemente do resultado, desativa o indicador de carregamento
      setCarregando(false);
    }
  };

  // Função para fechar o modal
  const handleCloseModal = () => {
    setModalState({ ...modalState, isOpen: false });
  };

  return (
    <main className={styles.mainLogin}>
      <section className={styles.containerImagem}>
        <img src={Capa} alt="Navio com carregado de Container" />
      </section>
      <section className={styles.containerForms}>
        <img src={Logo} alt="Logo da Wilson SOns" />
        <h1>Boas vindas ao Novo Portal SISPAR</h1>
        <p>Sistemas de Emissão de Boletos e Parcelamentos</p>

        {/* Formulário de login, usando onSubmit para melhor prática */}
        <form className={styles.formLogin} onSubmit={fazerLogin}>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={carregando} // Desabilita o input durante o carregamento
            required // Adiciona validação básica do HTML5
          />
          <input
            type="password"
            name="password" // Considere usar 'senha' para consistência com o id se não houver motivo específico
            id="senha"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            disabled={carregando} // Desabilita o input durante o carregamento
            required // Adiciona validação básica do HTML5
          />

          {/* Link para recuperação de senha */}
          <a
            onClick={() => !carregando && navigate("/recuperar-senha")} // Impede clique durante o carregamento
            style={{ cursor: carregando ? 'default' : 'pointer', color: carregando ? '#aaa' : undefined }}
            tabIndex={carregando ? -1 : 0} // Remove do foco se estiver carregando
          >
            Esqueci minha senha
          </a>

          {/* Exibição da mensagem de erro, se houver */}
          {erro && <p className={styles.mensagemErro} style={{color: 'red'}}>{erro}</p>}

          <div>
            {/* Botão principal para submeter o formulário */}
            <button type="submit" className={styles.buttonEntrar} disabled={carregando}>
              {carregando ? "Entrando..." : "Entrar"}
            </button>
            {/* Botão para navegação para a página de cadastro */}
            <button
              type="button"
              onClick={() => !carregando && navigate("/cadastro")}
              className={styles.buttonCriar}
              disabled={carregando}
            >
              Criar conta
            </button>
          </div>
        </form>
      </section>

      {/* Modal de feedback */}
      <ModalConfirmacao
        isOpen={modalState.isOpen}
        title={modalState.title}
        onConfirm={handleCloseModal}
        onClose={handleCloseModal}
        confirmText="OK"
        showCancelButton={false}
        confirmButtonType={modalState.type === "success" ? "primary" : "danger"}
      >
        {modalState.message}
      </ModalConfirmacao>
    </main>
  );
}
export default Login;