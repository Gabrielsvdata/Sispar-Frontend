// src/components/analise/VerificarAnalises.jsx
// VERSÃO COMPLETA E FINAL

import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../Services/Api";
import { isAdmin } from "../../utils/auth";
import NavBar from "../navbar/NavBar";
import BottomNav from "../navbar/BottomNav";
import ModalConfirmacao from "../modal/ModalConfirmacao";
import { Loading } from "../ui/Loading";

import Home from "../../assets/Dashboard/home header.png";
import Seta from "../../assets/Dashboard/Vector.png";
import CheckIcon from "../../assets/solicitacao/check.png";
import XIcon from "../../assets/solicitacao/x.png";

import styles from "./VerificarAnalise.module.scss";

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export default function VerificarAnalise() {
  const [pendentes, setPendentes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filterTipoDespesa, setFilterTipoDespesa] = useState("");
  const navigate = useNavigate();

  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    confirmText: "Confirmar",
    confirmButtonType: "danger",
    showCancelButton: true,
  });

  const closeModal = () => setModalState({ isOpen: false });

  const carregarPendentes = useCallback(async () => {
    setLoading(true);
    try {
      const usuarioId = localStorage.getItem("usuarioId");
      const endpoint = isAdmin() 
        ? "/reembolsos/" 
        : `/reembolsos/?colaborador_id=${usuarioId}`;
      
      const { data } = await Api.get(endpoint);
      const somenteAnalise = data.filter((r) => r.status === "Em análise");
      setPendentes(somenteAnalise);
    } catch (err) {
      console.error(err);
      setModalState({
        isOpen: true,
        title: "Erro",
        message: "Erro ao carregar solicitações. Tente novamente.",
        onConfirm: closeModal,
        confirmText: "OK",
        showCancelButton: false,
        confirmButtonType: "danger",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarPendentes();
  }, [carregarPendentes]);

  async function aprovar(num_prestacao) {
    setActionLoading(true);
    try {
      await Api.patch(`/reembolsos/${num_prestacao}/aprovar/`);
      await carregarPendentes();
      setModalState({
        isOpen: true,
        title: "Sucesso",
        message: "Reembolso aprovado com sucesso!",
        onConfirm: closeModal,
        confirmText: "OK",
        showCancelButton: false,
        confirmButtonType: "primary",
      });
    } catch {
      setModalState({
        isOpen: true,
        title: "Erro",
        message: "Erro ao aprovar reembolso. Tente novamente.",
        onConfirm: closeModal,
        confirmText: "OK",
        showCancelButton: false,
        confirmButtonType: "danger",
      });
    } finally {
      setActionLoading(false);
    }
  }
  
  async function rejeitar(num_prestacao) {
    setActionLoading(true);
    try {
      await Api.patch(`/reembolsos/${num_prestacao}/rejeitar/`);
      await carregarPendentes();
      setModalState({
        isOpen: true,
        title: "Sucesso",
        message: "Reembolso rejeitado com sucesso!",
        onConfirm: closeModal,
        confirmText: "OK",
        showCancelButton: false,
        confirmButtonType: "danger",
      });
    } catch {
      setModalState({
        isOpen: true,
        title: "Erro",
        message: "Erro ao rejeitar reembolso. Tente novamente.",
        onConfirm: closeModal,
        confirmText: "OK",
        showCancelButton: false,
        confirmButtonType: "danger",
      });
    } finally {
      setActionLoading(false);
    }
  }

  const handleAprovarClick = (reembolso) => {
    setModalState({
      isOpen: true,
      title: "Aprovar Reembolso",
      message: `Tem certeza que deseja APROVAR o reembolso Nº ${reembolso.num_prestacao} do colaborador ${reembolso.colaborador}?`,
      onConfirm: () => aprovar(reembolso.num_prestacao),
      confirmText: "Aprovar",
      confirmButtonType: "primary",
      showCancelButton: true,
    });
  };

  const handleRejeitarClick = (reembolso) => {
    setModalState({
      isOpen: true,
      title: "Rejeitar Reembolso",
      message: `Tem certeza que deseja REJEITAR o reembolso Nº ${reembolso.num_prestacao} do colaborador ${reembolso.colaborador}?`,
      onConfirm: () => rejeitar(reembolso.num_prestacao),
      confirmText: "Rejeitar",
      confirmButtonType: "danger",
      showCancelButton: true,
    });
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filtros e ordenação
  let mostrados = pendentes.filter((r) => {
    const matchesSearch = r.colaborador.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = filterTipoDespesa ? r.tipo_reembolso === filterTipoDespesa : true;
    return matchesSearch && matchesTipo;
  });

  if (sortConfig.key) {
    mostrados = [...mostrados].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Lista única de tipos de despesa para o filtro
  const tiposDespesa = [...new Set(pendentes.map(r => r.tipo_reembolso).filter(Boolean))];

  if (loading) {
    return (
      <div className={styles.layoutAnalise}>
        <NavBar />
        <BottomNav />
        <Loading fullScreen message="Carregando análises..." />
      </div>
    );
  }

  return (
    <div className={styles.layoutAnalise}>
      {actionLoading && <Loading fullScreen message="Processando..." />}
      
      <ModalConfirmacao
        isOpen={modalState.isOpen}
        title={modalState.title}
        onConfirm={modalState.onConfirm}
        onClose={closeModal}
        confirmText={modalState.confirmText}
        showCancelButton={modalState.showCancelButton}
        confirmButtonType={modalState.confirmButtonType}
      >
        {modalState.message}
      </ModalConfirmacao>

      <NavBar />
      <BottomNav />

      <main className={styles.mainAnalise}>
        <header className={styles.headerAnalise}>
          <img src={Home} alt="home" onClick={() => navigate("/reembolsos")} />
          <img src={Seta} alt="seta" />
          <p>Reembolsos</p>
          <img src={Seta} alt="seta" />
          <p>Verificar Análises</p>
        </header>

        <section className={styles.searchBar}>
          <input
            id="search-colaborador"
            type="text"
            placeholder="Pesquisar colaborador…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={filterTipoDespesa}
            onChange={(e) => setFilterTipoDespesa(e.target.value)}
          >
            <option value="">Todos os tipos</option>
            {tiposDespesa.map(tipo => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
          <button 
            className={styles.btnAtualizar} 
            onClick={carregarPendentes} 
            disabled={loading}
          >
            {loading ? 'Atualizando...' : 'Atualizar'}
          </button>
        </section>

        <div className={styles.tabelaContainer}>
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort('num_prestacao')} style={{ cursor: 'pointer' }}>
                  Nº Prest {sortConfig.key === 'num_prestacao' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('colaborador')} style={{ cursor: 'pointer' }}>
                  Colaborador {sortConfig.key === 'colaborador' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('empresa')} style={{ cursor: 'pointer' }}>
                  Empresa {sortConfig.key === 'empresa' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('data')} style={{ cursor: 'pointer' }}>
                  Data {sortConfig.key === 'data' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th>Descrição</th>
                <th onClick={() => handleSort('tipo_reembolso')} style={{ cursor: 'pointer' }}>
                  Tipo Despesa {sortConfig.key === 'tipo_reembolso' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('valor_faturado')} style={{ cursor: 'pointer' }}>
                  Val. Faturado {sortConfig.key === 'valor_faturado' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('despesa')} style={{ cursor: 'pointer' }}>
                  Despesa {sortConfig.key === 'despesa' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {mostrados.map((r) => (
                <tr key={r.num_prestacao}>
                  <td data-label="Nº Prest">{r.num_prestacao}</td>
                  <td data-label="Colaborador">{r.colaborador}</td>
                  <td data-label="Empresa">{r.empresa}</td>
                  <td data-label="Data">{new Date(r.data).toLocaleDateString("pt-BR")}</td>
                  <td data-label="Descrição">{r.descricao}</td>
                  <td data-label="Tipo Despesa">{r.tipo_reembolso}</td>
                  <td data-label="Val. Faturado">{currencyFormatter.format(r.valor_faturado)}</td>
                  <td data-label="Despesa">{currencyFormatter.format(r.despesa || 0)}</td>
                  
                  {/* Célula de ações - Apenas admins podem aprovar/rejeitar */}
                  <td className={styles.actionsWrapper} data-label="Ações">
                    {isAdmin() ? (
                      <>
                        <button 
                          className={styles.actionButtonIA} 
                          onClick={() => navigate(`/analise-ia/${r.num_prestacao}`)} 
                          aria-label={`Análise IA do reembolso ${r.num_prestacao}`}
                          title="Ver Análise Completa com IA"
                        >
                          <span>🤖</span>
                          <span>Análise IA</span>
                        </button>
                        <button 
                          className={styles.actionButtonAprovar} 
                          onClick={() => handleAprovarClick(r)} 
                          aria-label={`Aprovar reembolso ${r.num_prestacao}`}
                        >
                          <img src={CheckIcon} alt="" />
                          <span>Aprovar</span>
                        </button>
                        <button 
                          className={styles.actionButtonRejeitar} 
                          onClick={() => handleRejeitarClick(r)} 
                          aria-label={`Rejeitar reembolso ${r.num_prestacao}`}
                        >
                          <img src={XIcon} alt="" />
                          <span>Rejeitar</span>
                        </button>
                      </>
                    ) : (
                      <span className={styles.aguardandoAprovacao}>
                        Aguardando aprovação
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {mostrados.length === 0 && (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center" }}>
                    Nenhuma solicitação encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}