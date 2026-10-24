import axios from "axios"; // biblioteca usada para fazer requisições HTTP

// Endereço da API: definido em VITE_API_URL (arquivo .env ou painel do Cloudflare Pages).
// Sem a variável, usa a API local.
export const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para adicionar o token de login em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratamento global de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // Token expirado ou inválido: limpa a sessão e volta para o login
    if (status === 401) {
      localStorage.removeItem('usuarioId');
      localStorage.removeItem('usuarioNome');
      localStorage.removeItem('usuarioCargo');
      localStorage.removeItem('usuarioTipo');
      localStorage.removeItem('authToken');

      // Dispara evento para atualizar UI
      window.dispatchEvent(new Event('userChanged'));

      // Redireciona para o login, exceto se já estiver nas telas públicas
      const telasPublicas = ['', '#/', '#/cadastro', '#/recuperar-senha'];
      if (!telasPublicas.includes(window.location.hash)) {
        window.location.hash = '#/';
      }
    }

    // Acesso negado (usuário sem permissão)
    if (status === 403) {
      console.error('Acesso negado: você não tem permissão para esta ação');
    }

    return Promise.reject(error);
  }
);

export default api;
