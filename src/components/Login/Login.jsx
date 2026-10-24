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

  // Salva o usuário e o token retornados pela API e vai para a tela de reembolsos
  const concluirLogin = async ({ usuario, token }) => {
    await login({
      id: String(usuario.id),
      nome: usuario.nome,
      cargo: usuario.cargo,
      tipo: usuario.tipo || "usuario",
      token,
    });
    // Pequeno intervalo para o estado de autenticação propagar antes da rota protegida
    await new Promise((resolve) => setTimeout(resolve, 100));
    navigate("/reembolsos", { replace: true });
  };

  const mostrarErro = (error) => {
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
  };

  // Entra numa conta de demonstração (colaborador ou gestor), sem senha
  const entrarDemo = async (perfil) => {
    setErro(null);
    setCarregando(true);
    try {
      const resposta = await api.post("/colaborador/login-demo", { perfil });
      await concluirLogin(resposta.data);
    } catch (error) {
      mostrarErro(error);
    } finally {
      setCarregando(false);
    }
  };

  // Função assíncrona para lidar com o processo de login
  const fazerLogin = async (e) => {
    e.preventDefault(); // Previne o comportamento padrão de submissão do formulário
    setErro(null); // Limpa erros anteriores
    setCarregando(true); // Ativa o indicador de carregamento

    try {
      // Faz a requisição POST para o endpoint de login no backend
      const resposta = await api.post("/colaborador/login", { email, senha });
      await concluirLogin(resposta.data);
    } catch (error) {
      mostrarErro(error);
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

        {/* Acesso rápido para recrutadores e visitantes */}
        <div className={styles.demo}>
          <span>Quer testar sem criar conta?</span>
          <div>
            <button type="button" onClick={() => entrarDemo("colaborador")} disabled={carregando}>
              Entrar como colaborador
            </button>
            <button type="button" onClick={() => entrarDemo("gestor")} disabled={carregando}>
              Entrar como gestor
            </button>
          </div>
          <small>Contas de demonstração com dados fictícios.</small>
        </div>
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