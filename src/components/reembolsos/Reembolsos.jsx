import styles from "./Reembolsos.module.scss"
import Home from "../../assets/Dashboard/home header.png"
import Seta from "../../assets/Dashboard/Vector.png"
import SolicitarReembolso from "../../assets/Dashboard/Solicitar - Reembolso.png"
import Análise from "../../assets/Dashboard/Análises.png"
import NumeroAnálise from "../../assets/Dashboard/N-Análises.png"
import NumeroAprovados from "../../assets/Dashboard/N-Aprovados.png"
import NumeroRejeitados from "../../assets/Dashboard/N-Rejeitados.png"
import NumerosSolicitados from "../../assets/Dashboard/N-Solicitados.png"
import SisAtualizado from "../../assets/Dashboard/Sistema-atualizado.png"


function Reembolsos() {
    return (
        <div>
            <header>
                <img src={Home} alt="Casinha Header" />
                <img src={Seta} alt="seta indicativa ao reembolsos" />
                <p>Reembolsos</p>
            </header>

            <main>
                <h1>Sistema de Reembolsos</h1>
                <p>Solicite novos pedidos de reembolso, vizualize solicitações em alálise e todo o histórico.</p>
            </main>

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
                    <p>Histórico</p>
                </article>
            </section>
            </div>
    )
}

export default Reembolsos;