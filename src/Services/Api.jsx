import axios from "axios"; //importar a biblioteca axios, que é usada para fazer requisições, HTTP.


// PORTA PRA TESTE DO SERVIDOR LOCAL
const api = axios.create({
     baseURL: "http://localhost:5000" // define a url para todas as requisições com essa instancia 
});


// PORTA DO SERVIDOR EM PRODUÇÃO
//  const api = axios.create({
//       baseURL: "https://cria-o-api.onrender.com" // define a url para todas as requisições com essa instancia 
// });

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log("🚀 Requisição:", {
      method: config.method?.toUpperCase(),
      url: config.baseURL + config.url,
      headers: config.headers,
    });
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento global de erros
api.interceptors.response.use(
  (response) => {
    console.log("✅ Resposta:", {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error("❌ Erro na requisição:", {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data,
    });
    
    // Erro 308 - Permanent Redirect
    if (error.response?.status === 308) {
      console.error("⚠️ Erro 308: Backend está redirecionando permanentemente");
      console.error("Location header:", error.response?.headers?.location);
    }
    
    // Token expirado ou inválido
    if (error.response?.status === 401) {
      // Limpa dados de autenticação
      localStorage.removeItem('usuarioId');
      localStorage.removeItem('usuarioNome');
      localStorage.removeItem('usuarioCargo');
      localStorage.removeItem('usuarioTipo');
      localStorage.removeItem('authToken');
      
      // Dispara evento para atualizar UI
      window.dispatchEvent(new Event('userChanged'));
      
      // Redireciona para login apenas se não estiver na página de login
      if (!window.location.hash.includes('#/')) {
        window.location.href = '/#/';
      }
    }
    
    // Acesso negado (usuário sem permissão)
    if (error.response?.status === 403) {
      console.error('Acesso negado: você não tem permissão para esta ação');
    }
    
    // Erro do servidor
    if (error.response?.status >= 500) {
      console.error('Erro no servidor. Tente novamente mais tarde.');
    }
    
    return Promise.reject(error);
  }
);

export default api;