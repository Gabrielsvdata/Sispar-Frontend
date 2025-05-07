import{useState} from "react"
import{useNavigate} from "react-router-dom"
import api from "../../Services/Api.jsx"
import Capa from "../../assets/Tela Login/imagem tela de login.png"
import Logo from "../../assets/Tela Login/logo-ws.png"
import styles from "./Login.module.scss"
function Login() {

    const navigate = useNavigate() //iniciar o hook useNavigate

    const irParaReembolsos = () => {
        navigate("/Reembolsos")
    }

    // Iniciando estados

    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")

    const fazerLogin = async (e) => {
        e.preventDefault()

        try{
            const respostas = await api.post("/colaborador/login", {
                "email":email, 
                "senha":senha
            });
            console.log(respostas.data);
            alert("Login realizado com sucesso")
            irParaReembolsos() // <-- redireciona pra aula de reembolso

        }catch(error){
            console.log("Erro ao fazer Login", error)
            alert("ERRO NO LOGIN")
        }
    }
    
    return (

        <main className={styles.mainLogin}>
            <section className={styles.containerImagem}>
                <img src={Capa} alt="Navio com carregado de Container" />
            </section>
            <section className={styles.containerForms}>
                <img src={Logo} alt="Logo da Wilson SOns" />
                <h1>Boas vindas ao Novo Portal SISPAR</h1>
                <p>Sistemas de Emissão de Boletos e Parcelamentos</p>

                <form className={styles.formLogin} action="">

                    <input type="email" name="email" id="email" placeholder="Email"value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <input type="password" name="password" id="senha" placeholder="Senha" value = {senha} onChange={ (e) => setSenha(e.target.value)} />

                    <a  onClick={() => navigate("/recuperar-senha")} href="">Esqueci minha senha</a>

                    <div> 
                        <button onClick={fazerLogin} className={styles.buttonEntrar}>Entrar</button>
                        <button  onClick={() => navigate("/cadastro")}className={styles.buttonCriar}>Criar conta</button>
                    </div>

                </form>
            </section>
        </main>

    )
}
export default Login;