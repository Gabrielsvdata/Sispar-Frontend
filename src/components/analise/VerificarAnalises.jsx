// src/components/analise/VerificarAnalises.jsx
// VERSÃO COMPLETA E FINAL

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../Services/Api";
import NavBar from "../navbar/NavBar";
import BottomNav from "../navbar/BottomNav";
import ModalConfirmacao from "../modal/ModalConfirmacao";

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

  useEffect(() => {
    carregarPendentes();
  }, []);

  async function carregarPendentes() {
    try {
      const { data } = await Api.get("/reembolsos");
      const somenteAnalise = data.filter((r) => r.status === "Em análise");
      setPendentes(somenteAnalise);
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar solicitações.");
    }
  }

  async function aprovar(num_prestacao) {
    try {
      await Api.patch(`/reembolsos/${num_prestacao}/aprovar`);
      await carregarPendentes();
    } catch {
      alert("Erro ao aprovar.");
    } finally {
      closeModal();
    }
  }
  
  async function rejeitar(num_prestacao) {
    try {
      await Api.patch(`/reembolsos/${num_prestacao}/rejeitar`);
      await carregarPendentes();
    } catch {
      alert("Erro ao rejeitar.");
    } finally {
      closeModal();
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

  const mostrados = pendentes.filter((r) =>
    r.colaborador.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.layoutAnalise}>
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
          <label htmlFor="search-colaborador" className={styles.visuallyHidden}>
            Pesquisar por colaborador
          </label>
          <input
            id="search-colaborador"
            type="text"
            placeholder="Pesquisar colaborador…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </section>

        <div className={styles.tabelaContainer}>
          <table>
            <thead>
              <tr>
                <th>Nº Prest</th>
                <th>Colaborador</th>
                <th>Empresa</th>
                <th>Data</th>
                <th>Descrição</th>
                <th>Tipo Despesa</th>
                <th>Val. Faturado</th>
                <th>Despesa</th>
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
                  
                  {/* Célula de ações com data-label e botões com texto */}
                  <td className={styles.actionsWrapper} data-label="Ações">
                    <button className={styles.actionButtonAprovar} onClick={() => handleAprovarClick(r)} aria-label={`Aprovar reembolso ${r.num_prestacao}`}>
                      <img src={CheckIcon} alt="" />
                      <span>Aprovar</span>
                    </button>
                    <button className={styles.actionButtonRejeitar} onClick={() => handleRejeitarClick(r)} aria-label={`Rejeitar reembolso ${r.num_prestacao}`}>
                      <img src={XIcon} alt="" />
                      <span>Rejeitar</span>
                    </button>
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