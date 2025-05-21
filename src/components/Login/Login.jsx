import{useState} from "react"
import{useNavigate} from "react-router-dom"
import api from "../../Services/Api.jsx"
import Capa from "../../assets/Tela Login/imagem tela de login.png"
import Logo from "../../assets/Tela Login/logo-ws.png"
import styles from "./Login.module.scss"
function Login() {
  // Declaração dos estados necessários para o componente
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);

  // Hook para navegação
  const navigate = useNavigate();

  // Função para redirecionar após o login bem-sucedido
  const irParaReembolsos = () => {
    navigate("/reembolsos"); // Ajuste o caminho da rota conforme necessário
  };

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

      // Armazena os dados do usuário e o token no localStorage
      localStorage.setItem("usuarioId", String(usuario.id));
      localStorage.setItem("usuarioNome", usuario.nome);
      localStorage.setItem("usuarioCargo", usuario.cargo);
      if (token) {
        localStorage.setItem("authToken", token); // Armazena o token JWT, se existir
      }

      // Feedback ao usuário
      alert("Login realizado com sucesso!"); // Considere usar um componente de notificação/toast

      // Dispara um evento global, se outros componentes precisarem reagir à mudança de usuário
      window.dispatchEvent(new Event("userChanged"));

      // Redireciona o usuário
      irParaReembolsos();

    } catch (error) {
      // Log do erro para depuração
      console.error("Erro ao fazer login:", error);

      // Trata diferentes tipos de erro e define a mensagem para o usuário
      if (error.response && error.response.data && error.response.data.mensagem) {
        setErro(error.response.data.mensagem);
      } else if (error.request) {
        setErro("Não foi possível conectar ao servidor. Verifique sua conexão ou as configurações.");
      } else {
        setErro("Ocorreu um erro inesperado ao tentar fazer login. Tente novamente.");
      }
    } finally {
      // Independentemente do resultado, desativa o indicador de carregamento
      setCarregando(false);
    }
  };
  // ... O restante do seu componente JSX viria aqui ...
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
              type="button" // Define como tipo 'button' para não submeter o formulário
              onClick={() => !carregando && navigate("/cadastro")} // Impede clique durante o carregamento
              className={styles.buttonCriar}
              disabled={carregando}
            >
              Criar conta
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
export default Login;