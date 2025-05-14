// src/components/reembolsos/Reembolsos.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Api from "../../Services/Api";
import styles from "./Reembolsos.module.scss"
import NavBar from "../navbar/NavBar.jsx";

import Home from "../../assets/Dashboard/home header.png";
import Seta from "../../assets/Dashboard/Vector.png";
import Análise from "../../assets/Dashboard/Análises.png";
import NumeroAnálise from "../../assets/Dashboard/N-Análises.png";
import NumeroAprovados from "../../assets/Dashboard/N-Aprovados.png";
import NumeroRejeitados from "../../assets/Dashboard/N-Rejeitados.png";
import NumeroSolicitados from "../../assets/Dashboard/N-Solicitados.png";
import SolicitarHistorico from "../../assets/Dashboard/SolicitarHistórico.png";
import SolicitarReembolso from "../../assets/Dashboard/SolicitarReembolso.png";
import SistemaAtualizado from "../../assets/Dashboard/Sistema-atualizado.png";



function Reembolsos() {
  const navigate = useNavigate();
  const location = useLocation();

  const [counts, setCounts] = useState({
    solicitados:  0,
    emAnalise:    0,
    aprovados:    0,
    rejeitados:   0,
  });

  useEffect(() => {
    carregarContadores();
  }, [location]);

  async function carregarContadores() {
    try {
      const { data } = await Api.get("/reembolsos");
      const solicitados = data.length;
      const emAnalise   = data.filter(r => r.status === "Em análise").length;
      const aprovados   = data.filter(r => r.status === "Aprovado").length;
      const rejeitados  = data.filter(r => r.status === "Rejeitado").length;
      setCounts({ solicitados, emAnalise, aprovados, rejeitados });
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar contadores de reembolso.");
    }
  }

  return (
    <div className={styles.container}>
      <NavBar />

      <main className={styles.mainReembolsos}>

        <header className={styles.headerReembolso}>
          <img src={Home} alt="Home" />
          <img src={Seta} alt="Seta" />
          <p>Reembolsos</p>
        </header>

        <div className={styles.sisRem}>
          <h1>Sistema de Reembolsos</h1>
          <p>Solicite novos pedidos de reembolso, visualize solicitações em análise e todo o histórico.</p>
        </div>

        <section className={styles.containerCards}>
          <article className={styles.card} onClick={() => navigate("/solicitacao")}>
            <img src={SolicitarReembolso} alt="Solicitar Reembolso" />
            <p>Solicitar Reembolso</p>
          </article>

          <article className={styles.card} onClick={() => navigate("/analise")}>
            <img src={Análise} alt="Verificar Análises" />
            <p>Verificar Análises</p>
          </article>

          <article className={styles.card} onClick={() => navigate("/historico")}>
            <img src={SolicitarHistorico} alt="Histórico" />
            <p>Histórico</p>
          </article>
        </section>

        <section className={styles.containerStatus}>
          <div onClick={() => navigate("/solicitacao")}>
            <img className={styles.imgSolicitados} src={NumeroSolicitados} alt="Solicitados" />
            <h4>{counts.solicitados}</h4>
            <p>Solicitados</p>
          </div>
          <div onClick={() => navigate("/analise")}>
            <img className={styles.imgAnalises} src={NumeroAnálise} alt="Em análise" />
            <h4>{counts.emAnalise}</h4>
            <p>Em análise</p>
          </div>
          <div onClick={() => navigate("/historico")}>
            <img className={styles.imgAprovados} src={NumeroAprovados} alt="Aprovados" />
            <h4>{counts.aprovados}</h4>
            <p>Aprovados</p>
          </div>
          <div onClick={() => navigate("/historico")}>
            <img className={styles.imgRejeitados} src={NumeroRejeitados} alt="Rejeitados" />
            <h4>{counts.rejeitados}</h4>
            <p>Rejeitados</p>
          </div>
        </section>

        <section className={styles.containerSistema}>
          <img src={SistemaAtualizado} alt="Sistema atualizado" />
          <a href="#">Sistema Atualizado</a>
        </section>

      </main>
    </div>
  );
}

export default Reembolsos;
