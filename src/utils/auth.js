// src/utils/auth.js
// Funções auxiliares para verificação de permissões de usuário

/**
 * Verifica se o usuário logado é um administrador
 * @returns {boolean} true se for admin, false caso contrário
 */
export const isAdmin = () => {
  const tipo = localStorage.getItem("usuarioTipo");
  return tipo === "admin";
};

/**
 * Verifica se o usuário logado é um usuário comum
 * @returns {boolean} true se for usuario, false caso contrário
 */
export const isUsuario = () => {
  const tipo = localStorage.getItem("usuarioTipo");
  return tipo === "usuario";
};

/**
 * Obtém o tipo do usuário logado
 * @returns {string|null} 'admin', 'usuario' ou null se não estiver logado
 */
export const getTipoUsuario = () => {
  return localStorage.getItem("usuarioTipo");
};

/**
 * Obtém o ID do usuário logado
 * @returns {string|null} ID do usuário ou null se não estiver logado
 */
export const getUsuarioId = () => {
  return localStorage.getItem("usuarioId");
};

/**
 * Verifica se existe um usuário logado
 * @returns {boolean} true se houver usuário logado
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem("usuarioId");
};
