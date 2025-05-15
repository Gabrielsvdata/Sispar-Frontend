import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../Services/Api";
import NavBar from "../navbar/NavBar";

import Home      from "../../assets/Dashboard/home header.png";
import Seta      from "../../assets/Dashboard/Vector.png";
import CheckIcon from "../../assets/solicitacao/check.png";
import XIcon     from "../../assets/solicitacao/x.png";

import styles from "./VerificarAnalise.module.scss";

export default function VerificarAnalise() {
  const [pendentes, setPendentes]   = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    carregarPendentes();
  }, []);

  async function carregarPendentes() {
    try {
      // busca todas, depois filtra apenas as que estão "Em análise"
      const { data } = await Api.get("/reembolsos");
      const somenteAnalise = data.filter(r => r.status === "Em análise");
      setPendentes(somenteAnalise);
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar solicitações.");
    }
  }

  async function aprovar(num) {
    try {
      await Api.patch(`/reembolsos/${num}/aprovar`);
      await carregarPendentes();
    } catch {
      alert("Erro ao aprovar.");
    }
  }

  async function rejeitar(num) {
    try {
      await Api.patch(`/reembolsos/${num}/rejeitar`);
      await carregarPendentes();
    } catch {
      alert("Erro ao rejeitar.");
    }
  }

  const mostrados = pendentes.filter(r =>
    r.colaborador.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.layoutAnalise}>
      <NavBar />

      <main className={styles.mainAnalise}>
        <header className={styles.headerAnalise}>
          <img src={Home} alt="home" onClick={() => navigate("/")} />
          <img src={Seta} alt="seta" />
          <p>Reembolsos</p>
          <img src={Seta} alt="seta" />
          <p>Verificar Análises</p>
        </header>

        <section className={styles.searchBar}>
          <input
            type="text"
            placeholder="Pesquisar colaborador…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </section>

        <section className={styles.tabela}>
          <table>
            <thead>
              <tr>
                <th>Nº Prest</th><th>Colaborador</th><th>Empresa</th>
                <th>Data</th><th>Descrição</th><th>Tipo Despesa</th>
                <th>Centro Custo</th><th>Ord. Int.</th><th>Div.</th>
                <th>PEP</th><th>Moeda</th><th>Dist. KM</th>
                <th>Valor KM</th><th>Val. Faturado</th><th>Despesa</th>
                <th>Aprovar</th><th>Rejeitar</th>
              </tr>
            </thead>
            <tbody>
              {mostrados.map(r => (
                <tr key={r.num_prestacao}>
                  <td>{r.num_prestacao}</td>
                  <td>{r.colaborador}</td>
                  <td>{r.empresa}</td>
                  <td>{new Date(r.data).toLocaleDateString("pt-BR")}</td>
                  <td>{r.descricao}</td>
                  <td>{r.tipo_reembolso}</td>
                  <td>{r.centro_custo}</td>
                  <td>{r.ordem_interna}</td>
                  <td>{r.divisao}</td>
                  <td>{r.pep}</td>
                  <td>{r.moeda}</td>
                  <td>{r.distancia_km}</td>
                  <td>{r.valor_km}</td>
                  <td>R$ {Number(r.valor_faturado).toFixed(2)}</td>
                  <td>R$ {Number(r.despesa || 0).toFixed(2)}</td>
                  <td className={styles.btnAprovar}>
                    <img
                      src={CheckIcon}
                      alt="aprovar"
                      style={{ cursor: "pointer" }}
                      onClick={() => aprovar(r.num_prestacao)}
                    />
                  </td>
                  <td className={styles.btnRejeitar}>
                    <img
                      src={XIcon}
                      alt="rejeitar"
                      style={{ cursor: "pointer" }}
                      onClick={() => rejeitar(r.num_prestacao)}
                    />
                  </td>
                </tr>
              ))}
              {mostrados.length === 0 && (
                <tr>
                  <td colSpan={17} style={{ textAlign: "center" }}>
                    Nenhuma solicitação encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
