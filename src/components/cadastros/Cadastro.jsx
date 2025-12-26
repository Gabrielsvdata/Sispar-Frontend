import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../Services/Api.jsx";
import Capa from "../../assets/Tela Login/imagem tela de login.png";
import Logo from "../../assets/Tela Login/logo-ws.png";
import styles from "./Cadastro.module.scss";


function Cadastro() {
  // Hook para navegação, para que eu possa redirecionar o usuário
  const navigate = useNavigate();

  // Estados para cada campo do formulário
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cargo, setCargo] = useState("");
  const [salario, setSalario] = useState("");
  const [tipo, setTipo] = useState("usuario"); // Novo estado para tipo de usuário

  // Função para validar os campos antes de enviar para o backend
  const validarCampos = () => {
    if (!nome || !email || !senha || !cargo || !salario) {
      alert("Preencha todos os campos.");
      return false; // Impede o cadastro se algum campo estiver vazio
    }
    if (!email.includes("@") || !email.includes(".")) {
      alert("E-mail inválido.");
      return false; // Impede o cadastro se o email não parecer válido
    }
    if (senha.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres.");
      return false; // Impede o cadastro se a senha for muito curta
    }
    // Tentei converter o salário para número aqui para a validação
    const salarioNumerico = Number(String(salario).replace(",", "."));
    if (isNaN(salarioNumerico) || salarioNumerico <= 0) {
      alert("Salário inválido.");
      return false; // Impede o cadastro se o salário não for um número positivo
    }
    return true; // Se todas as validações passarem, retorna true
  };

  // Função principal que é chamada quando o formulário é submetido
  const fazerCadastro = async (e) => {
    e.preventDefault(); // Previne o recarregamento da página, que é o comportamento padrão do form

    // Chamo minha função de validação primeiro
    if (!validarCampos()) {
      return; // Se a validação falhar, não continuo com o cadastro
    }

    try {
      // Se a validação passou, tento enviar os dados para a API
      // Faço a conversão do salário para número e substituo vírgula por ponto
      const resposta = await api.post("/colaborador/cadastrar", {
        nome,
        email,
        senha,
        cargo,
        salario: parseFloat(String(salario).replace(",", ".")),
        tipo, // Envia o tipo de usuário
      });

      // Se a API respondeu com sucesso (não caiu no catch)...
      alert("Cadastro realizado com sucesso!"); // Mostro uma mensagem de sucesso
      navigate("/"); // E aí sim, redireciono para a tela de login ("/")
    } catch (error) {
      // Se deu algum erro na chamada da API...
      console.error("Erro ao cadastrar:", error); // Mostro o erro no console para eu ver depois
      // E mostro uma mensagem genérica para o usuário
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

        {/* O formulário agora chama 'fazerCadastro' quando é submetido.
          Isso acontece quando um botão type="submit" dentro dele é clicado.
        */}
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
            type="text" // Mudei para text para facilitar a digitação com vírgula, a conversão é feita no submit
            placeholder="Salário"
            // step="0.01" // 'step' é mais para type="number"
            value={salario}
            onChange={(e) => setSalario(e.target.value)}
          />

          {/* Campo para selecionar tipo de usuário */}
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className={styles.selectTipo}
          >
            <option value="usuario">Usuário Comum</option>
            <option value="admin">Administrador</option>
          </select>

          <div>
            {/* CORREÇÃO PRINCIPAL AQUI:
              1. Mudei o type do botão "Cadastrar" para "submit".
                 Isso faz com que ele naturalmente acione o 'onSubmit' do formulário.
              2. Removi o 'onClick={() => navigate("/")}' daqui, porque a navegação
                 deve acontecer SÓ DEPOIS que o cadastro for bem-sucedido,
                 dentro da função 'fazerCadastro'.
            */}
            <button type="submit" className={styles.buttonCadastrar}>
              Cadastrar
            </button>

            {/* O botão Voltar continua como type="button" e navega direto */}
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