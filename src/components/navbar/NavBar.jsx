import Home from "../../assets/Header/botão - Home.png"
import Historico from "../../assets/Header/Botão - Histórico.png"
import Pesquisa from "../../assets/Header/Botão - Pesquisa.png"
import Reembolso from "../../assets/Header/Botão - Reembolso.png"
import Sair from "../../assets/Header/Botão - Sair.png"
import People from "../../assets/Header/image.png"
import FecharHearder from "../../assets/Header/imagem-fechar-header.png"
import styles from "./NavBar.module.scss"
import {useNavigate} from "react-router-dom"

function NavBar() {

    const navigate = useNavigate()

    return (
        <nav className={styles.navBarEstilo}>
            <button onClick={() => {navigate("/")}}>
                <img src={FecharHearder} alt="Botão abrir e fechar" />
            </button>

            <section>
                <img src={People} alt="Foto Perfil" />

                <div>
                    <button onClick={() => {
                        navigate("/reembolsos");
                    }}>
                    <img src={Home} alt="Botão do Home" />
                    </button>

                    <button onClick={() => { navigate("/solicitacao") }}>
                        <img src={Reembolso} alt="Botão Reembolso" />
                    </button>

                    <button onClick={() => {navigate("/reembolso")}}>
                        <img src={Pesquisa} alt="Botão Pesquisa" />
                    </button>

                    <button onClick={() => {navigate ("/solicitacao")}}>
                        <img src={Historico} alt="Botão Histórico" />
                    </button>
                </div>
            </section>



            <button className={styles.buttonSair} onClick={() => { navigate("/") }}>
                <img src={Sair} alt="Botão Sair" />
            </button>
        </nav>
    );
}

export default NavBar;