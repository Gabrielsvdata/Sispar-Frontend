import Home from "../../assets/Header/botão - Home.png"
import Historico from "../../assets/Header/Botão - Histórico.png"
import Pesquisa from "../../assets/Header/Botão - Pesquisa.png"
import Reembolso from "../../assets/Header/Botão - Reembolso.png"
import Sair from "../../assets/Header/Botão - Sair.png"
import People from "../../assets/Header/MePeople.jpeg"
import FecharHearder from "../../assets/Header/imagem-fechar-header.png"
import styles from "./NavBar.module.scss"
import { useNavigate } from "react-router-dom"
import { useState } from "react"


function NavBar() {

    const navigate = useNavigate()
    const [status, setStatus] = useState("fechado")

    function click() {
        if (status === "fechado") {
            setStatus("aberto")
        }
        else {
            setStatus("fechado")
        }
    }

    return (
        <nav className={`${styles.navBarEstilo} ${styles[status]}`}>
            <button onClick={() => click()}>
                <img src={FecharHearder} alt="Botão abrir e fechar" />
            </button>

            <section>
                <div className={styles.navbarPeople}>
                <img src={People} alt="Foto Perfil" />
                
                <h2>GABRIEL SILVANO</h2>
                <p>Comercio exterior</p>
                </div>

                <div className={styles.containerNavbar}> 

                    <div className={styles.buttonNav}>
                    <button onClick={() => {
                        navigate("/reembolsos");
                    }}>
                        <img src={Home} alt="Botão do Home" />
                    </button>
                    <p>Inicio</p>
                    </div>

                    <div className={styles.buttonNav}>
                    <button onClick={() => { navigate("/solicitacao") }}>
                        <img src={Reembolso} alt="Botão Reembolso" />
                    </button>
                    <p>Reembolsos</p>
                    </div>

                    <div className={styles.buttonNav}>
                    <button onClick={() => { navigate("/reembolsos") }}>
                        <img src={Pesquisa} alt="Botão Pesquisa" />
                    </button>
                    <p>Pesquisa</p>
                    </div>

                    <div className={styles.buttonNav}>
                    <button onClick={() => { navigate("/solicitacao") }}>
                        <img src={Historico} alt="Botão Histórico" />
                    </button>
                    <p>Histórico</p>
                    </div>
                </div>
            </section>



            <button className={styles.buttonSair} onClick={() => { navigate("/") }}>
                <img src={Sair} alt="Botão Sair" />
            </button>
        </nav>
    );
}

export default NavBar;