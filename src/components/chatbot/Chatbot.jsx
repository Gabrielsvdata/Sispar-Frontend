import { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import styles from './Chatbot.module.scss';

/**
 * Sugestões padrão do chatbot
 */
const DEFAULT_SUGGESTIONS = [
  'Como solicitar um reembolso?',
  'Qual o status da minha solicitação?',
  'Quais documentos são necessários?'
];

/**
 * Componente Chatbot SISPAR
 * 
 * Sistema de assistente virtual integrado com IA (Grok API)
 * para auxiliar colaboradores e administradores com dúvidas
 * sobre reembolsos, processos e sistema.
 * 
 * @param {number} userId - ID do colaborador logado
 */
const Chatbot = ({ userId }) => {
  // ==================== ESTADO ====================
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // ==================== REFS ====================
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const abortControllerRef = useRef(null);

  // ==================== CONSTANTES ====================
  const MAX_MESSAGE_LENGTH = 2000;
  const MAX_HISTORY_LENGTH = 10;
  const API_BASE_URL = 'http://localhost:5000';
  const WELCOME_MESSAGE = 'Olá! Sou o assistente SISPAR. Como posso ajudar você hoje?';

  // ==================== EFFECTS ====================
  
  /**
   * Auto-scroll para última mensagem quando histórico atualizar
   */
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, isOpen]);

  /**
   * Foca no input quando chat abrir
   */
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  /**
   * Cleanup: Cancela requisições pendentes ao desmontar
   */
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // ==================== FUNÇÕES AUXILIARES ====================
  
  /**
   * Formata histórico para enviar à API (últimas N mensagens)
   */
  const formatHistoryForAPI = useCallback((currentHistory) => {
    return currentHistory
      .slice(-MAX_HISTORY_LENGTH * 2)
      .map(({ role, content }) => ({ role, content }));
  }, []);

  /**
   * Adiciona mensagem ao histórico
   */
  const addMessageToHistory = useCallback((role, content) => {
    setHistory(prev => {
      const newHistory = [...prev, { role, content }];
      return newHistory.slice(-MAX_HISTORY_LENGTH * 2);
    });
  }, []);

  /**
   * Limpa mensagens de erro
   */
  const clearError = useCallback(() => {
    // Não faz nada - mantido para compatibilidade
  }, []);

  /**
   * Trata erros da API do chatbot
   */
  const handleAPIError = useCallback((error) => {
    console.error('Erro na API do chatbot:', error);
    const errorMessage = error.response?.data?.error || 'Erro ao processar sua mensagem. Tente novamente.';
    addMessageToHistory('assistant', `❌ Erro: ${errorMessage}`);
  }, [addMessageToHistory]);

  /**
   * Trata erros de conexão com o servidor
   */
  const handleNetworkError = useCallback(() => {
    console.error('Erro de conexão com o servidor');
    const offlineMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
    addMessageToHistory('assistant', `❌ ${offlineMessage}`);
  }, [addMessageToHistory]);

  // ==================== EFFECTS ====================
  
  /**
   * Envia mensagem para o chatbot
   */
  const sendMessage = useCallback(async (text) => {
    if (!text?.trim()) return;

    const userMessage = text.trim();
    
    // Adiciona mensagem do usuário ao histórico
    addMessageToHistory('user', userMessage);
    setMessage('');
    setIsLoading(true);
    setSuggestions([]);
    clearError();

    // Cancela requisição anterior se existir
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(`${API_BASE_URL}/chatbot/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          message: userMessage,
          colaborador_id: userId,
          history: formatHistoryForAPI(history),
        }),
        signal: abortControllerRef.current.signal,
      });

      const data = await response.json();

      if (response.ok) {
        // Adiciona resposta do assistente
        addMessageToHistory('assistant', data.response);
        
        // Atualiza sugestões se disponíveis
        if (data.suggestions?.length > 0) {
          setSuggestions(data.suggestions);
        }
      } else {
        // Tratamento de erros da API
        handleAPIError(response.status, data);
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Requisição cancelada');
        return;
      }
      
      handleNetworkError(err);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [userId, history, formatHistoryForAPI, addMessageToHistory, clearError, handleAPIError, handleNetworkError]);

  /**
   * Submete formulário (Enter)
   */
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    sendMessage(message);
  }, [message, sendMessage]);

  /**
   * Clica em sugestão
   */
  const handleSuggestionClick = useCallback((suggestion) => {
    sendMessage(suggestion);
  }, [sendMessage]);

  /**
   * Detecta Enter (sem Shift para enviar)
   */
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }, [handleSubmit]);

  /**
   * Toggle chat (abrir/fechar)
   */
  const toggleChat = useCallback(() => {
    setIsOpen(prev => {
      const newState = !prev;
      
      // Inicializa chat na primeira abertura
      if (newState && history.length === 0) {
        setHistory([{
          role: 'assistant',
          content: WELCOME_MESSAGE
        }]);
        setSuggestions(DEFAULT_SUGGESTIONS);
      }
      
      return newState;
    });
  }, [history.length]);

  /**
   * Limpa histórico de conversa
   */
  const clearHistory = useCallback(() => {
    setHistory([{
      role: 'assistant',
      content: 'Conversa limpa. Como posso ajudar você?'
    }]);
    setSuggestions(DEFAULT_SUGGESTIONS);
    clearError();
  }, [clearError]);

  // ==================== RENDER ====================
  
  /**
   * Renderiza indicador de digitação
   */
  const renderTypingIndicator = () => (
    <div className={`${styles.message} ${styles.assistantMessage}`}>
      <div className={styles.messageContent}>
        <span className={styles.messageRole}>🤖</span>
        <div className={styles.typingIndicator}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );

  /**
   * Renderiza lista de mensagens
   */
  const renderMessages = () => (
    <>
      {history.map((msg, index) => (
        <div
          key={`msg-${index}`}
          className={`${styles.message} ${
            msg.role === 'user' ? styles.userMessage : styles.assistantMessage
          }`}
        >
          <div className={styles.messageContent}>
            <span className={styles.messageRole}>
              {msg.role === 'user' ? '👤' : '🤖'}
            </span>
            <p className={styles.messageText}>{msg.content}</p>
          </div>
        </div>
      ))}
      {isLoading && renderTypingIndicator()}
      <div ref={messagesEndRef} />
    </>
  );

  /**
   * Renderiza sugestões
   */
  const renderSuggestions = () => {
    if (suggestions.length === 0 || isLoading) return null;

    return (
      <div className={styles.suggestionsContainer}>
        <p className={styles.suggestionsLabel}>Sugestões:</p>
        <div className={styles.suggestions}>
          {suggestions.map((suggestion, index) => (
            <button
              key={`suggestion-${index}`}
              className={styles.suggestionButton}
              onClick={() => handleSuggestionClick(suggestion)}
              type="button"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    );
  };

  /**
   * Renderiza formulário de input
   */
  const renderInputForm = () => (
    <>
      <form className={styles.chatInput} onSubmit={handleSubmit}>
        <textarea
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Digite sua mensagem..."
          maxLength={MAX_MESSAGE_LENGTH}
          disabled={isLoading}
          rows={1}
          className={styles.inputField}
          aria-label="Campo de mensagem"
        />
        <button
          type="submit"
          disabled={!message.trim() || isLoading}
          className={styles.sendButton}
          aria-label="Enviar mensagem"
        >
          ➤
        </button>
      </form>

      <div className={styles.charCounter}>
        {message.length}/{MAX_MESSAGE_LENGTH}
      </div>
    </>
  );

  // ==================== COMPONENTE PRINCIPAL ====================

  return (
    <>
      {/* Botão flutuante */}
      <button
        className={`${styles.chatButton} ${isOpen ? styles.chatButtonOpen : ''}`}
        onClick={toggleChat}
        aria-label={isOpen ? 'Fechar chat' : 'Abrir chat'}
        title={isOpen ? 'Fechar chat' : 'Abrir chat SISPAR'}
        type="button"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Modal do chat */}
      {isOpen && (
        <div className={styles.chatContainer} role="dialog" aria-modal="true" aria-labelledby="chat-title">
          {/* Header */}
          <div className={styles.chatHeader}>
            <div className={styles.headerContent}>
              <span id="chat-title" className={styles.chatTitle}>🤖 Assistente SISPAR</span>
              <span className={styles.chatStatus}>Online</span>
            </div>
            <div className={styles.headerActions}>
              <button
                className={styles.clearButton}
                onClick={clearHistory}
                title="Limpar conversa"
                aria-label="Limpar conversa"
                type="button"
              >
                🔄
              </button>
              <button
                className={styles.closeButton}
                onClick={toggleChat}
                title="Fechar chat"
                aria-label="Fechar chat"
                type="button"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Mensagens */}
          <div className={styles.chatMessages} role="log" aria-live="polite" aria-atomic="false">
            {renderMessages()}
          </div>

          {/* Sugestões */}
          {renderSuggestions()}

          {/* Input */}
          {renderInputForm()}
        </div>
      )}
    </>
  );
};

// ==================== PROP TYPES ====================

Chatbot.propTypes = {
  userId: PropTypes.number.isRequired,
};

export default Chatbot;
