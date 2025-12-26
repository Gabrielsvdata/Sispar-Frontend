// src/pages/Historico.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../Services/Api";
import { isAdmin, getUsuarioId } from "../../utils/auth";
import NavBar from "../navbar/NavBar";
import BottomNav from "../navbar/BottomNav";

import Home from "../../assets/Dashboard/home header.png";
import Seta from "../../assets/Dashboard/Vector.png";

import styles from "./Historico.module.scss";

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

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

  useEffect(() => {
    async function fetchData() {
      try {
        // Se não for admin, filtra apenas os reembolsos do próprio usuário
        const usuarioId = getUsuarioId();
      const endpoint = isAdmin()
          ? `/reembolsos/` 
          : `/reembolsos/?colaborador_id=${usuarioId}`;        const { data } = await Api.get(endpoint);
        setReembolsos(data);
        setCurrentPage(1);
      } catch (err) {
        console.error(err);
        alert("Erro ao carregar histórico.");
      }
    }
    fetchData();
  }, []);

  const filtrados = reembolsos.filter(r => {
    const matchesStatus = statusTab ? r.status === statusTab : true;
    const matchesPrestacao = numPrestacaoSearch
      ? String(r.num_prestacao).includes(numPrestacaoSearch)
      : true;
    const matchesName = r.colaborador
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const dateOnly = r.data ? r.data.split("T")[0] : '';
    const afterFrom = dateFrom ? dateOnly >= dateFrom : true;
    const beforeTo  = dateTo   ? dateOnly <= dateTo   : true;
    return matchesStatus && matchesPrestacao && matchesName && afterFrom && beforeTo;
  });

  const totalPages   = Math.ceil(filtrados.length / itemsPerPage);
  const startIdx     = (currentPage - 1) * itemsPerPage;
  const currentItems = filtrados.slice(startIdx, startIdx + itemsPerPage);

  const getStatusClass = (status) => {
    if (status === "Aprovado") return styles.statusAprovado;
    if (status === "Rejeitado") return styles.statusRejeitado;
    if (status === "Em análise") return styles.statusEmAnalise;
    return "";
  };

  return (
    <div className={styles.layoutHistorico}>
      <BottomNav/>
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
            className={statusTab === "Aprovado" ? `${styles.active} ${styles.activeGreen}` : ""}
            onClick={() => setStatusTab("Aprovado")}
          >
            Aprovados
          </button>
          <button
            className={statusTab === "Rejeitado" ? `${styles.active} ${styles.activeRed}` : ""}
            onClick={() => setStatusTab("Rejeitado")}
          >
            Rejeitados
          </button>
          <button
            className={statusTab === "Em análise" ? `${styles.active} ${styles.activeYellow}` : ""}
            onClick={() => setStatusTab("Em análise")}
          >
            Em Análise
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
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
            </label>
            <label>
              Até:
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
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

        <div className={styles.tabela}>
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
            {/* CORREÇÃO PRINCIPAL: Adicionado 'data-label' em cada <td> */}
            <tbody>
              {currentItems.map(r => (
                <tr key={r.num_prestacao}>
                  <td data-label="Nº Prest">{r.num_prestacao}</td>
                  <td data-label="Colaborador">{r.colaborador}</td>
                  <td data-label="Empresa">{r.empresa}</td>
                  <td data-label="Data">{r.data ? new Date(r.data).toLocaleDateString('pt-BR') : '-'}</td>
                  <td data-label="Descrição">{r.descricao}</td>
                  <td data-label="Tipo Despesa">{r.tipo_reembolso}</td>
                  <td data-label="Centro Custo">{r.centro_custo}</td>
                  <td data-label="Ord. Int.">{r.ordem_interna}</td>
                  <td data-label="Div.">{r.divisao}</td>
                  <td data-label="PEP">{r.pep}</td>
                  <td data-label="Moeda">{r.moeda}</td>
                  <td data-label="Dist. KM">{r.distancia_km}</td>
                  <td data-label="Valor KM">{r.valor_km}</td>
                  <td data-label="Val. Faturado">{currencyFormatter.format(r.valor_faturado || 0)}</td>
                  <td data-label="Despesa">{currencyFormatter.format(r.despesa || 0)}</td>
                  <td data-label="Status">
                    <span className={getStatusClass(r.status)}>
                      {r.status}
                    </span>
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
        </div>

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