// src/pages/Historico.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../Services/Api";
import NavBar from "../navbar/NavBar";
import BottonmNav from "../navbar/BottomNav";

import Home from "../../assets/Dashboard/home header.png";
import Seta from "../../assets/Dashboard/Vector.png";

import styles from "./Historico.module.scss";

export default function Historico() {
  const [statusTab, setStatusTab] = useState("");
  const [reembolsos, setReembolsos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [numPrestacaoSearch, setNumPrestacaoSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // sempre que statusTab mudar, busca de novo
  useEffect(() => {
    async function fetchData() {
      try {
        const params = statusTab ? `?status=${encodeURIComponent(statusTab)}` : "";
        const { data } = await Api.get(`/reembolsos${params}`);
        setReembolsos(data);
        setCurrentPage(1);
      } catch (err) {
        console.error(err);
        alert("Erro ao carregar histórico.");
      }
    }
    fetchData();
  }, [statusTab]);

  // aplica filtros de status, nº prestação, colaborador e datas no front
  const filtrados = reembolsos.filter(r => {
    const matchesStatus = statusTab ? r.status === statusTab : true;
    const matchesPrestacao = numPrestacaoSearch
      ? String(r.num_prestacao).includes(numPrestacaoSearch)
      : true;
    const matchesName = r.colaborador
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const dateOnly = r.data.split("T")[0];
    const afterFrom = dateFrom ? dateOnly >= dateFrom : true;
    const beforeTo  = dateTo   ? dateOnly <= dateTo   : true;
    return matchesStatus && matchesPrestacao && matchesName && afterFrom && beforeTo;
  });

  const totalPages   = Math.ceil(filtrados.length / itemsPerPage);
  const startIdx     = (currentPage - 1) * itemsPerPage;
  const currentItems = filtrados.slice(startIdx, startIdx + itemsPerPage);

  return (
    <div className={styles.layoutHistorico}>
      <BottonmNav/>
      <NavBar />

      <main className={styles.mainHistorico}>
        <header className={styles.headerHistorico}>
          <img src={Home} alt="home" onClick={() => navigate("/reembolsos")} />
          <img src={Seta} alt="seta" />
          <p>Reembolsos</p>
          <img src={Seta} alt="seta" />
          <p>Histórico</p>
        </header>

        <section className={styles.tabs}>
          <button
            className={statusTab === "Aprovado" ? styles.active : ""}
            onClick={() => setStatusTab("Aprovado")}
          >
            Aprovados
          </button>
          <button
            className={statusTab === "Rejeitado" ? styles.active : ""}
            onClick={() => setStatusTab("Rejeitado")}
          >
            Rejeitados
          </button>
          <button
            className={statusTab === "" ? styles.active : ""}
            onClick={() => setStatusTab("")}
          >
            Todos
          </button>
        </section>

        <section className={styles.filters}>
          <input
            type="text"
            placeholder="Nº Prestação…"
            value={numPrestacaoSearch}
            onChange={e => setNumPrestacaoSearch(e.target.value)}
          />
          <input
            type="text"
            placeholder="Pesquisar colaborador…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <div className={styles.dateFilters}>
            <label>
              De:
              <input
                type="date"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
              />
            </label>
            <label>
              Até:
              <input
                type="date"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
              />
            </label>
          </div>
        </section>

        <section className={styles.actions}>
          <button
            className={styles.buttonGrafico}
            onClick={() => navigate("/graficos")}
          >
            Gráficos
          </button>
        </section>

        <section className={styles.tabela}>
          <table>
            <thead>
              <tr>
                <th>Nº Prest</th>
                <th>Colaborador</th>
                <th>Empresa</th>
                <th>Data</th>
                <th>Descrição</th>
                <th>Tipo Despesa</th>
                <th>Centro Custo</th>
                <th>Ord. Int.</th>
                <th>Div.</th>
                <th>PEP</th>
                <th>Moeda</th>
                <th>Dist. KM</th>
                <th>Valor KM</th>
                <th>Val. Faturado</th>
                <th>Despesa</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map(r => (
                <tr key={r.num_prestacao}>
                  <td>{r.num_prestacao}</td>
                  <td>{r.colaborador}</td>
                  <td>{r.empresa}</td>
                  <td>{new Date(r.data).toLocaleDateString('pt-BR')}</td>
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
                  <td
                    className={
                      r.status === "Aprovado"
                        ? styles.statusAprovado
                        : styles.statusRejeitado
                    }
                  >
                    {r.status}
                  </td>
                </tr>
              ))}
              {currentItems.length === 0 && (
                <tr>
                  <td colSpan={16} style={{ textAlign: "center" }}>
                    Nada para exibir.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        <section className={styles.pagination}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={currentPage === i + 1 ? styles.active : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </section>
      </main>
    </div>
  );
}
