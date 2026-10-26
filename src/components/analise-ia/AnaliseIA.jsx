import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Api from '../../Services/Api';
import NavBar from '../navbar/NavBar';
import BottomNav from '../navbar/BottomNav';
import ModalConfirmacao from '../modal/ModalConfirmacao';
import { Loading } from '../ui/Loading';
import styles from './AnaliseIA.module.scss';

import Home from '../../assets/Dashboard/home header.png';
import Seta from '../../assets/Dashboard/Vector.png';
import CheckIcon from '../../assets/solicitacao/check.png';
import XIcon from '../../assets/solicitacao/x.png';

const AnaliseIA = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [analise, setAnalise] = useState(null);
  const [reembolso, setReembolso] = useState(null);
  const [showComprovante, setShowComprovante] = useState(false);
  const [comprovanteUrl, setComprovanteUrl] = useState(null);

  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    confirmText: 'Confirmar',
    confirmButtonType: 'danger',
    showCancelButton: true,
  });

  const closeModal = () => setModalState({ isOpen: false });

  // Buscar dados do reembolso e análise IA
  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      try {
        // Buscar reembolso
        const { data: reembolsoData } = await Api.get(`/reembolsos/${id}/`);
        setReembolso(reembolsoData);

        // Buscar análise IA
        try {
          const { data: analiseData } = await Api.post(`/reembolsos/${id}/analisar-ia`);
          setAnalise(analiseData);
        } catch (analiseError) {
          console.warn('Análise IA não disponível, usando dados do reembolso apenas:', analiseError);
          // Se análise IA falhar, continua com reembolso mas sem análise
          setAnalise(null);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setModalState({
          isOpen: true,
          title: 'Erro',
          message: `Erro ao carregar dados: ${error.response?.data?.error || error.message}`,
          onConfirm: () => navigate('/analise'),
          confirmText: 'Voltar',
          showCancelButton: false,
          confirmButtonType: 'danger',
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      carregarDados();
    }
  }, [id, navigate]);

  // Visualizar comprovante
  const handleVerComprovante = async () => {
    try {
      const response = await Api.get(`/reembolsos/${id}/comprovante`, {
        responseType: 'blob',
      });
      
      const url = URL.createObjectURL(response.data);
      setComprovanteUrl(url);
      setShowComprovante(true);
    } catch (error) {
      console.error('Erro ao carregar comprovante:', error);
      setModalState({
        isOpen: true,
        title: 'Erro',
        message: 'Não foi possível carregar o comprovante.',
        onConfirm: closeModal,
        confirmText: 'OK',
        showCancelButton: false,
        confirmButtonType: 'danger',
      });
    }
  };

  // Download do comprovante
  const handleDownloadComprovante = async () => {
    try {
      const response = await Api.get(`/reembolsos/${id}/comprovante`, {
        responseType: 'blob',
      });
      
      const url = URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `comprovante_${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao baixar comprovante:', error);
    }
  };

  // Aprovar com recomendação IA
  const handleAprovarComIA = () => {
    setModalState({
      isOpen: true,
      title: 'Confirmar Aprovação (IA)',
      message: `Aceitar recomendação da IA e aprovar este reembolso?\n\nScore: ${analise?.score_confiabilidade}%\nMotivo: ${analise?.motivo_sugestao}`,
      onConfirm: async () => {
        setActionLoading(true);
        try {
          await Api.post(`/reembolsos/${id}/aprovar-com-ia`, {
            admin_id: parseInt(localStorage.getItem('usuarioId')),
            aceitar_recomendacao_ia: true,
            observacao: `Aprovado automaticamente por IA - Score ${analise.score_confiabilidade}%`,
          });

          setModalState({
            isOpen: true,
            title: 'Sucesso',
            message: 'Reembolso aprovado com base na análise IA!',
            onConfirm: () => navigate('/analise'),
            confirmText: 'OK',
            showCancelButton: false,
            confirmButtonType: 'primary',
          });
        } catch (error) {
          console.error('Erro ao aprovar:', error);
          setModalState({
            isOpen: true,
            title: 'Erro',
            message: 'Erro ao aprovar reembolso. Tente novamente.',
            onConfirm: closeModal,
            confirmText: 'OK',
            showCancelButton: false,
            confirmButtonType: 'danger',
          });
        } finally {
          setActionLoading(false);
        }
      },
      confirmText: 'Sim, Aprovar',
      showCancelButton: true,
      confirmButtonType: 'primary',
    });
  };

  // Aprovar manualmente (ignorando IA)
  const handleAprovarManual = () => {
    setModalState({
      isOpen: true,
      title: 'Confirmar Aprovação Manual',
      message: 'Deseja aprovar este reembolso manualmente, ignorando a recomendação da IA?',
      onConfirm: async () => {
        setActionLoading(true);
        try {
          await Api.patch(`/reembolsos/${id}/aprovar/`);

          setModalState({
            isOpen: true,
            title: 'Sucesso',
            message: 'Reembolso aprovado manualmente!',
            onConfirm: () => navigate('/analise'),
            confirmText: 'OK',
            showCancelButton: false,
            confirmButtonType: 'primary',
          });
        } catch (error) {
          console.error('Erro ao aprovar:', error);
          setModalState({
            isOpen: true,
            title: 'Erro',
            message: 'Erro ao aprovar reembolso. Tente novamente.',
            onConfirm: closeModal,
            confirmText: 'OK',
            showCancelButton: false,
            confirmButtonType: 'danger',
          });
        } finally {
          setActionLoading(false);
        }
      },
      confirmText: 'Sim, Aprovar',
      showCancelButton: true,
      confirmButtonType: 'primary',
    });
  };

  // Rejeitar
  const handleRejeitar = () => {
    setModalState({
      isOpen: true,
      title: 'Confirmar Rejeição',
      message: 'Deseja rejeitar este reembolso?',
      onConfirm: async () => {
        setActionLoading(true);
        try {
          await Api.patch(`/reembolsos/${id}/rejeitar/`);

          setModalState({
            isOpen: true,
            title: 'Sucesso',
            message: 'Reembolso rejeitado!',
            onConfirm: () => navigate('/analise'),
            confirmText: 'OK',
            showCancelButton: false,
            confirmButtonType: 'primary',
          });
        } catch (error) {
          console.error('Erro ao rejeitar:', error);
          setModalState({
            isOpen: true,
            title: 'Erro',
            message: 'Erro ao rejeitar reembolso. Tente novamente.',
            onConfirm: closeModal,
            confirmText: 'OK',
            showCancelButton: false,
            confirmButtonType: 'danger',
          });
        } finally {
          setActionLoading(false);
        }
      },
      confirmText: 'Sim, Rejeitar',
      showCancelButton: true,
      confirmButtonType: 'danger',
    });
  };

  // Obter cor baseada no nível de risco
  const getRiscoColor = (nivel) => {
    switch (nivel?.toLowerCase()) {
      case 'baixo':
        return '#22c55e';
      case 'medio':
        return '#f59e0b';
      case 'alto':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  // Obter cor baseada na gravidade
  const getGravidadeColor = (gravidade) => {
    switch (gravidade?.toLowerCase()) {
      case 'baixa':
        return '#22c55e';
      case 'media':
        return '#f59e0b';
      case 'alta':
        return '#ef4444';
      case 'critica':
        return '#dc2626';
      default:
        return '#6b7280';
    }
  };

  if (loading) {
    return <Loading fullScreen message="Carregando análise IA..." />;
  }

  if (!reembolso) {
    return (
      <div className={styles.container}>
        <NavBar />
        <BottomNav />
        <main className={styles.mainAnalise}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h2>Reembolso não encontrado</h2>
            <button onClick={() => navigate('/analise')} style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', cursor: 'pointer' }}>
              Voltar
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!analise) {
    return (
      <div className={styles.container}>
        <NavBar />
        <BottomNav />
        <main className={styles.mainAnalise}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h2>⚠️ Análise IA não disponível</h2>
            <p>O serviço de análise IA está temporariamente indisponível.</p>
            <p>Por favor, aprove ou rejeite manualmente na tela de Análises.</p>
            <button onClick={() => navigate('/analise')} style={{ marginTop: '1rem', padding: '0.75rem 1.5rem', cursor: 'pointer' }}>
              Voltar para Análises
            </button>
          </div>
        </main>
      </div>
    );
  }

  const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return (
    <div className={styles.container}>
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

      {/* Modal de visualização de comprovante */}
      {showComprovante && (
        <div className={styles.modalComprovante} onClick={() => setShowComprovante(false)}>
          <div className={styles.modalComprovanteContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeModal} onClick={() => setShowComprovante(false)}>
              ✕
            </button>
            <iframe src={comprovanteUrl} title="Comprovante" className={styles.iframeComprovante} />
            <button className={styles.downloadButton} onClick={handleDownloadComprovante}>
              ⬇ Download
            </button>
          </div>
        </div>
      )}

      <NavBar />
      <BottomNav />

      <main className={styles.mainAnalise}>
        <header className={styles.headerAnalise}>
          <img src={Home} alt="home" onClick={() => navigate('/reembolsos')} />
          <img src={Seta} alt="seta" />
          <p>Reembolsos</p>
          <img src={Seta} alt="seta" />
          <p>Análise</p>
          <img src={Seta} alt="seta" />
          <p>Análise IA #{id}</p>
        </header>

        {/* Score Principal */}
        <div className={styles.scoreCard}>
          <div className={styles.scoreCircle} style={{ borderColor: getRiscoColor(analise.nivel_risco) }}>
            <span className={styles.scoreNumber}>{analise.score_confiabilidade}</span>
            <span className={styles.scoreLabel}>Score</span>
          </div>
          <div className={styles.scoreInfo}>
            <h2>Análise de Confiabilidade</h2>
            <div className={styles.riscoBadge} style={{ backgroundColor: getRiscoColor(analise.nivel_risco) }}>
              Risco {analise.nivel_risco?.toUpperCase()}
            </div>
            <p className={styles.recomendacao}>
              {analise.aprovacao_sugerida ? '✓ Aprovação Sugerida' : '✗ Revisão Manual Necessária'}
            </p>
          </div>
        </div>

        {/* Informações do Reembolso */}
        <div className={styles.infoCard}>
          <h3>Dados do Reembolso</h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <label>Colaborador:</label>
              <span>{reembolso.colaborador}</span>
            </div>
            <div className={styles.infoItem}>
              <label>Empresa:</label>
              <span>{reembolso.empresa}</span>
            </div>
            <div className={styles.infoItem}>
              <label>Data:</label>
              <span>{new Date(reembolso.data).toLocaleDateString('pt-BR')}</span>
            </div>
            <div className={styles.infoItem}>
              <label>Tipo:</label>
              <span>{reembolso.tipo_reembolso}</span>
            </div>
            <div className={styles.infoItem}>
              <label>Valor Declarado:</label>
              <span>{currencyFormatter.format(reembolso.valor_faturado)}</span>
            </div>
            <div className={styles.infoItem}>
              <label>Descrição:</label>
              <span>{reembolso.descricao}</span>
            </div>
          </div>
          <button className={styles.btnVerComprovante} onClick={handleVerComprovante}>
            📄 Ver Comprovante
          </button>
        </div>

        {/* Alertas */}
        {analise.alertas && analise.alertas.length > 0 && (
          <div className={styles.alertasCard}>
            <h3>⚠️ Alertas Detectados ({analise.alertas.length})</h3>
            <div className={styles.alertasList}>
              {analise.alertas.map((alerta, index) => (
                <div
                  key={index}
                  className={styles.alertaItem}
                  style={{ borderLeftColor: getGravidadeColor(alerta.gravidade) }}
                >
                  <div className={styles.alertaHeader}>
                    <span className={styles.alertaTipo}>{alerta.tipo.replace(/_/g, ' ')}</span>
                    <span
                      className={styles.alertaGravidade}
                      style={{ backgroundColor: getGravidadeColor(alerta.gravidade) }}
                    >
                      {alerta.gravidade}
                    </span>
                  </div>
                  <p className={styles.alertaMensagem}>{alerta.mensagem}</p>
                  {alerta.confianca && (
                    <span className={styles.alertaConfianca}>
                      Confiança: {(alerta.confianca * 100).toFixed(0)}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Validações */}
        {analise.validacoes && (
          <div className={styles.validacoesCard}>
            <h3>✓ Validações Realizadas</h3>
            <div className={styles.validacoesList}>
              <div className={styles.validacaoItem}>
                <span className={analise.validacoes.valor_corresponde ? styles.valid : styles.invalid}>
                  {analise.validacoes.valor_corresponde ? '✓' : '✗'}
                </span>
                <span>Valor corresponde ao comprovante</span>
                {analise.validacoes.divergencia_percentual && (
                  <span className={styles.validacaoDetail}>
                    ({analise.validacoes.divergencia_percentual.toFixed(1)}% divergência)
                  </span>
                )}
              </div>
              <div className={styles.validacaoItem}>
                <span className={analise.validacoes.data_valida ? styles.valid : styles.invalid}>
                  {analise.validacoes.data_valida ? '✓' : '✗'}
                </span>
                <span>Data válida</span>
              </div>
              <div className={styles.validacaoItem}>
                <span className={analise.validacoes.documento_duplicado ? styles.invalid : styles.valid}>
                  {analise.validacoes.documento_duplicado ? '✗' : '✓'}
                </span>
                <span>Sem duplicatas detectadas</span>
              </div>
              <div className={styles.validacaoItem}>
                <span className={analise.validacoes.estabelecimento_valido ? styles.valid : styles.invalid}>
                  {analise.validacoes.estabelecimento_valido ? '✓' : '✗'}
                </span>
                <span>Estabelecimento válido</span>
              </div>
              <div className={styles.validacaoItem}>
                <span className={analise.validacoes.tipo_despesa_correto ? styles.valid : styles.invalid}>
                  {analise.validacoes.tipo_despesa_correto ? '✓' : '✗'}
                </span>
                <span>Tipo de despesa correto</span>
              </div>
              <div className={styles.validacaoItem}>
                <span className={analise.validacoes.comprovante_legivel ? styles.valid : styles.invalid}>
                  {analise.validacoes.comprovante_legivel ? '✓' : '✗'}
                </span>
                <span>Comprovante legível</span>
                {analise.validacoes.qualidade_imagem && (
                  <span className={styles.validacaoDetail}>
                    (Qualidade: {(analise.validacoes.qualidade_imagem * 100).toFixed(0)}%)
                  </span>
                )}
              </div>
              <div className={styles.validacaoItem}>
                <span className={analise.validacoes.sinais_edicao ? styles.invalid : styles.valid}>
                  {analise.validacoes.sinais_edicao ? '✗' : '✓'}
                </span>
                <span>Sem sinais de edição</span>
              </div>
            </div>
          </div>
        )}

        {/* Dados Extraídos OCR */}
        {analise.dados_extraidos_ocr && (
          <div className={styles.ocrCard}>
            <h3>📸 Dados Extraídos do Comprovante ({analise.versao_modelo === 'ocr-tesseract' ? 'OCR' : 'IA'})</h3>
            <div className={styles.ocrGrid}>
              <div className={styles.ocrItem}>
                <label>Valor Total:</label>
                <span>{currencyFormatter.format(analise.dados_extraidos_ocr.valor_total || 0)}</span>
              </div>
              <div className={styles.ocrItem}>
                <label>Data Emissão:</label>
                <span>
                  {analise.dados_extraidos_ocr.data_emissao
                    ? new Date(analise.dados_extraidos_ocr.data_emissao).toLocaleDateString('pt-BR')
                    : 'N/A'}
                </span>
              </div>
              <div className={styles.ocrItem}>
                <label>CNPJ:</label>
                <span>{analise.dados_extraidos_ocr.cnpj || 'N/A'}</span>
              </div>
              <div className={styles.ocrItem}>
                <label>Estabelecimento:</label>
                <span>{analise.dados_extraidos_ocr.razao_social || 'N/A'}</span>
              </div>
              <div className={styles.ocrItem}>
                <label>Forma de Pagamento:</label>
                <span>{analise.dados_extraidos_ocr.forma_pagamento || 'N/A'}</span>
              </div>
              {analise.dados_extraidos_ocr.itens && analise.dados_extraidos_ocr.itens.length > 0 && (
                <div className={styles.ocrItem} style={{ gridColumn: '1 / -1' }}>
                  <label>Itens:</label>
                  <span>{analise.dados_extraidos_ocr.itens.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Histórico do Colaborador */}
        {analise.historico_colaborador && (
          <div className={styles.historicoCard}>
            <h3>👤 Histórico do Colaborador</h3>
            <div className={styles.historicoGrid}>
              <div className={styles.historicoItem}>
                <label>Total de Reembolsos:</label>
                <span>{analise.historico_colaborador.total_reembolsos}</span>
              </div>
              <div className={styles.historicoItem}>
                <label>Aprovados:</label>
                <span className={styles.aprovados}>{analise.historico_colaborador.total_aprovados}</span>
              </div>
              <div className={styles.historicoItem}>
                <label>Rejeitados:</label>
                <span className={styles.rejeitados}>{analise.historico_colaborador.total_rejeitados}</span>
              </div>
              <div className={styles.historicoItem}>
                <label>Taxa de Aprovação:</label>
                <span>{analise.historico_colaborador.taxa_aprovacao?.toFixed(1)}%</span>
              </div>
              <div className={styles.historicoItem}>
                <label>Valor Médio Mensal:</label>
                <span>{currencyFormatter.format(analise.historico_colaborador.valor_medio_mensal || 0)}</span>
              </div>
              <div className={styles.historicoItem}>
                <label>Última Solicitação:</label>
                <span>
                  {analise.historico_colaborador.ultima_solicitacao
                    ? new Date(analise.historico_colaborador.ultima_solicitacao).toLocaleDateString('pt-BR')
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Recomendação IA */}
        <div className={styles.recomendacaoCard}>
          <h3>🤖 Recomendação da Inteligência Artificial</h3>
          <p className={styles.recomendacaoTexto}>{analise.recomendacao_ia}</p>
          <p className={styles.recomendacaoMotivo}>
            <strong>Motivo:</strong> {analise.motivo_sugestao}
          </p>
        </div>

        {/* Ações */}
        <div className={styles.acoesCard}>
          <h3>Decisão do Administrador</h3>
          <div className={styles.acoesButtons}>
            {analise.aprovacao_sugerida && (
              <button className={styles.btnAprovarIA} onClick={handleAprovarComIA}>
                <img src={CheckIcon} alt="" />
                Aceitar Recomendação IA
              </button>
            )}
            <button className={styles.btnAprovarManual} onClick={handleAprovarManual}>
              <img src={CheckIcon} alt="" />
              Aprovar Manualmente
            </button>
            <button className={styles.btnRejeitar} onClick={handleRejeitar}>
              <img src={XIcon} alt="" />
              Rejeitar
            </button>
            <button className={styles.btnVoltar} onClick={() => navigate('/analise')}>
              ← Voltar
            </button>
          </div>
        </div>

        <div className={styles.footer}>
          <span>
            Análise realizada em: {new Date(analise.timestamp_analise).toLocaleString('pt-BR')}
          </span>
          <span>Modelo: {analise.versao_modelo}</span>
        </div>
      </main>
    </div>
  );
};

export default AnaliseIA;
