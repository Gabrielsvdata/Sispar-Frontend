import styles from "./Solicitacao.module.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../Services/Api";
import NavBar from "../navbar/NavBar";
import BottomNav from "../navbar/BottomNav";
import ModalConfirmacao from "../modal/ModalConfirmacao";
import { Loading } from "../ui/Loading";

// Imagens
import Home from "../../assets/Dashboard/home header.png";
import Seta from "../../assets/Dashboard/Vector.png";
import Deletar from "../../assets/solicitacao/deletar.png";
import Lixeira from "../../assets/solicitacao/lixeira.png";
import Calendario from "../../assets/solicitacao/calendario.png";
import setaBaixo from "../../assets/solicitacao/seta baixa.png";
import IconeX from "../../assets/solicitacao/x.png";
import Motivo from "../../assets/solicitacao/motivo.png";
import Check from "../../assets/solicitacao/check.png";

function Solicitacao() {
  const navigate = useNavigate();
  // Estados do formulário
  const [colaborador, setColaborador] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState("");
  const [tipoReembolso, setTipoReembolso] = useState("");
  const [centroCusto, setCentroCusto] = useState("");
  const [ordemInterna, setOrdemInterna] = useState("");
  const [divisao, setDivisao] = useState("");
  const [moeda, setMoeda] = useState("");
  const [pep, setPep] = useState("");
  const [distanciaKm, setDistanciaKm] = useState("");
  const [valorKm, setValorKm] = useState("");
  const [valorFaturado, setValorFaturado] = useState("");
  const [despesa, setDespesa] = useState("");
  const [comprovante, setComprovante] = useState(null); // Arquivo do comprovante

  // Estado da lista de reembolsos (o "carrinho")
  const [dadosReembolso, setDadosReembolso] = useState([]);
  
  // Estado de loading
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado unificado para TODOS os modais
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    confirmText: "Confirmar",
    showCancelButton: true,
    confirmButtonType: "primary",
  });

  const closeModal = () => setModalState({ ...modalState, isOpen: false });

  // Limpa os campos do formulário
  const limparCampos = () => {
    setColaborador("");
    setEmpresa("");
    setDescricao("");
    setData("");
    setTipoReembolso("");
    setCentroCusto("");
    setOrdemInterna("");
    setDivisao("");
    setPep("");
    setMoeda("");
    setDistanciaKm("");
    setValorKm("");
    setValorFaturado("");
    setDespesa("");
    setComprovante(null); // Limpa o comprovante
  };

  /**
   * CORREÇÃO 1: Função `handleSubmit` para o botão "+ Salvar".
   * Agora ela é 100% local e não fala com a API.
   * Apenas adiciona um item à lista `dadosReembolso`.
   */
  const handleSubmit = () => {
    if (!colaborador || !empresa || !data || !comprovante) {
      setModalState({
        isOpen: true,
        title: "Campos Obrigatórios",
        message: "Por favor, preencha os campos: Nome Completo, Empresa, Data e Comprovante.",
        onConfirm: closeModal,
        confirmText: "OK",
        showCancelButton: false,
      });
      return;
    }

    const novoReembolso = {
      colaborador,
      empresa,
      descricao,
      data,
      tipo_reembolso: tipoReembolso,
      centro_custo: centroCusto,
      ordem_interna: ordemInterna,
      divisao,
      pep,
      moeda,
      distancia_km: distanciaKm,
      valor_km: Number(valorKm) || 0,
      valor_faturado: Number(valorFaturado) || 0,
      despesa: Number(despesa) || 0,
      id_colaborador: Number(localStorage.getItem("usuarioId")),
      num_prestacao: "—", // Placeholder, pois o número real virá da API no envio final
      comprovante: comprovante, // Adiciona o arquivo do comprovante
    };

    setDadosReembolso((prev) => [...prev, novoReembolso]);
    limparCampos();
  };

  /**
   * CORREÇÃO 2: `handleConfirmEnvio` para o botão "Enviar Para Análise".
   * FLUXO EM 2 ETAPAS:
   * 1. Criar reembolso com JSON (POST /reembolsos/new)
   * 2. Upload do comprovante com FormData (POST /ocr/)
   */
  const handleConfirmEnvio = async () => {
    setIsSubmitting(true);
    try {
      // Processa cada reembolso sequencialmente
      for (const item of dadosReembolso) {
        // VALIDAÇÕES ANTES DE ENVIAR
        if (!item.colaborador || !item.empresa || !item.tipo_reembolso || 
            !item.centro_custo || !item.valor_faturado || !item.id_colaborador) {
          throw new Error("Campos obrigatórios faltando: colaborador, empresa, tipo_reembolso, centro_custo, valor_faturado");
        }

        if (!item.comprovante) {
          throw new Error("Comprovante é obrigatório");
        }

        // Validação do arquivo
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        const maxSize = 10 * 1024 * 1024; // 10MB
        
        if (!allowedTypes.includes(item.comprovante.type)) {
          throw new Error("Formato de arquivo inválido. Aceito apenas: PDF, JPG, JPEG, PNG");
        }
        
        if (item.comprovante.size > maxSize) {
          throw new Error("Arquivo muito grande. Tamanho máximo: 10MB");
        }

        // PASSO 1: Criar reembolso com JSON
        const reembolsoResponse = await Api.post(
          "/reembolsos/new",
          {
            colaborador: item.colaborador,
            empresa: item.empresa,
            descricao: item.descricao,
            tipo_reembolso: item.tipo_reembolso,
            centro_custo: item.centro_custo,
            ordem_interna: item.ordem_interna,
            divisao: item.divisao,
            pep: item.pep,
            moeda: item.moeda,
            distancia_km: item.distancia_km,
            valor_km: Number(item.valor_km) || 0,
            valor_faturado: Number(item.valor_faturado) || 0,
            despesa: Number(item.despesa) || 0,
            id_colaborador: item.id_colaborador
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        // Extrai o número da prestação criado
        const numPrestacao = reembolsoResponse.data.reembolso.num_prestacao;

        // PASSO 2: Upload do comprovante com OCR
        const formData = new FormData();
        formData.append('file', item.comprovante);
        formData.append('reembolso_id', numPrestacao);

        await Api.post("/ocr/", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      // Sucesso: limpa a lista e exibe mensagem
      setDadosReembolso([]);
      
      setModalState({
        isOpen: true,
        title: "Sucesso!",
        message: "Sua solicitação foi enviada para análise.",
        onConfirm: () => {
          closeModal();
          navigate("/reembolsos");
        },
        confirmText: "OK",
        showCancelButton: false,
      });

    } catch (err) {
      // Tratamento de erros específicos
      let errorMessage = "Ocorreu um erro desconhecido";
      
      if (err.message) {
        errorMessage = err.message;
      } else if (err.response?.data?.erro) {
        errorMessage = err.response.data.erro;
      } else if (err.response?.status === 415) {
        errorMessage = "Erro ao criar reembolso: Tipo de conteúdo não suportado";
      }

      setModalState({
        isOpen: true,
        title: "Erro no Envio",
        message: errorMessage,
        onConfirm: closeModal,
        confirmText: "OK",
        showCancelButton: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função que abre o modal de confirmação para o envio
  const enviarParaAnalise = () => {
    if (dadosReembolso.length === 0) {
      setModalState({
        isOpen: true,
        title: "Atenção",
        message: "Não há itens na tabela para enviar. Adicione um reembolso antes de prosseguir.",
        onConfirm: closeModal,
        confirmText: "OK",
        showCancelButton: false,
      });
      return;
    }

    setModalState({
      isOpen: true,
      title: "Enviar para Análise",
      message: "Tem certeza que deseja enviar todos os itens para análise? Esta ação não poderá ser desfeita.",
      onConfirm: handleConfirmEnvio, // Chama a função de envio ao confirmar
      confirmText: "Sim, Enviar",
      confirmButtonType: "primary",
      showCancelButton: true,
    });
  };

  /**
   * CORREÇÃO 3: Simplificação da função de Cancelar.
   * Apenas limpa a lista local, sem chamar API.
   */
  const handleConfirmCancelamento = () => {
    setDadosReembolso([]);
    closeModal();
  };
  
  const cancelarSolicitacao = () => {
      if (dadosReembolso.length === 0) {
        setModalState({
          isOpen: true,
          title: "Atenção",
          message: "Não há itens na tabela para cancelar.",
          onConfirm: closeModal,
          confirmText: "OK",
          showCancelButton: false,
        });
        return;
      }
  
      setModalState({
        isOpen: true,
        title: "Cancelar Solicitação",
        message: "Tem certeza que deseja limpar todos os itens da lista? Os dados não salvos serão perdidos.",
        onConfirm: handleConfirmCancelamento,
        confirmText: "Sim, Limpar Tudo",
        confirmButtonType: "danger",
        showCancelButton: true,
      });
  };

  // Funções de utilidade (remover item da lista, mostrar motivo)
  const removerReembolso = (idx) => {
    setDadosReembolso((prev) => prev.filter((_, i) => i !== idx));
  };
  
  const handleShowMotivo = (descricaoDoMotivo) => {
    setModalState({
      isOpen: true,
      title: "Motivo do Reembolso",
      message: descricaoDoMotivo || "Nenhuma descrição fornecida.",
      onConfirm: closeModal,
      confirmText: "Fechar",
      showCancelButton: false,
    });
  };

  // Cálculos de totais para o rodapé
  const totalFaturado = dadosReembolso.reduce((soma, item) => soma + Number(item.valor_faturado || 0), 0);
  const totalDespesa = dadosReembolso.reduce((soma, item) => soma + Number(item.despesa || 0), 0);

  return (
    <div className={styles.layoutSolicitacao}>
      {isSubmitting && <Loading fullScreen message="Enviando reembolsos... Por favor, aguarde." />}
      
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
      
      <div className={styles.containerPrincipalSolicitacao}>
        <main className={styles.mainSolicitacao}>
          <header className={styles.headerSolicitacao}>
            <img src={Home} alt="home" onClick={() => navigate("/reembolsos")} />
            <img src={Seta} alt="Seta indicativa do home" />
            <p>Reembolsos</p>
            <img src={Seta} alt="" />
            <p>Solicitação de Reembolso</p>
          </header>

          <form onSubmit={(e) => e.preventDefault()} className={styles.formSolicitacao}>
            <div className={styles.grupo1}>
                {/* Inputs do Grupo 1 (Nome, Empresa, etc.) */}
                <div className={styles.inputNome}>
                  <label htmlFor="">Nome Completo</label>
                  <input type="text" name="colaborador" value={colaborador} onChange={(e) => setColaborador(e.target.value)} />
                </div>
                <div className={styles.inputEmpresa}>
                  <label htmlFor="">Empresa</label>
                  <input type="text" name="empresa" value={empresa} onChange={(e) => setEmpresa(e.target.value)} />
                </div>
                <div className={styles.inputPrestacao}>
                  <label>Nº Prest. Contas</label>
                  <input type="text" readOnly placeholder="Será gerado pelo sistema" />
                </div>
                <div className={styles.inputMotivo}>
                  <label htmlFor=""> Descrição / Motivo do Reembolso </label>
                  <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} rows="4" />
                </div>
            </div>

            <div className={styles.barraVertical}></div>

            <div className={styles.grupo2}>
              {/* Inputs do Grupo 2 (Data, Despesa, etc.) */}
              <div className={styles.inputData}>
                <label htmlFor="">Data</label>
                <img className={styles.imgData} src={Calendario} alt="" />
                <input type="date" value={data} onChange={(e) => setData(e.target.value)} />
              </div>
              <div className={styles.tipoDeDespesa}>
                <label htmlFor=""> Tipo de Despesa </label>
                <img className={styles.imgDespesa} src={setaBaixo} alt="" />
                <select value={tipoReembolso} onChange={(e) => setTipoReembolso(e.target.value)} name="tipoReembolso">
                  <option value="">Selecionar</option>
                  <option value="Alimentação">Alimentação</option>
                  <option value="Combustível">Combustível</option>
                  <option value="Condução">Condução</option>
                  <option value="Estacionamento">Estacionamento</option>
                  <option value="Viagem Administrativa">Viagem Administrativa</option>
                  <option value="Viagem Operacional">Viagem Operacional</option>
                  <option value="Eventos de representação">Eventos de representação</option>
                </select>
              </div>
              {/* ... outros selects e inputs ... */}
              <div className={styles.centroDeCusto}>
                <label htmlFor="">Centro de Custo</label>
                <img className={styles.imgCustos} src={setaBaixo} alt="" />
                <select value={centroCusto} onChange={(e) => setCentroCusto(e.target.value)}>
                    <option value="">Selecione</option>
                    <option value="1100109002">1100109002 – FIM CONTROLES INTERNOS MTZ</option>
                    <option value="1100110002">1100110002 – FIN VICE-PRESIDÊNCIA FINANÇAS MTZ</option>
                    <option value="1100110101">1100110101 – FIN CONTABILIDADE MTZ</option>
                </select>
              </div>
              <div className={styles.ordem}>
                <label htmlFor="">Ord. Int.</label>
                <input type="number" value={ordemInterna} onChange={(e) => setOrdemInterna(e.target.value)} />
              </div>
              <div className={styles.divisoes}>
                <label htmlFor="">Div.</label>
                <input type="number" value={divisao} onChange={(e) => setDivisao(e.target.value)} />
              </div>
              <div className={styles.pep}>
                <label htmlFor="">PEP.</label>
                <input type="number" value={pep} onChange={(e) => setPep(e.target.value)} />
              </div>
              <div className={styles.moeda}>
                <label htmlFor="">Moeda</label>
                <select id="moeda" name="moeda" value={moeda} onChange={(e) => setMoeda(e.target.value)}>
                    <option value="">Selecionar</option>
                    <option value="BRL">BRL</option>
                    <option value="ARS">ARS</option>
                    <option value="USD">USD</option>
                </select>
              </div>
              <div className={styles.distancia}>
                <label htmlFor=""> Dist. / KM</label>
                <input type="text" value={distanciaKm} onChange={(e) => setDistanciaKm(e.target.value)} />
              </div>
              <div className={styles.valorKM}>
                <label htmlFor="">Valor / KM</label>
                <input type="number" value={valorKm} onChange={(e) => setValorKm(e.target.value)} />
              </div>
              <div className={styles.valorFaturado}>
                <label htmlFor="">Val. Faturado</label>
                <input type="number" value={valorFaturado} onChange={(e) => setValorFaturado(e.target.value)} />
              </div>
              <div className={styles.despesa}>
                <label htmlFor="Despesas">Despesa</label>
                <input type="number" value={despesa} onChange={(e) => setDespesa(e.target.value)} />
              </div>

              {/* Campo para upload de comprovante (OCR) */}
              <div className={styles.comprovante}>
                <label htmlFor="comprovante">Comprovante *</label>
                <input 
                  type="file" 
                  id="comprovante"
                  accept="image/*,.pdf"
                  onChange={(e) => setComprovante(e.target.files[0])}
                />
                {comprovante && (
                  <span className={styles.nomeArquivo}>
                    📎 {comprovante.name}
                  </span>
                )}
              </div>
              
              <div className={styles.botoes}>
                <button className={styles.botaoSalvar} onClick={handleSubmit}>+ Salvar</button>
                <button className={styles.customerDelete} onClick={limparCampos}>
                  <img src={Deletar} alt="Limpar campos" />
                </button>
              </div>
            </div>
          </form>

          <div className={styles.containerTable}>
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Colaborador(a)</th>
                  <th>Empresa</th>
                  <th>NºPrest.</th>
                  <th>Data</th>
                  <th>Motivo</th>
                  <th>Tipo De Despesa</th>
                  <th>CTR. Custos</th>
                  <th>Ord. Int.</th>
                  <th>Div.</th>
                  <th>Pep</th>
                  <th>Moeda</th>
                  <th>Dis.KM</th>
                  <th>Valor.KM</th>
                  <th>Val.Faturado</th>
                  <th>Despesa</th>
                </tr>
              </thead>
              <tbody>
                {dadosReembolso.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <img src={Lixeira} alt="Remover" style={{ cursor: 'pointer' }} onClick={() => removerReembolso(index)} />
                    </td>
                    <td>{item.colaborador}</td>
                    <td>{item.empresa}</td>
                    <td>{item.num_prestacao}</td>
                    <td>{new Date(item.data).toLocaleDateString("pt-BR")}</td>
                    <td style={{ cursor: "pointer" }} onClick={() => handleShowMotivo(item.descricao)}>
                      <img src={Motivo} alt="Ver motivo" />
                    </td>
                    <td>{item.tipo_reembolso}</td>
                    <td>{item.centro_custo}</td>
                    <td>{item.ordem_interna}</td>
                    <td>{item.divisao}</td>
                    <td>{item.pep}</td>
                    <td>{item.moeda}</td>
                    <td>{item.distancia_km}</td>
                    <td>{item.valor_km}</td>
                    <td>{item.valor_faturado}</td>
                    <td>{item.despesa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>

        <footer className={styles.containerFooter}>
          <div className={styles.inputFooterFaturado}>
            <label htmlFor="">Total Faturado</label>
            <input id="totalFaturado" type="text" value={totalFaturado.toFixed(2).replace('.', ',')} readOnly />
          </div>
          <div className={styles.inputFooterDespesa}>
            <label htmlFor="">Total Despesa</label>
            <input id="totalDespesa" type="text" value={totalDespesa.toFixed(2).replace('.', ',')} readOnly />
          </div>
          <div>
            <button 
              className={styles.buttonCheck} 
              onClick={enviarParaAnalise}
              disabled={isSubmitting || dadosReembolso.length === 0}
            >
              <img src={Check} alt="" />
              {isSubmitting ? 'Enviando...' : 'Enviar Para Analise'}
            </button>
          </div>
          <div>
            <button 
              className={styles.buttonX} 
              onClick={cancelarSolicitacao}
              disabled={isSubmitting}
            >
              <img src={IconeX} alt="" />
              <p>Cancelar Solicitação</p>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Solicitacao;