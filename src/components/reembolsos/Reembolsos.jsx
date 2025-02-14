import styles from "./Reembolsos.module.scss"
import Home from "../../assets/Dashboard/home header.png"
import Seta from "../../assets/Dashboard/Vector.png"
import Análise from "../../assets/Dashboard/Análises.png"
import NumeroAnálise from "../../assets/Dashboard/N-Análises.png"
import NumeroAprovados from "../../assets/Dashboard/N-Aprovados.png"
import NumeroRejeitados from "../../assets/Dashboard/N-Rejeitados.png"
import NumeroSolicitados from "../../assets/Dashboard/N-Solicitados.png"
import SisAtualizado from "../../assets/Dashboard/Sistema-atualizado.png"
import SolicitarHistorico from "../../assets/Dashboard/Solicitar - Histórico.png"
import SolicitarReembolso from "../../assets/Dashboard/Solicitar - Reembolso.png"

function Reembolsos() {
    return (
        <div>
            <header>
                <img src={Home} alt="Casinha Header" />
                <img src={Seta} alt="seta indicativa ao reembolsos" />
                <p>Reembolsos</p>
            </header>

            <main className={styles.mainReembolsos}>
                <h1>Sistema de Reembolsos</h1>
                <p>Solicite novos pedidos de reembolso, vizualize solicitações em alálise e todo o histórico.</p>


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
            </main>

        </div>
    )
}

export default Reembolsos;