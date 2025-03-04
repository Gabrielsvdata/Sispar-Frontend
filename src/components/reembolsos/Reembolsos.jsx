import styles from "./Reembolsos.module.scss"
import Home from "../../assets/Dashboard/home header.png"
import Seta from "../../assets/Dashboard/Vector.png"
import Análise from "../../assets/Dashboard/Análises.png"
import NumeroAnálise from "../../assets/Dashboard/N-Análises.png"
import NumeroAprovados from "../../assets/Dashboard/N-Aprovados.png"
import NumeroRejeitados from "../../assets/Dashboard/N-Rejeitados.png"
import NumeroSolicitados from "../../assets/Dashboard/N-Solicitados.png"
import SisAtualizado from "../../assets/Dashboard/Sistema-atualizado.png"
import SolicitarHistorico from "../../assets/Dashboard/SolicitarHistórico.png"
import SolicitarReembolso from "../../assets/Dashboard/SolicitarReembolso.png"
import SistemaAtualizado from "../../assets/Dashboard/Sistema-atualizado.png"
//importando NavBar
import NavBar from "../navbar/NavBar.jsx"
function Reembolsos() {

    return (
        <div className={styles.container} >
            <NavBar/>
            <div>
            <header>
                <img src={Home} alt="Casinha Header" />
                <img src={Seta} alt="seta indicativa ao reembolsos" />
                <p>Reembolsos</p>
            </header>

            <main className={styles.mainReembolsos}>

                <div> 
                <h1>Sistema de Reembolsos</h1>
                <p>Solicite novos pedidos de reembolso, vizualize solicitações em alálise e todo o histórico.</p>
                </div>

                <section className={styles.containerCards}>

                    <article className={styles.card}>
                        <img src={SolicitarReembolso} alt="" />
                        <p>Solicitar Reembolso</p>
                    </article>

                    <article className={styles.card}>
                        <img src={Análise} alt="Análise do reembolso" />
                        <p>Verificar Análises</p>
                    </article>

                    <article className={styles.card}>
                        <img src={SolicitarHistorico} alt="" />
                        <p>Histórico</p>
                    </article>
                </section>

                <section className={styles.containerStatus}>
                    <div>
                    <img className={styles.imgSolicitados} src={NumeroSolicitados} alt="" />
                    <h4>182</h4>
                    <p>Solicitados</p>
                    </div>

                    <div>
                    <img className={styles.imgAnalises} src={NumeroAnálise} alt="" />
                    <h4>74</h4>
                    <p>Em análise</p>
                    </div>

                    <div>
                    <img className={styles.imgAprovados} src={NumeroAprovados} alt="" />
                    <h4>195</h4>
                    <p>Aprovados</p>
                    </div>

                    <div>
                    <img className={styles.imgRejeitados} src={NumeroRejeitados} alt="" />
                    <h4>41</h4>
                    <p>Rejeitados</p>
                    </div>
                </section>

                <section className={styles.containerSistema}>
                    <img src={SistemaAtualizado} alt="logo Sistema atualuzado" />
                    <a href="">Sistema Atualizado</a>
                </section>
            </main>
            </div>

        </div>
    );
}

export default Reembolsos;